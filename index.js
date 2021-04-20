// let a = {
//     i: 1,
//     toString() {
//       return a.i++;
//     }
//   }

// if (a == 1 && a == 2 && a == 3) {
//     console.log(1);
// }
// async function b() {
//     console.log(3);
// }

// async function a() {
//     await new Promise((resove) => { console.log(3); resove(1); });
//     console.log(2);
// }

// a.call(this);
// // a();
// console.log(1);

// const arr1 = [1];
// const arr2 = [1];
// const flagList = [], map = new Map(), map1 = new Map();
// let flag;

// arr1.forEach((value, index) => {
//     map.set(value, value);
// });

// arr2.forEach((value, index) => {
//     map1.set(value, value);
// });

// Array.from(map).forEach((_value, index) => {
//     Array.from(map1).forEach((value, index) => {
//         if (value[0] === _value[1]) {
//             flagList.push(true);
//         }
//     })
// });

// if (map1.size === flagList.length) {
//     console.log(true);
// } else {
//     console.log(false);
// }

// async function a2() {
// }

// async function a1() {
//     await a2();  // then后边的事情
// }

// async function a3() {
// }

// async function a4() {
//     await a3();  // then后边的事情
// }

// Promise.all([a1,a4]).then(x=>{
//     console.log(x)
// });
// console.log(4);

// let a = [1, 2, 4];
// a.forEach((x, i, b) => {
//     console.log(b);
//     b.splice(x, 1);
// });

// let net = require('net');
const a = {
  s_103:
    {
      next () {
        return { value: 0, done: false };
      },
      [Symbol.iterator] () {
        return this;
      },
      company_name: '山牛商城单用户分销版',
      id: '103',
      money: '32000.00',
      product_name: '山牛商城单用户分销版'
    }
};

const menus = [
  {
    modelshow: '1',
    categorys: [{ name: 'PBJG', icon: null, label: '\u4E2D\u6807\u5019\u9009\u4EBA\u516C\u793A' }],
    mcode: 'JYGCJS',
    rmenuid: '59504971-0015-11e9-a06c-005056b31df8',
    utime: '2018-12-15 10:58:50.0',
    modelname: '\u5DE5\u7A0B\u5EFA\u8BBE',
    name: '\u5DE5\u7A0B\u5EFA\u8BBE',
    navshow: '1',
    index: '2001',
    id: 'a21fd0f9-5a92-11e9-82f2-005056b31df8',
    type: '1',
    isleaf: '1'
  },
  {
    modelshow: '1',
    categorys: [{ name: 'CGGG', icon: null, label: '\u91C7\u8D2D\u516C\u544A' },
      { name: 'GZGG', icon: null, label: '\u66F4\u6B63\u516C\u544A' }, { name: 'JGGG', icon: null, label: '\u7ED3\u679C\u516C\u544A' }, { name: 'QYLX', icon: null, label: '\u5408\u540C\u516C\u544A' }, { name: 'ZZGG', icon: null, label: '\u6D41\u6807\u6216\u7EC8\u6B62\u516C\u544A' }, { name: 'CGYXGG', icon: null, label: '\u91C7\u8D2D\u610F\u5411\u516C\u544A' }],
    mcode: 'JYZFCG',
    rmenuid: '59504971-0015-11e9-a06c-005056b31df8',
    utime: '2018-12-15 10:58:50.0',
    modelname: '\u653F\u5E9C\u91C7\u8D2D',
    name: '\u653F\u5E9C\u91C7\u8D2D',
    navshow: '1',
    index: '2002',
    id: 'a2201cfc-5a92-11e9-82f2-005056b31df8',
    type: '1',
    isleaf: '1'
  },
  {
    modelshow: '1',
    categorys: [{ name: 'CRGG', icon: null, label: '\u51FA\u8BA9\u516C\u544A' }, { name: 'GGBG', icon: null, label: '\u516C\u544A\u53D8\u66F4' }, { name: 'CJZD', icon: null, label: '\u6210\u4EA4\u5B97\u5730' }, { name: 'ZZGG', icon: null, label: '\u6D41\u6807\u6216\u7EC8\u6B62\u516C\u544A' }],
    mcode: 'JYTD',
    rmenuid: '59504971-0015-11e9-a06c-005056b31df8',
    utime: '2020-06-22 17:25:47.0',
    modelname: '\u571F\u5730\u62DB\u62CD\u6302',
    name: '\u571F\u5730\u62DB\u62CD\u6302',
    navshow: '1',
    index: '2003',
    id: 'a2207ecc-5a92-11e9-82f2-005056b31df8',
    type: '1',
    isleaf: '1'
  }];
changeMenu();

function changeMenu () {
  const mcode = $('#menu').val();
  let categorys = [];
  for (let i = 0; i < menus.length; i++) {
    const menu = menus[i];
    if (menu.mcode === mcode) {
      categorys = menu.categorys;
      break;
    }
  }
  $('#category').html('');
}
