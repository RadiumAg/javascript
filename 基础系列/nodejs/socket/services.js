// 创建TCP服务器
const net = require('net');
const server = net.createServer(socket => {
  socket.on('data', data => {
    socket.write('transfer');
  });

  socket.on('end', data => {
    console.log('cut off');
  });

  socket.write('test');
});

server.listen('8080', () => {
  console.log('server bound');
});
