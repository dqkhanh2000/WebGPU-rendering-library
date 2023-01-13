/**
 * A class for handling animation frames and running a callback function.
 */
class FrameController {
  /**
   * A private property indicating if the animation loop is currently active.
   * @private
   * @type {boolean}
   */
  _active = false;

  /**
   * The function to be called on each animation frame.
   * @type {Function}
   */
  callback;

  /**
   * @param {Function} callback - The function to be called on each animation frame.
   */
  constructor(callback) {
    this.callback = callback;
  }

  /**
   * A boolean property indicating if the animation loop is currently active.
   * @type {boolean}
   * @readonly
   */
  get isActive() {
    return this._active;
  }

  /**
   * Start the animation loop.
   */
  start() {
    this._active = true;
    this._loop();
  }

  /**
   * Pause the animation loop.
   */
  pause() {
    this._active = false;
  }

  /**
   * The animation loop function that calls the provided callback function.
   * @private
   */
  _loop() {
    if (this._active) {
      requestAnimationFrame(this._loop.bind(this));
      this.callback();
    }
  }
}

export { FrameController };
