const express = require('express');
const {
  createProxyMiddleware,
  loggerPlugin,
} = require('http-proxy-middleware');

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = express();

const proxyMiddleware = createProxyMiddleware({
  target: 'https://pre-seoadmin-arise.alibaba-inc.com/metatag',
  changeOrigin: true,
  cookiePathRewrite: true,
  cookieDomainRewrite: true,
  // headers: {
  //   host: 'seoadmin-arise.alibaba-inc.com',
  //   Origin: 'https://seoadmin-arise.alibaba-inc.com',
  //   Referer: 'https://seoadmin-arise.alibaba-inc.com',
  // },
  on: {
    proxyReq: (proxyReq, req, res) => {
      /* handle proxyReq */
      proxyReq.setHeader('Host', 'pre-seoadmin-arise.alibaba-inc.com');
      proxyReq.setHeader('Origin', 'https://workstation.miravia.net');
      proxyReq.setHeader('Referer', 'https://workstation.miravia.net');

      req.headers.host = 'pre-seoadmin-arise.alibaba-inc.com';
      req.headers.origin = 'https://workstation.miravia.net';
      req.headers.referer = 'https://workstation.miravia.net';
    },
    proxyRes: (proxyRes, req, res) => {
      /* handle proxyRes */
      proxyRes.headers['access-control-allow-origin'] = '*';
      res.headers = {
        'access-control-allow-origin': '*',
      };
    },
    error: (err, req, res) => {
      console.log(err);
      /* handle error */
    },
  },
  logger: console,
  plugins: [loggerPlugin],
  secure: false,
});

app.use('/metatag', proxyMiddleware);

app.listen(4000);
