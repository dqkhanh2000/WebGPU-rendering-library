import { TextureObject } from "../buffer/TextureObject.js";
import { BaseLoader } from "./BaseLoader.js";

const GPUTextureUsage = window.GPUTextureUsage ?? {};
class TextureLoader extends BaseLoader {
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
