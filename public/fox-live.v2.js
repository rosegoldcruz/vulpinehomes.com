import * as THREE from "https://unpkg.com/three@0.158.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.158.0/examples/jsm/loaders/GLTFLoader.js";

function foxLiveMain() {
  console.log("[fox-live.v2] Passive renderer initializing");

  const canvas = document.getElementById("fox-canvas");

  if (!canvas) {
    console.error("[fox-live.v2] fox-canvas not found");
    return;
  }

  let mixer = null;
  let foxRoot = null;
  let mouthTargets = [];
  let animations = {};
  let currentAction = null;
  let previousAnimationState = 'idle';

  console.log("[fox-live.v2] Initializing Three.js renderer");

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

  // Try to load the VR Foxy model with talk animation first
  loader.load(
    "/models/vr-foxy-0000/animations/talk/vrfoxy_talk.glb",
    (gltf) => {
      console.log("[fox-live.v2] Talk animation model loaded");
      setupFoxModel(gltf, scene, true);
    },
    undefined,
    (err) => {
      console.warn("[fox-live.v2] Talk model failed, trying fox.glb:", err);
      // Fallback to fox.glb
      loader.load(
        "/fox.glb",
        (gltf) => {
          console.log("[fox-live.v2] Fox model loaded (fallback)");
          setupFoxModel(gltf, scene, false);
        },
        undefined,
        (err) => {
          console.error("[fox-live.v2] Failed to load any fox model:", err);
          createStubModel(scene);
        }
      );
    }
  );

  function setupFoxModel(gltf, scene, hasTalkAnim) {
      const fox = gltf.scene;
      foxRoot = fox;
      fox.scale.set(1.3, 1.3, 1.3);
      fox.position.set(0, -1.2, 0);
      scene.add(fox);

      // Find mouth targets for lip sync
      mouthTargets = [];
      fox.traverse((obj) => {
        // Morph targets
        if (obj.isMesh && obj.morphTargetInfluences && obj.morphTargetDictionary) {
          const dict = obj.morphTargetDictionary;
          const keys = Object.keys(dict);
          const mouthKey = keys.find((k) => /mouth|jaw|open|talk|viseme/i.test(k));
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
            mouthTargets.push({ type: "bone", obj, originalRotation: obj.rotation.x });
          }
        }
      });

    console.log("[fox-live.v2] Found mouth targets:", mouthTargets.length);

      mixer = new THREE.AnimationMixer(fox);

      // Store animations by name
      animations = {};
      gltf.animations.forEach((clip) => {
        const name = clip.name.toLowerCase();
        animations[name] = clip;
      console.log("[fox-live.v2] Found animation:", clip.name);
      });

      // Play idle animation initially
      const idleClip =
        gltf.animations.find((a) => a.name.toLowerCase().includes("idle")) ||
        gltf.animations[0];

      if (idleClip) {
        currentAction = mixer.clipAction(idleClip);
        currentAction.play();
      console.log("[fox-live.v2] Playing animation:", idleClip.name);
    }
  }

  function createStubModel(scene) {
      // Never fail silently: stub geometry so rendering continues.
      const stub = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xff6600 })
      );
      stub.position.set(0, 0, 0);
      scene.add(stub);
    foxRoot = stub;
  }

  const clock = new THREE.Clock();

  function animate() {
      requestAnimationFrame(animate);

      // Get animation state from window (set by React component)
      const animationState = window.__FOX_ANIMATION_STATE || 'idle';
      const isSpeaking = window.__FOX_IS_SPEAKING || false;
      const ampRaw = window.__FOX_AUDIO_AMPLITUDE ?? 0;
      const amp = Math.max(0, Math.min(1, ampRaw));

      // Handle animation state changes
      if (animationState !== previousAnimationState) {
      console.log("[fox-live.v2] Animation state changed:", animationState);
        previousAnimationState = animationState;
        
        if (mixer) {
          // Find appropriate animation
          let targetClip = null;
          
          if (animationState === 'talking' || animationState === 'greeting') {
            targetClip = Object.values(animations).find(c => 
              c.name.toLowerCase().includes('talk') || 
              c.name.toLowerCase().includes('speak')
            );
          } else if (animationState === 'listening') {
            targetClip = Object.values(animations).find(c => 
              c.name.toLowerCase().includes('idle') ||
              c.name.toLowerCase().includes('listen')
            );
          } else if (animationState === 'thinking') {
            targetClip = Object.values(animations).find(c => 
              c.name.toLowerCase().includes('think') ||
              c.name.toLowerCase().includes('idle')
            );
          } else {
            targetClip = Object.values(animations).find(c => 
              c.name.toLowerCase().includes('idle')
            );
          }

          // Fallback to first animation if no match
          if (!targetClip && Object.values(animations).length > 0) {
            targetClip = Object.values(animations)[0];
          }

          if (targetClip && currentAction) {
            const newAction = mixer.clipAction(targetClip);
            newAction.reset();
            newAction.crossFadeFrom(currentAction, 0.3, true);
            newAction.play();
            currentAction = newAction;
          }
        }
      }

      // Subtle idle movement + face tracking
      if (foxRoot) {
        const breathe = Math.sin(performance.now() * 0.001) * 0.015;
        foxRoot.position.y = -1.2 + breathe;
        
        // Get face position from FoxRuntime
        const facePos = window.__FOX_FACE_POSITION || { x: 0, y: 0 };
        
        // Blend face tracking with idle sway
        const idleSway = Math.sin(performance.now() * 0.0006) * 0.08;
        const targetRotationY = facePos.x * 0.3 + idleSway * 0.3;
        const targetRotationX = -facePos.y * 0.2;
        
        // Smooth interpolation
        foxRoot.rotation.y += (targetRotationY - foxRoot.rotation.y) * 0.05;
        
        if (isSpeaking) {
          foxRoot.rotation.x += (targetRotationX - foxRoot.rotation.x) * 0.08;
        } else {
          const idleNod = Math.sin(performance.now() * 0.0009) * 0.05;
          foxRoot.rotation.x += ((targetRotationX + idleNod) - foxRoot.rotation.x) * 0.05;
        }
      }

      // Drive mouth animation from audio amplitude
      if (mouthTargets.length) {
        const mouthAmp = isSpeaking ? amp * 1.5 : 0;
        
        for (const t of mouthTargets) {
          if (t.type === "morph") {
            const influences = t.mesh.morphTargetInfluences;
            if (influences && typeof t.index === "number") {
              // Smooth the mouth movement
              const current = influences[t.index];
              influences[t.index] = current + (mouthAmp - current) * 0.3;
            }
          } else if (t.type === "bone") {
            // Rotate jaw bone for lip sync
            const targetRotation = (t.originalRotation || 0) + mouthAmp * 0.3;
            t.obj.rotation.x += (targetRotation - t.obj.rotation.x) * 0.3;
          }
        }
      }

      if (mixer) {
        mixer.update(clock.getDelta());
      }
    renderer.render(scene, camera);
  }

  animate();
  console.log("[fox-live.v2] Render loop started");

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", foxLiveMain, { once: true });
} else {
  foxLiveMain();
}
