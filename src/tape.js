/*
 * Create tapes, tape head and event objects
 */
const SHAPES2D = require(`./shapes2D`);

// Tape class - Object on which tape heads and events are attached
class Tape {
  constructor(position, isHorizontal, start, end) {
    this.position = position || 0.0;
    if (isHorizontal === undefined) {
      this.isHorizontal = true;
    } else {
      this.isHorizontal = isHorizontal;
    }
    this.start = start ||
      (this.isHorizontal ? -window.innerWidth / 2 : -window.innerHeight / 2);
    this.end = end ||
      (this.isHorizontal ? window.innerWidth / 2 : window.innerHeight / 2);
    this.heads = [];
    this.events = [];
    this.line = undefined;
  }
  // Add an event on the tape
  addEvent(tapeEvent) {
    this.events.push(tapeEvent);
  }
  // Add a head on the tape
  addHead(tapeHead) {
    this.heads.push(tapeHead);
  }
  // Draw the original line on a given scene
  drawOn(scene) {
    this.line = new SHAPES2D.Line(
      {x: this.isHorizontal ? this.start : this.position,
       y: this.isHorizontal ? this.position : this.start, z: 0.0},
      {x: this.isHorizontal ? this.end : this.position,
       y: this.isHorizontal ? this.position : this.end, z: 0.0}
    );
    this.line.addTo(scene);
  }
  // Update the events and heads
  update () {
    this.heads.forEach((head) => {
      // Move the the head
      let previousPosition = head.position;
      tapeHead.update();
      // Fire an event if the head just went past it
      this.events.forEach((event) => {
        // TODO Fire event
        event.update();
      });
    });
  }
}
// Class defining a tape head
class Head {
  constructor(tape, position, isForward) {
    if (isForward === undefined) {
      this.isForward = true;
    } else {
      this.isForward = isForward;
    }
    this.position = position || 0; // Linear position on the tape
    this.tape = tape;
    this._size = 30;
    this._speed = this.direction * 180;
    this.sprite = undefined;
  }
  // Getters
  get xyz() {
    let xyz = {};
    if (this.tape.isHorizontal) {
      xyz.x = this.position;
      xyz.y = this.tape.position;
    } else {
      xyz.x = this.tape.position;
      xyz.y = this.position;
    }
    xyz.z = 0;
    return xyz;
  }
  get direction() {
    return -1 + 2 * this.isForward;
  }
  // Draw the tape at its original place on the scene
  drawOn(scene) {
    this.sprite = new SHAPES2D.Square(this._size, this.xyz);
    this.sprite.addTo(scene);
  }
  // Render the tape
  render(dt) {
    let xyz = this.xyz;
    this.sprite.position.x = xyz.x;
    this.sprite.position.y = xyz.y;
    this.sprite.position.z = xyz.z;
  }
  // Update the tape
  update(step) {
    this.position += this._speed * step;
  }



}

module.exports.Tape = Tape;
module.exports.Head = Head;
