let THREE = require('three');
let Animation = require('./animation');
let shapes2D = require('./shapes2D');

let scene = new THREE.Scene();
// let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -1000, 1000 );
camera.position.z = 0;
// camera.position.x = 30;
// camera.position.y = 30;
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


// Line
let lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
let lineGeometry = new THREE.Geometry();
lineGeometry.vertices.push(
  new THREE.Vector3(-window.innerWidth/2, 0, 0),
  new THREE.Vector3(window.innerWidth/2, 0, 0)
);
var line = new THREE.Line( lineGeometry, lineMaterial );
scene.add( line );

// Square
let square = new shapes2D.square(30);
square.addTo(scene);

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
