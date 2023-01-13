/**
 * Class for creating, updating, and managing textures in a 3D graphics application.
 */
class TextureObject {
  /**
   * @type {Object}
   * @private
   */
  _descriptor;

  /**
   * @type {Object}
   * @private
   */
  _texture;

  /**
   * @type {Object}
   * @private
   */
  _view;

  /**
   * @type {Array}
   * @private
   */
  _images;

  /**
   * @type {Object}
   * @private
   */
  _sampler;

  /**
   * @type {Boolean}
   * @private
   */
  _loaded = false;

  /**
   * @type {Map}
   * @static
   */
  static cachedTextures = new Map();

  /**
   * @constructor
   * @param {Object} descriptor - the descriptor for the texture
   */
  constructor(descriptor) {
    this._descriptor = descriptor;
    TextureObject.cachedTextures.set(this, true);
  }

  /**
   * update descriptor but not create texture immediately
   * @param {Object} desc - the descriptor to update
   * @returns {TextureObject} - returns the current instance
   */
  updateDescriptor(desc) {
    this.destroy();
    if (!this._descriptor) {
      this._descriptor = desc;
    }
    else {
      desc.texture
                && (this._descriptor.texture = Object.assign(this._descriptor.texture ?? {}, desc.texture));
      desc.view
                && (this._descriptor.view = Object.assign(this._descriptor.view ?? {}, desc.view));
      desc.sampler
                && (this._descriptor.sampler = Object.assign(this._descriptor.sampler ?? {}, desc.sampler));
    }
    return this;
  }

  /**
   * @async
   * @param {HTMLImageElement} image - the image to create the texture from
   * @param {Object} options - options to pass to createImageBitmap
   * @param {Object} offset - contains sx, sy, sw, sh properties indicating the offset of the image
   * @returns {Promise<TextureObject>} - returns the current instance
   */
  async setImageAsync(image, options, offset) {
    const promise = offset
      ? createImageBitmap(image, offset.sx, offset.sy, offset.sw, offset.sh, options)
      : createImageBitmap(image, options);
    this._images = [await promise];
    this._loaded = false;
    return this;
  }

  /**
   * @async
   * @param {Array<HTMLImageElement>} images - the images to create the texture from
   * @returns {Promise<TextureObject>} - returns the current instance
   */
  async setImagesAsync(images) {
    const promises = images.map((img) => createImageBitmap(img));
    this._images = await Promise.all(promises);
    this._loaded = false;
    return this;
  }

  /**
   * update buffer with the images
   * @param {Object} device - the device used to create the texture
   */
  updateBuffer(device) {
    if (!this._loaded && this._images) {
      const texture = this.getTexture(device);
      this._images.forEach((img, i) => {
        device.queue.copyExternalImageToTexture({ source: img }, { texture, origin: [0, 0, i] }, [img.width, img.height]);
      });
      this._loaded = true;
    }
  }

  /**
   * get the texture
   * @param {Object} device - the device used to create the texture
   * @param {Boolean} [forceUpdate=false] - forces update of the texture
   * @param {Object} [desc={}] - descriptor for the texture
   * @returns {Object} - the texture object
   */
  getTexture(device, forceUpdate = false, desc = {}) {
    if (!this._texture || forceUpdate) {
      this.updateDescriptor({ texture: desc });
      this._texture?.destroy();
      this._texture = device.createTexture(this._descriptor.texture);
      this._view = undefined;
      this.updateBuffer(device);
    }
    return this._texture;
  }

  /**
   * get the texture view
   * @param {Object} device - the device used to create the texture view
   * @param {Boolean} [forceUpdate=false] - forces update of the texture view
   * @param {Object} [desc={}] - descriptor for the texture view
   * @returns {Object} - the texture view object
   */
  getView(device, forceUpdate = false, desc = {}) {
    if (!this._view || forceUpdate) {
      this.updateDescriptor({ view: desc });
      this._view = this.getTexture(device).createView(this._descriptor?.view);
    }
    return this._view;
  }

  /**
   * get the sampler
   * @param {Object} device - the device used to create the sampler
   * @param {Boolean} [forceUpdate=false] - forces update of the sampler
   * @param {Object} [desc={}] - descriptor for the sampler
   * @returns {Object} - the sampler object
   */
  getSampler(device, forceUpdate = false, desc = {}) {
    if (!this._sampler || forceUpdate) {
      desc && this.updateDescriptor({ sampler: desc });
      this._sampler = device.createSampler(this._descriptor?.sampler);
    }
    return this._sampler;
  }

  /**
   * destroy the texture
   */
  destroy() {
    if (this._texture) {
      this._texture.destroy();
      this._texture = undefined;
      this._view = undefined;
    }
  }
}
/**
 * Exports the TextureObject class.
 **/
export { TextureObject };
