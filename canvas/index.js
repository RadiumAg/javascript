'use strict';
let net = require('nodejs-websocket'),
    connList = [];// 连接的列表
var server = net.createServer((connection) => {
    connList.push(connection);
    console.log(connList);
    connection.on('text', (data) => {
        if (connList[1]) {
            connList[1].sendText(data);
        }
    });

    connection.on('close', () => {
        console.log("链接断开");
    });

    connection.on('error', (code) => {
        console.log(code);
    })

    connection.on('connect', (socket) => {
        console.log(connList);
    });
});


server.listen(8124, () => {
    console.log('server bound');
});
