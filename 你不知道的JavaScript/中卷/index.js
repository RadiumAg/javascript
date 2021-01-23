// 内部属性[[Class]]
console.log(Object.prototype.toString.call([1, 2, 3]));
console.log(Object.prototype.toString.call(/regex-literal/));
console.log(Object.prototype.toString.call(null));
console.log(Object.prototype.toString.call(undefined));

// 封装对象包装
let a = 'abc';
a.length; //3
a.toUpperCase(); //"ABC"

function Jquery() {
}
Jquery.init = function(){}; 
Jquery.init.prototype = Jquery.prototype;
Jquery();
console.log(Jquery());

console.log(new Jquery.prototype.constructor())