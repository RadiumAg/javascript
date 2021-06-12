const dgram = require('dgram');

const message = Buffer.from('深入浅出Node.js');
const client = dgram.createSocket('udp4');

client.send(message, 0, message.length, 41134, '0.0.0.0', function () {
  client.close();
});
