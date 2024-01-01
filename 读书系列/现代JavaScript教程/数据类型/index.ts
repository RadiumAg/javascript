// 有七种原始类型：string,number,bigint,boolean,symbol,null,undefined
(() => {
  const str = 'Hello';
  console.log(str.toUpperCase());
})();

// splice
(() => {
  // 从索引1删除一个元素
  (() => {
    const arr = ['I', 'study', 'JavaScript'];
    arr.splice(1, 1); // 从索引1 开始删除1个元素
    console.log(arr);
  })();

  // 用另外两个元素替换它们
  (() => {
    const arr = ['I', 'study', 'JavaScript'];
    arr.splice(0, 3, "Let's", 'dance');
    console.log(arr);
  })();

  // 在这里我们可以看到splice返回了被删除的元素所组成的数组
  (() => {
    const arr = ['I', 'study', 'JavaScript', 'right', 'now'];
    // 删除前两个元素
    const removed = arr.splice(0, 2);
    console.log(removed);
  })();

  (() => {
    const arr = ['I', 'study', 'JavaScript'];
    arr.splice(2, 0, 'complex', 'language');
    console.log(arr);
  })();
})();

// concat
(() => {
  (() => {
    const arr = [1, 2];
    console.log(arr.concat([3, 4]));
    console.log(arr.concat([3, 4], [5, 6]));
    console.log(arr.concat([3, 4], 5, 6));
  })();

  // arrayLike
  (() => {
    const arr = [1, 2];
    const arrayLike = {
      0: 'something',
      length: 1,
    };

    console.log(arr.concat(arrayLike));
  })();

  // Symbol.isConcatSpreadable
  (() => {
    const arr = [1, 2];
    const arrayLike = {
      0: 'something',
      1: 'else',
      [Symbol.isConcatSpreadable]: true,
      length: 2,
    };

    console.log(arr.concat(arrayLike));
  })();
})();

// 在数组中搜索
(() => {
  // indexOf
  (() => {
    const arr = [1, 0, false];
    console.log(arr.indexOf(0));
    console.log(arr.indexOf(false));
    console.log(arr.indexOf(null));
    console.log(arr.includes(1));
  })();

  // lastIndexOf
  (() => {
    const arr = ['Apple', 'Orange', 'Apple'];
    console.log(arr.indexOf('Apple'));
    console.log(arr.lastIndexOf('Apple'));
  })();

  // find 和 findeIndex/findLastIndex
  (() => {
    const users = [
      {
        id: 1,
        name: 'John',
      },
      {
        id: 2,
        name: 'Pete',
      },
      {
        id: 3,
        name: 'Mary',
      },
    ];

    const user = users.find(item => item.id == 1);
    console.log(user?.name);
  })();

  // findLastIndex
  (() => {
    const users = [
      {
        id: 1,
        name: 'John',
      },
      {
        id: 2,
        name: 'Pete',
      },
      {
        id: 3,
        name: 'Mary',
      },
      {
        id: 4,
        name: 'John',
      },
    ];

    console.log(users.findIndex(item => item.id == 1));
    console.log(users.findLastIndex(item => item.id == 1));
  })();
})();

// filter
(() => {
  const users = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Pete' },
    { id: 3, name: 'Mary' },
  ];

  console.log(users.filter(item => item.id < 3));
})();
