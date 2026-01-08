import * as THREE from "https://cdn.skypack.dev/three@0.155.0";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.155.0/examples/jsm/loaders/GLTFLoader.js";

const videoEl = document.getElementById("camera");
const canvasEl = document.getElementById("scene");

function startVideoStream() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.error("Camera access is not supported in this browser.");
    return;
  }

  navigator.mediaDevices
    .getUserMedia({
      audio: false,
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: window.innerWidth },
        height: { ideal: window.innerHeight },
      },
    })
    .then((stream) => {
      videoEl.srcObject = stream;
    })
    .catch((err) => {
      console.error("Unable to access camera:", err);
    });
}

function initThree() {
  const renderer = new THREE.WebGLRenderer({ canvas: canvasEl, alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 1.5, 4);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x333333, 1.2);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(3, 6, 2);
  scene.add(dirLight);

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
          child.castShadow = true;
        }
      });
      scene.add(fox);

      mixer = new THREE.AnimationMixer(fox);
      const idleClip = gltf.animations.find((clip) => clip.name.toLowerCase().includes("idle")) || gltf.animations[0];
      if (idleClip) {
        mixer.clipAction(idleClip).play();
      }
    },
    undefined,
    (error) => {
      console.error("Failed to load fox model:", error);
    }
  );

  const clock = new THREE.Clock();

  function onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  window.addEventListener("resize", onResize);

  function render() {
    requestAnimationFrame(render);
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);
    renderer.render(scene, camera);
  }

  render();
}

startVideoStream();
initThree();
