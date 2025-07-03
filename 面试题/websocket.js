!(function () {
  if (
    null != window.WebSocket &&
    (function (n) {
      debugger;
      try {
        var o = localStorage.getItem(n);
        if (null == o) return null;
        return JSON.parse(o);
      } catch (e) {
        return null;
      }
    })('token') &&
    !window.__OVERLAY__
  ) {
    debugger;
    var n =
        null != window.DiscordNative || null != window.require ? 'etf' : 'json',
      o =
        window.GLOBAL_ENV.GATEWAY_ENDPOINT +
        '/?encoding=' +
        n +
        '&v=' +
        window.GLOBAL_ENV.API_VERSION;
    null != window.DiscordNative &&
    void 0 !== window.Uint8Array &&
    void 0 !== window.TextDecoder
      ? (o += '&compress=zstd-stream')
      : void 0 !== window.Uint8Array && (o += '&compress=zlib-stream'),
      console.log(
        '[FAST CONNECT] ' +
          o +
          ', encoding: ' +
          n +
          ', version: ' +
          window.GLOBAL_ENV.API_VERSION
      );
    var e = new WebSocket(o);
    e.binaryType = 'arraybuffer';
    var i = Date.now(),
      r = {
        open: !1,
        identify: !1,
        gateway: o,
        messages: [],
      };
    (e.onopen = function () {
      console.log('[FAST CONNECT] connected in ' + (Date.now() - i) + 'ms'),
        (r.open = !0);
    }),
      (e.onclose = e.onerror =
        function () {
          window._ws = null;
        }),
      (e.onmessage = function (n) {
        r.messages.push(n);
      }),
      (window._ws = {
        ws: e,
        state: r,
      });
  }
})();
