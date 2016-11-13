/*
 * Create tapes, tape head and event objects
 */
const SHAPES2D = require(`./shapes2D`);

// Class defining a general event - Fully cu
// TODO Doc
class Event {
  constructor(tape, position) {
    this.drawOn = (scene) => {return;};
    this.fire = () => {return;};
    this.isFired = false;
    this.tape = tape;
    tape.addEvent(this);
    this.position = position || (tape.start + tape.end) / 2;
    // Make sure the position is on the tape
    if (this.position < tape.start) this.position = tape.start;
    if (this.position > tape.end) this.position = tape.end;
    this.render = () => {return;};
    this.sprite = undefined;
    this.update = () => {return;};
  }
  drawOn(scene) {
    this.drawOn(scene);
  }
  fire() {
    this.fire(...arguments);
  }
  render(dt) {
    this.render(dt);
  }
  update(step) {
    this.update(step);
  }
}

class SoundEvent extends Event {
  constructor(tape, position, howl) {
    super(tape, position);
    this.howl = howl;
    this.drawOn = (scene) => {
      // debugger
      let x, y;
      if (this.tape.isHorizontal) {
        x = this.position;
        y = this.tape.position;
        // Draw a vertical line
        this.sprite = new SHAPES2D.Line(
          {x: x, y: y - 20, z: 0},
          {x: x, y: y + 50, z: 0});
      } else {
        x = this.tape.position;
        y = this.position;
        this.sprite = new SHAPES2D.Line(
          {x: x + 20, y: y, z: 0},
          {x: x - 50, y: y, z: 0});
      }
      this.sprite.addTo(scene);
    };
  }
}

// Class defining a tape head
// TODO Doc
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
    this.tape.addHead(this);
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
// Tape class - Object on which tape heads and events are attached
// TODO Doc
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
    this.sprite = undefined;
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
    this.sprite = new SHAPES2D.Line(
      {x: this.isHorizontal ? this.start : this.position,
        y: this.isHorizontal ? this.position : this.start, z: 0.0},
      {x: this.isHorizontal ? this.end : this.position,
        y: this.isHorizontal ? this.position : this.end, z: 0.0});
    this.sprite.addTo(scene);
  }
  // Update the events and heads
  update (step) {
    this.heads.forEach((head) => {
      // Move the the head
      let previousPosition = head.position;
      head.update(step);
      // Fire an event if the head just went past it
      this.events.forEach((event) => {
        // TODO Fire event
        event.update(step);
      });
    });
  }
  render(dt) {
    this.heads.forEach((head) => {
      head.render(dt);
    });
    this.events.forEach((event) => {
      event.render(dt);
    });
  }
}

module.exports.Event = Event;
module.exports.SoundEvent = SoundEvent;
module.exports.Head = Head;
module.exports.Tape = Tape;
