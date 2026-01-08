import * as THREE from "https://cdn.skypack.dev/three@0.155.0";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.155.0/examples/jsm/loaders/GLTFLoader.js";

const video = document.getElementById("camera");
const canvas = document.getElementById("scene");
const startOverlay = document.getElementById("start");
const startBtn = document.getElementById("startBtn");

let mixer;

startBtn.addEventListener("click", async () => {
  startOverlay.remove();
  await startCamera();
  startThree();
});

async function startCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { facingMode: { ideal: "environment" } }
  });

  video.srcObject = stream;
  await video.play();
}

function startThree() {
  const renderer = new THREE.WebGLRenderer({
    canvas,
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

  scene.add(new THREE.HemisphereLight(0xffffff, 0x333333, 1.3));

  const dir = new THREE.DirectionalLight(0xffffff, 1);
  dir.position.set(3, 6, 2);
  scene.add(dir);

  const loader = new GLTFLoader();

  loader.load("/fox.glb", (gltf) => {
    const fox = gltf.scene;
    fox.scale.set(1.3, 1.3, 1.3);
    fox.position.set(0, -1.2, 0);
    scene.add(fox);

    mixer = new THREE.AnimationMixer(fox);
    const idle =
      gltf.animations.find(a => a.name.toLowerCase().includes("idle")) ||
      gltf.animations[0];
    mixer.clipAction(idle).play();
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    if (mixer) mixer.update(clock.getDelta());
    renderer.render(scene, camera);
  }

  animate();
}
