const expect = require('chai').expect;

describe('Hook示例', () => {
  let foo = false;

  beforeEach(done => {
    setTimeout(() => {
      foo = true;
      done();
    }, 50);
  });

  it('全局变量异步修改应该成功', () => {
    expect(foo).to.be.equal(true);
  });
});
