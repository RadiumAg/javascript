function HammingCode(input: String) {
  let hArray = [],
    hASize: number,
    bArray: string[] = [],
    hSize: number = 1;

  hArray = input.split("");
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
        let result,
          bIndexArray = [],
          bIndex = bArray[i].indexOf("1"),
          flag = false;

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
          result = flag ? hArray[i] : result ^ hArray[i];
          flag = false;
        }
        hArray[i] = (result ^ 0) === 0 ? "0" : "1";
      }
    });
  }

  /**
   * @description 获得并设置位置数组
   */
  function setbArray() {
    for (let i = 0; i < hSize; i++) {
      hArray.splice(Math.pow(2, i) - 1, 0, -1);
    }

    // 获得位置的二进制
    for (let i = 1; i <= hArray.length; i++) {
      bArray.push(("000" + i.toString(2)).slice(-4));
    }
  }

  /**
   * @description 获得并设置海明码的长度
   */
  function sethSize() {
    hASize = hArray.length;
    while (!(Math.pow(2, hSize) - 1 >= hASize + hSize)) {
      hSize++;
    }
  }

  console.log(hArray.join(""));
}

HammingCode("1010110");
