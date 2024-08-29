const fork = require('child_process').fork;
const cpus = require('os').cpus();
const path = require('path');

console.log(cpus);
for (let i = 0; i < cpus.length; i++) {
  fork(path.resolve(__dirname, './work.js'));
}
