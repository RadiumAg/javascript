class SimpleBloomFilter {
  private bits: Uint8Array;
  private size: number;
  private hasCount: number;

  constructor(size: number, hasCount: number) {
    this.size = size;
    this.hasCount = hasCount;
    this.bits = new Uint8Array(Math.ceil(size / 8));
  }

  private hash(value: string, seed: number) {
    let h = 0x811c9dc5 ^ seed;
    for (let i = 0; i < value.length; i++) {
      h ^= value.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }

    return (h >>> 0) % this.size;
  }

  add(value: string) {
    for (let i = 0; i < this.hasCount; i++) {
      const pos = this.hash(value, i);
      this.bits[pos >>> 3] |= 1 << (pos & 7);
    }
  }

  has(value: string) {
    for (let i = 0; i < this.hasCount; i++) {
      const pos = this.hash(value, i);
      if (!(this.bits[pos >> 3] & (1 << (pos & 7)))) {
        return false; // 有位为0，一定不存在
      }
    }
    return true; // 全为1 -> 可能存在
  }
}
