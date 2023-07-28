function HammingCode(input: string) {
  let hArray = [];
  let hASize: number;
  const bArray: string[] = [];
  let hSize = 1;

  hArray = input.split('');
  // 获得海明码长度
  sethSize();
  setbArray();
  sethCode();

  /**
   * @description 计算海明码
   */
  function sethCode() {
    hArray.forEach((v, i, a) => {
      if (v === -1) {
        // 获得编码中1的位置
        let result;
        const bIndexArray = [];
        const bIndex = bArray[i].indexOf('1');
        let flag = false;

        // 获得地址编码中1位置一样的地址数组
        bArray.forEach((v, _i, a) => {
          if (i === _i) {
            return;
          }
          if (Number(v.split('')[bIndex]) === 1) {
            bIndexArray.push(_i);
          }
        });

        for (const i of bIndexArray) {
          // tslint:disable-next-line: no-bitwise
          result = flag ? hArray[i] : result ^ hArray[i];
          flag = false;
        }
        // tslint:disable-next-line: no-bitwise
        hArray[i] = Math.trunc(result) === 0 ? '0' : '1';
      }
    });
  }

  /**
   * @description 获得并设置位置数组
   */
  function setbArray() {
    for (let i = 0; i < hSize; i++) {
      hArray.splice(2 ** i - 1, 0, -1);
    }

    // 获得位置的二进制
    for (let i = 1; i <= hArray.length; i++) {
      bArray.push(`000${i.toString(2)}`.slice(-4));
    }
  }

  /**
   * @description 获得并设置海明码的长度
   */
  function sethSize() {
    hASize = hArray.length;
    while (!(2 ** hSize - 1 >= hASize + hSize)) {
      hSize++;
    }
  }

  console.log(hArray.join(''));
}

HammingCode('1010110');
HammingCode('01101001');
HammingCode('1101');
HammingCode('1011');
HammingCode('11000010');
HammingCode('10011101');
HammingCode('1100');
// 01110100110
// 010111001001
// 1010101
// 0110011
// 101110010010
// 111000111101
