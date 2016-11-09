let THREE = require('three');
let Animation = require('./animation');

let scene = new THREE.Scene();
// let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -1000, 1000 );
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Cube
let geometry = new THREE.BoxGeometry(30, 30, 30);
let material = new THREE.MeshLambertMaterial({ color: 0xffffff });
let cube = new THREE.Mesh(geometry, material);
// cube.position.z = -15;
scene.add(cube);
camera.position.z = 100;
camera.position.x = 30;
camera.position.y = 30;

// Cylindre
geometry = new THREE.CylinderGeometry(2, 2, window.innerWidth, 5);
let cylinder = new THREE.Mesh(geometry, material);
cylinder.rotation.z = Math.PI / 2;
scene.add(cylinder);

// LIGHTS

let ambientLight = new THREE.AmbientLight(0x555555);
scene.add(ambientLight);
let light = new THREE.DirectionalLight(0xFFFFFF, 1);
light.position.set(-800, 900, 300);
scene.add(light);

// Animation dynamics
let update = (step) => {
};

let render = (dt) => {
  renderer.render(scene, camera);
};

let animation = new Animation.Animation(update, render);
animation.run();

// 2D representation - http://stackoverflow.com/questions/21786184/setting-up-a-2d-view-in-three-js / See update 4
