const THREE = require('three');
const ANIM = require('./animation');
const SHAPES2D = require('./shapes2D');
// const ASSETS = require('./assets');
const TAPE = require('./tape');

// Initialize THREE
// ----------------------------------------------------------------------------
let scene = new THREE.Scene();
// let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -1000, 1000 );
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// ---------------------------------------------------------------------------

// Add tape
let tape = new TAPE.Tape(0, false);
tape.drawOn(scene);

// Add head
let head = new TAPE.Head(tape, 0, false);
head.drawOn(scene);

// Add sound event
let soundEvent = new TAPE.SoundEvent(tape, -250);
soundEvent.drawOn(scene);

// Animation setup
// ---------------------------------------------------------------------------
// Update animations physics
let update = (step) => {
  tape.update(step);
};
// Render animation
let render = (dt) => {
  tape.render(dt);
  renderer.render(scene, camera);
};
// Define the animation dynamics
let animation = new ANIM.Animation(update, render);
animation.run();
// ---------------------------------------------------------------------------
