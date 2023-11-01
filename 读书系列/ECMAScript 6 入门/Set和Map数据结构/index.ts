() => {
  // Set 值的成员是唯一的
  const s = new Set();
  [2, 3, 5, 4, 5, 2, 2].forEach(_ => s.add(_));
  for (const i of s) {
    console.log(i);
  }
};

() => {
  const set = new Set();
};
