// Object.is与 === 的行为基本一致
() => {
  Object.is('foo', 'foo'); // true
  Object.is(+0, -0);
  Object.is(Number.NaN, Number.NaN);
};
