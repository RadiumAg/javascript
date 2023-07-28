'use strict';
const net = require('net');
const server = net.createServer(socket => {
  //新的连接
  socket.on('data', data => {
    socket.write('hello');
  });

  socket.on('end', () => {
    console.log('链接断开');
  });
  socket.write('hellow world,my dear\n');
});

server.listen(8124, () => {
  console.log('server bound');
});

//为了体现listerner是连接事件connection的监听器，也可以采用另一种方式进行监听
// let server = net.createServer();
// server.on('connection',(socket)=>{

// });

// server.listen(8124);
