(() => {
  // 当使用 radix =16时，可以省略“0x”前缀
  console.log(Number.parseInt(('0x13', 16)));
  console.log(Number.parseInt(('13', 16)));

  // 使用'0x'前缀时可以不指定radix
  console.log(Number.parseInt('0x13'));
  console.log(Number.parseInt('13'));
})();
