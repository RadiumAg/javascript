const https = require('http2');
const fs = require('fs');
const path = require('path');

const filePath = 'https://cn.textboostsms.com/assets/video/textboostsms.mp4';
const outputFile = path.resolve(__dirname, 'output.mp4');

const client = https.connect(filePath, {
  headers: {
    accept: '*/*',
    'accept-encoding': 'gzip, deflate, br, zstd',
    'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
    'cache-control': 'no-cache',
    cookie:
      '_gcl_au=1.1.46215287.1722232025.1618641042.1722232298.1722232310;crisp-client%2Fsession%2F626fd71a-2d19-4952-be33-f8b657590b6a=session_d936043f-9b78-4240-91a8-5dcc803a213f',
    pragma: 'no-cache',
    priority: 'u=1, i',
    referer: 'https://cn.textboostsms.com/assets/video/textboostsms.mp4',
    path: '/assets/video/textboostsms.mp4',
    'sec-ch-ua':
      'Chromium";v="128", "Not;A=Brand";v="24", "Microsoft Edge";v="128',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': 'macOS',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent':
      ' Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0',
  },
});

const req = client.request({
  ':method': 'GET',
  ':path': new URL(filePath).pathname,
  ':scheme': 'https',
});

req.on('response', (headers, flags) => {
  if (headers[':status'] !== 200) {
    console.error(`Download failed with status ${headers[':status']}`);
    client.close();
    return;
  }

  const fileStream = fs.createWriteStream(outputFile);

  req.on('data', chunk => {
    fileStream.write(chunk);
  });

  req.on('end', () => {
    console.log('Download completed');
    fileStream.end();
    client.close();
  });
});

req.end();
