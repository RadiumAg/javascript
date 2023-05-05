(() => {
  const buf = new ArrayBuffer(32);
  const dataView = new DataView(buf);

  console.log(dataView.getUint8(8));
})();

// 一组构造函数，代表不同的数据结构
(() => {
  const buffer = new ArrayBuffer(12);

  const x1 = new Int32Array(buffer);
  x1[0] = 1;
  const x2 = new Uint8Array(buffer);
  x2[0] = 2;

  x1[0]; //2
})();

// 字节序
(() => {
  const buffer = new ArrayBuffer(16);
  const int32View = new Int32Array(buffer);

  for (let i = 0; i < int32View.length; i++) {
    int32View[i] = i * 2;
  }
})();
