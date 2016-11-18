/*
 * Create tapes, tape head and event objects
 */
const SHAPES2D = require(`./shapes2D`);
const UUID = require(`node-uuid`);

class Item {
  constructor(id) {
    this._id = id || UUID.v1();
  }
  get id() {return this._id;}
}
/*
 * Class defining a general event - Fully customisable
 * TODO Doc
 */
class Event extends Item {
  constructor(tape, position, id) {
    super(id);
    this.firingHead = undefined;
    this.isFired = false;
    this.tape = tape;
    tape.addEvent(this);
    this.position = position || (tape.start + tape.end) / 2;
    // Make sure the position is on the tape
    if (this.position < tape.start) this.position = tape.start;
    if (this.position > tape.end) this.position = tape.end;
    this.sprite = undefined;
  }
  // Allows for custom general events
  drawOn(scene) {
    return;
  }
  firedBy (head) {
    // Fires if the head passes the event
    // Makes sure it doesn't fire in case of loop
    if ((head.position == this.position) || // Exactly on the event
        (head.isForward && // Passing the event in the forward direction
          (head.position > this.position) && (head.PreviousPosition < this.position)) ||
        (!head.isForward && // Passing the event in the backward direction
          (head.position < this.position) && (head.PreviousPosition > this.position))) {
      this.isFired = true;
      this.firingHead = head;
    }
  }
  render() {
    return;
  }
  update() {
    if (this.isFired) {
      this.isFired = false;
      this.firingHead = undefined;
    }
    return;
  }
}
/*
 * Sound event - Subclass of event
 * TODO Doc
 */
class SoundEvent extends Event {
  constructor(tape, position, howl, id) {
    super(tape, position, id);
    this.howl = howl;
  }
  drawOn (scene) {
    super.drawOn(scene);
    let x, y;
    if (this.tape.isHorizontal) {
      x = this.position;
      y = this.tape.position;
      // Draw a vertical line
      this.sprite = new SHAPES2D.Line(
        {x: x, y: y + 20, z: 0},
        {x: x, y: y - 50, z: 0});
    } else {
      x = this.tape.position;
      y = this.position;
      this.sprite = new SHAPES2D.Line(
        {x: x - 20, y: y, z: 0},
        {x: x + 50, y: y, z: 0});
    }
    this.sprite.addTo(scene);
  }

  update () {
    if (this.isFired) {
      this.sprite.material.linewidth = 3;
      setTimeout(() => {this.sprite.material.linewidth = 1;}, 150);
      this.howl.play();
    }
    super.update();
  }
}
/*
 * Loop event - Subclass of Event
 * TODO Documentation
 */
class LoopEvent extends Event {
  constructor(tape, back, front, id) {
    super(tape, back, id); // Position will hold the upstream part of the loop
    this.backPosition = back || this.tape.start;
    this.frontPosition = front || this.tape.end;
    this.backSprite = undefined;
    this.fromtSprite = undefined;
    this._height = 40;
  }
  drawOn(scene) {
    super.drawOn(scene);
    let rotation, backXYZ, frontXYZ;
    if (this.tape.isHorizontal) {
      rotation = 0;
      backXYZ = {x: this.backPosition, y: this.tape.position, z: 0};
      frontXYZ = {x: this.frontPosition, y: this.tape.position, z: 0};
    } else {
      rotation = Math.PI/2;
      backXYZ = {x: this.tape.position, y: this.backPosition, z: 0};
      frontXYZ = {x: this.tape.position, y: this.frontPosition, z: 0};
    }
    this.backSprite = new SHAPES2D.Bracket(backXYZ, this._height, rotation);
    this.frontSprite = new SHAPES2D.Bracket(frontXYZ, this._height, Math.PI + rotation);
    this.backSprite.addTo(scene);
    this.frontSprite.addTo(scene);
  }
  firedBy(head) {
    if (head.isForward) {
      this.position = this.frontPosition;
    } else {
      this.position = this.backPosition;
    }
    super.firedBy(head);
  }
  update () {
    if (this.isFired) {
      this.backSprite.material.linewidth = 3;
      this.frontSprite.material.linewidth = 3;
      setTimeout(() => {
        this.backSprite.material.linewidth = 1;
        this.frontSprite.material.linewidth = 1;}, 150);
      if (this.firingHead.isForward) {
        this.firingHead.position = this.backPosition;
      } else {
        this.firingHead.position = this.frontPosition;
      }
    }
    super.update();
  }
}

// Class defining a tape head
// TODO Doc
class Head extends Item {
  constructor(tape, position, isForward, id) {
    super(id);
    if (isForward === undefined) {
      this.isForward = true;
    } else {
      this.isForward = isForward;
    }
    this.position = position || 0; // Linear position on the tape
    this.previousPosition = this.position;
    this.tape = tape;
    this._size = 25;
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
    this.PreviousPosition = this.position;
    this.position += this._speed * step;
  }
}
// Tape class - Object on which tape heads and events are attached
// TODO Doc
class Tape extends Item {
  constructor(position, isHorizontal, start, end, id) {
    super(id);
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
        event.firedBy(head);
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

/*
 * Returns the item with the id (or undefined);
 */
let findById = (itemArray, id) => {
  return itemArray.filter((item) => {
    return item.id == id;
  })[0];
};
/*
 * Instantiates the items in a tapeItems array
 */
exports.createTapeItems = (ASSETS) => {
  let tapeObjects = {
    tapes: [],
    heads: [],
    events: []
  };
  let theTape;
  ASSETS.data.tapeItems.forEach((item) => {
    if (item.type !== "Tape") {
      theTape = findById(tapeObjects.tapes, item.tapeId);
    }
    switch (item.type) {
      case "Tape":
        tapeObjects.tapes.push(new Tape(item.position, item.isHorizontal, item.start, item.end, item.id));
        break;
      case "LoopEvent":
        tapeObjects.events.push(new LoopEvent(theTape, item.back, item.front, item.id));
        break;
      case "SoundEvent":
        tapeObjects.events.push(new SoundEvent(theTape, item.position, ASSETS.sounds[item.sound].howl));
        break;
      case "Head":
        tapeObjects.heads.push(new Head(theTape, item.position, item.isForward, item.id));
        break;
    }
  });
  return tapeObjects;
};

exports.drawTapeObjects = (tapeObjects, scene) => {
  for (let key in tapeObjects) {
    tapeObjects[key].forEach((object) => {
      object.drawOn(scene);
    });
  }
};

module.exports.Event = Event;
module.exports.SoundEvent = SoundEvent;
module.exports.LoopEvent = LoopEvent;
module.exports.Head = Head;
module.exports.Tape = Tape;
