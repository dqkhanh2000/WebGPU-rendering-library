
/**
 * A class for representing a buffer attribute.
 *
 * @class
 */
export class BufferAttribute {
  /**
   * Creates a new BufferAttribute instance.
   *
   * @param {number} [offset=0] - The byte offset of the attribute in the buffer.
   * @param {number} [size=3] - The number of components in the attribute.
   * @param {string} [format='float32x4'] - The format of the attribute data.
   */
  constructor(offset = 0, size = 3, format = "float32x4") {
    /**
     * The byte offset of the attribute in the buffer.
     *
     * @type {number}
     */
    this.offset = 0;

    /**
     * The number of components in the attribute.
     *
     * @type {number}
     */
    this.size = 3;

    /**
     * The format of the attribute data.
     *
     * @type {string}
     */
    this.format = "float32x4";


    this.offset = offset;
    this.size = size;
    this.format = format;
  }
}
