const { EventEmitter } = require('events');
const { createServer } = require('http');
const crypto = require('crypto');
const { Buffer } = require('buffer');
const MAGIC_STRING = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'; // 固定的字符串

class MyWebSocket extends EventEmitter {
    constructor(options) {
        super(options);
        this.options = options;
        this.server = createServer();
        options.port ? this.server.listen(options.port) : this.server.listen(8080); //默认端口
        // 处理协议升级请求
        this.server.on('upgrade', (req, socket, header) => {
            this.socket = socket;
            socket.setKeepAlive(true);
            console.log(req.headers['sec-websocket-key'],'key');
            const resKey = hashWebSocketKey(req.headers['sec-websocket-key']); //对浏览器生成的key进行加密
            //构造响应头
            const resHeaders = [
                'HTTP/1.1 101 Switching Protocols',
                'Upgrade: websocket',
                'Connection: Upgrade',
                'Sec-WebSocket-Accept: ' + resKey,
            ].concat('','').join('\r\n');
            console.log(resHeaders,'resHeaders');
            socket.write(resHeaders); // 返回响应头部
        });
        
        // 监听客户端发送过来的数据，该数据是一个Buffer类型的数据
        this.socket.on('data',(data)=>{
           this.buffer = data;
           this.processBuffer();
        })
    }

    processBuffer(){
        let buf = this.buffer = new Buffer();
        let idx = 2; //首先分析前两个字节
        // 处理第一个字节
        const byte1 = buf.readUInt8(0);// 读取buffer数据的前8bit并转换为十进制整数
        // 获取第一个字节的最高位，看是0还是1
        const str1 = byte1.toString(2); // 将第一个字符转换为二进制的字符串形式
        const FIN = str1[0];
        // 获取第一个字节的后四位，让第一个字节与00001111进行运算，即可拿到后四位。
        let opcode = byte1 & 0x0f;
    }
}

function hashWebSocketKey(key) {
    const sha1 = crypto.createHash('sha1'); //拿到sha1算法
    sha1.update(key + MAGIC_STRING,'ascii');
    return sha1.digest('base64');
}

module.exports = MyWebSocket;