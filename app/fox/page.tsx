"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { ARButton } from "three/examples/jsm/webxr/ARButton.js";
import LiveKitClient from "@/lib/livekit";
import OpenAIClient from "@/lib/openai-realtime";
import { OpenAIEventBridge } from "@/lib/openai-events";
import { FoxController } from "@/lib/fox-state";
import { detectFallback } from "@/lib/fallback";

export default function FoxAR() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const clockRef = useRef(new THREE.Clock());

  const fox = useRef(new FoxController());
  const bridge = useRef(new OpenAIEventBridge());

  const hitTestSourceRef = useRef<XRHitTestSource | null>(null);
  const hitTestSourceRequestedRef = useRef(false);

  const [mode, setMode] = useState<"ar" | "3d" | "audio">("ar");

  useEffect(() => {
    const m = detectFallback();
    setMode(m);
  }, []);

  useEffect(() => {
    if (mode === "audio") return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      20
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = mode === "ar";

    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;

    containerRef.current?.appendChild(renderer.domElement);

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    const loader = new GLTFLoader();
    loader.load("/models/fox.glb", (gltf) => {
      fox.current.setModel(gltf.scene, gltf.animations);
      gltf.scene.scale.set(0.6, 0.6, 0.6);
      gltf.scene.visible = false;
      scene.add(gltf.scene);
    });

    if (mode === "ar") {
      const button = ARButton.createButton(renderer, {
        requiredFeatures: ["hit-test"],
      });
      document.body.appendChild(button);
    }

    const renderLoop = (time: number, frame?: XRFrame) => {
      const delta = clockRef.current.getDelta();

      if (mode === "ar" && frame && renderer.xr.isPresenting) {
        const session = renderer.xr.getSession();

        if (session && !hitTestSourceRequestedRef.current) {
          const stableSession: XRSession = session; // non-null for TS

          stableSession.requestReferenceSpace("viewer").then((space) => {
            const req = stableSession.requestHitTestSource?.({ space });
            if (req) {
              req.then((source: XRHitTestSource) => {
                hitTestSourceRef.current = source;
              });
            }
          });

          hitTestSourceRequestedRef.current = true;
        }

        const hitSource = hitTestSourceRef.current;
        if (hitSource) {
          const referenceSpace = renderer.xr.getReferenceSpace();
          const hitTestResults = frame.getHitTestResults(hitSource);

          if (hitTestResults.length > 0 && fox.current.fox) {
            const hit = hitTestResults[0];

            const ref = referenceSpace;
            if (!ref) return;

            const pose = hit.getPose(ref);
            if (pose && fox.current.state === "idle") {
              fox.current.fox.visible = true;
              fox.current.fox.position.copy(pose.transform.position);
              fox.current.setState("greet");
            }
          }
        }
      } else if (mode === "3d" && fox.current.fox && !fox.current.fox.visible) {
        fox.current.fox.visible = true;
        fox.current.fox.position.set(0, 0, -1);
      }

      fox.current.update(delta);
      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(renderLoop as any);

    return () => {
      renderer.setAnimationLoop(null);
      renderer.dispose();
      hitTestSourceRef.current = null;
      hitTestSourceRequestedRef.current = false;
    };
  }, [mode]);

  useEffect(() => {
    if (mode === "audio") {
      const ws = OpenAIClient.init();
      bridge.current.connect(ws);
      return;
    }

    LiveKitClient.connect().then(() => {
      const ws = OpenAIClient.init();
      bridge.current.connect(ws);

      bridge.current.on("user_speaking", () => {
        fox.current.setState("listen");
      });

      bridge.current.on("assistant_speaking", () => {
        fox.current.setState("respond");
      });

      bridge.current.on("assistant_walk_to", (e: any) => {
        const target = new THREE.Vector3(e.x ?? 0, e.y ?? 0, e.z ?? -1);
        fox.current.setWalkTarget(target);
      });

      bridge.current.on("assistant_point", () => {
        fox.current.setState("point");
      });

      bridge.current.on("assistant_look_at_user", (e: any) => {
        fox.current.userPos.set(e.x ?? 0, e.y ?? 1.4, e.z ?? 0);
        fox.current.setState("look_at_user");
      });

      bridge.current.on("assistant_idle", () => {
        fox.current.setState("idle");
      });
    });
  }, [mode]);

  return <div ref={containerRef} className="w-full h-screen" />;
}
