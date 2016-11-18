const THREE = require('three');
const ANIM = require('./animation');
const SHAPES2D = require('./shapes2D');
const ASSETS = require('./assets');
const TAPE = require('./tape');

// Initialize THREE
// ----------------------------------------------------------------------------
let scene = new THREE.Scene();
let camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / -2, window.innerHeight / 2, -200, 200);
camera.position.z = 3;
// Renderer
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
let container = document.getElementById('ThreeJS');
container.appendChild(renderer.domElement);
// Dom events

// Window events

// -----------------------------------------------------------------------------
// Graphical interface
// -----------------------------------------------------------------------------
ASSETS.load(() => {
  // ----------------------------------------------------------------------------
  // Initialize objects
  // ----------------------------------------------------------------------------
  let tapeObjects = TAPE.createTapeItems(ASSETS);
  TAPE.drawTapeObjects(tapeObjects, scene); // TODO Make this elegant!

  //---------------------------------------------------------------------------
  // Animation setup
  // ---------------------------------------------------------------------------
  // Update animations physics
  let update = (step) => {
    // tape.update(step);
    tapeObjects.tapes.forEach((tape) => {
      tape.update(step);
    });
  };
  // Render animation
  let render = (dt) => {
    tapeObjects.tapes.forEach((tape) => {
      tape.render(dt);
    });
    renderer.render(scene, camera);
  };
  // Define the animation dynamics
  let animation = new ANIM.Animation(update, render);
  animation.run();
});
