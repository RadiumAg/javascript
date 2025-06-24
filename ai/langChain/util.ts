import * as crypto from 'crypto';
import { URL } from 'url';

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
    host: host,
    date: date,
    authorization: authorization,
  });

  return `${requestUrl}?${values.toString()}`;
}

export { assembleWsAuthUrl };
