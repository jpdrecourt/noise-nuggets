const THREE = require('three');
const ANIM = require('./animation');
const SHAPES2D = require('./shapes2D');
const ASSETS = require('./assets');
const TAPE = require('./tape');

// Initialize THREE
// ----------------------------------------------------------------------------
let scene = new THREE.Scene();
// let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -1000, 1000 );
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// -----------------------------------------------------------------------------
// Graphical interface
// -----------------------------------------------------------------------------
ASSETS.load(() => {
  // ----------------------------------------------------------------------------
  // Initialize objects
  // ----------------------------------------------------------------------------
  let tapeObjects = TAPE.createTapeItems(ASSETS);
  TAPE.drawTapeObjects(tapeObjects, scene); // TODO Make this elegant!

  // // Add head
  // let head = new TAPE.Head(tape, 0, false);
  // head.drawOn(scene);
  // let head2 = new TAPE.Head(tape, 0, true);
  // head2.drawOn(scene);
  // head2.sprite.colorHex = 0xff0000;
  // let head3 = new TAPE.Head(tape, 40, true);
  // head3.drawOn(scene);
  // head3.sprite.colorHex = 0x00ff00;
  //
  // // Add sound event
  // let soundEvent = new TAPE.SoundEvent(tape, -250, ASSETS.sounds.bell.howl);
  // soundEvent.drawOn(scene);
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
