import chai from 'chai';
import add from '../src/add.js';

const expect = chai.expect;

describe('加法函数的测试', () => {
  it('1 加 1 应该等于 2', () => {
    expect(add(1, 1)).to.be.equal(2);
  });
});
