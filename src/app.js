let THREE = require('three');
let Animation = require('./animation');

let scene = new THREE.Scene();
// let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -1000, 1000 );
camera.position.z = 100;
// camera.position.x = 30;
// camera.position.y = 30;
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Square
let squareMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
let squareGeometry = new THREE.Geometry();
squareGeometry.vertices.push(new THREE.Vector3(-15.0, 15.0, 0.0));
squareGeometry.vertices.push(new THREE.Vector3(15.0, 15.0, 0.0));
squareGeometry.vertices.push(new THREE.Vector3(15.0, -15.0, 0.0));
squareGeometry.vertices.push(new THREE.Vector3(-15.0, -15.0, 0.0));
squareGeometry.faces.push(new THREE.Face3(0, 2, 1));
squareGeometry.faces.push(new THREE.Face3(0, 3, 2));
let square = new THREE.Mesh(squareGeometry, squareMaterial);
// square.position.set(0.0, 0.0, 0.0);
scene.add(square);

// Line
let lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
let lineGeometry = new THREE.Geometry();
lineGeometry.vertices.push(
  new THREE.Vector3(-window.innerWidth/2, 0, 0),
  new THREE.Vector3(window.innerWidth/2, 0, 0)
);
var line = new THREE.Line( lineGeometry, lineMaterial );
scene.add( line );

// // Cylindre
// let geometry = new THREE.CylinderGeometry(2, 2, window.innerWidth, 5);
// let cylinder = new THREE.Mesh(geometry, material);
// cylinder.rotation.z = Math.PI / 2;
// scene.add(cylinder);

// Animation dynamics
let update = (step) => {
  square.position.x += 120 * step;
  if (square.position.x > window.innerWidth/2) {
    square.position.x = -square.position.x;
  }
};

let render = (dt) => {
  renderer.render(scene, camera);
};

let animation = new Animation.Animation(update, render);
animation.run();

// 2D representation - http://stackoverflow.com/questions/21786184/setting-up-a-2d-view-in-three-js / See update 4
