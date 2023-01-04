class FrameController {
  _active = false;

  callback;

  constructor(callback) {
    this.callback = callback;
  }

  get isActive() {
    return this._active;
  }

  start() {
    this._active = true;
    this._loop();
  }

  pause() {
    this._active = false;
  }

  _loop() {
    if (this._active) {
      requestAnimationFrame(this._loop.bind(this));
      this.callback();
    }
  }
}

export { FrameController };
