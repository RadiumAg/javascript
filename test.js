const cookie = `lark_oapi_csrf_token=0PX2enw0XBlmUQ28ioXh4CNckMdXmQf/byMSgWrHgQI=; open_locale=zh-CN; _ga=GA1.3.218488402.1730722959; deviceId=cm33018ua00003j6xw2rtbu50; _gid=GA1.3.981001546.1731223151; __tea__ug__uid=3488331730722956176; Hm_lvt_a79616d9322d81f12a92402ac6ae32ea=1730722956,1731223231,1731240921,1731422892; _gcl_au=1.1.1362015446.1731507419; _gid=GA1.2.1476036992.1731507420; passport_trace_id=7437100281067929603; i18n_locale=zh-CN; landing_url=https://ae.feishu.cn/hc/zh-CN/articles/829761733100; _uetsid=2466f490a10511ef8c33897fb20dbb53; _uetvid=7baea8a09aa711efab560d9cebefddd0; msToken=81IBKtjwZqtFAge4Os6LCWpXe2Y07IQlN27Jd6jPPZRKdx6PvQZNk1MfM7P2yoJUIP3b6awb9HVLpTi_zhO2qRMCPpbZbZYX4052HVk0iraru5t_FPKEJ2k0oZ38DyEtj2OILgW6mb0G87LLYvPI7hbxvN2wTwYTLq87y1mGO2Pe; _ga=GA1.1.11229210.1731507420; swp_csrf_token=e3f4de99-0325-418a-a691-1c35555ed110; _ga_VPYRHN104D=GS1.1.1731592484.4.1.1731593023.50.0.0`;

function getCookie(name) {
  const nameEQ = `${name}=`;
  const ca = cookie.split(';');
  for (let c of ca) {
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function setCookie(name, value, days) {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value || ''}${expires}; path=/`;
}

cookie
  .split(';')
  .map(_ => _.split('='))
  .forEach(_ => {
    setCookie(_[0], getCookie(_[0]), 365);
  });
