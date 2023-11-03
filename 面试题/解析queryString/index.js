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
  const queryStringArr = input.split('&');
  const quer = queryStringArr.map(_ => _.split('='));

  const result = {};

  quer.forEach(_ => {
    if (_[0] in result) {
      if (Array.isArray(result[_[0]])) {
        result[_[0]] = result[_[0]].concat(_[1]);
      } else {
        result[_[0]] = [result[_[0]]].concat(_[1]);
      }
    } else {
      result[_[0]] = _[1];
    }
  });

  return result;
}

console.log(parse());
