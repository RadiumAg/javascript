const fs = require('fs');
const { resolve } = require('path');

const chunks = [];
const size = 0;
const rs = fs.createReadStream(resolve(__dirname, './test.md'), {
  highWaterMark: 11,
});
let data = '';

rs.on('data', chunk => {
  data += chunk;
});

rs.on('end', () => {
  console.log(data);
});
