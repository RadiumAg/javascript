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
  const orgContent = JSON.stringify(text);

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

export { assembleWsAuthUrl, getBody };
