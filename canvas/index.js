'use strict';
let net = require('net');
var server = net.createServer((socket)=>{
    //新的连接
    socket.on('data',(data)=>{
        console.log(data.toString('utf8'));
    });

    socket.on('end',()=>{
         console.log("链接断开");
    });
    socket.write('hellow world,my dear\n');
});

server.listen(8124,()=>{
    console.log('server bound');
});
