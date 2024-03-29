// const services = [
//   function A () { console.log("I'm A"); },
//   function B () { console.log("I'm B"); },
//   function C () { }
// ];

// const funRegex = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
// function getDependices (fun = '') {
//   const match = fun.toString().match(funRegex)[1];
//   if (match != '') {
//     match.replace('\s', '');
//   }
//   return match.split(',');
// }

// function getServices (params) {
//   for (const key in params) {
//     params[key] = services[key];
//   }
//   return params;
// }

// function service (A, B) {
//   A();
//   B();
// }

// service.apply(this, getServices(getDependices(service)));

const a = {
  [Symbol.iterator]() {
    return this;
  },

  a: 1,

  next() {
    if (a <= 3) {
      return {
        value: ++this.a,
        done: false,
      };
    } else {
      return {
        value: ++this.a,
        done: true,
      };
    }
  },
};

for (const item of a) {
  console.log(item);
}
