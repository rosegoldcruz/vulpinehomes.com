import * as THREE from "https://unpkg.com/three@0.158.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.158.0/examples/jsm/loaders/GLTFLoader.js";

function foxLiveMain() {
  console.log("[fox-live] init");

  const video = document.getElementById("camera-feed");
  const canvas = document.getElementById("fox-canvas");
  const startOverlay = document.getElementById("start");
  const startBtn = document.getElementById("startBtn");
  const errorEl = document.getElementById("error");

  if (!video) {
    console.error("[fox-live] camera-feed not found");
    return;
  }

  if (!canvas) {
    console.error("[fox-live] fox-canvas not found");
    return;
  }

  if (!startBtn) {
    console.error("[fox-live] startBtn not found");
    return;
  }

  console.log("[fox-live] startBtn found, attaching click listener");

  let mixer = null;
  let foxRoot = null;
  let mouthTargets = [];

  startBtn.addEventListener("click", async () => {
    console.log("[fox-live] Button clicked");

    try {
      await startCamera();
      console.log("[fox-live] Camera started");
      startOverlay.style.display = "none";
      initThree();
    } catch (err) {
      console.error("[fox-live] Failed to start:", err);
      if (errorEl) {
        errorEl.textContent = "Camera error: " + (err.message || err);
      }
    }
  });

  async function startCamera() {
    console.log("[fox-live] Requesting camera access");

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("Camera API not supported");
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    });

    console.log("[fox-live] Got media stream");

    video.srcObject = stream;
    video.setAttribute("playsinline", "");
    video.muted = true;

    await video.play();
    console.log("[fox-live] Video playing");
  }

  function initThree() {
    console.log("[fox-live] Initializing Three.js");

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.6, 4);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x333333, 1.3));

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(3, 6, 2);
    scene.add(dirLight);

    const loader = new GLTFLoader();

    loader.load(
      "/fox.glb",
      (gltf) => {
        console.log("[fox-live] Fox model loaded");

        const fox = gltf.scene;
        foxRoot = fox;
        fox.scale.set(1.3, 1.3, 1.3);
        fox.position.set(0, -1.2, 0);
        scene.add(fox);

        // Best-effort mouth targets (morphs or jaw-like bones)
        mouthTargets = [];
        fox.traverse((obj) => {
          // Morph targets
          if (obj.isMesh && obj.morphTargetInfluences && obj.morphTargetDictionary) {
            const dict = obj.morphTargetDictionary;
            const keys = Object.keys(dict);
            const mouthKey = keys.find((k) => /mouth|jaw|open|talk/i.test(k));
            if (mouthKey) {
              mouthTargets.push({
                type: "morph",
                mesh: obj,
                index: dict[mouthKey],
              });
            }
          }
          // Bones / named parts
          if (obj.isBone || obj.isObject3D) {
            if (/jaw|mouth/i.test(obj.name || "")) {
              mouthTargets.push({ type: "bone", obj });
            }
          }
        });

        mixer = new THREE.AnimationMixer(fox);

        const idleClip =
          gltf.animations.find((a) => a.name.toLowerCase().includes("idle")) ||
          gltf.animations[0];

        if (idleClip) {
          mixer.clipAction(idleClip).play();
          console.log("[fox-live] Playing animation:", idleClip.name);
        }
      },
      undefined,
      (err) => {
        console.error("[fox-live] Failed to load fox.glb:", err);

        // Never fail silently: stub geometry so rendering continues.
        const stub = new THREE.Mesh(
          new THREE.BoxGeometry(),
          new THREE.MeshNormalMaterial()
        );
        stub.position.set(0, 0, 0);
        scene.add(stub);
      }
    );

    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      // Drive mouth + subtle motion from audio amplitude (set by page code)
      const ampRaw = (window.__FOX_AUDIO_AMPLITUDE ?? 0);
      const amp = Math.max(0, Math.min(1, ampRaw));

      if (foxRoot) {
        foxRoot.rotation.y = Math.sin(performance.now() * 0.0006) * 0.12;
        foxRoot.rotation.x = Math.sin(performance.now() * 0.0009) * 0.05;
      }

      if (mouthTargets.length) {
        for (const t of mouthTargets) {
          if (t.type === "morph") {
            const influences = t.mesh.morphTargetInfluences;
            if (influences && typeof t.index === "number") {
              influences[t.index] = amp;
            }
          } else if (t.type === "bone") {
            t.obj.rotation.x = amp * 0.35;
          }
        }
      }

      if (mixer) {
        mixer.update(clock.getDelta());
      }
      renderer.render(scene, camera);
    }

    animate();
    console.log("[fox-live] Render loop started");

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", foxLiveMain, { once: true });
} else {
  foxLiveMain();
}
