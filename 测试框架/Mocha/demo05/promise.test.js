const fetch = require('node-fetch');
const expect = require('chai').expect;

describe('promise.test.js - 异步测试', () => {
  it('异步请求应该返回一个对象', () => {
    return fetch('https://api.github.com')
      .then(res => {
        return res.json();
      })
      .then(json => {
        expect(json).to.be.an('object');
      });
  });
});
