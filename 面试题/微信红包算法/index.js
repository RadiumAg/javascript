/**
 *
 * 二倍均值法
 *
 *
 */

() => {
  class RedPackage {
    money = 0;
    count = 0;
    _remain = 0;

    constructor(money, count) {
      this.money = money;
      this.count = count;
      this._remain = money; // 初始化剩余金额
    }

    openRedPackge() {
      // 红包已抢完
      if (this.count === 0) {
        console.log(0);
        return 0;
      }

      // 最后一个红包
      if (this.count === 1) {
        const lastMoney = this._remain; // 使用剩余金额
        this.money = 0;
        this.count = 0;
        this._remain = 0;
        console.log(lastMoney.toFixed(2));
        return lastMoney;
      }

      // 二倍均值法计算最大可抢金额
      const max = Math.min(
        this._remain - 0.01 * (this.count - 1), // 确保每人至少有0.01元
        (this._remain / this.count) * 2 // 二倍均值
      );

      // 随机金额（至少0.01元）
      const getMoney = parseFloat(
        Math.max(0.01, Math.random() * max).toFixed(2)
      );

      // 更新状态
      this._remain -= getMoney;
      this.count--;

      console.log(getMoney.toFixed(2));
      return getMoney;
    }
  }

  // 测试
  const redpkg = new RedPackage(100, 5);
  console.log('开始抢红包：');
  redpkg.openRedPackge();
  redpkg.openRedPackge();
  redpkg.openRedPackge();
  redpkg.openRedPackge();
  redpkg.openRedPackge();
  redpkg.openRedPackge(); // 第六次应该返回0
};

(() => {
  class RedPackage {
    money = 0;
    count = 0;
    _remain = 0;

    constructor(money, count) {
      this.money = money;
      this.count = count;
      this._remain = money; // 初始化剩余金额
    }

    openRedPackge() {
      if (this.count === 1) {
        const lastMoney = this.money.toFixed(2);
        this.money = 0;
        this.count = 0;

        console.log(lastMoney);

        return lastMoney;
      }

      if (this.count === 0) {
        return 0;
      }

      const maxMoney = (this.money / this.count) * 2; // 最大值
      const finalMoney = Math.max((Math.random() * maxMoney).toFixed(2), 0.1); // 如果是小于0.1，则返回0.1

      this.money -= finalMoney;
      this.count--;

      console.log(finalMoney);

      return finalMoney;
    }
  }

  // 测试
  const redpkg = new RedPackage(100, 5);
  console.log('开始抢红包：');
  redpkg.openRedPackge();
  redpkg.openRedPackge();
  redpkg.openRedPackge();
  redpkg.openRedPackge();
  redpkg.openRedPackge();
  redpkg.openRedPackge(); //
})();
