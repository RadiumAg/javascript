import * as crypto from 'crypto';
import { URL } from 'url';
import base64 from 'base64-js';

function assembleWsAuthUrl(
  requestUrl: string,
  method: string = 'GET',
  apiKey: string = '',
  apiSecret: string = ''
): string {
  const u = new URL(requestUrl);
  const host = u.host;
  const path = u.pathname;
  const now = new Date();
  const date = now.toUTCString();

  const signatureOrigin = `host: ${host}\ndate: ${date}\n${method} ${path} HTTP/1.1`;
  const hmac = crypto.createHmac('sha256', apiSecret);
  hmac.update(signatureOrigin);
  const signatureSha = hmac.digest('base64');

  const authorizationOrigin = `api_key="${apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signatureSha}"`;
  const authorization = Buffer.from(authorizationOrigin).toString('base64');

  const values = new URLSearchParams({
    host,
    date,
    authorization,
  });

  return `${requestUrl}?${values.toString()}`;
}

interface Body {
  header: {
    app_id: string;
    uid?: string;
    status: number;
  };
  parameter: {
    emb: {
      domain: string;
      feature: {
        encoding: string;
      };
    };
  };
  payload: {
    messages: {
      text: string;
    };
  };
}

function getBody(appid: string, text: any, style: string): Body {
  const orgContent = JSON.stringify({
    messages: [{ content: text, role: 'user' }],
  });

  const body: Body = {
    header: { app_id: appid, status: 3 },
    parameter: { emb: { domain: style, feature: { encoding: 'utf8' } } },
    payload: {
      messages: {
        text: base64.fromByteArray(Buffer.from(orgContent, 'utf-8')),
      },
    },
  };

  return body;
}

/**
 * 解析消息并返回浮点数数组
 * @param message JSON格式的消息字符串
 * @returns 解析后的浮点数数组
 */
function parserMessage(message: string): Float32Array | undefined {
  const data = JSON.parse(message);
  // console.log('data' + message);

  const code = data.header.code;
  if (code !== 0) {
    console.log(`请求错误: ${code}, ${JSON.stringify(data)}`);
    return new Float32Array();
  } else {
    // const sid = data.header.sid;
    // console.log('本次会话的id为：' + sid);

    const textBase = data.payload.feature.text;
    // 使用base64解码
    const textData = Buffer.from(
      base64.fromByteArray(Buffer.from(textBase)),
      'base64'
    );

    // 将字节缓冲区转换为Float32Array
    const text = new Float32Array(textData.buffer);

    // 打印向量维度
    // console.log(text.length);
    // console.log('返回的向量化数组为:');
    // console.log(text);
    return text;
  }
}

export { assembleWsAuthUrl, getBody, parserMessage };
