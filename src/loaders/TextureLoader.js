import { TextureObject } from "../buffer/TextureObject.js";
import { BaseLoader } from "./BaseLoader.js";

const GPUTextureUsage = window.GPUTextureUsage ?? {};

/**
 Class representing a Texture Loader.
 @extends BaseLoader
 */
class TextureLoader extends BaseLoader {
  /**
   Asynchronously loads a Texture from a URL.
   @param {string} url - The URL of the Texture to load.
   @returns {Promise<TextureObject>} A promise that resolves to the loaded Texture.
   */
  async loadAsync(url) {
    const img = await this.getImage(url);
    const texture = new TextureObject({
      texture: {
        size   : [img.width, img.height, 1],
        format : "rgba8unorm",
        usage  : GPUTextureUsage.TEXTURE_BINDING
                    | GPUTextureUsage.COPY_DST
                    | GPUTextureUsage.RENDER_ATTACHMENT,
      },
    });
    await texture.setImageAsync(img);
    return texture;
  }

  /**
   Asynchronously loads a cubemap from a list of URLs.
   @param {string[]} urls - An array of URLs of the 6 faces of the cubemap to load.
   @returns {Promise<TextureObject>} A promise that resolves to the loaded cubemap.
   */
  async loadCubemapAsync(urls) {
    const imgs = await Promise.all(urls.map(this.getImage));
    const texture = new TextureObject({
      texture: {
        size   : [imgs[0].width, imgs[0].height, 6],
        format : "rgba8unorm",
        usage  : GPUTextureUsage.TEXTURE_BINDING
                    | GPUTextureUsage.COPY_DST
                    | GPUTextureUsage.RENDER_ATTACHMENT,
      },
      view: {
        dimension: "cube",
      },
    });
    await texture.setImagesAsync(imgs);
    return texture;
  }

  /**
   Returns an Image object from a given URL.
   @param {string} url - The URL of the image.
   @returns {Promise<Image>} A promise that resolves to the loaded image.
   */
  getImage(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        resolve(img);
      };
    });
  }
}

export { TextureLoader };
