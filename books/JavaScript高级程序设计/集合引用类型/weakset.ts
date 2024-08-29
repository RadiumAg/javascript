// 弱集合中的值只能是Object或者继承自Object的类型

// add 添加,has 查询,delete删除
(() => {
  const ws = new WeakSet();
  const val1 = { id: 1 },
    val2 = { id: 2 };

  ws.add(val1).add(val2);

  console.log(ws.has(val1));
  console.log(ws.has(val2));
})();
