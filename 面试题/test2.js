/**
 * 提供了一个RedPackage的类，初始化时传入红包金额和个数，需要实现一个openRedPackage方法，每调一次都进行一次“抢红包”，并以console.log的形式输出抢到的红包金额
 */
class RedPackage {
  money = 0;
  count = 0;
  _remain = 0;

  constructor(money, count) {
      this.money = money;
      this.count = count;
      this._remain = money;
  }

  openRedPackge() {
    if(this.count === 1) {
      const lastMoney = this.money;
      this.money = 0
      this.count = 0;
      console.log(lastMoney) 
      return lastMoney;
    }
    if(this.count === 0) return null;
    if(this.money === 0) return null;

     const getMoney = Math.floor(this.money * Math.random()* (1 /  this.count));

     if(getMoney === 0 ) {
        return this.openRedPackge();
     }

     this.money = this.money - getMoney
     this.count--;


     console.log(getMoney)

     return getMoney
  }
}

const redpkg = new RedPackage(100, 5);
redpkg.openRedPackge();
redpkg.openRedPackge();
redpkg.openRedPackge();
redpkg.openRedPackge();
redpkg.openRedPackge();
redpkg.openRedPackge();