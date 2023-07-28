const multiply = require('../../src/multiply');
const expect = require('chai').expect;

describe('乘法函数的测试', () => {
  it('1 乘 1 应该等于 1', () => {
    expect(multiply(1, 1)).to.be.equal(1);
  });
});
