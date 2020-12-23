const { EventEmitter } = require('events');
const { createServer } = require('http');
const crypto = require('crypto');
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
        })
    }
}

function hashWebSocketKey(key) {
    const sha1 = crypto.createHash('sha1'); //拿到sha1算法
    sha1.update(key + MAGIC_STRING,'ascii');
    return sha1.digest('base64');
}

module.exports = MyWebSocket;