/**
 * 简单实现一个queryString，具有parse和stringify的能力，
 * parse，用于把一个URL查询字符串解析成一个键值对的集合。
 * 输入：查询字符串 'foo=bar&abc=xyz&abc=123'
 * 输出：一个键值对的对象
 * {
 *   foo: 'bar',
 *   abc: ['xyz', '123'],
 * }
 */

function parse(input = 'foo=bar&abc=xyz&abc=123') {
  const queryStringArr = input.split('&').map(_ => _.split('='));

  const result = {};

  queryStringArr.forEach(_ => {
    const prop = _[0];
    const value = _[1];

    if (prop in result) {
      if (Array.isArray(value)) {
        result[prop].push(value);
      } else {
        result[prop] = [result[prop]].concat(value);
      }
    } else {
      result[prop] = value;
    }
  });

  return result;
}
