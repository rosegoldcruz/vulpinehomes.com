import * as THREE from "https://cdn.skypack.dev/three@0.155.0";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.155.0/examples/jsm/loaders/GLTFLoader.js";

const videoEl = document.getElementById("camera");
const canvasEl = document.getElementById("scene");

if (!videoEl || !canvasEl) {
  console.error("Camera video or canvas element not found.");
}

/* =========================
   START CAMERA (MOBILE SAFE)
   ========================= */
async function startCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.error("getUserMedia not supported");
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: window.innerWidth },
        height: { ideal: window.innerHeight }
      }
    });

    videoEl.srcObject = stream;

    // iOS SAFARI REQUIRES THIS
    videoEl.onloadedmetadata = () => {
      videoEl
        .play()
        .then(() => {
          console.log("Camera started");
        })
        .catch(err => {
          console.error("Video play failed:", err);
        });
    };

  } catch (err) {
    console.error("Camera access denied or failed:", err);
  }
}

/* =========================
   THREE.JS SETUP
   ========================= */
function startThree() {
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasEl,
    alpha: true,
    antialias: true
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 1.6, 4);

  /* LIGHTING */
  const hemi = new THREE.HemisphereLight(0xffffff, 0x333333, 1.3);
  scene.add(hemi);

  const dir = new THREE.DirectionalLight(0xffffff, 1);
  dir.position.set(3, 6, 2);
  scene.add(dir);

  /* LOAD FOX */
  const loader = new GLTFLoader();
  let mixer = null;

  loader.load(
    "/fox.glb",
    (gltf) => {
      const fox = gltf.scene;

      fox.scale.set(1.3, 1.3, 1.3);
      fox.position.set(0, -1.2, 0);

      fox.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = false;
          child.frustumCulled = false;
        }
      });

      scene.add(fox);

      mixer = new THREE.AnimationMixer(fox);
      const idle =
        gltf.animations.find(a =>
          a.name.toLowerCase().includes("idle")
        ) || gltf.animations[0];

      if (idle) {
        mixer.clipAction(idle).play();
      }
    },
    undefined,
    (err) => {
      console.error("Failed to load fox.glb:", err);
    }
  );

  const clock = new THREE.Clock();

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  window.addEventListener("resize", resize);

  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);
    renderer.render(scene, camera);
  }

  animate();
}

/* =========================
   BOOT SEQUENCE
   ========================= */
startCamera();
startThree();