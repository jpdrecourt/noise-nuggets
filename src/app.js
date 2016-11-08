let THREE = require('three');
let Animation = require('./animation');

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let geometry = new THREE.BoxGeometry(1, 1, 1);
let material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
let cube = new THREE.Mesh(geometry, material);
scene.add(cube);
camera.position.z = 5;

// LIGHTS

let ambientLight = new THREE.AmbientLight(0x222222);
scene.add(ambientLight);
let light = new THREE.DirectionalLight(0xFFFFFF, 1);
light.position.set(-800, 900, 300);
scene.add(light);

// Animation dynamics
let update = (step) => {
  cube.rotation.x += 0.6 * step;
  cube.rotation.y += 0.6 * step;
};

let render = (dt) => {
  renderer.render(scene, camera);
};

let animation = new Animation.Animation(update, render);
animation.run();
// 2D representation - http://stackoverflow.com/questions/21786184/setting-up-a-2d-view-in-three-js / See update 4
