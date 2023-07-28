'use strict';

require('core-js/modules/es.promise.finally.js');

require('core-js/modules/es.promise.js');

const a = [1].map(x => {
  return x + 1;
});

const fn = function fn() {
  return 1;
};

Promise.resolve().finally();
