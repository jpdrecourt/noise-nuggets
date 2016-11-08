/*
 * Animation class managing update and rendering separately
 * Inspired by http://codeincomplete.com/posts/javascript-game-foundations-the-game-loop/
 * Initialize with let animation = new Animation(update, render);
 * update: function updating the animation physics without rendering
 *         argument: step in seconds
 * render: function rendering the animation once every requestAnimationFrame
 * And run with animation.run();
 * Slow motion with: animation.slow = x (x > 1)
 * Change step for update with animation.step = 1/fps
 */

class Animation {
  constructor (update, render) {
    this._maxDt = 1; // Maximum DT between two updates (in case animation stops)
    this._last = undefined;
    this._dt = 0;
    this._slow = 1;
    this._step = 1/60;
    this._slowStep = this._slow * this._step;
    this._update = update; // Once every slowStep
    this._render = render; // Once every requestAnimationFrame
  }

  // Getters
  get slow()    {return this._slow;}
  get step()    {return this._step;}
  get update()  {return this._update;}
  get render()  {return this._render;}

  // Setters
  set slow(value)   {this._slow = value;}
  set step(value)   {this._step = value;
                     this._slowStep = this._slow * this._step;}
  set update(value) {this._update = value;}
  set render(value) {this._render = value;}

  run() {
    let frame = (now) => {
      if (!this._last) this._last = now;

      this._dt += Math.min(this._maxDt, (now - this._last) / 1000);
      // Do the updating as many times as needed for one rendering frame
      while (this._dt > this._slowStep) {
        this._dt -= this._slowStep;
        this.update(this.step);
      }
      this.render(this._dt/this.slow);
      this._last = now;
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }
}

module.exports.Animation = Animation;
