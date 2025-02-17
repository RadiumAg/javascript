// 基础类型
() => {
  //  undefined是由null值派生而来的，因此表面上相等
  () => {
    console.log(null == undefined); // true
  };

  // boolean
  (() => {
    // fasly的值
    console.log(+'');
    console.log(+0);
    console.log(+Number.NaN);
    console.log(+null);
    console.log(+undefined);
  })();
};

// number 类型
(() => {
  () => {
    const num = 1;
    const num2 = ~num;

    console.log(num2);
    console.log(num.toString(2), num2.toString(2));
  };

  () => {
    let age = 29;
    const anotherAge = --age + 2;
    console.log(age); // 28
    console.log(anotherAge); // 30

    let num1 = 2;
    const num2 = 20;
    const num3 = num1-- + num2;
    const num4 = num1 + num2;
    console.log(num3); // 22
    console.log(num4); // 21
  }; // 递增/递减操作符

  () => {
    // 八进制字面量，第一个数字必须是0
    // const octalNum1 = 070; // 八进制的56
    // const octalNum2 = 079; // 无效的八进制值，当成79处理
  };

  () => {
    const hexNum1 = 0xa;
    const bexNum2 = 0x1f;
  };

  // parseFloat始终忽略字符串开头的零
  () => {
    const num1 = Number.parseFloat('1234blue');
    console.log(num1);

    const num2 = Number.parseFloat('0xa');
    console.log(num2);

    const num3 = Number.parseFloat('22.5');
    console.log(num3);

    const num4 = Number.parseFloat('22.34.5');
    console.log(num4);

    const num5 = Number.parseFloat('0908.5');
    console.log(num5);

    const num6 = Number.parseFloat('3.125e7');
    console.log(num6);
  };

  // NaN不等于包括NaN在内的任何值
  (() => {
    console.log(Number.NaN === Number.NaN);
  })();
})();

// 操作符

() => {
  // 只操作一个值的叫一元操作符
  (() => {})();
};

// undefined类型
(() => {
  let message;
  console.log(typeof message);
  console.log(typeof age);
})();
