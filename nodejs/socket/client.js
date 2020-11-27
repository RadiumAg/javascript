let net = require('net');

//连接服务器
let client = net.connect({ port: 8080 }, () => {
    console.log('connected to server');
    client.write('World!\r\n');
});

//接收服务端的数据
client.on('data',(data)=>{
    console.log('client got data from srver:',data.toString());
    client.end();
});


//断开连接
client.on('end',()=>{
    console.log('disconnected from server');
});

