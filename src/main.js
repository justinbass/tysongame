import "./style.css";
import * as THREE from "three";

const app = document.querySelector("#app");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b1020);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.set(0, 1, 4);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
app.appendChild(renderer.domElement);

const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);

const key = new THREE.DirectionalLight(0xffffff, 1.0);
key.position.set(3, 5, 2);
scene.add(key);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x8b5cf6 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const grid = new THREE.GridHelper(10, 10, 0x2a335a, 0x1b2140);
grid.position.y = -1;
scene.add(grid);

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onResize);

function animate() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.0125;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
