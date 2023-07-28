const expect = require('chai').expect;

describe('timeout.test.js - 超时测试', () => {
  it('测试应该 5000 毫秒后结束', done => {
    let x = true;
    const f = function () {
      x = false;
      expect(x).to.be.not.ok;
      done();
    };
    setTimeout(f, 4000);
  });
});
