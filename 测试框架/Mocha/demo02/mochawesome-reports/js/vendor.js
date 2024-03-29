!(function (t, e) {
  'object' === typeof module && 'object' === typeof module.exports
    ? (module.exports = t.document
        ? e(t, !0)
        : function (t) {
            if (!t.document)
              throw new Error('jQuery requires a window with a document');
            return e(t);
          })
    : e(t);
})('undefined' !== typeof window ? window : this, (t, e) => {
  function n(t) {
    const e = t.length,
      n = K.type(t);
    return 'function' === n || K.isWindow(t)
      ? !1
      : 1 === t.nodeType && e
      ? !0
      : 'array' === n ||
        0 === e ||
        ('number' === typeof e && e > 0 && e - 1 in t);
  }
  function i(t, e, n) {
    if (K.isFunction(e))
      return K.grep(t, (t, i) => {
        return !!e.call(t, i, t) !== n;
      });
    if (e.nodeType)
      return K.grep(t, t => {
        return (t === e) !== n;
      });
    if ('string' === typeof e) {
      if (ae.test(e)) return K.filter(e, t, n);
      e = K.filter(e, t);
    }
    return K.grep(t, t => {
      return V.call(e, t) >= 0 !== n;
    });
  }
  function o(t, e) {
    for (; (t = t[e]) && 1 !== t.nodeType; );
    return t;
  }
  function s(t) {
    const e = (fe[t] = {});
    return (
      K.each(t.match(pe) || [], (t, n) => {
        e[n] = !0;
      }),
      e
    );
  }
  function r() {
    Z.removeEventListener('DOMContentLoaded', r, !1),
      t.removeEventListener('load', r, !1),
      K.ready();
  }
  function a() {
    Object.defineProperty((this.cache = {}), 0, {
      get() {
        return {};
      },
    }),
      (this.expando = K.expando + a.uid++);
  }
  function l(t, e, n) {
    let i;
    if (void 0 === n && 1 === t.nodeType)
      if (
        ((i = `data-${e.replace(be, '-$1').toLowerCase()}`),
        (n = t.getAttribute(i)),
        'string' === typeof n)
      ) {
        try {
          n =
            'true' === n
              ? !0
              : 'false' === n
              ? !1
              : 'null' === n
              ? null
              : `${+n}` === n
              ? +n
              : xe.test(n)
              ? K.parseJSON(n)
              : n;
        } catch {}
        ye.set(t, e, n);
      } else n = void 0;
    return n;
  }
  function h() {
    return !0;
  }
  function c() {
    return !1;
  }
  function u() {
    try {
      return Z.activeElement;
    } catch {}
  }
  function d(t, e) {
    return K.nodeName(t, 'table') &&
      K.nodeName(11 !== e.nodeType ? e : e.firstChild, 'tr')
      ? t.querySelectorAll('tbody')[0] ||
          t.appendChild(t.ownerDocument.createElement('tbody'))
      : t;
  }
  function p(t) {
    return (t.type = `${null !== t.getAttribute('type')}/${t.type}`), t;
  }
  function f(t) {
    const e = Oe.exec(t.type);
    return e ? (t.type = e[1]) : t.removeAttribute('type'), t;
  }
  function g(t, e) {
    for (let n = 0, i = t.length; i > n; n++)
      ve.set(t[n], 'globalEval', !e || ve.get(e[n], 'globalEval'));
  }
  function m(t, e) {
    let n, i, o, s, r, a, l, h;
    if (1 === e.nodeType) {
      if (
        ve.hasData(t) &&
        ((s = ve.access(t)), (r = ve.set(e, s)), (h = s.events))
      ) {
        delete r.handle, (r.events = {});
        for (o in h)
          for (n = 0, i = h[o].length; i > n; n++) K.event.add(e, o, h[o][n]);
      }
      ye.hasData(t) &&
        ((a = ye.access(t)), (l = K.extend({}, a)), ye.set(e, l));
    }
  }
  function v(t, e) {
    const n = t.getElementsByTagName
      ? t.getElementsByTagName(e || '*')
      : t.querySelectorAll
      ? t.querySelectorAll(e || '*')
      : [];
    return void 0 === e || (e && K.nodeName(t, e)) ? K.merge([t], n) : n;
  }
  function y(t, e) {
    const n = e.nodeName.toLowerCase();
    'input' === n && Te.test(t.type)
      ? (e.checked = t.checked)
      : ('input' === n || 'textarea' === n) &&
        (e.defaultValue = t.defaultValue);
  }
  function x(e, n) {
    let i,
      o = K(n.createElement(e)).appendTo(n.body),
      s =
        t.getDefaultComputedStyle && (i = t.getDefaultComputedStyle(o[0]))
          ? i.display
          : K.css(o[0], 'display');
    return o.detach(), s;
  }
  function b(t) {
    let e = Z,
      n = Ie[t];
    return (
      n ||
        ((n = x(t, e)),
        ('none' !== n && n) ||
          ((ze = (
            ze || K("<iframe frameborder='0' width='0' height='0'/>")
          ).appendTo(e.documentElement)),
          (e = ze[0].contentDocument),
          e.write(),
          e.close(),
          (n = x(t, e)),
          ze.detach()),
        (Ie[t] = n)),
      n
    );
  }
  function w(t, e, n) {
    let i,
      o,
      s,
      r,
      a = t.style;
    return (
      (n = n || $e(t)),
      n && (r = n.getPropertyValue(e) || n[e]),
      n &&
        ('' !== r || K.contains(t.ownerDocument, t) || (r = K.style(t, e)),
        Be.test(r) &&
          qe.test(e) &&
          ((i = a.width),
          (o = a.minWidth),
          (s = a.maxWidth),
          (a.minWidth = a.maxWidth = a.width = r),
          (r = n.width),
          (a.width = i),
          (a.minWidth = o),
          (a.maxWidth = s))),
      void 0 !== r ? `${r}` : r
    );
  }
  function C(t, e) {
    return {
      get() {
        return t()
          ? void delete this.get
          : Reflect.apply((this.get = e), this, arguments);
      },
    };
  }
  function S(t, e) {
    if (e in t) return e;
    for (var n = e[0].toUpperCase() + e.slice(1), i = e, o = Ue.length; o--; )
      if (((e = Ue[o] + n), e in t)) return e;
    return i;
  }
  function T(t, e, n) {
    const i = Xe.exec(e);
    return i ? Math.max(0, i[1] - (n || 0)) + (i[2] || 'px') : e;
  }
  function k(t, e, n, i, o) {
    for (
      var s = n === (i ? 'border' : 'content') ? 4 : 'width' === e ? 1 : 0,
        r = 0;
      4 > s;
      s += 2
    )
      'margin' === n && (r += K.css(t, n + Ce[s], !0, o)),
        i
          ? ('content' === n && (r -= K.css(t, `padding${Ce[s]}`, !0, o)),
            'margin' !== n && (r -= K.css(t, `border${Ce[s]}Width`, !0, o)))
          : ((r += K.css(t, `padding${Ce[s]}`, !0, o)),
            'padding' !== n && (r += K.css(t, `border${Ce[s]}Width`, !0, o)));
    return r;
  }
  function P(t, e, n) {
    let i = !0,
      o = 'width' === e ? t.offsetWidth : t.offsetHeight,
      s = $e(t),
      r = 'border-box' === K.css(t, 'boxSizing', !1, s);
    if (0 >= o || null == o) {
      if (
        ((o = w(t, e, s)), (0 > o || null == o) && (o = t.style[e]), Be.test(o))
      )
        return o;
      (i = r && (Q.boxSizingReliable() || o === t.style[e])),
        (o = Number.parseFloat(o) || 0);
    }
    return `${o + k(t, e, n || (r ? 'border' : 'content'), i, s)}px`;
  }
  function L(t, e) {
    for (var n, i, o, s = [], r = 0, a = t.length; a > r; r++)
      (i = t[r]),
        i.style &&
          ((s[r] = ve.get(i, 'olddisplay')),
          (n = i.style.display),
          e
            ? (s[r] || 'none' !== n || (i.style.display = ''),
              '' === i.style.display &&
                Se(i) &&
                (s[r] = ve.access(i, 'olddisplay', b(i.nodeName))))
            : ((o = Se(i)),
              ('none' === n && o) ||
                ve.set(i, 'olddisplay', o ? n : K.css(i, 'display'))));
    for (r = 0; a > r; r++)
      (i = t[r]),
        i.style &&
          ((e && 'none' !== i.style.display && '' !== i.style.display) ||
            (i.style.display = e ? s[r] || '' : 'none'));
    return t;
  }
  function A(t, e, n, i, o) {
    return new A.prototype.init(t, e, n, i, o);
  }
  function E() {
    return (
      setTimeout(() => {
        Qe = void 0;
      }),
      (Qe = K.now())
    );
  }
  function F(t, e) {
    let n,
      i = 0,
      o = { height: t };
    for (e = e ? 1 : 0; 4 > i; i += 2 - e)
      (n = Ce[i]), (o[`margin${n}`] = o[`padding${n}`] = t);
    return e && (o.opacity = o.width = t), o;
  }
  function R(t, e, n) {
    for (
      var i, o = (nn[e] || []).concat(nn['*']), s = 0, r = o.length;
      r > s;
      s++
    )
      if ((i = o[s].call(n, e, t))) return i;
  }
  function N(t, e, n) {
    let i,
      o,
      s,
      r,
      a,
      l,
      h,
      c,
      u = this,
      d = {},
      p = t.style,
      f = t.nodeType && Se(t),
      g = ve.get(t, 'fxshow');
    n.queue ||
      ((a = K._queueHooks(t, 'fx')),
      null == a.unqueued &&
        ((a.unqueued = 0),
        (l = a.empty.fire),
        (a.empty.fire = function () {
          a.unqueued || l();
        })),
      a.unqueued++,
      u.always(() => {
        u.always(() => {
          a.unqueued--, K.queue(t, 'fx').length || a.empty.fire();
        });
      })),
      1 === t.nodeType &&
        ('height' in e || 'width' in e) &&
        ((n.overflow = [p.overflow, p.overflowX, p.overflowY]),
        (h = K.css(t, 'display')),
        (c = 'none' === h ? ve.get(t, 'olddisplay') || b(t.nodeName) : h),
        'inline' === c &&
          'none' === K.css(t, 'float') &&
          (p.display = 'inline-block')),
      n.overflow &&
        ((p.overflow = 'hidden'),
        u.always(() => {
          (p.overflow = n.overflow[0]),
            (p.overflowX = n.overflow[1]),
            (p.overflowY = n.overflow[2]);
        }));
    for (i in e)
      if (((o = e[i]), Je.exec(o))) {
        if (
          (delete e[i], (s = s || 'toggle' === o), o === (f ? 'hide' : 'show'))
        ) {
          if ('show' !== o || !g || void 0 === g[i]) continue;
          f = !0;
        }
        d[i] = (g && g[i]) || K.style(t, i);
      } else h = void 0;
    if (K.isEmptyObject(d))
      'inline' === ('none' === h ? b(t.nodeName) : h) && (p.display = h);
    else {
      g ? 'hidden' in g && (f = g.hidden) : (g = ve.access(t, 'fxshow', {})),
        s && (g.hidden = !f),
        f
          ? K(t).show()
          : u.done(() => {
              K(t).hide();
            }),
        u.done(() => {
          let e;
          ve.remove(t, 'fxshow');
          for (e in d) K.style(t, e, d[e]);
        });
      for (i in d)
        (r = R(f ? g[i] : 0, i, u)),
          i in g ||
            ((g[i] = r.start),
            f &&
              ((r.end = r.start),
              (r.start = 'width' === i || 'height' === i ? 1 : 0)));
    }
  }
  function D(t, e) {
    let n, i, o, s, r;
    for (n in t)
      if (
        ((i = K.camelCase(n)),
        (o = e[i]),
        (s = t[n]),
        K.isArray(s) && ((o = s[1]), (s = t[n] = s[0])),
        n !== i && ((t[i] = s), delete t[n]),
        (r = K.cssHooks[i]),
        r && 'expand' in r)
      ) {
        (s = r.expand(s)), delete t[i];
        for (n in s) n in t || ((t[n] = s[n]), (e[n] = o));
      } else e[i] = o;
  }
  function M(t, e, n) {
    var i,
      o,
      s = 0,
      r = en.length,
      a = K.Deferred().always(() => {
        delete l.elem;
      }),
      l = function () {
        if (o) return !1;
        for (
          var e = Qe || E(),
            n = Math.max(0, h.startTime + h.duration - e),
            i = n / h.duration || 0,
            s = 1 - i,
            r = 0,
            l = h.tweens.length;
          l > r;
          r++
        )
          h.tweens[r].run(s);
        return (
          a.notifyWith(t, [h, s, n]),
          1 > s && l ? n : (a.resolveWith(t, [h]), !1)
        );
      },
      h = a.promise({
        elem: t,
        props: K.extend({}, e),
        opts: K.extend(!0, { specialEasing: {} }, n),
        originalProperties: e,
        originalOptions: n,
        startTime: Qe || E(),
        duration: n.duration,
        tweens: [],
        createTween(e, n) {
          const i = K.Tween(
            t,
            h.opts,
            e,
            n,
            h.opts.specialEasing[e] || h.opts.easing,
          );
          return h.tweens.push(i), i;
        },
        stop(e) {
          let n = 0,
            i = e ? h.tweens.length : 0;
          if (o) return this;
          for (o = !0; i > n; n++) h.tweens[n].run(1);
          return e ? a.resolveWith(t, [h, e]) : a.rejectWith(t, [h, e]), this;
        },
      }),
      c = h.props;
    for (D(c, h.opts.specialEasing); r > s; s++)
      if ((i = en[s].call(h, t, c, h.opts))) return i;
    return (
      K.map(c, R, h),
      K.isFunction(h.opts.start) && h.opts.start.call(t, h),
      K.fx.timer(K.extend(l, { elem: t, anim: h, queue: h.opts.queue })),
      h
        .progress(h.opts.progress)
        .done(h.opts.done, h.opts.complete)
        .fail(h.opts.fail)
        .always(h.opts.always)
    );
  }
  function W(t) {
    return function (e, n) {
      'string' !== typeof e && ((n = e), (e = '*'));
      let i,
        o = 0,
        s = e.toLowerCase().match(pe) || [];
      if (K.isFunction(n))
        for (; (i = s[o++]); )
          '+' === i[0]
            ? ((i = i.slice(1) || '*'), (t[i] = t[i] || []).unshift(n))
            : (t[i] = t[i] || []).push(n);
    };
  }
  function O(t, e, n, i) {
    function o(a) {
      let l;
      return (
        (s[a] = !0),
        K.each(t[a] || [], (t, a) => {
          const h = a(e, n, i);
          return 'string' !== typeof h || r || s[h]
            ? r
              ? !(l = h)
              : void 0
            : (e.dataTypes.unshift(h), o(h), !1);
        }),
        l
      );
    }
    var s = {},
      r = t === bn;
    return o(e.dataTypes[0]) || (!s['*'] && o('*'));
  }
  function j(t, e) {
    let n,
      i,
      o = K.ajaxSettings.flatOptions || {};
    for (n in e) void 0 !== e[n] && ((o[n] ? t : i || (i = {}))[n] = e[n]);
    return i && K.extend(!0, t, i), t;
  }
  function H(t, e, n) {
    for (var i, o, s, r, a = t.contents, l = t.dataTypes; '*' === l[0]; )
      l.shift(),
        void 0 === i && (i = t.mimeType || e.getResponseHeader('Content-Type'));
    if (i)
      for (o in a)
        if (a[o] && a[o].test(i)) {
          l.unshift(o);
          break;
        }
    if (l[0] in n) s = l[0];
    else {
      for (o in n) {
        if (!l[0] || t.converters[`${o} ${l[0]}`]) {
          s = o;
          break;
        }
        r || (r = o);
      }
      s = s || r;
    }
    return s ? (s !== l[0] && l.unshift(s), n[s]) : void 0;
  }
  function z(t, e, n, i) {
    let o,
      s,
      r,
      a,
      l,
      h = {},
      c = t.dataTypes.slice();
    if (c[1]) for (r in t.converters) h[r.toLowerCase()] = t.converters[r];
    for (s = c.shift(); s; )
      if (
        (t.responseFields[s] && (n[t.responseFields[s]] = e),
        !l && i && t.dataFilter && (e = t.dataFilter(e, t.dataType)),
        (l = s),
        (s = c.shift()))
      )
        if ('*' === s) s = l;
        else if ('*' !== l && l !== s) {
          if (((r = h[`${l} ${s}`] || h[`* ${s}`]), !r))
            for (o in h)
              if (
                ((a = o.split(' ')),
                a[1] === s && (r = h[`${l} ${a[0]}`] || h[`* ${a[0]}`]))
              ) {
                r === !0
                  ? (r = h[o])
                  : h[o] !== !0 && ((s = a[0]), c.unshift(a[1]));
                break;
              }
          if (r !== !0)
            if (r && t['throws']) e = r(e);
            else
              try {
                e = r(e);
              } catch (u) {
                return {
                  state: 'parsererror',
                  error: r ? u : `No conversion from ${l} to ${s}`,
                };
              }
        }
    return { state: 'success', data: e };
  }
  function I(t, e, n, i) {
    let o;
    if (K.isArray(e))
      K.each(e, (e, o) => {
        n || kn.test(t)
          ? i(t, o)
          : I(`${t}[${'object' === typeof o ? e : ''}]`, o, n, i);
      });
    else if (n || 'object' !== K.type(e)) i(t, e);
    else for (o in e) I(`${t}[${o}]`, e[o], n, i);
  }
  function q(t) {
    return K.isWindow(t) ? t : 9 === t.nodeType && t.defaultView;
  }
  var B = [],
    $ = B.slice,
    _ = B.concat,
    X = B.push,
    V = B.indexOf,
    Y = {},
    G = Y.toString,
    U = Y.hasOwnProperty,
    Q = {},
    Z = t.document,
    J = '2.1.3',
    K = function (t, e) {
      return new K.fn.init(t, e);
    },
    te = /^\s+|\s+$/g,
    ee = /^-ms-/,
    ne = /-([\da-z])/gi,
    ie = function (t, e) {
      return e.toUpperCase();
    };
  (K.fn = K.prototype =
    {
      jquery: J,
      constructor: K,
      selector: '',
      length: 0,
      toArray() {
        return $.call(this);
      },
      get(t) {
        return null != t
          ? 0 > t
            ? this[t + this.length]
            : this[t]
          : $.call(this);
      },
      pushStack(t) {
        const e = K.merge(this.constructor(), t);
        return (e.prevObject = this), (e.context = this.context), e;
      },
      each(t, e) {
        return K.each(this, t, e);
      },
      map(t) {
        return this.pushStack(
          K.map(this, (e, n) => {
            return t.call(e, n, e);
          }),
        );
      },
      slice() {
        return this.pushStack(Reflect.apply($, this, arguments));
      },
      first() {
        return this.eq(0);
      },
      last() {
        return this.eq(-1);
      },
      eq(t) {
        const e = this.length,
          n = +t + (0 > t ? e : 0);
        return this.pushStack(n >= 0 && e > n ? [this[n]] : []);
      },
      end() {
        return this.prevObject || this.constructor(null);
      },
      push: X,
      sort: B.sort,
      splice: B.splice,
    }),
    (K.extend = K.fn.extend =
      function () {
        let t,
          e,
          n,
          i,
          o,
          s,
          r = arguments[0] || {},
          a = 1,
          l = arguments.length,
          h = !1;
        for (
          'boolean' === typeof r && ((h = r), (r = arguments[a] || {}), a++),
            'object' === typeof r || K.isFunction(r) || (r = {}),
            a === l && ((r = this), a--);
          l > a;
          a++
        )
          if (null != (t = arguments[a]))
            for (e in t)
              (n = r[e]),
                (i = t[e]),
                r !== i &&
                  (h && i && (K.isPlainObject(i) || (o = K.isArray(i)))
                    ? (o
                        ? ((o = !1), (s = n && K.isArray(n) ? n : []))
                        : (s = n && K.isPlainObject(n) ? n : {}),
                      (r[e] = K.extend(h, s, i)))
                    : void 0 !== i && (r[e] = i));
        return r;
      }),
    K.extend({
      expando: `jQuery${(J + Math.random()).replace(/\D/g, '')}`,
      isReady: !0,
      error(t) {
        throw new Error(t);
      },
      noop() {},
      isFunction(t) {
        return 'function' === K.type(t);
      },
      isArray: Array.isArray,
      isWindow(t) {
        return null != t && t === t.window;
      },
      isNumeric(t) {
        return !K.isArray(t) && t - Number.parseFloat(t) + 1 >= 0;
      },
      isPlainObject(t) {
        return 'object' !== K.type(t) || t.nodeType || K.isWindow(t)
          ? !1
          : t.constructor && !U.call(t.constructor.prototype, 'isPrototypeOf')
          ? !1
          : !0;
      },
      isEmptyObject(t) {
        let e;
        for (e in t) return !1;
        return !0;
      },
      type(t) {
        return null == t
          ? `${t}`
          : 'object' === typeof t || 'function' === typeof t
          ? Y[G.call(t)] || 'object'
          : typeof t;
      },
      globalEval(t) {
        let e,
          n = eval;
        (t = K.trim(t)),
          t &&
            (1 === t.indexOf('use strict')
              ? ((e = Z.createElement('script')),
                (e.text = t),
                Z.head.appendChild(e).parentNode.removeChild(e))
              : n(t));
      },
      camelCase(t) {
        return t.replace(ee, 'ms-').replace(ne, ie);
      },
      nodeName(t, e) {
        return t.nodeName && t.nodeName.toLowerCase() === e.toLowerCase();
      },
      each(t, e, i) {
        let o,
          s = 0,
          r = t.length,
          a = n(t);
        if (i) {
          if (a) for (; r > s && ((o = e.apply(t[s], i)), o !== !1); s++);
          else for (s in t) if (((o = e.apply(t[s], i)), o === !1)) break;
        } else if (a)
          for (; r > s && ((o = e.call(t[s], s, t[s])), o !== !1); s++);
        else for (s in t) if (((o = e.call(t[s], s, t[s])), o === !1)) break;
        return t;
      },
      trim(t) {
        return null == t ? '' : `${t}`.replace(te, '');
      },
      makeArray(t, e) {
        const i = e || [];
        return (
          null != t &&
            (n(new Object(t))
              ? K.merge(i, 'string' === typeof t ? [t] : t)
              : X.call(i, t)),
          i
        );
      },
      inArray(t, e, n) {
        return null == e ? -1 : V.call(e, t, n);
      },
      merge(t, e) {
        for (var n = +e.length, i = 0, o = t.length; n > i; i++) t[o++] = e[i];
        return (t.length = o), t;
      },
      grep(t, e, n) {
        for (var i, o = [], s = 0, r = t.length, a = !n; r > s; s++)
          (i = !e(t[s], s)), i !== a && o.push(t[s]);
        return o;
      },
      map(t, e, i) {
        let o,
          s = 0,
          r = t.length,
          a = n(t),
          l = [];
        if (a) for (; r > s; s++) (o = e(t[s], s, i)), null != o && l.push(o);
        else for (s in t) (o = e(t[s], s, i)), null != o && l.push(o);
        return _.apply([], l);
      },
      guid: 1,
      proxy(t, e) {
        let n, i, o;
        return (
          'string' === typeof e && ((n = t[e]), (e = t), (t = n)),
          K.isFunction(t)
            ? ((i = $.call(arguments, 2)),
              (o = function () {
                return t.apply(e || this, i.concat($.call(arguments)));
              }),
              (o.guid = t.guid = t.guid || K.guid++),
              o)
            : void 0
        );
      },
      now: Date.now,
      support: Q,
    }),
    K.each(
      'Boolean Number String Function Array Date RegExp Object Error'.split(
        ' ',
      ),
      (t, e) => {
        Y[`[object ${e}]`] = e.toLowerCase();
      },
    );
  const oe = (function (t) {
    function e(t, e, n, i) {
      let o, s, r, a, l, h, u, p, f, g;
      if (
        ((e ? e.ownerDocument || e : I) !== N && R(e),
        (e = e || N),
        (n = n || []),
        (a = e.nodeType),
        'string' !== typeof t || !t || (1 !== a && 9 !== a && 11 !== a))
      )
        return n;
      if (!i && M) {
        if (11 !== a && (o = ye.exec(t)))
          if ((r = o[1])) {
            if (9 === a) {
              if (((s = e.getElementById(r)), !s || !s.parentNode)) return n;
              if (s.id === r) return n.push(s), n;
            } else if (
              e.ownerDocument &&
              (s = e.ownerDocument.getElementById(r)) &&
              H(e, s) &&
              s.id === r
            )
              return n.push(s), n;
          } else {
            if (o[2]) return J.apply(n, e.getElementsByTagName(t)), n;
            if ((r = o[3]) && w.getElementsByClassName)
              return J.apply(n, e.getElementsByClassName(r)), n;
          }
        if (w.qsa && (!W || !W.test(t))) {
          if (
            ((p = u = z),
            (f = e),
            (g = 1 !== a && t),
            1 === a && 'object' !== e.nodeName.toLowerCase())
          ) {
            for (
              h = k(t),
                (u = e.getAttribute('id'))
                  ? (p = u.replace(be, '\\$&'))
                  : e.setAttribute('id', p),
                p = `[id='${p}'] `,
                l = h.length;
              l--;

            )
              h[l] = p + d(h[l]);
            (f = (xe.test(t) && c(e.parentNode)) || e), (g = h.join(','));
          }
          if (g)
            try {
              return J.apply(n, f.querySelectorAll(g)), n;
            } catch {
            } finally {
              u || e.removeAttribute('id');
            }
        }
      }
      return L(t.replace(le, '$1'), e, n, i);
    }
    function n() {
      function t(n, i) {
        return (
          e.push(`${n} `) > C.cacheLength && delete t[e.shift()],
          (t[`${n} `] = i)
        );
      }
      var e = [];
      return t;
    }
    function i(t) {
      return (t[z] = !0), t;
    }
    function o(t) {
      let e = N.createElement('div');
      try {
        return !!t(e);
      } catch {
        return !1;
      } finally {
        e.parentNode && e.parentNode.removeChild(e), (e = null);
      }
    }
    function s(t, e) {
      for (let n = t.split('|'), i = t.length; i--; ) C.attrHandle[n[i]] = e;
    }
    function r(t, e) {
      let n = e && t,
        i =
          n &&
          1 === t.nodeType &&
          1 === e.nodeType &&
          (~e.sourceIndex || Y) - (~t.sourceIndex || Y);
      if (i) return i;
      if (n) for (; (n = n.nextSibling); ) if (n === e) return -1;
      return t ? 1 : -1;
    }
    function a(t) {
      return function (e) {
        const n = e.nodeName.toLowerCase();
        return 'input' === n && e.type === t;
      };
    }
    function l(t) {
      return function (e) {
        const n = e.nodeName.toLowerCase();
        return ('input' === n || 'button' === n) && e.type === t;
      };
    }
    function h(t) {
      return i(e => {
        return (
          (e = +e),
          i((n, i) => {
            for (var o, s = t([], n.length, e), r = s.length; r--; )
              n[(o = s[r])] && (n[o] = !(i[o] = n[o]));
          })
        );
      });
    }
    function c(t) {
      return t && 'undefined' !== typeof t.getElementsByTagName && t;
    }
    function u() {}
    function d(t) {
      for (var e = 0, n = t.length, i = ''; n > e; e++) i += t[e].value;
      return i;
    }
    function p(t, e, n) {
      const i = e.dir,
        o = n && 'parentNode' === i,
        s = B++;
      return e.first
        ? function (e, n, s) {
            for (; (e = e[i]); ) if (1 === e.nodeType || o) return t(e, n, s);
          }
        : function (e, n, r) {
            let a,
              l,
              h = [q, s];
            if (r) {
              for (; (e = e[i]); )
                if ((1 === e.nodeType || o) && t(e, n, r)) return !0;
            } else
              for (; (e = e[i]); )
                if (1 === e.nodeType || o) {
                  if (
                    ((l = e[z] || (e[z] = {})),
                    (a = l[i]) && a[0] === q && a[1] === s)
                  )
                    return (h[2] = a[2]);
                  if (((l[i] = h), (h[2] = t(e, n, r)))) return !0;
                }
          };
    }
    function f(t) {
      return t.length > 1
        ? function (e, n, i) {
            for (let o = t.length; o--; ) if (!t[o](e, n, i)) return !1;
            return !0;
          }
        : t[0];
    }
    function g(t, n, i) {
      for (let o = 0, s = n.length; s > o; o++) e(t, n[o], i);
      return i;
    }
    function m(t, e, n, i, o) {
      for (var s, r = [], a = 0, l = t.length, h = null != e; l > a; a++)
        (s = t[a]) && (!n || n(s, i, o)) && (r.push(s), h && e.push(a));
      return r;
    }
    function v(t, e, n, o, s, r) {
      return (
        o && !o[z] && (o = v(o)),
        s && !s[z] && (s = v(s, r)),
        i((i, r, a, l) => {
          let h,
            c,
            u,
            d = [],
            p = [],
            f = r.length,
            v = i || g(e || '*', a.nodeType ? [a] : a, []),
            y = !t || (!i && e) ? v : m(v, d, t, a, l),
            x = n ? (s || (i ? t : f || o) ? [] : r) : y;
          if ((n && n(y, x, a, l), o))
            for (h = m(x, p), o(h, [], a, l), c = h.length; c--; )
              (u = h[c]) && (x[p[c]] = !(y[p[c]] = u));
          if (i) {
            if (s || t) {
              if (s) {
                for (h = [], c = x.length; c--; )
                  (u = x[c]) && h.push((y[c] = u));
                s(null, (x = []), h, l);
              }
              for (c = x.length; c--; )
                (u = x[c]) &&
                  (h = s ? te(i, u) : d[c]) > -1 &&
                  (i[h] = !(r[h] = u));
            }
          } else
            (x = m(x === r ? x.splice(f, x.length) : x)),
              s ? s(null, r, x, l) : J.apply(r, x);
        })
      );
    }
    function y(t) {
      for (
        var e,
          n,
          i,
          o = t.length,
          s = C.relative[t[0].type],
          r = s || C.relative[' '],
          a = s ? 1 : 0,
          l = p(
            t => {
              return t === e;
            },
            r,
            !0,
          ),
          h = p(
            t => {
              return te(e, t) > -1;
            },
            r,
            !0,
          ),
          c = [
            function (t, n, i) {
              const o =
                (!s && (i || n !== A)) ||
                ((e = n).nodeType ? l(t, n, i) : h(t, n, i));
              return (e = null), o;
            },
          ];
        o > a;
        a++
      )
        if ((n = C.relative[t[a].type])) c = [p(f(c), n)];
        else {
          if (((n = C.filter[t[a].type].apply(null, t[a].matches)), n[z])) {
            for (i = ++a; o > i && !C.relative[t[i].type]; i++);
            return v(
              a > 1 && f(c),
              a > 1 &&
                d(
                  t
                    .slice(0, a - 1)
                    .concat({ value: ' ' === t[a - 2].type ? '*' : '' }),
                ).replace(le, '$1'),
              n,
              i > a && y(t.slice(a, i)),
              o > i && y((t = t.slice(i))),
              o > i && d(t),
            );
          }
          c.push(n);
        }
      return f(c);
    }
    function x(t, n) {
      const o = n.length > 0,
        s = t.length > 0,
        r = function (i, r, a, l, h) {
          let c,
            u,
            d,
            p = 0,
            f = '0',
            g = i && [],
            v = [],
            y = A,
            x = i || (s && C.find.TAG('*', h)),
            b = (q += null == y ? 1 : Math.random() || 0.1),
            w = x.length;
          for (h && (A = r !== N && r); f !== w && null != (c = x[f]); f++) {
            if (s && c) {
              for (u = 0; (d = t[u++]); )
                if (d(c, r, a)) {
                  l.push(c);
                  break;
                }
              h && (q = b);
            }
            o && ((c = !d && c) && p--, i && g.push(c));
          }
          if (((p += f), o && f !== p)) {
            for (u = 0; (d = n[u++]); ) d(g, v, r, a);
            if (i) {
              if (p > 0) for (; f--; ) g[f] || v[f] || (v[f] = Q.call(l));
              v = m(v);
            }
            J.apply(l, v),
              h && !i && v.length > 0 && p + n.length > 1 && e.uniqueSort(l);
          }
          return h && ((q = b), (A = y)), g;
        };
      return o ? i(r) : r;
    }
    var b,
      w,
      C,
      S,
      T,
      k,
      P,
      L,
      A,
      E,
      F,
      R,
      N,
      D,
      M,
      W,
      O,
      j,
      H,
      z = `sizzle${1 * Date.now()}`,
      I = t.document,
      q = 0,
      B = 0,
      $ = n(),
      _ = n(),
      X = n(),
      V = function (t, e) {
        return t === e && (F = !0), 0;
      },
      Y = 1 << 31,
      G = {}.hasOwnProperty,
      U = [],
      Q = U.pop,
      Z = U.push,
      J = U.push,
      K = U.slice,
      te = function (t, e) {
        for (let n = 0, i = t.length; i > n; n++) if (t[n] === e) return n;
        return -1;
      },
      ee =
        'checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped',
      ne = '[\\x20\\t\\r\\n\\f]',
      ie = '(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+',
      oe = ie.replace('w', 'w#'),
      se = `\\[${ne}*(${ie})(?:${ne}*([*^$|!~]?=)${ne}*(?:'((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)"|(${oe}))|)${ne}*\\]`,
      re = `:(${ie})(?:\\((('((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)")|((?:\\\\.|[^\\\\()[\\]]|${se})*)|.*)\\)|)`,
      ae = new RegExp(`${ne}+`, 'g'),
      le = new RegExp(`^${ne}+|((?:^|[^\\\\])(?:\\\\.)*)${ne}+$`, 'g'),
      he = new RegExp(`^${ne}*,${ne}*`),
      ce = new RegExp(`^${ne}*([>+~]|${ne})${ne}*`),
      ue = new RegExp(`=${ne}*([^\\]'"]*?)${ne}*\\]`, 'g'),
      de = new RegExp(re),
      pe = new RegExp(`^${oe}$`),
      fe = {
        ID: new RegExp(`^#(${ie})`),
        CLASS: new RegExp(`^\\.(${ie})`),
        TAG: new RegExp(`^(${ie.replace('w', 'w*')})`),
        ATTR: new RegExp(`^${se}`),
        PSEUDO: new RegExp(`^${re}`),
        CHILD: new RegExp(
          `^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(${ne}*(even|odd|(([+-]|)(\\d*)n|)${ne}*(?:([+-]|)${ne}*(\\d+)|))${ne}*\\)|)`,
          'i',
        ),
        bool: new RegExp(`^(?:${ee})$`, 'i'),
        needsContext: new RegExp(
          `^${ne}*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(${ne}*((?:-\\d)?\\d*)${ne}*\\)|)(?=[^-]|$)`,
          'i',
        ),
      },
      ge = /^(?:input|select|textarea|button)$/i,
      me = /^h\d$/i,
      ve = /^[^{]+{\s*\[native \w/,
      ye = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
      xe = /[+~]/,
      be = /'|\\/g,
      we = new RegExp(`\\\\([\\da-f]{1,6}${ne}?|(${ne})|.)`, 'ig'),
      Ce = function (t, e, n) {
        const i = `0x${e}` - 65536;
        return i !== i || n
          ? e
          : 0 > i
          ? String.fromCharCode(i + 65536)
          : String.fromCharCode((i >> 10) | 55296, (1023 & i) | 56320);
      },
      Se = function () {
        R();
      };
    try {
      J.apply((U = K.call(I.childNodes)), I.childNodes),
        U[I.childNodes.length].nodeType;
    } catch {
      J = {
        apply:
          U.length > 0
            ? function (t, e) {
                Z.apply(t, K.call(e));
              }
            : function (t, e) {
                for (var n = t.length, i = 0; (t[n++] = e[i++]); );
                t.length = n - 1;
              },
      };
    }
    (w = e.support = {}),
      (T = e.isXML =
        function (t) {
          const e = t && (t.ownerDocument || t).documentElement;
          return e ? 'HTML' !== e.nodeName : !1;
        }),
      (R = e.setDocument =
        function (t) {
          let e,
            n,
            i = t ? t.ownerDocument || t : I;
          return i !== N && 9 === i.nodeType && i.documentElement
            ? ((N = i),
              (D = i.documentElement),
              (n = i.defaultView),
              n &&
                n !== n.top &&
                (n.addEventListener
                  ? n.addEventListener('unload', Se, !1)
                  : n.attachEvent && n.attachEvent('onunload', Se)),
              (M = !T(i)),
              (w.attributes = o(t => {
                return (t.className = 'i'), !t.getAttribute('className');
              })),
              (w.getElementsByTagName = o(t => {
                return (
                  t.appendChild(i.createComment('')),
                  t.querySelectorAll('*').length === 0
                );
              })),
              (w.getElementsByClassName = ve.test(i.getElementsByClassName)),
              (w.getById = o(t => {
                return (
                  (D.appendChild(t).id = z),
                  !i.getElementsByName || i.getElementsByName(z).length === 0
                );
              })),
              w.getById
                ? ((C.find.ID = function (t, e) {
                    if ('undefined' !== typeof e.getElementById && M) {
                      const n = e.getElementById(t);
                      return n && n.parentNode ? [n] : [];
                    }
                  }),
                  (C.filter.ID = function (t) {
                    const e = t.replace(we, Ce);
                    return function (t) {
                      return t.getAttribute('id') === e;
                    };
                  }))
                : (delete C.find.ID,
                  (C.filter.ID = function (t) {
                    const e = t.replace(we, Ce);
                    return function (t) {
                      const n =
                        'undefined' !== typeof t.getAttributeNode &&
                        t.getAttributeNode('id');
                      return n && n.value === e;
                    };
                  })),
              (C.find.TAG = w.getElementsByTagName
                ? function (t, e) {
                    return 'undefined' !== typeof e.getElementsByTagName
                      ? e.getElementsByTagName(t)
                      : w.qsa
                      ? e.querySelectorAll(t)
                      : void 0;
                  }
                : function (t, e) {
                    let n,
                      i = [],
                      o = 0,
                      s = e.getElementsByTagName(t);
                    if ('*' === t) {
                      for (; (n = s[o++]); ) 1 === n.nodeType && i.push(n);
                      return i;
                    }
                    return s;
                  }),
              (C.find.CLASS =
                w.getElementsByClassName &&
                function (t, e) {
                  return M ? e.getElementsByClassName(t) : void 0;
                }),
              (O = []),
              (W = []),
              (w.qsa = ve.test(i.querySelectorAll)) &&
                (o(t => {
                  (D.appendChild(
                    t,
                  ).innerHTML = `<a id='${z}'></a><select id='${z}-\f]' msallowcapture=''><option selected=''></option></select>`),
                    t.querySelectorAll("[msallowcapture^='']").length &&
                      W.push(`[*^$]=${ne}*(?:''|"")`),
                    t.querySelectorAll('[selected]').length ||
                      W.push(`\\[${ne}*(?:value|${ee})`),
                    t.querySelectorAll(`[id~=${z}-]`).length || W.push('~='),
                    t.querySelectorAll(':checked').length || W.push(':checked'),
                    t.querySelectorAll(`a#${z}+*`).length || W.push('.#.+[+~]');
                }),
                o(t => {
                  const e = i.createElement('input');
                  e.setAttribute('type', 'hidden'),
                    t.appendChild(e).setAttribute('name', 'D'),
                    t.querySelectorAll('[name=d]').length &&
                      W.push(`name${ne}*[*^$|!~]?=`),
                    t.querySelectorAll(':enabled').length ||
                      W.push(':enabled', ':disabled'),
                    t.querySelectorAll('*,:x'),
                    W.push(',.*:');
                })),
              (w.matchesSelector = ve.test(
                (j =
                  D.matches ||
                  D.webkitMatchesSelector ||
                  D.mozMatchesSelector ||
                  D.oMatchesSelector ||
                  D.msMatchesSelector),
              )) &&
                o(t => {
                  (w.disconnectedMatch = j.call(t, 'div')),
                    j.call(t, "[s!='']:x"),
                    O.push('!=', re);
                }),
              (W = W.length && new RegExp(W.join('|'))),
              (O = O.length && new RegExp(O.join('|'))),
              (e = ve.test(D.compareDocumentPosition)),
              (H =
                e || ve.test(D.contains)
                  ? function (t, e) {
                      const n = 9 === t.nodeType ? t.documentElement : t,
                        i = e && e.parentNode;
                      return (
                        t === i ||
                        !(
                          !i ||
                          1 !== i.nodeType ||
                          !(n.contains
                            ? n.contains(i)
                            : t.compareDocumentPosition &&
                              16 & t.compareDocumentPosition(i))
                        )
                      );
                    }
                  : function (t, e) {
                      if (e)
                        for (; (e = e.parentNode); ) if (e === t) return !0;
                      return !1;
                    }),
              (V = e
                ? function (t, e) {
                    if (t === e) return (F = !0), 0;
                    let n =
                      !t.compareDocumentPosition - !e.compareDocumentPosition;
                    return n
                      ? n
                      : ((n =
                          (t.ownerDocument || t) === (e.ownerDocument || e)
                            ? t.compareDocumentPosition(e)
                            : 1),
                        1 & n ||
                        (!w.sortDetached && e.compareDocumentPosition(t) === n)
                          ? t === i || (t.ownerDocument === I && H(I, t))
                            ? -1
                            : e === i || (e.ownerDocument === I && H(I, e))
                            ? 1
                            : E
                            ? te(E, t) - te(E, e)
                            : 0
                          : 4 & n
                          ? -1
                          : 1);
                  }
                : function (t, e) {
                    if (t === e) return (F = !0), 0;
                    let n,
                      o = 0,
                      s = t.parentNode,
                      a = e.parentNode,
                      l = [t],
                      h = [e];
                    if (!s || !a)
                      return t === i
                        ? -1
                        : e === i
                        ? 1
                        : s
                        ? -1
                        : a
                        ? 1
                        : E
                        ? te(E, t) - te(E, e)
                        : 0;
                    if (s === a) return r(t, e);
                    for (n = t; (n = n.parentNode); ) l.unshift(n);
                    for (n = e; (n = n.parentNode); ) h.unshift(n);
                    for (; l[o] === h[o]; ) o++;
                    return o
                      ? r(l[o], h[o])
                      : l[o] === I
                      ? -1
                      : h[o] === I
                      ? 1
                      : 0;
                  }),
              i)
            : N;
        }),
      (e.matches = function (t, n) {
        return e(t, null, null, n);
      }),
      (e.matchesSelector = function (t, n) {
        if (
          ((t.ownerDocument || t) !== N && R(t),
          (n = n.replace(ue, "='$1']")),
          !(!w.matchesSelector || !M || (O && O.test(n)) || (W && W.test(n))))
        )
          try {
            const i = j.call(t, n);
            if (
              i ||
              w.disconnectedMatch ||
              (t.document && 11 !== t.document.nodeType)
            )
              return i;
          } catch {}
        return e(n, N, null, [t]).length > 0;
      }),
      (e.contains = function (t, e) {
        return (t.ownerDocument || t) !== N && R(t), H(t, e);
      }),
      (e.attr = function (t, e) {
        (t.ownerDocument || t) !== N && R(t);
        let n = C.attrHandle[e.toLowerCase()],
          i = n && G.call(C.attrHandle, e.toLowerCase()) ? n(t, e, !M) : void 0;
        return void 0 !== i
          ? i
          : w.attributes || !M
          ? t.getAttribute(e)
          : (i = t.getAttributeNode(e)) && i.specified
          ? i.value
          : null;
      }),
      (e.error = function (t) {
        throw new Error(`Syntax error, unrecognized expression: ${t}`);
      }),
      (e.uniqueSort = function (t) {
        let e,
          n = [],
          i = 0,
          o = 0;
        if (
          ((F = !w.detectDuplicates),
          (E = !w.sortStable && t.slice(0)),
          t.sort(V),
          F)
        ) {
          for (; (e = t[o++]); ) e === t[o] && (i = n.push(o));
          for (; i--; ) t.splice(n[i], 1);
        }
        return (E = null), t;
      }),
      (S = e.getText =
        function (t) {
          let e,
            n = '',
            i = 0,
            o = t.nodeType;
          if (o) {
            if (1 === o || 9 === o || 11 === o) {
              if ('string' === typeof t.textContent) return t.textContent;
              for (t = t.firstChild; t; t = t.nextSibling) n += S(t);
            } else if (3 === o || 4 === o) return t.nodeValue;
          } else for (; (e = t[i++]); ) n += S(e);
          return n;
        }),
      (C = e.selectors =
        {
          cacheLength: 50,
          createPseudo: i,
          match: fe,
          attrHandle: {},
          find: {},
          relative: {
            '>': { dir: 'parentNode', first: !0 },
            ' ': { dir: 'parentNode' },
            '+': { dir: 'previousSibling', first: !0 },
            '~': { dir: 'previousSibling' },
          },
          preFilter: {
            ATTR(t) {
              return (
                (t[1] = t[1].replace(we, Ce)),
                (t[3] = (t[3] || t[4] || t[5] || '').replace(we, Ce)),
                '~=' === t[2] && (t[3] = ` ${t[3]} `),
                t.slice(0, 4)
              );
            },
            CHILD(t) {
              return (
                (t[1] = t[1].toLowerCase()),
                'nth' === t[1].slice(0, 3)
                  ? (t[3] || e.error(t[0]),
                    (t[4] = +(t[4]
                      ? t[5] + (t[6] || 1)
                      : 2 * ('even' === t[3] || 'odd' === t[3]))),
                    (t[5] = +(t[7] + t[8] || 'odd' === t[3])))
                  : t[3] && e.error(t[0]),
                t
              );
            },
            PSEUDO(t) {
              let e,
                n = !t[6] && t[2];
              return fe.CHILD.test(t[0])
                ? null
                : (t[3]
                    ? (t[2] = t[4] || t[5] || '')
                    : n &&
                      de.test(n) &&
                      (e = k(n, !0)) &&
                      (e = n.indexOf(')', n.length - e) - n.length) &&
                      ((t[0] = t[0].slice(0, e)), (t[2] = n.slice(0, e))),
                  t.slice(0, 3));
            },
          },
          filter: {
            TAG(t) {
              const e = t.replace(we, Ce).toLowerCase();
              return '*' === t
                ? function () {
                    return !0;
                  }
                : function (t) {
                    return t.nodeName && t.nodeName.toLowerCase() === e;
                  };
            },
            CLASS(t) {
              let e = $[`${t} `];
              return (
                e ||
                ((e = new RegExp(`(^|${ne})${t}(${ne}|$)`)) &&
                  $(t, t => {
                    return e.test(
                      ('string' === typeof t.className && t.className) ||
                        ('undefined' !== typeof t.getAttribute &&
                          t.getAttribute('class')) ||
                        '',
                    );
                  }))
              );
            },
            ATTR(t, n, i) {
              return function (o) {
                let s = e.attr(o, t);
                return null == s
                  ? '!=' === n
                  : n
                  ? ((s += ''),
                    '=' === n
                      ? s === i
                      : '!=' === n
                      ? s !== i
                      : '^=' === n
                      ? i && 0 === s.indexOf(i)
                      : '*=' === n
                      ? i && s.includes(i)
                      : '$=' === n
                      ? i && s.slice(-i.length) === i
                      : '~=' === n
                      ? ` ${s.replace(ae, ' ')} `.includes(i)
                      : '|=' === n
                      ? s === i || s.slice(0, i.length + 1) === `${i}-`
                      : !1)
                  : !0;
              };
            },
            CHILD(t, e, n, i, o) {
              const s = 'nth' !== t.slice(0, 3),
                r = 'last' !== t.slice(-4),
                a = 'of-type' === e;
              return 1 === i && 0 === o
                ? function (t) {
                    return !!t.parentNode;
                  }
                : function (e, n, l) {
                    let h,
                      c,
                      u,
                      d,
                      p,
                      f,
                      g = s !== r ? 'nextSibling' : 'previousSibling',
                      m = e.parentNode,
                      v = a && e.nodeName.toLowerCase(),
                      y = !l && !a;
                    if (m) {
                      if (s) {
                        for (; g; ) {
                          for (u = e; (u = u[g]); )
                            if (
                              a
                                ? u.nodeName.toLowerCase() === v
                                : 1 === u.nodeType
                            )
                              return !1;
                          f = g = 'only' === t && !f && 'nextSibling';
                        }
                        return !0;
                      }
                      if (((f = [r ? m.firstChild : m.lastChild]), r && y)) {
                        for (
                          c = m[z] || (m[z] = {}),
                            h = c[t] || [],
                            p = h[0] === q && h[1],
                            d = h[0] === q && h[2],
                            u = p && m.childNodes[p];
                          (u = (++p && u && u[g]) || (d = p = 0) || f.pop());

                        )
                          if (1 === u.nodeType && ++d && u === e) {
                            c[t] = [q, p, d];
                            break;
                          }
                      } else if (
                        y &&
                        (h = (e[z] || (e[z] = {}))[t]) &&
                        h[0] === q
                      )
                        d = h[1];
                      else
                        for (
                          ;
                          (u = (++p && u && u[g]) || (d = p = 0) || f.pop()) &&
                          ((a
                            ? u.nodeName.toLowerCase() !== v
                            : 1 !== u.nodeType) ||
                            !++d ||
                            (y && ((u[z] || (u[z] = {}))[t] = [q, d]),
                            u !== e));

                        );
                      return (d -= o), d === i || (d % i === 0 && d / i >= 0);
                    }
                  };
            },
            PSEUDO(t, n) {
              let o,
                s =
                  C.pseudos[t] ||
                  C.setFilters[t.toLowerCase()] ||
                  e.error(`unsupported pseudo: ${t}`);
              return s[z]
                ? s(n)
                : s.length > 1
                ? ((o = [t, t, '', n]),
                  C.setFilters.hasOwnProperty(t.toLowerCase())
                    ? i((t, e) => {
                        for (var i, o = s(t, n), r = o.length; r--; )
                          (i = te(t, o[r])), (t[i] = !(e[i] = o[r]));
                      })
                    : function (t) {
                        return s(t, 0, o);
                      })
                : s;
            },
          },
          pseudos: {
            not: i(t => {
              const e = [],
                n = [],
                o = P(t.replace(le, '$1'));
              return o[z]
                ? i((t, e, n, i) => {
                    for (var s, r = o(t, null, i, []), a = t.length; a--; )
                      (s = r[a]) && (t[a] = !(e[a] = s));
                  })
                : function (t, i, s) {
                    return (
                      (e[0] = t), o(e, null, s, n), (e[0] = null), !n.pop()
                    );
                  };
            }),
            has: i(t => {
              return function (n) {
                return e(t, n).length > 0;
              };
            }),
            contains: i(t => {
              return (
                (t = t.replace(we, Ce)),
                function (e) {
                  return (e.textContent || e.innerText || S(e)).includes(t);
                }
              );
            }),
            lang: i(t => {
              return (
                pe.test(t || '') || e.error(`unsupported lang: ${t}`),
                (t = t.replace(we, Ce).toLowerCase()),
                function (e) {
                  let n;
                  do
                    if (
                      (n = M
                        ? e.lang
                        : e.getAttribute('xml:lang') || e.getAttribute('lang'))
                    )
                      return (
                        (n = n.toLowerCase()),
                        n === t || 0 === n.indexOf(`${t}-`)
                      );
                  while ((e = e.parentNode) && 1 === e.nodeType);
                  return !1;
                }
              );
            }),
            target(e) {
              const n = t.location && t.location.hash;
              return n && n.slice(1) === e.id;
            },
            root(t) {
              return t === D;
            },
            focus(t) {
              return (
                t === N.activeElement &&
                (!N.hasFocus || N.hasFocus()) &&
                !!(t.type || t.href || ~t.tabIndex)
              );
            },
            enabled(t) {
              return t.disabled === !1;
            },
            disabled(t) {
              return t.disabled === !0;
            },
            checked(t) {
              const e = t.nodeName.toLowerCase();
              return (
                ('input' === e && !!t.checked) ||
                ('option' === e && !!t.selected)
              );
            },
            selected(t) {
              return (
                t.parentNode && t.parentNode.selectedIndex, t.selected === !0
              );
            },
            empty(t) {
              for (t = t.firstChild; t; t = t.nextSibling)
                if (t.nodeType < 6) return !1;
              return !0;
            },
            parent(t) {
              return !C.pseudos.empty(t);
            },
            header(t) {
              return me.test(t.nodeName);
            },
            input(t) {
              return ge.test(t.nodeName);
            },
            button(t) {
              const e = t.nodeName.toLowerCase();
              return ('input' === e && 'button' === t.type) || 'button' === e;
            },
            text(t) {
              let e;
              return (
                'input' === t.nodeName.toLowerCase() &&
                'text' === t.type &&
                (null == (e = t.getAttribute('type')) ||
                  'text' === e.toLowerCase())
              );
            },
            first: h(() => {
              return [0];
            }),
            last: h((t, e) => {
              return [e - 1];
            }),
            eq: h((t, e, n) => {
              return [0 > n ? n + e : n];
            }),
            even: h((t, e) => {
              for (let n = 0; e > n; n += 2) t.push(n);
              return t;
            }),
            odd: h((t, e) => {
              for (let n = 1; e > n; n += 2) t.push(n);
              return t;
            }),
            lt: h((t, e, n) => {
              for (let i = 0 > n ? n + e : n; --i >= 0; ) t.push(i);
              return t;
            }),
            gt: h((t, e, n) => {
              for (let i = 0 > n ? n + e : n; ++i < e; ) t.push(i);
              return t;
            }),
          },
        }),
      (C.pseudos.nth = C.pseudos.eq);
    for (b in { radio: !0, checkbox: !0, file: !0, password: !0, image: !0 })
      C.pseudos[b] = a(b);
    for (b in { submit: !0, reset: !0 }) C.pseudos[b] = l(b);
    return (
      (u.prototype = C.filters = C.pseudos),
      (C.setFilters = new u()),
      (k = e.tokenize =
        function (t, n) {
          let i,
            o,
            s,
            r,
            a,
            l,
            h,
            c = _[`${t} `];
          if (c) return n ? 0 : c.slice(0);
          for (a = t, l = [], h = C.preFilter; a; ) {
            (!i || (o = he.exec(a))) &&
              (o && (a = a.slice(o[0].length) || a), l.push((s = []))),
              (i = !1),
              (o = ce.exec(a)) &&
                ((i = o.shift()),
                s.push({ value: i, type: o[0].replace(le, ' ') }),
                (a = a.slice(i.length)));
            for (r in C.filter)
              !(o = fe[r].exec(a)) ||
                (h[r] && !(o = h[r](o))) ||
                ((i = o.shift()),
                s.push({ value: i, type: r, matches: o }),
                (a = a.slice(i.length)));
            if (!i) break;
          }
          return n ? a.length : a ? e.error(t) : _(t, l).slice(0);
        }),
      (P = e.compile =
        function (t, e) {
          let n,
            i = [],
            o = [],
            s = X[`${t} `];
          if (!s) {
            for (e || (e = k(t)), n = e.length; n--; )
              (s = y(e[n])), s[z] ? i.push(s) : o.push(s);
            (s = X(t, x(o, i))), (s.selector = t);
          }
          return s;
        }),
      (L = e.select =
        function (t, e, n, i) {
          let o,
            s,
            r,
            a,
            l,
            h = 'function' === typeof t && t,
            u = !i && k((t = h.selector || t));
          if (((n = n || []), 1 === u.length)) {
            if (
              ((s = u[0] = u[0].slice(0)),
              s.length > 2 &&
                'ID' === (r = s[0]).type &&
                w.getById &&
                9 === e.nodeType &&
                M &&
                C.relative[s[1].type])
            ) {
              if (
                ((e = (C.find.ID(r.matches[0].replace(we, Ce), e) || [])[0]),
                !e)
              )
                return n;
              h && (e = e.parentNode), (t = t.slice(s.shift().value.length));
            }
            for (
              o = fe.needsContext.test(t) ? 0 : s.length;
              o-- && ((r = s[o]), !C.relative[(a = r.type)]);

            )
              if (
                (l = C.find[a]) &&
                (i = l(
                  r.matches[0].replace(we, Ce),
                  (xe.test(s[0].type) && c(e.parentNode)) || e,
                ))
              ) {
                if ((s.splice(o, 1), (t = i.length && d(s)), !t))
                  return J.apply(n, i), n;
                break;
              }
          }
          return (
            (h || P(t, u))(i, e, !M, n, (xe.test(t) && c(e.parentNode)) || e), n
          );
        }),
      (w.sortStable = z.split('').sort(V).join('') === z),
      (w.detectDuplicates = !!F),
      R(),
      (w.sortDetached = o(t => {
        return 1 & t.compareDocumentPosition(N.createElement('div'));
      })),
      o(t => {
        return (
          (t.innerHTML = "<a href='#'></a>"),
          '#' === t.firstChild.getAttribute('href')
        );
      }) ||
        s('type|href|height|width', (t, e, n) => {
          return n
            ? void 0
            : t.getAttribute(e, 'type' === e.toLowerCase() ? 1 : 2);
        }),
      (w.attributes &&
        o(t => {
          return (
            (t.innerHTML = '<input/>'),
            t.firstChild.setAttribute('value', ''),
            '' === t.firstChild.getAttribute('value')
          );
        })) ||
        s('value', (t, e, n) => {
          return n || 'input' !== t.nodeName.toLowerCase()
            ? void 0
            : t.defaultValue;
        }),
      o(t => {
        return null == t.getAttribute('disabled');
      }) ||
        s(ee, (t, e, n) => {
          let i;
          return n
            ? void 0
            : t[e] === !0
            ? e.toLowerCase()
            : (i = t.getAttributeNode(e)) && i.specified
            ? i.value
            : null;
        }),
      e
    );
  })(t);
  (K.find = oe),
    (K.expr = oe.selectors),
    (K.expr[':'] = K.expr.pseudos),
    (K.unique = oe.uniqueSort),
    (K.text = oe.getText),
    (K.isXMLDoc = oe.isXML),
    (K.contains = oe.contains);
  var se = K.expr.match.needsContext,
    re = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
    ae = /^.[^#,.:[]*$/;
  (K.filter = function (t, e, n) {
    const i = e[0];
    return (
      n && (t = `:not(${t})`),
      1 === e.length && 1 === i.nodeType
        ? K.find.matchesSelector(i, t)
          ? [i]
          : []
        : K.find.matches(
            t,
            K.grep(e, t => {
              return 1 === t.nodeType;
            }),
          )
    );
  }),
    K.fn.extend({
      find(t) {
        let e,
          n = this.length,
          i = [],
          o = this;
        if ('string' !== typeof t)
          return this.pushStack(
            K(t).filter(function () {
              for (e = 0; n > e; e++) if (K.contains(o[e], this)) return !0;
            }),
          );
        for (e = 0; n > e; e++) K.find(t, o[e], i);
        return (
          (i = this.pushStack(n > 1 ? K.unique(i) : i)),
          (i.selector = this.selector ? `${this.selector} ${t}` : t),
          i
        );
      },
      filter(t) {
        return this.pushStack(i(this, t || [], !1));
      },
      not(t) {
        return this.pushStack(i(this, t || [], !0));
      },
      is(t) {
        return (
          i(this, 'string' === typeof t && se.test(t) ? K(t) : t || [], !1)
            .length > 0
        );
      },
    });
  let le,
    he = /^(?:\s*(<[\W\w]+>)[^>]*|#([\w-]*))$/,
    ce = (K.fn.init = function (t, e) {
      let n, i;
      if (!t) return this;
      if ('string' === typeof t) {
        if (
          ((n =
            '<' === t[0] && '>' === t[t.length - 1] && t.length >= 3
              ? [null, t, null]
              : he.exec(t)),
          !n || (!n[1] && e))
        )
          return !e || e.jquery
            ? (e || le).find(t)
            : this.constructor(e).find(t);
        if (n[1]) {
          if (
            ((e = e instanceof K ? e[0] : e),
            K.merge(
              this,
              K.parseHTML(n[1], e && e.nodeType ? e.ownerDocument || e : Z, !0),
            ),
            re.test(n[1]) && K.isPlainObject(e))
          )
            for (n in e)
              K.isFunction(this[n]) ? this[n](e[n]) : this.attr(n, e[n]);
          return this;
        }
        return (
          (i = Z.getElementById(n[2])),
          i && i.parentNode && ((this.length = 1), (this[0] = i)),
          (this.context = Z),
          (this.selector = t),
          this
        );
      }
      return t.nodeType
        ? ((this.context = this[0] = t), (this.length = 1), this)
        : K.isFunction(t)
        ? 'undefined' !== typeof le.ready
          ? le.ready(t)
          : t(K)
        : (void 0 !== t.selector &&
            ((this.selector = t.selector), (this.context = t.context)),
          K.makeArray(t, this));
    });
  (ce.prototype = K.fn), (le = K(Z));
  const ue = /^(?:parents|prev(?:Until|All))/,
    de = { children: !0, contents: !0, next: !0, prev: !0 };
  K.extend({
    dir(t, e, n) {
      for (var i = [], o = void 0 !== n; (t = t[e]) && 9 !== t.nodeType; )
        if (1 === t.nodeType) {
          if (o && K(t).is(n)) break;
          i.push(t);
        }
      return i;
    },
    sibling(t, e) {
      for (var n = []; t; t = t.nextSibling)
        1 === t.nodeType && t !== e && n.push(t);
      return n;
    },
  }),
    K.fn.extend({
      has(t) {
        const e = K(t, this),
          n = e.length;
        return this.filter(function () {
          for (let t = 0; n > t; t++) if (K.contains(this, e[t])) return !0;
        });
      },
      closest(t, e) {
        for (
          var n,
            i = 0,
            o = this.length,
            s = [],
            r =
              se.test(t) || 'string' !== typeof t ? K(t, e || this.context) : 0;
          o > i;
          i++
        )
          for (n = this[i]; n && n !== e; n = n.parentNode)
            if (
              n.nodeType < 11 &&
              (r
                ? r.index(n) > -1
                : 1 === n.nodeType && K.find.matchesSelector(n, t))
            ) {
              s.push(n);
              break;
            }
        return this.pushStack(s.length > 1 ? K.unique(s) : s);
      },
      index(t) {
        return t
          ? 'string' === typeof t
            ? V.call(K(t), this[0])
            : V.call(this, t.jquery ? t[0] : t)
          : this[0] && this[0].parentNode
          ? this.first().prevAll().length
          : -1;
      },
      add(t, e) {
        return this.pushStack(K.unique(K.merge(this.get(), K(t, e))));
      },
      addBack(t) {
        return this.add(
          null == t ? this.prevObject : this.prevObject.filter(t),
        );
      },
    }),
    K.each(
      {
        parent(t) {
          const e = t.parentNode;
          return e && 11 !== e.nodeType ? e : null;
        },
        parents(t) {
          return K.dir(t, 'parentNode');
        },
        parentsUntil(t, e, n) {
          return K.dir(t, 'parentNode', n);
        },
        next(t) {
          return o(t, 'nextSibling');
        },
        prev(t) {
          return o(t, 'previousSibling');
        },
        nextAll(t) {
          return K.dir(t, 'nextSibling');
        },
        prevAll(t) {
          return K.dir(t, 'previousSibling');
        },
        nextUntil(t, e, n) {
          return K.dir(t, 'nextSibling', n);
        },
        prevUntil(t, e, n) {
          return K.dir(t, 'previousSibling', n);
        },
        siblings(t) {
          return K.sibling((t.parentNode || {}).firstChild, t);
        },
        children(t) {
          return K.sibling(t.firstChild);
        },
        contents(t) {
          return t.contentDocument || K.merge([], t.childNodes);
        },
      },
      (t, e) => {
        K.fn[t] = function (n, i) {
          let o = K.map(this, e, n);
          return (
            'Until' !== t.slice(-5) && (i = n),
            i && 'string' === typeof i && (o = K.filter(i, o)),
            this.length > 1 &&
              (de[t] || K.unique(o), ue.test(t) && o.reverse()),
            this.pushStack(o)
          );
        };
      },
    );
  var pe = /\S+/g,
    fe = {};
  (K.Callbacks = function (t) {
    t = 'string' === typeof t ? fe[t] || s(t) : K.extend({}, t);
    var e,
      n,
      i,
      o,
      r,
      a,
      l = [],
      h = !t.once && [],
      c = function (s) {
        for (
          e = t.memory && s, n = !0, a = o || 0, o = 0, r = l.length, i = !0;
          l && r > a;
          a++
        )
          if (l[a].apply(s[0], s[1]) === !1 && t.stopOnFalse) {
            e = !1;
            break;
          }
        (i = !1),
          l && (h ? h.length && c(h.shift()) : e ? (l = []) : u.disable());
      },
      u = {
        add() {
          if (l) {
            const n = l.length;
            !(function s(e) {
              K.each(e, (e, n) => {
                const i = K.type(n);
                'function' === i
                  ? (t.unique && u.has(n)) || l.push(n)
                  : n && n.length && 'string' !== i && s(n);
              });
            })(arguments),
              i ? (r = l.length) : e && ((o = n), c(e));
          }
          return this;
        },
        remove() {
          return (
            l &&
              K.each(arguments, (t, e) => {
                for (var n; (n = K.inArray(e, l, n)) > -1; )
                  l.splice(n, 1), i && (r >= n && r--, a >= n && a--);
              }),
            this
          );
        },
        has(t) {
          return t ? K.inArray(t, l) > -1 : !(!l || l.length === 0);
        },
        empty() {
          return (l = []), (r = 0), this;
        },
        disable() {
          return (l = h = e = void 0), this;
        },
        disabled() {
          return !l;
        },
        lock() {
          return (h = void 0), e || u.disable(), this;
        },
        locked() {
          return !h;
        },
        fireWith(t, e) {
          return (
            !l ||
              (n && !h) ||
              ((e = e || []),
              (e = [t, e.slice ? e.slice() : e]),
              i ? h.push(e) : c(e)),
            this
          );
        },
        fire() {
          return u.fireWith(this, arguments), this;
        },
        fired() {
          return !!n;
        },
      };
    return u;
  }),
    K.extend({
      Deferred(t) {
        var e = [
            ['resolve', 'done', K.Callbacks('once memory'), 'resolved'],
            ['reject', 'fail', K.Callbacks('once memory'), 'rejected'],
            ['notify', 'progress', K.Callbacks('memory')],
          ],
          n = 'pending',
          i = {
            state() {
              return n;
            },
            always() {
              return o.done(arguments).fail(arguments), this;
            },
            then() {
              let t = arguments;
              return K.Deferred(n => {
                K.each(e, (e, s) => {
                  const r = K.isFunction(t[e]) && t[e];
                  o[s[1]](function () {
                    const t = r && Reflect.apply(r, this, arguments);
                    t && K.isFunction(t.promise)
                      ? t
                          .promise()
                          .done(n.resolve)
                          .fail(n.reject)
                          .progress(n.notify)
                      : n[`${s[0]}With`](
                          this === i ? n.promise() : this,
                          r ? [t] : arguments,
                        );
                  });
                }),
                  (t = null);
              }).promise();
            },
            promise(t) {
              return null != t ? K.extend(t, i) : i;
            },
          },
          o = {};
        return (
          (i.pipe = i.then),
          K.each(e, (t, s) => {
            const r = s[2],
              a = s[3];
            (i[s[1]] = r.add),
              a &&
                r.add(
                  () => {
                    n = a;
                  },
                  e[1 ^ t][2].disable,
                  e[2][2].lock,
                ),
              (o[s[0]] = function () {
                return o[`${s[0]}With`](this === o ? i : this, arguments), this;
              }),
              (o[`${s[0]}With`] = r.fireWith);
          }),
          i.promise(o),
          t && t.call(o, o),
          o
        );
      },
      when(t) {
        let e,
          n,
          i,
          o = 0,
          s = $.call(arguments),
          r = s.length,
          a = 1 !== r || (t && K.isFunction(t.promise)) ? r : 0,
          l = 1 === a ? t : K.Deferred(),
          h = function (t, n, i) {
            return function (o) {
              (n[t] = this),
                (i[t] = arguments.length > 1 ? $.call(arguments) : o),
                i === e ? l.notifyWith(n, i) : --a || l.resolveWith(n, i);
            };
          };
        if (r > 1)
          for (e = new Array(r), n = new Array(r), i = new Array(r); r > o; o++)
            s[o] && K.isFunction(s[o].promise)
              ? s[o]
                  .promise()
                  .done(h(o, i, s))
                  .fail(l.reject)
                  .progress(h(o, n, e))
              : --a;
        return a || l.resolveWith(i, s), l.promise();
      },
    });
  let ge;
  (K.fn.ready = function (t) {
    return K.ready.promise().done(t), this;
  }),
    K.extend({
      isReady: !1,
      readyWait: 1,
      holdReady(t) {
        t ? K.readyWait++ : K.ready(!0);
      },
      ready(t) {
        (t === !0 ? --K.readyWait : K.isReady) ||
          ((K.isReady = !0),
          (t !== !0 && --K.readyWait > 0) ||
            (ge.resolveWith(Z, [K]),
            K.fn.triggerHandler &&
              (K(Z).triggerHandler('ready'), K(Z).off('ready'))));
      },
    }),
    (K.ready.promise = function (e) {
      return (
        ge ||
          ((ge = K.Deferred()),
          'complete' === Z.readyState
            ? setTimeout(K.ready)
            : (Z.addEventListener('DOMContentLoaded', r, !1),
              t.addEventListener('load', r, !1))),
        ge.promise(e)
      );
    }),
    K.ready.promise();
  const me = (K.access = function (t, e, n, i, o, s, r) {
    let a = 0,
      l = t.length,
      h = null == n;
    if ('object' === K.type(n)) {
      o = !0;
      for (a in n) K.access(t, e, a, n[a], !0, s, r);
    } else if (
      void 0 !== i &&
      ((o = !0),
      K.isFunction(i) || (r = !0),
      h &&
        (r
          ? (e.call(t, i), (e = null))
          : ((h = e),
            (e = function (t, e, n) {
              return h.call(K(t), n);
            }))),
      e)
    )
      for (; l > a; a++) e(t[a], n, r ? i : i.call(t[a], a, e(t[a], n)));
    return o ? t : h ? e.call(t) : l ? e(t[0], n) : s;
  });
  (K.acceptData = function (t) {
    return 1 === t.nodeType || 9 === t.nodeType || !+t.nodeType;
  }),
    (a.uid = 1),
    (a.accepts = K.acceptData),
    (a.prototype = {
      key(t) {
        if (!a.accepts(t)) return 0;
        let e = {},
          n = t[this.expando];
        if (!n) {
          n = a.uid++;
          try {
            (e[this.expando] = { value: n }), Object.defineProperties(t, e);
          } catch {
            (e[this.expando] = n), K.extend(t, e);
          }
        }
        return this.cache[n] || (this.cache[n] = {}), n;
      },
      set(t, e, n) {
        let i,
          o = this.key(t),
          s = this.cache[o];
        if ('string' === typeof e) s[e] = n;
        else if (K.isEmptyObject(s)) K.extend(this.cache[o], e);
        else for (i in e) s[i] = e[i];
        return s;
      },
      get(t, e) {
        const n = this.cache[this.key(t)];
        return void 0 === e ? n : n[e];
      },
      access(t, e, n) {
        let i;
        return void 0 === e || (e && 'string' === typeof e && void 0 === n)
          ? ((i = this.get(t, e)),
            void 0 !== i ? i : this.get(t, K.camelCase(e)))
          : (this.set(t, e, n), void 0 !== n ? n : e);
      },
      remove(t, e) {
        let n,
          i,
          o,
          s = this.key(t),
          r = this.cache[s];
        if (void 0 === e) this.cache[s] = {};
        else {
          K.isArray(e)
            ? (i = e.concat(e.map(K.camelCase)))
            : ((o = K.camelCase(e)),
              e in r
                ? (i = [e, o])
                : ((i = o), (i = i in r ? [i] : i.match(pe) || []))),
            (n = i.length);
          for (; n--; ) delete r[i[n]];
        }
      },
      hasData(t) {
        return !K.isEmptyObject(this.cache[t[this.expando]] || {});
      },
      discard(t) {
        t[this.expando] && delete this.cache[t[this.expando]];
      },
    });
  var ve = new a(),
    ye = new a(),
    xe = /^(?:{[\W\w]*}|\[[\W\w]*])$/,
    be = /([A-Z])/g;
  K.extend({
    hasData(t) {
      return ye.hasData(t) || ve.hasData(t);
    },
    data(t, e, n) {
      return ye.access(t, e, n);
    },
    removeData(t, e) {
      ye.remove(t, e);
    },
    _data(t, e, n) {
      return ve.access(t, e, n);
    },
    _removeData(t, e) {
      ve.remove(t, e);
    },
  }),
    K.fn.extend({
      data(t, e) {
        let n,
          i,
          o,
          s = this[0],
          r = s && s.attributes;
        if (void 0 === t) {
          if (
            this.length &&
            ((o = ye.get(s)), 1 === s.nodeType && !ve.get(s, 'hasDataAttrs'))
          ) {
            for (n = r.length; n--; )
              r[n] &&
                ((i = r[n].name),
                0 === i.indexOf('data-') &&
                  ((i = K.camelCase(i.slice(5))), l(s, i, o[i])));
            ve.set(s, 'hasDataAttrs', !0);
          }
          return o;
        }
        return 'object' === typeof t
          ? this.each(function () {
              ye.set(this, t);
            })
          : me(
              this,
              function (e) {
                let n,
                  i = K.camelCase(t);
                if (s && void 0 === e) {
                  if (((n = ye.get(s, t)), void 0 !== n)) return n;
                  if (((n = ye.get(s, i)), void 0 !== n)) return n;
                  if (((n = l(s, i, void 0)), void 0 !== n)) return n;
                } else
                  this.each(function () {
                    const n = ye.get(this, i);
                    ye.set(this, i, e),
                      -1 !== t.indexOf('-') &&
                        void 0 !== n &&
                        ye.set(this, t, e);
                  });
              },
              null,
              e,
              arguments.length > 1,
              null,
              !0,
            );
      },
      removeData(t) {
        return this.each(function () {
          ye.remove(this, t);
        });
      },
    }),
    K.extend({
      queue(t, e, n) {
        let i;
        return t
          ? ((e = `${e || 'fx'}queue`),
            (i = ve.get(t, e)),
            n &&
              (!i || K.isArray(n)
                ? (i = ve.access(t, e, K.makeArray(n)))
                : i.push(n)),
            i || [])
          : void 0;
      },
      dequeue(t, e) {
        e = e || 'fx';
        let n = K.queue(t, e),
          i = n.length,
          o = n.shift(),
          s = K._queueHooks(t, e),
          r = function () {
            K.dequeue(t, e);
          };
        'inprogress' === o && ((o = n.shift()), i--),
          o &&
            ('fx' === e && n.unshift('inprogress'),
            delete s.stop,
            o.call(t, r, s)),
          !i && s && s.empty.fire();
      },
      _queueHooks(t, e) {
        const n = `${e}queueHooks`;
        return (
          ve.get(t, n) ||
          ve.access(t, n, {
            empty: K.Callbacks('once memory').add(() => {
              ve.remove(t, [`${e}queue`, n]);
            }),
          })
        );
      },
    }),
    K.fn.extend({
      queue(t, e) {
        let n = 2;
        return (
          'string' !== typeof t && ((e = t), (t = 'fx'), n--),
          arguments.length < n
            ? K.queue(this[0], t)
            : void 0 === e
            ? this
            : this.each(function () {
                const n = K.queue(this, t, e);
                K._queueHooks(this, t),
                  'fx' === t && 'inprogress' !== n[0] && K.dequeue(this, t);
              })
        );
      },
      dequeue(t) {
        return this.each(function () {
          K.dequeue(this, t);
        });
      },
      clearQueue(t) {
        return this.queue(t || 'fx', []);
      },
      promise(t, e) {
        let n,
          i = 1,
          o = K.Deferred(),
          s = this,
          r = this.length,
          a = function () {
            --i || o.resolveWith(s, [s]);
          };
        for (
          'string' !== typeof t && ((e = t), (t = void 0)), t = t || 'fx';
          r--;

        )
          (n = ve.get(s[r], `${t}queueHooks`)),
            n && n.empty && (i++, n.empty.add(a));
        return a(), o.promise(e);
      },
    });
  var we = /[+-]?(?:\d*\.|)\d+(?:[Ee][+-]?\d+|)/.source,
    Ce = ['Top', 'Right', 'Bottom', 'Left'],
    Se = function (t, e) {
      return (
        (t = e || t),
        'none' === K.css(t, 'display') || !K.contains(t.ownerDocument, t)
      );
    },
    Te = /^(?:checkbox|radio)$/i;
  !(function () {
    const t = Z.createDocumentFragment(),
      e = t.appendChild(Z.createElement('div')),
      n = Z.createElement('input');
    n.setAttribute('type', 'radio'),
      n.setAttribute('checked', 'checked'),
      n.setAttribute('name', 't'),
      e.appendChild(n),
      (Q.checkClone = e.cloneNode(!0).cloneNode(!0).lastChild.checked),
      (e.innerHTML = '<textarea>x</textarea>'),
      (Q.noCloneChecked = !!e.cloneNode(!0).lastChild.defaultValue);
  })();
  const ke = 'undefined';
  Q.focusinBubbles = 'onfocusin' in t;
  const Pe = /^key/,
    Le = /^(?:mouse|pointer|contextmenu)|click/,
    Ae = /^(?:focusinfocus|focusoutblur)$/,
    Ee = /^([^.]*)(?:\.(.+)|)$/;
  (K.event = {
    global: {},
    add(t, e, n, i, o) {
      let s,
        r,
        a,
        l,
        h,
        c,
        u,
        d,
        p,
        f,
        g,
        m = ve.get(t);
      if (m)
        for (
          n.handler && ((s = n), (n = s.handler), (o = s.selector)),
            n.guid || (n.guid = K.guid++),
            (l = m.events) || (l = m.events = {}),
            (r = m.handle) ||
              (r = m.handle =
                function (e) {
                  return typeof K !== ke && K.event.triggered !== e.type
                    ? K.event.dispatch.apply(t, arguments)
                    : void 0;
                }),
            e = (e || '').match(pe) || [''],
            h = e.length;
          h--;

        )
          (a = Ee.exec(e[h]) || []),
            (p = g = a[1]),
            (f = (a[2] || '').split('.').sort()),
            p &&
              ((u = K.event.special[p] || {}),
              (p = (o ? u.delegateType : u.bindType) || p),
              (u = K.event.special[p] || {}),
              (c = K.extend(
                {
                  type: p,
                  origType: g,
                  data: i,
                  handler: n,
                  guid: n.guid,
                  selector: o,
                  needsContext: o && K.expr.match.needsContext.test(o),
                  namespace: f.join('.'),
                },
                s,
              )),
              (d = l[p]) ||
                ((d = l[p] = []),
                (d.delegateCount = 0),
                (u.setup && u.setup.call(t, i, f, r) !== !1) ||
                  (t.addEventListener && t.addEventListener(p, r, !1))),
              u.add &&
                (u.add.call(t, c), c.handler.guid || (c.handler.guid = n.guid)),
              o ? d.splice(d.delegateCount++, 0, c) : d.push(c),
              (K.event.global[p] = !0));
    },
    remove(t, e, n, i, o) {
      let s,
        r,
        a,
        l,
        h,
        c,
        u,
        d,
        p,
        f,
        g,
        m = ve.hasData(t) && ve.get(t);
      if (m && (l = m.events)) {
        for (e = (e || '').match(pe) || [''], h = e.length; h--; )
          if (
            ((a = Ee.exec(e[h]) || []),
            (p = g = a[1]),
            (f = (a[2] || '').split('.').sort()),
            p)
          ) {
            for (
              u = K.event.special[p] || {},
                p = (i ? u.delegateType : u.bindType) || p,
                d = l[p] || [],
                a =
                  a[2] &&
                  new RegExp(`(^|\\.)${f.join('\\.(?:.*\\.|)')}(\\.|$)`),
                r = s = d.length;
              s--;

            )
              (c = d[s]),
                (!o && g !== c.origType) ||
                  (n && n.guid !== c.guid) ||
                  (a && !a.test(c.namespace)) ||
                  (i && i !== c.selector && ('**' !== i || !c.selector)) ||
                  (d.splice(s, 1),
                  c.selector && d.delegateCount--,
                  u.remove && u.remove.call(t, c));
            r &&
              d.length === 0 &&
              ((u.teardown && u.teardown.call(t, f, m.handle) !== !1) ||
                K.removeEvent(t, p, m.handle),
              delete l[p]);
          } else for (p in l) K.event.remove(t, p + e[h], n, i, !0);
        K.isEmptyObject(l) && (delete m.handle, ve.remove(t, 'events'));
      }
    },
    trigger(e, n, i, o) {
      let s,
        r,
        a,
        l,
        h,
        c,
        u,
        d = [i || Z],
        p = U.call(e, 'type') ? e.type : e,
        f = U.call(e, 'namespace') ? e.namespace.split('.') : [];
      if (
        ((r = a = i = i || Z),
        3 !== i.nodeType &&
          8 !== i.nodeType &&
          !Ae.test(p + K.event.triggered) &&
          (p.includes('.') && ((f = p.split('.')), (p = f.shift()), f.sort()),
          (h = !p.includes(':') && `on${p}`),
          (e = e[K.expando] ? e : new K.Event(p, 'object' === typeof e && e)),
          (e.isTrigger = o ? 2 : 3),
          (e.namespace = f.join('.')),
          (e.namespace_re = e.namespace
            ? new RegExp(`(^|\\.)${f.join('\\.(?:.*\\.|)')}(\\.|$)`)
            : null),
          (e.result = void 0),
          e.target || (e.target = i),
          (n = null == n ? [e] : K.makeArray(n, [e])),
          (u = K.event.special[p] || {}),
          o || !u.trigger || u.trigger.apply(i, n) !== !1))
      ) {
        if (!o && !u.noBubble && !K.isWindow(i)) {
          for (
            l = u.delegateType || p, Ae.test(l + p) || (r = r.parentNode);
            r;
            r = r.parentNode
          )
            d.push(r), (a = r);
          a === (i.ownerDocument || Z) &&
            d.push(a.defaultView || a.parentWindow || t);
        }
        for (s = 0; (r = d[s++]) && !e.isPropagationStopped(); )
          (e.type = s > 1 ? l : u.bindType || p),
            (c = (ve.get(r, 'events') || {})[e.type] && ve.get(r, 'handle')),
            c && c.apply(r, n),
            (c = h && r[h]),
            c &&
              c.apply &&
              K.acceptData(r) &&
              ((e.result = c.apply(r, n)),
              e.result === !1 && e.preventDefault());
        return (
          (e.type = p),
          o ||
            e.isDefaultPrevented() ||
            (u._default && u._default.apply(d.pop(), n) !== !1) ||
            !K.acceptData(i) ||
            (h &&
              K.isFunction(i[p]) &&
              !K.isWindow(i) &&
              ((a = i[h]),
              a && (i[h] = null),
              (K.event.triggered = p),
              i[p](),
              (K.event.triggered = void 0),
              a && (i[h] = a))),
          e.result
        );
      }
    },
    dispatch(t) {
      t = K.event.fix(t);
      let e,
        n,
        i,
        o,
        s,
        r = [],
        a = $.call(arguments),
        l = (ve.get(this, 'events') || {})[t.type] || [],
        h = K.event.special[t.type] || {};
      if (
        ((a[0] = t),
        (t.delegateTarget = this),
        !h.preDispatch || h.preDispatch.call(this, t) !== !1)
      ) {
        for (
          r = K.event.handlers.call(this, t, l), e = 0;
          (o = r[e++]) && !t.isPropagationStopped();

        )
          for (
            t.currentTarget = o.elem, n = 0;
            (s = o.handlers[n++]) && !t.isImmediatePropagationStopped();

          )
            (!t.namespace_re || t.namespace_re.test(s.namespace)) &&
              ((t.handleObj = s),
              (t.data = s.data),
              (i = (
                (K.event.special[s.origType] || {}).handle || s.handler
              ).apply(o.elem, a)),
              void 0 !== i &&
                (t.result = i) === !1 &&
                (t.preventDefault(), t.stopPropagation()));
        return h.postDispatch && h.postDispatch.call(this, t), t.result;
      }
    },
    handlers(t, e) {
      let n,
        i,
        o,
        s,
        r = [],
        a = e.delegateCount,
        l = t.target;
      if (a && l.nodeType && (!t.button || 'click' !== t.type))
        for (; l !== this; l = l.parentNode || this)
          if (l.disabled !== !0 || 'click' !== t.type) {
            for (i = [], n = 0; a > n; n++)
              (s = e[n]),
                (o = `${s.selector} `),
                void 0 === i[o] &&
                  (i[o] = s.needsContext
                    ? K(o, this).index(l) >= 0
                    : K.find(o, this, null, [l]).length),
                i[o] && i.push(s);
            i.length && r.push({ elem: l, handlers: i });
          }
      return a < e.length && r.push({ elem: this, handlers: e.slice(a) }), r;
    },
    props:
      'altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which'.split(
        ' ',
      ),
    fixHooks: {},
    keyHooks: {
      props: 'char charCode key keyCode'.split(' '),
      filter(t, e) {
        return (
          null == t.which &&
            (t.which = null != e.charCode ? e.charCode : e.keyCode),
          t
        );
      },
    },
    mouseHooks: {
      props:
        'button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement'.split(
          ' ',
        ),
      filter(t, e) {
        let n,
          i,
          o,
          s = e.button;
        return (
          null == t.pageX &&
            null != e.clientX &&
            ((n = t.target.ownerDocument || Z),
            (i = n.documentElement),
            (o = n.body),
            (t.pageX =
              e.clientX +
              ((i && i.scrollLeft) || (o && o.scrollLeft) || 0) -
              ((i && i.clientLeft) || (o && o.clientLeft) || 0)),
            (t.pageY =
              e.clientY +
              ((i && i.scrollTop) || (o && o.scrollTop) || 0) -
              ((i && i.clientTop) || (o && o.clientTop) || 0))),
          t.which ||
            void 0 === s ||
            (t.which = 1 & s ? 1 : 2 & s ? 3 : 4 & s ? 2 : 0),
          t
        );
      },
    },
    fix(t) {
      if (t[K.expando]) return t;
      let e,
        n,
        i,
        o = t.type,
        s = t,
        r = this.fixHooks[o];
      for (
        r ||
          (this.fixHooks[o] = r =
            Le.test(o) ? this.mouseHooks : Pe.test(o) ? this.keyHooks : {}),
          i = r.props ? this.props.concat(r.props) : this.props,
          t = new K.Event(s),
          e = i.length;
        e--;

      )
        (n = i[e]), (t[n] = s[n]);
      return (
        t.target || (t.target = Z),
        3 === t.target.nodeType && (t.target = t.target.parentNode),
        r.filter ? r.filter(t, s) : t
      );
    },
    special: {
      load: { noBubble: !0 },
      focus: {
        trigger() {
          return this !== u() && this.focus ? (this.focus(), !1) : void 0;
        },
        delegateType: 'focusin',
      },
      blur: {
        trigger() {
          return this === u() && this.blur ? (this.blur(), !1) : void 0;
        },
        delegateType: 'focusout',
      },
      click: {
        trigger() {
          return 'checkbox' === this.type &&
            this.click &&
            K.nodeName(this, 'input')
            ? (this.click(), !1)
            : void 0;
        },
        _default(t) {
          return K.nodeName(t.target, 'a');
        },
      },
      beforeunload: {
        postDispatch(t) {
          void 0 !== t.result &&
            t.originalEvent &&
            (t.originalEvent.returnValue = t.result);
        },
      },
    },
    simulate(t, e, n, i) {
      const o = K.extend(new K.Event(), n, {
        type: t,
        isSimulated: !0,
        originalEvent: {},
      });
      i ? K.event.trigger(o, null, e) : K.event.dispatch.call(e, o),
        o.isDefaultPrevented() && n.preventDefault();
    },
  }),
    (K.removeEvent = function (t, e, n) {
      t.removeEventListener && t.removeEventListener(e, n, !1);
    }),
    (K.Event = function (t, e) {
      return this instanceof K.Event
        ? (t && t.type
            ? ((this.originalEvent = t),
              (this.type = t.type),
              (this.isDefaultPrevented =
                t.defaultPrevented ||
                (void 0 === t.defaultPrevented && t.returnValue === !1)
                  ? h
                  : c))
            : (this.type = t),
          e && K.extend(this, e),
          (this.timeStamp = (t && t.timeStamp) || K.now()),
          void (this[K.expando] = !0))
        : new K.Event(t, e);
    }),
    (K.Event.prototype = {
      isDefaultPrevented: c,
      isPropagationStopped: c,
      isImmediatePropagationStopped: c,
      preventDefault() {
        const t = this.originalEvent;
        (this.isDefaultPrevented = h),
          t && t.preventDefault && t.preventDefault();
      },
      stopPropagation() {
        const t = this.originalEvent;
        (this.isPropagationStopped = h),
          t && t.stopPropagation && t.stopPropagation();
      },
      stopImmediatePropagation() {
        const t = this.originalEvent;
        (this.isImmediatePropagationStopped = h),
          t && t.stopImmediatePropagation && t.stopImmediatePropagation(),
          this.stopPropagation();
      },
    }),
    K.each(
      {
        mouseenter: 'mouseover',
        mouseleave: 'mouseout',
        pointerenter: 'pointerover',
        pointerleave: 'pointerout',
      },
      (t, e) => {
        K.event.special[t] = {
          delegateType: e,
          bindType: e,
          handle(t) {
            let n,
              i = this,
              o = t.relatedTarget,
              s = t.handleObj;
            return (
              (!o || (o !== i && !K.contains(i, o))) &&
                ((t.type = s.origType),
                (n = Reflect.apply(s.handler, this, arguments)),
                (t.type = e)),
              n
            );
          },
        };
      },
    ),
    Q.focusinBubbles ||
      K.each({ focus: 'focusin', blur: 'focusout' }, (t, e) => {
        const n = function (t) {
          K.event.simulate(e, t.target, K.event.fix(t), !0);
        };
        K.event.special[e] = {
          setup() {
            const i = this.ownerDocument || this,
              o = ve.access(i, e);
            o || i.addEventListener(t, n, !0), ve.access(i, e, (o || 0) + 1);
          },
          teardown() {
            const i = this.ownerDocument || this,
              o = ve.access(i, e) - 1;
            o
              ? ve.access(i, e, o)
              : (i.removeEventListener(t, n, !0), ve.remove(i, e));
          },
        };
      }),
    K.fn.extend({
      on(t, e, n, i, o) {
        let s, r;
        if ('object' === typeof t) {
          'string' !== typeof e && ((n = n || e), (e = void 0));
          for (r in t) this.on(r, e, n, t[r], o);
          return this;
        }
        if (
          (null == n && null == i
            ? ((i = e), (n = e = void 0))
            : null == i &&
              ('string' === typeof e
                ? ((i = n), (n = void 0))
                : ((i = n), (n = e), (e = void 0))),
          i === !1)
        )
          i = c;
        else if (!i) return this;
        return (
          1 === o &&
            ((s = i),
            (i = function (t) {
              return K().off(t), Reflect.apply(s, this, arguments);
            }),
            (i.guid = s.guid || (s.guid = K.guid++))),
          this.each(function () {
            K.event.add(this, t, i, n, e);
          })
        );
      },
      one(t, e, n, i) {
        return this.on(t, e, n, i, 1);
      },
      off(t, e, n) {
        let i, o;
        if (t && t.preventDefault && t.handleObj)
          return (
            (i = t.handleObj),
            K(t.delegateTarget).off(
              i.namespace ? `${i.origType}.${i.namespace}` : i.origType,
              i.selector,
              i.handler,
            ),
            this
          );
        if ('object' === typeof t) {
          for (o in t) this.off(o, e, t[o]);
          return this;
        }
        return (
          (e === !1 || 'function' === typeof e) && ((n = e), (e = void 0)),
          n === !1 && (n = c),
          this.each(function () {
            K.event.remove(this, t, n, e);
          })
        );
      },
      trigger(t, e) {
        return this.each(function () {
          K.event.trigger(t, e, this);
        });
      },
      triggerHandler(t, e) {
        const n = this[0];
        return n ? K.event.trigger(t, e, n, !0) : void 0;
      },
    });
  var Fe =
      /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
    Re = /<([\w:]+)/,
    Ne = /<|&#?\w+;/,
    De = /<(?:script|style|link)/i,
    Me = /checked\s*(?:[^=]|=\s*.checked.)/i,
    We = /^$|\/(?:java|ecma)script/i,
    Oe = /^true\/(.*)/,
    je = /^\s*<!(?:\[CDATA\[|--)|(?:]]|--)>\s*$/g,
    He = {
      option: [1, "<select multiple='multiple'>", '</select>'],
      thead: [1, '<table>', '</table>'],
      col: [2, '<table><colgroup>', '</colgroup></table>'],
      tr: [2, '<table><tbody>', '</tbody></table>'],
      td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
      _default: [0, '', ''],
    };
  (He.optgroup = He.option),
    (He.tbody = He.tfoot = He.colgroup = He.caption = He.thead),
    (He.th = He.td),
    K.extend({
      clone(t, e, n) {
        let i,
          o,
          s,
          r,
          a = t.cloneNode(!0),
          l = K.contains(t.ownerDocument, t);
        if (
          !(
            Q.noCloneChecked ||
            (1 !== t.nodeType && 11 !== t.nodeType) ||
            K.isXMLDoc(t)
          )
        )
          for (r = v(a), s = v(t), i = 0, o = s.length; o > i; i++)
            y(s[i], r[i]);
        if (e)
          if (n)
            for (s = s || v(t), r = r || v(a), i = 0, o = s.length; o > i; i++)
              m(s[i], r[i]);
          else m(t, a);
        return (
          (r = v(a, 'script')), r.length > 0 && g(r, !l && v(t, 'script')), a
        );
      },
      buildFragment(t, e, n, i) {
        for (
          var o,
            s,
            r,
            a,
            l,
            h,
            c = e.createDocumentFragment(),
            u = [],
            d = 0,
            p = t.length;
          p > d;
          d++
        )
          if (((o = t[d]), o || 0 === o))
            if ('object' === K.type(o)) K.merge(u, o.nodeType ? [o] : o);
            else if (Ne.test(o)) {
              for (
                s = s || c.appendChild(e.createElement('div')),
                  r = (Re.exec(o) || ['', ''])[1].toLowerCase(),
                  a = He[r] || He._default,
                  s.innerHTML = a[1] + o.replace(Fe, '<$1></$2>') + a[2],
                  h = a[0];
                h--;

              )
                s = s.lastChild;
              K.merge(u, s.childNodes),
                (s = c.firstChild),
                (s.textContent = '');
            } else u.push(e.createTextNode(o));
        for (c.textContent = '', d = 0; (o = u[d++]); )
          if (
            (!i || -1 === K.inArray(o, i)) &&
            ((l = K.contains(o.ownerDocument, o)),
            (s = v(c.appendChild(o), 'script')),
            l && g(s),
            n)
          )
            for (h = 0; (o = s[h++]); ) We.test(o.type || '') && n.push(o);
        return c;
      },
      cleanData(t) {
        for (
          var e, n, i, o, s = K.event.special, r = 0;
          void 0 !== (n = t[r]);
          r++
        ) {
          if (
            K.acceptData(n) &&
            ((o = n[ve.expando]), o && (e = ve.cache[o]))
          ) {
            if (e.events)
              for (i in e.events)
                s[i] ? K.event.remove(n, i) : K.removeEvent(n, i, e.handle);
            ve.cache[o] && delete ve.cache[o];
          }
          delete ye.cache[n[ye.expando]];
        }
      },
    }),
    K.fn.extend({
      text(t) {
        return me(
          this,
          function (t) {
            return void 0 === t
              ? K.text(this)
              : this.empty().each(function () {
                  (1 === this.nodeType ||
                    11 === this.nodeType ||
                    9 === this.nodeType) &&
                    (this.textContent = t);
                });
          },
          null,
          t,
          arguments.length,
        );
      },
      append() {
        return this.domManip(arguments, function (t) {
          if (
            1 === this.nodeType ||
            11 === this.nodeType ||
            9 === this.nodeType
          ) {
            const e = d(this, t);
            e.append(t);
          }
        });
      },
      prepend() {
        return this.domManip(arguments, function (t) {
          if (
            1 === this.nodeType ||
            11 === this.nodeType ||
            9 === this.nodeType
          ) {
            const e = d(this, t);
            e.insertBefore(t, e.firstChild);
          }
        });
      },
      before() {
        return this.domManip(arguments, function (t) {
          this.parentNode && this.parentNode.insertBefore(t, this);
        });
      },
      after() {
        return this.domManip(arguments, function (t) {
          this.parentNode && this.parentNode.insertBefore(t, this.nextSibling);
        });
      },
      remove(t, e) {
        for (
          var n, i = t ? K.filter(t, this) : this, o = 0;
          null != (n = i[o]);
          o++
        )
          e || 1 !== n.nodeType || K.cleanData(v(n)),
            n.parentNode &&
              (e && K.contains(n.ownerDocument, n) && g(v(n, 'script')),
              n.parentNode.removeChild(n));
        return this;
      },
      empty() {
        for (var t, e = 0; null != (t = this[e]); e++)
          1 === t.nodeType && (K.cleanData(v(t, !1)), (t.textContent = ''));
        return this;
      },
      clone(t, e) {
        return (
          (t = null == t ? !1 : t),
          (e = null == e ? t : e),
          this.map(function () {
            return K.clone(this, t, e);
          })
        );
      },
      html(t) {
        return me(
          this,
          function (t) {
            let e = this[0] || {},
              n = 0,
              i = this.length;
            if (void 0 === t && 1 === e.nodeType) return e.innerHTML;
            if (
              'string' === typeof t &&
              !De.test(t) &&
              !He[(Re.exec(t) || ['', ''])[1].toLowerCase()]
            ) {
              t = t.replace(Fe, '<$1></$2>');
              try {
                for (; i > n; n++)
                  (e = this[n] || {}),
                    1 === e.nodeType &&
                      (K.cleanData(v(e, !1)), (e.innerHTML = t));
                e = 0;
              } catch {}
            }
            e && this.empty().append(t);
          },
          null,
          t,
          arguments.length,
        );
      },
      replaceWith() {
        let t = arguments[0];
        return (
          this.domManip(arguments, function (e) {
            (t = this.parentNode),
              K.cleanData(v(this)),
              t && t.replaceChild(e, this);
          }),
          t && (t.length > 0 || t.nodeType) ? this : this.remove()
        );
      },
      detach(t) {
        return this.remove(t, !0);
      },
      domManip(t, e) {
        t = _.apply([], t);
        let n,
          i,
          o,
          s,
          r,
          a,
          l = 0,
          h = this.length,
          c = this,
          u = h - 1,
          d = t[0],
          g = K.isFunction(d);
        if (
          g ||
          (h > 1 && 'string' === typeof d && !Q.checkClone && Me.test(d))
        )
          return this.each(function (n) {
            const i = c.eq(n);
            g && (t[0] = d.call(this, n, i.html())), i.domManip(t, e);
          });
        if (
          h &&
          ((n = K.buildFragment(t, this[0].ownerDocument, !1, this)),
          (i = n.firstChild),
          1 === n.childNodes.length && (n = i),
          i)
        ) {
          for (o = K.map(v(n, 'script'), p), s = o.length; h > l; l++)
            (r = n),
              l !== u &&
                ((r = K.clone(r, !0, !0)), s && K.merge(o, v(r, 'script'))),
              e.call(this[l], r, l);
          if (s)
            for (
              a = o[o.length - 1].ownerDocument, K.map(o, f), l = 0;
              s > l;
              l++
            )
              (r = o[l]),
                We.test(r.type || '') &&
                  !ve.access(r, 'globalEval') &&
                  K.contains(a, r) &&
                  (r.src
                    ? K._evalUrl && K._evalUrl(r.src)
                    : K.globalEval(r.textContent.replace(je, '')));
        }
        return this;
      },
    }),
    K.each(
      {
        appendTo: 'append',
        prependTo: 'prepend',
        insertBefore: 'before',
        insertAfter: 'after',
        replaceAll: 'replaceWith',
      },
      (t, e) => {
        K.fn[t] = function (t) {
          for (var n, i = [], o = K(t), s = o.length - 1, r = 0; s >= r; r++)
            (n = r === s ? this : this.clone(!0)),
              K(o[r])[e](n),
              X.apply(i, n.get());
          return this.pushStack(i);
        };
      },
    );
  var ze,
    Ie = {},
    qe = /^margin/,
    Be = new RegExp(`^(${we})(?!px)[a-z%]+$`, 'i'),
    $e = function (e) {
      return e.ownerDocument.defaultView.opener
        ? e.ownerDocument.defaultView.getComputedStyle(e, null)
        : t.getComputedStyle(e, null);
    };
  !(function () {
    function e() {
      (r.style.cssText =
        '-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute'),
        (r.innerHTML = ''),
        o.appendChild(s);
      const e = t.getComputedStyle(r, null);
      (n = '1%' !== e.top), (i = '4px' === e.width), o.removeChild(s);
    }
    var n,
      i,
      o = Z.documentElement,
      s = Z.createElement('div'),
      r = Z.createElement('div');
    r.style &&
      ((r.style.backgroundClip = 'content-box'),
      (r.cloneNode(!0).style.backgroundClip = ''),
      (Q.clearCloneStyle = 'content-box' === r.style.backgroundClip),
      (s.style.cssText =
        'border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;position:absolute'),
      s.appendChild(r),
      t.getComputedStyle &&
        K.extend(Q, {
          pixelPosition() {
            return e(), n;
          },
          boxSizingReliable() {
            return null == i && e(), i;
          },
          reliableMarginRight() {
            let e,
              n = r.appendChild(Z.createElement('div'));
            return (
              (n.style.cssText = r.style.cssText =
                '-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0'),
              (n.style.marginRight = n.style.width = '0'),
              (r.style.width = '1px'),
              o.appendChild(s),
              (e = !Number.parseFloat(t.getComputedStyle(n, null).marginRight)),
              o.removeChild(s),
              r.removeChild(n),
              e
            );
          },
        }));
  })(),
    (K.swap = function (t, e, n, i) {
      let o,
        s,
        r = {};
      for (s in e) (r[s] = t.style[s]), (t.style[s] = e[s]);
      o = n.apply(t, i || []);
      for (s in e) t.style[s] = r[s];
      return o;
    });
  var _e = /^(none|table(?!-c[ae]).+)/,
    Xe = new RegExp(`^(${we})(.*)$`, 'i'),
    Ve = new RegExp(`^([+-])=(${we})`, 'i'),
    Ye = { position: 'absolute', visibility: 'hidden', display: 'block' },
    Ge = { letterSpacing: '0', fontWeight: '400' },
    Ue = ['Webkit', 'O', 'Moz', 'ms'];
  K.extend({
    cssHooks: {
      opacity: {
        get(t, e) {
          if (e) {
            const n = w(t, 'opacity');
            return '' === n ? '1' : n;
          }
        },
      },
    },
    cssNumber: {
      columnCount: !0,
      fillOpacity: !0,
      flexGrow: !0,
      flexShrink: !0,
      fontWeight: !0,
      lineHeight: !0,
      opacity: !0,
      order: !0,
      orphans: !0,
      widows: !0,
      zIndex: !0,
      zoom: !0,
    },
    cssProps: { float: 'cssFloat' },
    style(t, e, n, i) {
      if (t && 3 !== t.nodeType && 8 !== t.nodeType && t.style) {
        let o,
          s,
          r,
          a = K.camelCase(e),
          l = t.style;
        return (
          (e = K.cssProps[a] || (K.cssProps[a] = S(l, a))),
          (r = K.cssHooks[e] || K.cssHooks[a]),
          void 0 === n
            ? r && 'get' in r && void 0 !== (o = r.get(t, !1, i))
              ? o
              : l[e]
            : ((s = typeof n),
              'string' === s &&
                (o = Ve.exec(n)) &&
                ((n = (o[1] + 1) * o[2] + Number.parseFloat(K.css(t, e))),
                (s = 'number')),
              null != n &&
                n === n &&
                ('number' !== s || K.cssNumber[a] || (n += 'px'),
                Q.clearCloneStyle ||
                  '' !== n ||
                  0 !== e.indexOf('background') ||
                  (l[e] = 'inherit'),
                (r && 'set' in r && void 0 === (n = r.set(t, n, i))) ||
                  (l[e] = n)),
              void 0)
        );
      }
    },
    css(t, e, n, i) {
      let o,
        s,
        r,
        a = K.camelCase(e);
      return (
        (e = K.cssProps[a] || (K.cssProps[a] = S(t.style, a))),
        (r = K.cssHooks[e] || K.cssHooks[a]),
        r && 'get' in r && (o = r.get(t, !0, n)),
        void 0 === o && (o = w(t, e, i)),
        'normal' === o && e in Ge && (o = Ge[e]),
        '' === n || n
          ? ((s = Number.parseFloat(o)),
            n === !0 || K.isNumeric(s) ? s || 0 : o)
          : o
      );
    },
  }),
    K.each(['height', 'width'], (t, e) => {
      K.cssHooks[e] = {
        get(t, n, i) {
          return n
            ? _e.test(K.css(t, 'display')) && 0 === t.offsetWidth
              ? K.swap(t, Ye, () => {
                  return P(t, e, i);
                })
              : P(t, e, i)
            : void 0;
        },
        set(t, n, i) {
          const o = i && $e(t);
          return T(
            t,
            n,
            i
              ? k(t, e, i, 'border-box' === K.css(t, 'boxSizing', !1, o), o)
              : 0,
          );
        },
      };
    }),
    (K.cssHooks.marginRight = C(Q.reliableMarginRight, (t, e) => {
      return e
        ? K.swap(t, { display: 'inline-block' }, w, [t, 'marginRight'])
        : void 0;
    })),
    K.each({ margin: '', padding: '', border: 'Width' }, (t, e) => {
      (K.cssHooks[t + e] = {
        expand(n) {
          for (
            var i = 0, o = {}, s = 'string' === typeof n ? n.split(' ') : [n];
            4 > i;
            i++
          )
            o[t + Ce[i] + e] = s[i] || s[i - 2] || s[0];
          return o;
        },
      }),
        qe.test(t) || (K.cssHooks[t + e].set = T);
    }),
    K.fn.extend({
      css(t, e) {
        return me(
          this,
          (t, e, n) => {
            let i,
              o,
              s = {},
              r = 0;
            if (K.isArray(e)) {
              for (i = $e(t), o = e.length; o > r; r++)
                s[e[r]] = K.css(t, e[r], !1, i);
              return s;
            }
            return void 0 !== n ? K.style(t, e, n) : K.css(t, e);
          },
          t,
          e,
          arguments.length > 1,
        );
      },
      show() {
        return L(this, !0);
      },
      hide() {
        return L(this);
      },
      toggle(t) {
        return 'boolean' === typeof t
          ? t
            ? this.show()
            : this.hide()
          : this.each(function () {
              Se(this) ? K(this).show() : K(this).hide();
            });
      },
    }),
    (K.Tween = A),
    (A.prototype = {
      constructor: A,
      init(t, e, n, i, o, s) {
        (this.elem = t),
          (this.prop = n),
          (this.easing = o || 'swing'),
          (this.options = e),
          (this.start = this.now = this.cur()),
          (this.end = i),
          (this.unit = s || (K.cssNumber[n] ? '' : 'px'));
      },
      cur() {
        const t = A.propHooks[this.prop];
        return t && t.get ? t.get(this) : A.propHooks._default.get(this);
      },
      run(t) {
        let e,
          n = A.propHooks[this.prop];
        return (
          (this.pos = e =
            this.options.duration
              ? K.easing[this.easing](
                  t,
                  this.options.duration * t,
                  0,
                  1,
                  this.options.duration,
                )
              : t),
          (this.now = (this.end - this.start) * e + this.start),
          this.options.step &&
            this.options.step.call(this.elem, this.now, this),
          n && n.set ? n.set(this) : A.propHooks._default.set(this),
          this
        );
      },
    }),
    (A.prototype.init.prototype = A.prototype),
    (A.propHooks = {
      _default: {
        get(t) {
          let e;
          return null == t.elem[t.prop] ||
            (t.elem.style && null != t.elem.style[t.prop])
            ? ((e = K.css(t.elem, t.prop, '')), e && 'auto' !== e ? e : 0)
            : t.elem[t.prop];
        },
        set(t) {
          K.fx.step[t.prop]
            ? K.fx.step[t.prop](t)
            : t.elem.style &&
              (null != t.elem.style[K.cssProps[t.prop]] || K.cssHooks[t.prop])
            ? K.style(t.elem, t.prop, t.now + t.unit)
            : (t.elem[t.prop] = t.now);
        },
      },
    }),
    (A.propHooks.scrollTop = A.propHooks.scrollLeft =
      {
        set(t) {
          t.elem.nodeType && t.elem.parentNode && (t.elem[t.prop] = t.now);
        },
      }),
    (K.easing = {
      linear(t) {
        return t;
      },
      swing(t) {
        return 0.5 - Math.cos(t * Math.PI) / 2;
      },
    }),
    (K.fx = A.prototype.init),
    (K.fx.step = {});
  var Qe,
    Ze,
    Je = /^(?:toggle|show|hide)$/,
    Ke = new RegExp(`^(?:([+-])=|)(${we})([a-z%]*)$`, 'i'),
    tn = /queueHooks$/,
    en = [N],
    nn = {
      '*': [
        function (t, e) {
          let n = this.createTween(t, e),
            i = n.cur(),
            o = Ke.exec(e),
            s = (o && o[3]) || (K.cssNumber[t] ? '' : 'px'),
            r =
              (K.cssNumber[t] || ('px' !== s && +i)) &&
              Ke.exec(K.css(n.elem, t)),
            a = 1,
            l = 20;
          if (r && r[3] !== s) {
            (s = s || r[3]), (o = o || []), (r = +i || 1);
            do (a = a || '.5'), (r /= a), K.style(n.elem, t, r + s);
            while (a !== (a = n.cur() / i) && 1 !== a && --l);
          }
          return (
            o &&
              ((r = n.start = +r || +i || 0),
              (n.unit = s),
              (n.end = o[1] ? r + (o[1] + 1) * o[2] : +o[2])),
            n
          );
        },
      ],
    };
  (K.Animation = K.extend(M, {
    tweener(t, e) {
      K.isFunction(t) ? ((e = t), (t = ['*'])) : (t = t.split(' '));
      for (var n, i = 0, o = t.length; o > i; i++)
        (n = t[i]), (nn[n] = nn[n] || []), nn[n].unshift(e);
    },
    prefilter(t, e) {
      e ? en.unshift(t) : en.push(t);
    },
  })),
    (K.speed = function (t, e, n) {
      const i =
        t && 'object' === typeof t
          ? K.extend({}, t)
          : {
              complete: n || (!n && e) || (K.isFunction(t) && t),
              duration: t,
              easing: (n && e) || (e && !K.isFunction(e) && e),
            };
      return (
        (i.duration = K.fx.off
          ? 0
          : 'number' === typeof i.duration
          ? i.duration
          : i.duration in K.fx.speeds
          ? K.fx.speeds[i.duration]
          : K.fx.speeds._default),
        (null == i.queue || i.queue === !0) && (i.queue = 'fx'),
        (i.old = i.complete),
        (i.complete = function () {
          K.isFunction(i.old) && i.old.call(this),
            i.queue && K.dequeue(this, i.queue);
        }),
        i
      );
    }),
    K.fn.extend({
      fadeTo(t, e, n, i) {
        return this.filter(Se)
          .css('opacity', 0)
          .show()
          .end()
          .animate({ opacity: e }, t, n, i);
      },
      animate(t, e, n, i) {
        const o = K.isEmptyObject(t),
          s = K.speed(e, n, i),
          r = function () {
            const e = M(this, K.extend({}, t), s);
            (o || ve.get(this, 'finish')) && e.stop(!0);
          };
        return (
          (r.finish = r),
          o || s.queue === !1 ? this.each(r) : this.queue(s.queue, r)
        );
      },
      stop(t, e, n) {
        const i = function (t) {
          const e = t.stop;
          delete t.stop, e(n);
        };
        return (
          'string' !== typeof t && ((n = e), (e = t), (t = void 0)),
          e && t !== !1 && this.queue(t || 'fx', []),
          this.each(function () {
            let e = !0,
              o = null != t && `${t}queueHooks`,
              s = K.timers,
              r = ve.get(this);
            if (o) r[o] && r[o].stop && i(r[o]);
            else for (o in r) r[o] && r[o].stop && tn.test(o) && i(r[o]);
            for (o = s.length; o--; )
              s[o].elem !== this ||
                (null != t && s[o].queue !== t) ||
                (s[o].anim.stop(n), (e = !1), s.splice(o, 1));
            (e || !n) && K.dequeue(this, t);
          })
        );
      },
      finish(t) {
        return (
          t !== !1 && (t = t || 'fx'),
          this.each(function () {
            let e,
              n = ve.get(this),
              i = n[`${t}queue`],
              o = n[`${t}queueHooks`],
              s = K.timers,
              r = i ? i.length : 0;
            for (
              n.finish = !0,
                K.queue(this, t, []),
                o && o.stop && o.stop.call(this, !0),
                e = s.length;
              e--;

            )
              s[e].elem === this &&
                s[e].queue === t &&
                (s[e].anim.stop(!0), s.splice(e, 1));
            for (e = 0; r > e; e++)
              i[e] && i[e].finish && i[e].finish.call(this);
            delete n.finish;
          })
        );
      },
    }),
    K.each(['toggle', 'show', 'hide'], (t, e) => {
      const n = K.fn[e];
      K.fn[e] = function (t, i, o) {
        return null == t || 'boolean' === typeof t
          ? Reflect.apply(n, this, arguments)
          : this.animate(F(e, !0), t, i, o);
      };
    }),
    K.each(
      {
        slideDown: F('show'),
        slideUp: F('hide'),
        slideToggle: F('toggle'),
        fadeIn: { opacity: 'show' },
        fadeOut: { opacity: 'hide' },
        fadeToggle: { opacity: 'toggle' },
      },
      (t, e) => {
        K.fn[t] = function (t, n, i) {
          return this.animate(e, t, n, i);
        };
      },
    ),
    (K.timers = []),
    (K.fx.tick = function () {
      let t,
        e = 0,
        n = K.timers;
      for (Qe = K.now(); e < n.length; e++)
        (t = n[e]), t() || n[e] !== t || n.splice(e--, 1);
      n.length || K.fx.stop(), (Qe = void 0);
    }),
    (K.fx.timer = function (t) {
      K.timers.push(t), t() ? K.fx.start() : K.timers.pop();
    }),
    (K.fx.interval = 13),
    (K.fx.start = function () {
      Ze || (Ze = setInterval(K.fx.tick, K.fx.interval));
    }),
    (K.fx.stop = function () {
      clearInterval(Ze), (Ze = null);
    }),
    (K.fx.speeds = { slow: 600, fast: 200, _default: 400 }),
    (K.fn.delay = function (t, e) {
      return (
        (t = K.fx ? K.fx.speeds[t] || t : t),
        (e = e || 'fx'),
        this.queue(e, (e, n) => {
          const i = setTimeout(e, t);
          n.stop = function () {
            clearTimeout(i);
          };
        })
      );
    }),
    (function () {
      let t = Z.createElement('input'),
        e = Z.createElement('select'),
        n = e.appendChild(Z.createElement('option'));
      (t.type = 'checkbox'),
        (Q.checkOn = '' !== t.value),
        (Q.optSelected = n.selected),
        (e.disabled = !0),
        (Q.optDisabled = !n.disabled),
        (t = Z.createElement('input')),
        (t.value = 't'),
        (t.type = 'radio'),
        (Q.radioValue = 't' === t.value);
    })();
  let on,
    sn,
    rn = K.expr.attrHandle;
  K.fn.extend({
    attr(t, e) {
      return me(this, K.attr, t, e, arguments.length > 1);
    },
    removeAttr(t) {
      return this.each(function () {
        K.removeAttr(this, t);
      });
    },
  }),
    K.extend({
      attr(t, e, n) {
        let i,
          o,
          s = t.nodeType;
        if (t && 3 !== s && 8 !== s && 2 !== s)
          return typeof t.getAttribute === ke
            ? K.prop(t, e, n)
            : ((1 === s && K.isXMLDoc(t)) ||
                ((e = e.toLowerCase()),
                (i = K.attrHooks[e] || (K.expr.match.bool.test(e) ? sn : on))),
              void 0 === n
                ? i && 'get' in i && null !== (o = i.get(t, e))
                  ? o
                  : ((o = K.find.attr(t, e)), null == o ? void 0 : o)
                : null !== n
                ? i && 'set' in i && void 0 !== (o = i.set(t, n, e))
                  ? o
                  : (t.setAttribute(e, `${n}`), n)
                : void K.removeAttr(t, e));
      },
      removeAttr(t, e) {
        let n,
          i,
          o = 0,
          s = e && e.match(pe);
        if (s && 1 === t.nodeType)
          for (; (n = s[o++]); )
            (i = K.propFix[n] || n),
              K.expr.match.bool.test(n) && (t[i] = !1),
              t.removeAttribute(n);
      },
      attrHooks: {
        type: {
          set(t, e) {
            if (!Q.radioValue && 'radio' === e && K.nodeName(t, 'input')) {
              const n = t.value;
              return t.setAttribute('type', e), n && (t.value = n), e;
            }
          },
        },
      },
    }),
    (sn = {
      set(t, e, n) {
        return e === !1 ? K.removeAttr(t, n) : t.setAttribute(n, n), n;
      },
    }),
    K.each(K.expr.match.bool.source.match(/\w+/g), (t, e) => {
      const n = rn[e] || K.find.attr;
      rn[e] = function (t, e, i) {
        let o, s;
        return (
          i ||
            ((s = rn[e]),
            (rn[e] = o),
            (o = null != n(t, e, i) ? e.toLowerCase() : null),
            (rn[e] = s)),
          o
        );
      };
    });
  const an = /^(?:input|select|textarea|button)$/i;
  K.fn.extend({
    prop(t, e) {
      return me(this, K.prop, t, e, arguments.length > 1);
    },
    removeProp(t) {
      return this.each(function () {
        delete this[K.propFix[t] || t];
      });
    },
  }),
    K.extend({
      propFix: { for: 'htmlFor', class: 'className' },
      prop(t, e, n) {
        let i,
          o,
          s,
          r = t.nodeType;
        if (t && 3 !== r && 8 !== r && 2 !== r)
          return (
            (s = 1 !== r || !K.isXMLDoc(t)),
            s && ((e = K.propFix[e] || e), (o = K.propHooks[e])),
            void 0 !== n
              ? o && 'set' in o && void 0 !== (i = o.set(t, n, e))
                ? i
                : (t[e] = n)
              : o && 'get' in o && null !== (i = o.get(t, e))
              ? i
              : t[e]
          );
      },
      propHooks: {
        tabIndex: {
          get(t) {
            return t.hasAttribute('tabindex') || an.test(t.nodeName) || t.href
              ? t.tabIndex
              : -1;
          },
        },
      },
    }),
    Q.optSelected ||
      (K.propHooks.selected = {
        get(t) {
          const e = t.parentNode;
          return e && e.parentNode && e.parentNode.selectedIndex, null;
        },
      }),
    K.each(
      [
        'tabIndex',
        'readOnly',
        'maxLength',
        'cellSpacing',
        'cellPadding',
        'rowSpan',
        'colSpan',
        'useMap',
        'frameBorder',
        'contentEditable',
      ],
      function () {
        K.propFix[this.toLowerCase()] = this;
      },
    );
  const ln = /[\t\n\f\r]/g;
  K.fn.extend({
    addClass(t) {
      let e,
        n,
        i,
        o,
        s,
        r,
        a = 'string' === typeof t && t,
        l = 0,
        h = this.length;
      if (K.isFunction(t))
        return this.each(function (e) {
          K(this).addClass(t.call(this, e, this.className));
        });
      if (a)
        for (e = (t || '').match(pe) || []; h > l; l++)
          if (
            ((n = this[l]),
            (i =
              1 === n.nodeType &&
              (n.className ? ` ${n.className} `.replace(ln, ' ') : ' ')))
          ) {
            for (s = 0; (o = e[s++]); ) !i.includes(` ${o} `) && (i += `${o} `);
            (r = K.trim(i)), n.className !== r && (n.className = r);
          }
      return this;
    },
    removeClass(t) {
      let e,
        n,
        i,
        o,
        s,
        r,
        a = arguments.length === 0 || ('string' === typeof t && t),
        l = 0,
        h = this.length;
      if (K.isFunction(t))
        return this.each(function (e) {
          K(this).removeClass(t.call(this, e, this.className));
        });
      if (a)
        for (e = (t || '').match(pe) || []; h > l; l++)
          if (
            ((n = this[l]),
            (i =
              1 === n.nodeType &&
              (n.className ? ` ${n.className} `.replace(ln, ' ') : '')))
          ) {
            for (s = 0; (o = e[s++]); )
              for (; i.includes(` ${o} `); ) i = i.replace(` ${o} `, ' ');
            (r = t ? K.trim(i) : ''), n.className !== r && (n.className = r);
          }
      return this;
    },
    toggleClass(t, e) {
      const n = typeof t;
      return 'boolean' === typeof e && 'string' === n
        ? e
          ? this.addClass(t)
          : this.removeClass(t)
        : this.each(
            K.isFunction(t)
              ? function (n) {
                  K(this).toggleClass(t.call(this, n, this.className, e), e);
                }
              : function () {
                  if ('string' === n)
                    for (
                      var e, i = 0, o = K(this), s = t.match(pe) || [];
                      (e = s[i++]);

                    )
                      o.hasClass(e) ? o.removeClass(e) : o.addClass(e);
                  else
                    (n === ke || 'boolean' === n) &&
                      (this.className &&
                        ve.set(this, '__className__', this.className),
                      (this.className =
                        this.className || t === !1
                          ? ''
                          : ve.get(this, '__className__') || ''));
                },
          );
    },
    hasClass(t) {
      for (let e = ` ${t} `, n = 0, i = this.length; i > n; n++)
        if (
          1 === this[n].nodeType &&
          ` ${this[n].className} `.replace(ln, ' ').includes(e)
        )
          return !0;
      return !1;
    },
  });
  const hn = /\r/g;
  K.fn.extend({
    val(t) {
      let e,
        n,
        i,
        o = this[0];
      {
        if (arguments.length > 0)
          return (
            (i = K.isFunction(t)),
            this.each(function (n) {
              let o;
              1 === this.nodeType &&
                ((o = i ? t.call(this, n, K(this).val()) : t),
                null == o
                  ? (o = '')
                  : 'number' === typeof o
                  ? (o += '')
                  : K.isArray(o) &&
                    (o = K.map(o, t => {
                      return null == t ? '' : `${t}`;
                    })),
                (e =
                  K.valHooks[this.type] ||
                  K.valHooks[this.nodeName.toLowerCase()]),
                (e && 'set' in e && void 0 !== e.set(this, o, 'value')) ||
                  (this.value = o));
            })
          );
        if (o)
          return (
            (e = K.valHooks[o.type] || K.valHooks[o.nodeName.toLowerCase()]),
            e && 'get' in e && void 0 !== (n = e.get(o, 'value'))
              ? n
              : ((n = o.value),
                'string' === typeof n ? n.replace(hn, '') : null == n ? '' : n)
          );
      }
    },
  }),
    K.extend({
      valHooks: {
        option: {
          get(t) {
            const e = K.find.attr(t, 'value');
            return null != e ? e : K.trim(K.text(t));
          },
        },
        select: {
          get(t) {
            for (
              var e,
                n,
                i = t.options,
                o = t.selectedIndex,
                s = 'select-one' === t.type || 0 > o,
                r = s ? null : [],
                a = s ? o + 1 : i.length,
                l = 0 > o ? a : s ? o : 0;
              a > l;
              l++
            )
              if (
                ((n = i[l]),
                !(
                  (!n.selected && l !== o) ||
                  (Q.optDisabled
                    ? n.disabled
                    : null !== n.getAttribute('disabled')) ||
                  (n.parentNode.disabled &&
                    K.nodeName(n.parentNode, 'optgroup'))
                ))
              ) {
                if (((e = K(n).val()), s)) return e;
                r.push(e);
              }
            return r;
          },
          set(t, e) {
            for (
              var n, i, o = t.options, s = K.makeArray(e), r = o.length;
              r--;

            )
              (i = o[r]), (i.selected = K.inArray(i.value, s) >= 0) && (n = !0);
            return n || (t.selectedIndex = -1), s;
          },
        },
      },
    }),
    K.each(['radio', 'checkbox'], function () {
      (K.valHooks[this] = {
        set(t, e) {
          return K.isArray(e)
            ? (t.checked = K.inArray(K(t).val(), e) >= 0)
            : void 0;
        },
      }),
        Q.checkOn ||
          (K.valHooks[this].get = function (t) {
            return null === t.getAttribute('value') ? 'on' : t.value;
          });
    }),
    K.each(
      'blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu'.split(
        ' ',
      ),
      (t, e) => {
        K.fn[e] = function (t, n) {
          return arguments.length > 0
            ? this.on(e, null, t, n)
            : this.trigger(e);
        };
      },
    ),
    K.fn.extend({
      hover(t, e) {
        return this.mouseenter(t).mouseleave(e || t);
      },
      bind(t, e, n) {
        return this.on(t, null, e, n);
      },
      unbind(t, e) {
        return this.off(t, null, e);
      },
      delegate(t, e, n, i) {
        return this.on(e, t, n, i);
      },
      undelegate(t, e, n) {
        return 1 === arguments.length
          ? this.off(t, '**')
          : this.off(e, t || '**', n);
      },
    });
  let cn = K.now(),
    un = /\?/;
  (K.parseJSON = function (t) {
    return JSON.parse(`${t}`);
  }),
    (K.parseXML = function (t) {
      let e, n;
      if (!t || 'string' !== typeof t) return null;
      try {
        (n = new DOMParser()), (e = n.parseFromString(t, 'text/xml'));
      } catch {
        e = void 0;
      }
      return (
        (!e || e.querySelectorAll('parsererror').length) &&
          K.error(`Invalid XML: ${t}`),
        e
      );
    });
  var dn = /#.*$/,
    pn = /([&?])_=[^&]*/,
    fn = /^(.*?):[\t ]*([^\n\r]*)$/gm,
    gn = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
    mn = /^(?:GET|HEAD)$/,
    vn = /^\/\//,
    yn = /^([\w+.-]+:)(?:\/\/(?:[^#/?]*@|)([^#/:?]*)(?::(\d+)|)|)/,
    xn = {},
    bn = {},
    wn = '*/'.concat('*'),
    Cn = t.location.href,
    Sn = yn.exec(Cn.toLowerCase()) || [];
  K.extend({
    active: 0,
    lastModified: {},
    etag: {},
    ajaxSettings: {
      url: Cn,
      type: 'GET',
      isLocal: gn.test(Sn[1]),
      global: !0,
      processData: !0,
      async: !0,
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      accepts: {
        '*': wn,
        text: 'text/plain',
        html: 'text/html',
        xml: 'application/xml, text/xml',
        json: 'application/json, text/javascript',
      },
      contents: { xml: /xml/, html: /html/, json: /json/ },
      responseFields: {
        xml: 'responseXML',
        text: 'responseText',
        json: 'responseJSON',
      },
      converters: {
        '* text': String,
        'text html': !0,
        'text json': K.parseJSON,
        'text xml': K.parseXML,
      },
      flatOptions: { url: !0, context: !0 },
    },
    ajaxSetup(t, e) {
      return e ? j(j(t, K.ajaxSettings), e) : j(K.ajaxSettings, t);
    },
    ajaxPrefilter: W(xn),
    ajaxTransport: W(bn),
    ajax(t, e) {
      function n(t, e, n, r) {
        let l,
          c,
          v,
          y,
          b,
          C = e;
        2 !== x &&
          ((x = 2),
          a && clearTimeout(a),
          (i = void 0),
          (s = r || ''),
          (w.readyState = t > 0 ? 4 : 0),
          (l = (t >= 200 && 300 > t) || 304 === t),
          n && (y = H(u, w, n)),
          (y = z(u, y, w, l)),
          l
            ? (u.ifModified &&
                ((b = w.getResponseHeader('Last-Modified')),
                b && (K.lastModified[o] = b),
                (b = w.getResponseHeader('etag')),
                b && (K.etag[o] = b)),
              204 === t || 'HEAD' === u.type
                ? (C = 'nocontent')
                : 304 === t
                ? (C = 'notmodified')
                : ((C = y.state), (c = y.data), (v = y.error), (l = !v)))
            : ((v = C), (t || !C) && ((C = 'error'), 0 > t && (t = 0))),
          (w.status = t),
          (w.statusText = `${e || C}`),
          l ? f.resolveWith(d, [c, C, w]) : f.rejectWith(d, [w, C, v]),
          w.statusCode(m),
          (m = void 0),
          h && p.trigger(l ? 'ajaxSuccess' : 'ajaxError', [w, u, l ? c : v]),
          g.fireWith(d, [w, C]),
          h &&
            (p.trigger('ajaxComplete', [w, u]),
            --K.active || K.event.trigger('ajaxStop')));
      }
      'object' === typeof t && ((e = t), (t = void 0)), (e = e || {});
      var i,
        o,
        s,
        r,
        a,
        l,
        h,
        c,
        u = K.ajaxSetup({}, e),
        d = u.context || u,
        p = u.context && (d.nodeType || d.jquery) ? K(d) : K.event,
        f = K.Deferred(),
        g = K.Callbacks('once memory'),
        m = u.statusCode || {},
        v = {},
        y = {},
        x = 0,
        b = 'canceled',
        w = {
          readyState: 0,
          getResponseHeader(t) {
            let e;
            if (2 === x) {
              if (!r)
                for (r = {}; (e = fn.exec(s)); ) r[e[1].toLowerCase()] = e[2];
              e = r[t.toLowerCase()];
            }
            return null == e ? null : e;
          },
          getAllResponseHeaders() {
            return 2 === x ? s : null;
          },
          setRequestHeader(t, e) {
            const n = t.toLowerCase();
            return x || ((t = y[n] = y[n] || t), (v[t] = e)), this;
          },
          overrideMimeType(t) {
            return x || (u.mimeType = t), this;
          },
          statusCode(t) {
            let e;
            if (t)
              if (2 > x) for (e in t) m[e] = [m[e], t[e]];
              else w.always(t[w.status]);
            return this;
          },
          abort(t) {
            const e = t || b;
            return i && i.abort(e), n(0, e), this;
          },
        };
      if (
        ((f.promise(w).complete = g.add),
        (w.success = w.done),
        (w.error = w.fail),
        (u.url = `${t || u.url || Cn}`
          .replace(dn, '')
          .replace(vn, `${Sn[1]}//`)),
        (u.type = e.method || e.type || u.method || u.type),
        (u.dataTypes = K.trim(u.dataType || '*')
          .toLowerCase()
          .match(pe) || ['']),
        null == u.crossDomain &&
          ((l = yn.exec(u.url.toLowerCase())),
          (u.crossDomain = !(
            !l ||
            (l[1] === Sn[1] &&
              l[2] === Sn[2] &&
              (l[3] || ('http:' === l[1] ? '80' : '443')) ===
                (Sn[3] || ('http:' === Sn[1] ? '80' : '443')))
          ))),
        u.data &&
          u.processData &&
          'string' !== typeof u.data &&
          (u.data = K.param(u.data, u.traditional)),
        O(xn, u, e, w),
        2 === x)
      )
        return w;
      (h = K.event && u.global),
        h && 0 === K.active++ && K.event.trigger('ajaxStart'),
        (u.type = u.type.toUpperCase()),
        (u.hasContent = !mn.test(u.type)),
        (o = u.url),
        u.hasContent ||
          (u.data &&
            ((o = u.url += (un.test(o) ? '&' : '?') + u.data), delete u.data),
          u.cache === !1 &&
            (u.url = pn.test(o)
              ? o.replace(pn, `$1_=${cn++}`)
              : `${o + (un.test(o) ? '&' : '?')}_=${cn++}`)),
        u.ifModified &&
          (K.lastModified[o] &&
            w.setRequestHeader('If-Modified-Since', K.lastModified[o]),
          K.etag[o] && w.setRequestHeader('If-None-Match', K.etag[o])),
        ((u.data && u.hasContent && u.contentType !== !1) || e.contentType) &&
          w.setRequestHeader('Content-Type', u.contentType),
        w.setRequestHeader(
          'Accept',
          u.dataTypes[0] && u.accepts[u.dataTypes[0]]
            ? u.accepts[u.dataTypes[0]] +
                ('*' !== u.dataTypes[0] ? `, ${wn}; q=0.01` : '')
            : u.accepts['*'],
        );
      for (c in u.headers) w.setRequestHeader(c, u.headers[c]);
      if (u.beforeSend && (u.beforeSend.call(d, w, u) === !1 || 2 === x))
        return w.abort();
      b = 'abort';
      for (c in { success: 1, error: 1, complete: 1 }) w[c](u[c]);
      if ((i = O(bn, u, e, w))) {
        (w.readyState = 1),
          h && p.trigger('ajaxSend', [w, u]),
          u.async &&
            u.timeout > 0 &&
            (a = setTimeout(() => {
              w.abort('timeout');
            }, u.timeout));
        try {
          (x = 1), i.send(v, n);
        } catch (C) {
          if (!(2 > x)) throw C;
          n(-1, C);
        }
      } else n(-1, 'No Transport');
      return w;
    },
    getJSON(t, e, n) {
      return K.get(t, e, n, 'json');
    },
    getScript(t, e) {
      return K.get(t, void 0, e, 'script');
    },
  }),
    K.each(['get', 'post'], (t, e) => {
      K[e] = function (t, n, i, o) {
        return (
          K.isFunction(n) && ((o = o || i), (i = n), (n = void 0)),
          K.ajax({ url: t, type: e, dataType: o, data: n, success: i })
        );
      };
    }),
    (K._evalUrl = function (t) {
      return K.ajax({
        url: t,
        type: 'GET',
        dataType: 'script',
        async: !1,
        global: !1,
        throws: !0,
      });
    }),
    K.fn.extend({
      wrapAll(t) {
        let e;
        return K.isFunction(t)
          ? this.each(function (e) {
              K(this).wrapAll(t.call(this, e));
            })
          : (this[0] &&
              ((e = K(t, this[0].ownerDocument).eq(0).clone(!0)),
              this[0].parentNode && e.insertBefore(this[0]),
              e
                .map(function () {
                  for (var t = this; t.firstElementChild; )
                    t = t.firstElementChild;
                  return t;
                })
                .append(this)),
            this);
      },
      wrapInner(t) {
        return this.each(
          K.isFunction(t)
            ? function (e) {
                K(this).wrapInner(t.call(this, e));
              }
            : function () {
                const e = K(this),
                  n = e.contents();
                n.length > 0 ? n.wrapAll(t) : e.append(t);
              },
        );
      },
      wrap(t) {
        const e = K.isFunction(t);
        return this.each(function (n) {
          K(this).wrapAll(e ? t.call(this, n) : t);
        });
      },
      unwrap() {
        return this.parent()
          .each(function () {
            K.nodeName(this, 'body') || K(this).replaceWith(this.childNodes);
          })
          .end();
      },
    }),
    (K.expr.filters.hidden = function (t) {
      return t.offsetWidth <= 0 && t.offsetHeight <= 0;
    }),
    (K.expr.filters.visible = function (t) {
      return !K.expr.filters.hidden(t);
    });
  var Tn = /%20/g,
    kn = /\[]$/,
    Pn = /\r?\n/g,
    Ln = /^(?:submit|button|image|reset|file)$/i,
    An = /^(?:input|select|textarea|keygen)/i;
  (K.param = function (t, e) {
    let n,
      i = [],
      o = function (t, e) {
        (e = K.isFunction(e) ? e() : null == e ? '' : e),
          (i[i.length] = `${encodeURIComponent(t)}=${encodeURIComponent(e)}`);
      };
    if (
      (void 0 === e && (e = K.ajaxSettings && K.ajaxSettings.traditional),
      K.isArray(t) || (t.jquery && !K.isPlainObject(t)))
    )
      K.each(t, function () {
        o(this.name, this.value);
      });
    else for (n in t) I(n, t[n], e, o);
    return i.join('&').replace(Tn, '+');
  }),
    K.fn.extend({
      serialize() {
        return K.param(this.serializeArray());
      },
      serializeArray() {
        return this.map(function () {
          const t = K.prop(this, 'elements');
          return t ? K.makeArray(t) : this;
        })
          .filter(function () {
            const t = this.type;
            return (
              this.name &&
              !K(this).is(':disabled') &&
              An.test(this.nodeName) &&
              !Ln.test(t) &&
              (this.checked || !Te.test(t))
            );
          })
          .map(function (t, e) {
            const n = K(this).val();
            return null == n
              ? null
              : K.isArray(n)
              ? K.map(n, t => {
                  return { name: e.name, value: t.replace(Pn, '\r\n') };
                })
              : { name: e.name, value: n.replace(Pn, '\r\n') };
          })
          .get();
      },
    }),
    (K.ajaxSettings.xhr = function () {
      try {
        return new XMLHttpRequest();
      } catch {}
    });
  let En = 0,
    Fn = {},
    Rn = { 0: 200, 1223: 204 },
    Nn = K.ajaxSettings.xhr();
  t.attachEvent &&
    t.attachEvent('onunload', () => {
      for (const t in Fn) Fn[t]();
    }),
    (Q.cors = !!Nn && 'withCredentials' in Nn),
    (Q.ajax = Nn = !!Nn),
    K.ajaxTransport(t => {
      let e;
      return Q.cors || (Nn && !t.crossDomain)
        ? {
            send(n, i) {
              let o,
                s = t.xhr(),
                r = ++En;
              if (
                (s.open(t.type, t.url, t.async, t.username, t.password),
                t.xhrFields)
              )
                for (o in t.xhrFields) s[o] = t.xhrFields[o];
              t.mimeType &&
                s.overrideMimeType &&
                s.overrideMimeType(t.mimeType),
                t.crossDomain ||
                  n['X-Requested-With'] ||
                  (n['X-Requested-With'] = 'XMLHttpRequest');
              for (o in n) s.setRequestHeader(o, n[o]);
              (e = function (t) {
                return function () {
                  e &&
                    (delete Fn[r],
                    (e = s.addEventListener('load', (s.onerror = null))),
                    'abort' === t
                      ? s.abort()
                      : 'error' === t
                      ? i(s.status, s.statusText)
                      : i(
                          Rn[s.status] || s.status,
                          s.statusText,
                          'string' === typeof s.responseText
                            ? { text: s.responseText }
                            : void 0,
                          s.getAllResponseHeaders(),
                        ));
                };
              }),
                s.addEventListener('load', e()),
                (s.onerror = e('error')),
                (e = Fn[r] = e('abort'));
              try {
                s.send((t.hasContent && t.data) || null);
              } catch (a) {
                if (e) throw a;
              }
            },
            abort() {
              e && e();
            },
          }
        : void 0;
    }),
    K.ajaxSetup({
      accepts: {
        script:
          'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript',
      },
      contents: { script: /(?:java|ecma)script/ },
      converters: {
        'text script': function (t) {
          return K.globalEval(t), t;
        },
      },
    }),
    K.ajaxPrefilter('script', t => {
      void 0 === t.cache && (t.cache = !1), t.crossDomain && (t.type = 'GET');
    }),
    K.ajaxTransport('script', t => {
      if (t.crossDomain) {
        let e, n;
        return {
          send(i, o) {
            (e = K('<script>')
              .prop({ async: !0, charset: t.scriptCharset, src: t.url })
              .on(
                'load error',
                (n = function (t) {
                  e.remove(),
                    (n = null),
                    t && o('error' === t.type ? 404 : 200, t.type);
                }),
              )),
              Z.head.appendChild(e[0]);
          },
          abort() {
            n && n();
          },
        };
      }
    });
  const Dn = [],
    Mn = /(=)\?(?=&|$)|\?\?/;
  K.ajaxSetup({
    jsonp: 'callback',
    jsonpCallback() {
      const t = Dn.pop() || `${K.expando}_${cn++}`;
      return (this[t] = !0), t;
    },
  }),
    K.ajaxPrefilter('json jsonp', (e, n, i) => {
      let o,
        s,
        r,
        a =
          e.jsonp !== !1 &&
          (Mn.test(e.url)
            ? 'url'
            : 'string' === typeof e.data &&
              !(e.contentType || '').indexOf(
                'application/x-www-form-urlencoded',
              ) &&
              Mn.test(e.data) &&
              'data');
      return a || 'jsonp' === e.dataTypes[0]
        ? ((o = e.jsonpCallback =
            K.isFunction(e.jsonpCallback)
              ? e.jsonpCallback()
              : e.jsonpCallback),
          a
            ? (e[a] = e[a].replace(Mn, `$1${o}`))
            : e.jsonp !== !1 &&
              (e.url += `${(un.test(e.url) ? '&' : '?') + e.jsonp}=${o}`),
          (e.converters['script json'] = function () {
            return r || K.error(`${o} was not called`), r[0];
          }),
          (e.dataTypes[0] = 'json'),
          (s = t[o]),
          (t[o] = function () {
            r = arguments;
          }),
          i.always(() => {
            (t[o] = s),
              e[o] && ((e.jsonpCallback = n.jsonpCallback), Dn.push(o)),
              r && K.isFunction(s) && s(r[0]),
              (r = s = void 0);
          }),
          'script')
        : void 0;
    }),
    (K.parseHTML = function (t, e, n) {
      if (!t || 'string' !== typeof t) return null;
      'boolean' === typeof e && ((n = e), (e = !1)), (e = e || Z);
      let i = re.exec(t),
        o = !n && [];
      return i
        ? [e.createElement(i[1])]
        : ((i = K.buildFragment([t], e, o)),
          o && o.length && K(o).remove(),
          K.merge([], i.childNodes));
    });
  const Wn = K.fn.load;
  (K.fn.load = function (t, e, n) {
    if ('string' !== typeof t && Wn) return Reflect.apply(Wn, this, arguments);
    let i,
      o,
      s,
      r = this,
      a = t.indexOf(' ');
    return (
      a >= 0 && ((i = K.trim(t.slice(a))), (t = t.slice(0, a))),
      K.isFunction(e)
        ? ((n = e), (e = void 0))
        : e && 'object' === typeof e && (o = 'POST'),
      r.length > 0 &&
        K.ajax({ url: t, type: o, dataType: 'html', data: e })
          .done(function (t) {
            (s = arguments),
              r.html(i ? K('<div>').append(K.parseHTML(t)).find(i) : t);
          })
          .complete(
            n &&
              ((t, e) => {
                r.each(n, s || [t.responseText, e, t]);
              }),
          ),
      this
    );
  }),
    K.each(
      [
        'ajaxStart',
        'ajaxStop',
        'ajaxComplete',
        'ajaxError',
        'ajaxSuccess',
        'ajaxSend',
      ],
      (t, e) => {
        K.fn[e] = function (t) {
          return this.on(e, t);
        };
      },
    ),
    (K.expr.filters.animated = function (t) {
      return K.grep(K.timers, e => {
        return t === e.elem;
      }).length;
    });
  const On = t.document.documentElement;
  (K.offset = {
    setOffset(t, e, n) {
      let i,
        o,
        s,
        r,
        a,
        l,
        h,
        c = K.css(t, 'position'),
        u = K(t),
        d = {};
      'static' === c && (t.style.position = 'relative'),
        (a = u.offset()),
        (s = K.css(t, 'top')),
        (l = K.css(t, 'left')),
        (h = ('absolute' === c || 'fixed' === c) && (s + l).includes('auto')),
        h
          ? ((i = u.position()), (r = i.top), (o = i.left))
          : ((r = Number.parseFloat(s) || 0), (o = Number.parseFloat(l) || 0)),
        K.isFunction(e) && (e = e.call(t, n, a)),
        null != e.top && (d.top = e.top - a.top + r),
        null != e.left && (d.left = e.left - a.left + o),
        'using' in e ? e.using.call(t, d) : u.css(d);
    },
  }),
    K.fn.extend({
      offset(t) {
        if (arguments.length > 0)
          return void 0 === t
            ? this
            : this.each(function (e) {
                K.offset.setOffset(this, t, e);
              });
        let e,
          n,
          i = this[0],
          o = { top: 0, left: 0 },
          s = i && i.ownerDocument;
        if (s)
          return (
            (e = s.documentElement),
            K.contains(e, i)
              ? (typeof i.getBoundingClientRect !== ke &&
                  (o = i.getBoundingClientRect()),
                (n = q(s)),
                {
                  top: o.top + n.pageYOffset - e.clientTop,
                  left: o.left + n.pageXOffset - e.clientLeft,
                })
              : o
          );
      },
      position() {
        if (this[0]) {
          let t,
            e,
            n = this[0],
            i = { top: 0, left: 0 };
          return (
            'fixed' === K.css(n, 'position')
              ? (e = n.getBoundingClientRect())
              : ((t = this.offsetParent()),
                (e = this.offset()),
                K.nodeName(t[0], 'html') || (i = t.offset()),
                (i.top += K.css(t[0], 'borderTopWidth', !0)),
                (i.left += K.css(t[0], 'borderLeftWidth', !0))),
            {
              top: e.top - i.top - K.css(n, 'marginTop', !0),
              left: e.left - i.left - K.css(n, 'marginLeft', !0),
            }
          );
        }
      },
      offsetParent() {
        return this.map(function () {
          for (
            var t = this.offsetParent || On;
            t && !K.nodeName(t, 'html') && 'static' === K.css(t, 'position');

          )
            t = t.offsetParent;
          return t || On;
        });
      },
    }),
    K.each({ scrollLeft: 'pageXOffset', scrollTop: 'pageYOffset' }, (e, n) => {
      const i = 'pageYOffset' === n;
      K.fn[e] = function (o) {
        return me(
          this,
          (e, o, s) => {
            const r = q(e);
            return void 0 === s
              ? r
                ? r[n]
                : e[o]
              : void (r
                  ? r.scrollTo(i ? t.pageXOffset : s, i ? s : t.pageYOffset)
                  : (e[o] = s));
          },
          e,
          o,
          arguments.length,
          null,
        );
      };
    }),
    K.each(['top', 'left'], (t, e) => {
      K.cssHooks[e] = C(Q.pixelPosition, (t, n) => {
        return n
          ? ((n = w(t, e)), Be.test(n) ? `${K(t).position()[e]}px` : n)
          : void 0;
      });
    }),
    K.each({ Height: 'height', Width: 'width' }, (t, e) => {
      K.each({ padding: `inner${t}`, content: e, '': `outer${t}` }, (n, i) => {
        K.fn[i] = function (i, o) {
          const s = arguments.length && (n || 'boolean' !== typeof i),
            r = n || (i === !0 || o === !0 ? 'margin' : 'border');
          return me(
            this,
            (e, n, i) => {
              let o;
              return K.isWindow(e)
                ? e.document.documentElement[`client${t}`]
                : 9 === e.nodeType
                ? ((o = e.documentElement),
                  Math.max(
                    e.body[`scroll${t}`],
                    o[`scroll${t}`],
                    e.body[`offset${t}`],
                    o[`offset${t}`],
                    o[`client${t}`],
                  ))
                : void 0 === i
                ? K.css(e, n, r)
                : K.style(e, n, i, r);
            },
            e,
            s ? i : void 0,
            s,
            null,
          );
        };
      });
    }),
    (K.fn.size = function () {
      return this.length;
    }),
    (K.fn.andSelf = K.fn.addBack),
    'function' === typeof define &&
      define.amd &&
      define('jquery', [], () => {
        return K;
      });
  const jn = t.jQuery,
    Hn = t.$;
  return (
    (K.noConflict = function (e) {
      return t.$ === K && (t.$ = Hn), e && t.jQuery === K && (t.jQuery = jn), K;
    }),
    typeof e === ke && (t.jQuery = t.$ = K),
    K
  );
}),
  +(function (t) {
    'use strict';
    function e() {
      const t = document.createElement('bootstrap'),
        e = {
          WebkitTransition: 'webkitTransitionEnd',
          MozTransition: 'transitionend',
          OTransition: 'oTransitionEnd otransitionend',
          transition: 'transitionend',
        };
      for (const n in e) if (void 0 !== t.style[n]) return { end: e[n] };
      return !1;
    }
    (t.fn.emulateTransitionEnd = function (e) {
      let n = !1,
        i = this;
      t(this).one('bsTransitionEnd', () => {
        n = !0;
      });
      const o = function () {
        n || t(i).trigger(t.support.transition.end);
      };
      return setTimeout(o, e), this;
    }),
      t(() => {
        (t.support.transition = e()),
          t.support.transition &&
            (t.event.special.bsTransitionEnd = {
              bindType: t.support.transition.end,
              delegateType: t.support.transition.end,
              handle(e) {
                return t(e.target).is(this)
                  ? Reflect.apply(e.handleObj.handler, this, arguments)
                  : void 0;
              },
            });
      });
  })(jQuery),
  +(function (t) {
    'use strict';
    function e(e) {
      let n,
        i =
          e.attr('data-target') ||
          ((n = e.attr('href')) && n.replace(/.*(?=#\S+$)/, ''));
      return t(i);
    }
    function n(e) {
      return this.each(function () {
        let n = t(this),
          o = n.data('bs.collapse'),
          s = t.extend({}, i.DEFAULTS, n.data(), 'object' === typeof e && e);
        !o && s.toggle && 'show' == e && (s.toggle = !1),
          o || n.data('bs.collapse', (o = new i(this, s))),
          'string' === typeof e && o[e]();
      });
    }
    var i = function (e, n) {
      (this.$element = t(e)),
        (this.options = t.extend({}, i.DEFAULTS, n)),
        (this.$trigger = t(this.options.trigger).filter(
          `[href="#${e.id}"], [data-target="#${e.id}"]`,
        )),
        (this.transitioning = null),
        this.options.parent
          ? (this.$parent = this.getParent())
          : this.addAriaAndCollapsedClass(this.$element, this.$trigger),
        this.options.toggle && this.toggle();
    };
    (i.VERSION = '3.3.2'),
      (i.TRANSITION_DURATION = 350),
      (i.DEFAULTS = { toggle: !0, trigger: '[data-toggle="collapse"]' }),
      (i.prototype.dimension = function () {
        const t = this.$element.hasClass('width');
        return t ? 'width' : 'height';
      }),
      (i.prototype.show = function () {
        if (!this.transitioning && !this.$element.hasClass('in')) {
          let e,
            o =
              this.$parent &&
              this.$parent.children('.panel').children('.in, .collapsing');
          if (
            !(
              o &&
              o.length > 0 &&
              ((e = o.data('bs.collapse')), e && e.transitioning)
            )
          ) {
            const s = t.Event('show.bs.collapse');
            if ((this.$element.trigger(s), !s.isDefaultPrevented())) {
              o &&
                o.length &&
                (n.call(o, 'hide'), e || o.data('bs.collapse', null));
              const r = this.dimension();
              this.$element
                .removeClass('collapse')
                .addClass('collapsing')
                [r](0)
                .attr('aria-expanded', !0),
                this.$trigger
                  .removeClass('collapsed')
                  .attr('aria-expanded', !0),
                (this.transitioning = 1);
              const a = function () {
                this.$element
                  .removeClass('collapsing')
                  .addClass('collapse in')
                  [r](''),
                  (this.transitioning = 0),
                  this.$element.trigger('shown.bs.collapse');
              };
              if (!t.support.transition) return a.call(this);
              const l = t.camelCase(['scroll', r].join('-'));
              this.$element
                .one('bsTransitionEnd', t.proxy(a, this))
                .emulateTransitionEnd(i.TRANSITION_DURATION)
                [r](this.$element[0][l]);
            }
          }
        }
      }),
      (i.prototype.hide = function () {
        if (!this.transitioning && this.$element.hasClass('in')) {
          const e = t.Event('hide.bs.collapse');
          if ((this.$element.trigger(e), !e.isDefaultPrevented())) {
            const n = this.dimension();
            this.$element[n](this.$element[n]())[0].offsetHeight,
              this.$element
                .addClass('collapsing')
                .removeClass('collapse in')
                .attr('aria-expanded', !1),
              this.$trigger.addClass('collapsed').attr('aria-expanded', !1),
              (this.transitioning = 1);
            const o = function () {
              (this.transitioning = 0),
                this.$element
                  .removeClass('collapsing')
                  .addClass('collapse')
                  .trigger('hidden.bs.collapse');
            };
            return t.support.transition
              ? void this.$element[n](0)
                  .one('bsTransitionEnd', t.proxy(o, this))
                  .emulateTransitionEnd(i.TRANSITION_DURATION)
              : o.call(this);
          }
        }
      }),
      (i.prototype.toggle = function () {
        this[this.$element.hasClass('in') ? 'hide' : 'show']();
      }),
      (i.prototype.getParent = function () {
        return t(this.options.parent)
          .find(
            `[data-toggle="collapse"][data-parent="${this.options.parent}"]`,
          )
          .each(
            t.proxy(function (n, i) {
              const o = t(i);
              this.addAriaAndCollapsedClass(e(o), o);
            }, this),
          )
          .end();
      }),
      (i.prototype.addAriaAndCollapsedClass = function (t, e) {
        const n = t.hasClass('in');
        t.attr('aria-expanded', n),
          e.toggleClass('collapsed', !n).attr('aria-expanded', n);
      });
    const o = t.fn.collapse;
    (t.fn.collapse = n),
      (t.fn.collapse.Constructor = i),
      (t.fn.collapse.noConflict = function () {
        return (t.fn.collapse = o), this;
      }),
      t(document).on(
        'click.bs.collapse.data-api',
        '[data-toggle="collapse"]',
        function (i) {
          const o = t(this);
          o.attr('data-target') || i.preventDefault();
          const s = e(o),
            r = s.data('bs.collapse'),
            a = r ? 'toggle' : t.extend({}, o.data(), { trigger: this });
          n.call(s, a);
        },
      );
  })(jQuery),
  function () {
    function t(t) {
      return 'string' === typeof t ? t : null == t ? '' : `${t}`;
    }
    function e(t) {
      return (t && 'object' === typeof t) || !1;
    }
    function n(t) {
      if (e(t) && !isArray(t)) {
        if (t instanceof LodashWrapper) return t;
        if (k.call(t, '__wrapped__'))
          return new LodashWrapper(
            t.__wrapped__,
            t.__chain__,
            arrayCopy(t.__actions__),
          );
      }
      return new LodashWrapper(t);
    }
    function i(t, e, n) {
      function i() {
        m && clearTimeout(m), d && clearTimeout(d), (d = m = v = h);
      }
      function o() {
        const n = e - (R() - f);
        if (0 >= n || n > e) {
          d && clearTimeout(d);
          const i = v;
          (d = m = v = h),
            i && ((y = R()), (p = t.apply(g, c)), m || d || (c = g = null));
        } else m = setTimeout(o, n);
      }
      function a() {
        m && clearTimeout(m),
          (d = m = v = h),
          (b || x !== e) &&
            ((y = R()), (p = t.apply(g, c)), m || d || (c = g = null));
      }
      function l() {
        if (
          ((c = arguments),
          (f = R()),
          (g = this),
          (v = b && (m || !w)),
          x === !1)
        )
          var n = w && !m;
        else {
          d || w || (y = f);
          var i = x - (f - y),
            s = 0 >= i || i > x;
          s
            ? (d && (d = clearTimeout(d)), (y = f), (p = t.apply(g, c)))
            : d || (d = setTimeout(a, i));
        }
        return (
          s && m
            ? (m = clearTimeout(m))
            : m || e === x || (m = setTimeout(o, e)),
          n && ((s = !0), (p = t.apply(g, c))),
          !s || m || d || (c = g = null),
          p
        );
      }
      var c,
        d,
        p,
        f,
        g,
        m,
        v,
        y = 0,
        x = !1,
        b = !0;
      if (!s(t)) throw new TypeError(u);
      if (((e = 0 > e ? 0 : e), n === !0)) {
        var w = !0;
        b = !1;
      } else
        r(n) &&
          ((w = n.leading),
          (x = 'maxWait' in n && E(+n.maxWait || 0, e)),
          (b = 'trailing' in n ? n.trailing : b));
      return (l.cancel = i), l;
    }
    function o(t, e, n) {
      let o = !0,
        a = !0;
      if (!s(t)) throw new TypeError(u);
      return (
        n === !1
          ? (o = !1)
          : r(n) &&
            ((o = 'leading' in n ? !!n.leading : o),
            (a = 'trailing' in n ? !!n.trailing : a)),
        (m.leading = o),
        (m.maxWait = +e),
        (m.trailing = a),
        i(t, e, m)
      );
    }
    function s(t) {
      return 'function' === typeof t || !1;
    }
    function r(t) {
      const e = typeof t;
      return 'function' == e || (t && 'object' == e) || !1;
    }
    function a(t) {
      return null == t
        ? !1
        : P.call(t) == d
        ? L.test(T.call(t))
        : (e(t) && (C(t) ? L : p).test(t)) || !1;
    }
    function l(e) {
      return (e = t(e)), e && g.test(e) ? e.replace(f, '\\$&') : e;
    }
    var h,
      c = '3.1.0',
      u = 'Expected a function',
      d = '[object Function]',
      p = /^\[object .+?Constructor]$/,
      f = /[$()*+./?[\\\]^{|}]/g,
      g = new RegExp(f.source),
      m = { leading: !1, maxWait: 0, trailing: !1 },
      v = { function: !0, object: !0 },
      y = v[typeof window] && window !== (this && this.window) ? window : this,
      x = v[typeof exports] && exports && !exports.nodeType && exports,
      b = v[typeof module] && module && !module.nodeType && module,
      w = x && b && 'object' === typeof global && global;
    !w || (w.global !== w && w.window !== w && w.self !== w) || (y = w);
    var C = (function () {
        try {
          new Object(`${{ toString: 0 }}`);
        } catch {
          return function () {
            return !1;
          };
        }
        return function (t) {
          return 'function' !== typeof t.toString && 'string' === typeof `${t}`;
        };
      })(),
      S = Object.prototype,
      T = Function.prototype.toString,
      k = S.hasOwnProperty,
      P = S.toString,
      L = new RegExp(
        `^${l(P).replace(
          /toString|(function).*?(?=\\\()| for .+?(?=\\])/g,
          '$1.*?',
        )}$`,
      ),
      A = a((A = y.Uint8Array)) && A,
      E = Math.max,
      F = a((F = Date.now)) && F,
      R =
        F ||
        function () {
          return Date.now();
        };
    (s(/x/) || (A && !s(A))) &&
      (s = function (t) {
        return P.call(t) == d;
      }),
      (n.debounce = i),
      (n.throttle = o),
      (n.escapeRegExp = l),
      (n.isFunction = s),
      (n.isNative = a),
      (n.isObject = r),
      (n.now = R),
      (n.VERSION = c),
      (y._ = n);
  }.call(this),
  function () {
    'use strict';
    const t = this,
      e = t.Chart,
      n = function (t) {
        (this.canvas = t.canvas), (this.ctx = t);
        (this.width = t.canvas.width), (this.height = t.canvas.height);
        return (
          (this.aspectRatio = this.width / this.height),
          i.retinaScale(this),
          this
        );
      };
    (n.defaults = {
      global: {
        animation: !0,
        animationSteps: 60,
        animationEasing: 'easeOutQuart',
        showScale: !0,
        scaleOverride: !1,
        scaleSteps: null,
        scaleStepWidth: null,
        scaleStartValue: null,
        scaleLineColor: 'rgba(0,0,0,.1)',
        scaleLineWidth: 1,
        scaleShowLabels: !0,
        scaleLabel: '<%=value%>',
        scaleIntegersOnly: !0,
        scaleBeginAtZero: !1,
        scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
        scaleFontSize: 12,
        scaleFontStyle: 'normal',
        scaleFontColor: '#666',
        responsive: !1,
        maintainAspectRatio: !0,
        showTooltips: !0,
        customTooltips: !1,
        tooltipEvents: ['mousemove', 'touchstart', 'touchmove', 'mouseout'],
        tooltipFillColor: 'rgba(0,0,0,0.8)',
        tooltipFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
        tooltipFontSize: 14,
        tooltipFontStyle: 'normal',
        tooltipFontColor: '#fff',
        tooltipTitleFontFamily:
          "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
        tooltipTitleFontSize: 14,
        tooltipTitleFontStyle: 'bold',
        tooltipTitleFontColor: '#fff',
        tooltipYPadding: 6,
        tooltipXPadding: 6,
        tooltipCaretSize: 8,
        tooltipCornerRadius: 6,
        tooltipXOffset: 10,
        tooltipTemplate: '<%if (label){%><%=label%>: <%}%><%= value %>',
        multiTooltipTemplate: '<%= value %>',
        multiTooltipKeyBackground: '#fff',
        onAnimationProgress() {},
        onAnimationComplete() {},
      },
    }),
      (n.types = {});
    var i = (n.helpers = {}),
      o = (i.each = function (t, e, n) {
        const i = Array.prototype.slice.call(arguments, 3);
        if (t)
          if (t.length === +t.length) {
            let o;
            for (o = 0; o < t.length; o++) e.apply(n, [t[o], o].concat(i));
          } else for (const s in t) e.apply(n, [t[s], s].concat(i));
      }),
      s = (i.clone = function (t) {
        const e = {};
        return (
          o(t, (n, i) => {
            t.hasOwnProperty(i) && (e[i] = n);
          }),
          e
        );
      }),
      r = (i.extend = function (t) {
        return (
          o(Array.prototype.slice.call(arguments, 1), e => {
            o(e, (n, i) => {
              e.hasOwnProperty(i) && (t[i] = n);
            });
          }),
          t
        );
      }),
      a = (i.merge = function () {
        const t = Array.prototype.slice.call(arguments, 0);
        return t.unshift({}), r.apply(null, t);
      }),
      l = (i.indexOf = function (t, e) {
        if (Array.prototype.indexOf) return t.indexOf(e);
        for (let n = 0; n < t.length; n++) if (t[n] === e) return n;
        return -1;
      }),
      h =
        ((i.where = function (t, e) {
          const n = [];
          return (
            i.each(t, t => {
              e(t) && n.push(t);
            }),
            n
          );
        }),
        (i.findNextWhere = function (t, e, n) {
          n || (n = -1);
          for (let i = n + 1; i < t.length; i++) {
            const o = t[i];
            if (e(o)) return o;
          }
        }),
        (i.findPreviousWhere = function (t, e, n) {
          n || (n = t.length);
          for (let i = n - 1; i >= 0; i--) {
            const o = t[i];
            if (e(o)) return o;
          }
        }),
        (i.inherits = function (t) {
          const e = this,
            n =
              t && t.hasOwnProperty('constructor')
                ? t.constructor
                : function () {
                    return Reflect.apply(e, this, arguments);
                  },
            i = function () {
              this.constructor = n;
            };
          return (
            (i.prototype = e.prototype),
            (n.prototype = new i()),
            (n.extend = h),
            t && r(n.prototype, t),
            (n.__super__ = e.prototype),
            n
          );
        })),
      c = (i.noop = function () {}),
      u = (i.uid = (function () {
        let t = 0;
        return function () {
          return `chart-${t++}`;
        };
      })()),
      d = (i.warn = function (t) {
        window.console &&
          'function' === typeof window.console.warn &&
          console.warn(t);
      }),
      p = (i.amd = 'function' === typeof define && define.amd),
      f = (i.isNumber = function (t) {
        return !isNaN(Number.parseFloat(t)) && isFinite(t);
      }),
      g = (i.max = function (t) {
        return Math.max.apply(Math, t);
      }),
      m = (i.min = function (t) {
        return Math.min.apply(Math, t);
      }),
      v =
        ((i.cap = function (t, e, n) {
          if (f(e)) {
            if (t > e) return e;
          } else if (f(n) && n > t) return n;
          return t;
        }),
        (i.getDecimalPlaces = function (t) {
          return t % 1 !== 0 && f(t) ? t.toString().split('.')[1].length : 0;
        })),
      y = (i.radians = function (t) {
        return t * (Math.PI / 180);
      }),
      x =
        ((i.getAngleFromPoint = function (t, e) {
          let n = e.x - t.x,
            i = e.y - t.y,
            o = Math.sqrt(n * n + i * i),
            s = 2 * Math.PI + Math.atan2(i, n);
          return (
            0 > n && 0 > i && (s += 2 * Math.PI), { angle: s, distance: o }
          );
        }),
        (i.aliasPixel = function (t) {
          return t % 2 === 0 ? 0 : 0.5;
        })),
      b =
        ((i.splineCurve = function (t, e, n, i) {
          const o = Math.sqrt((e.x - t.x) ** 2 + (e.y - t.y) ** 2),
            s = Math.sqrt((n.x - e.x) ** 2 + (n.y - e.y) ** 2),
            r = (i * o) / (o + s),
            a = (i * s) / (o + s);
          return {
            inner: { x: e.x - r * (n.x - t.x), y: e.y - r * (n.y - t.y) },
            outer: { x: e.x + a * (n.x - t.x), y: e.y + a * (n.y - t.y) },
          };
        }),
        (i.calculateOrderOfMagnitude = function (t) {
          return Math.floor(Math.log(t) / Math.LN10);
        })),
      w =
        ((i.calculateScaleRange = function (t, e, n, i, o) {
          let s = 2,
            r = Math.floor(e / (1.5 * n)),
            a = s >= r,
            l = g(t),
            h = m(t);
          l === h && ((l += 0.5), h >= 0.5 && !i ? (h -= 0.5) : (l += 0.5));
          for (
            var c = Math.abs(l - h),
              u = b(c),
              d = Math.ceil(l / (1 * 10 ** u)) * 10 ** u,
              p = i ? 0 : Math.floor(h / (1 * 10 ** u)) * 10 ** u,
              f = d - p,
              v = 10 ** u,
              y = Math.round(f / v);
            (y > r || r > 2 * y) && !a;

          )
            if (y > r)
              (v *= 2), (y = Math.round(f / v)), y % 1 !== 0 && (a = !0);
            else if (o && u >= 0) {
              if ((v / 2) % 1 !== 0) break;
              (v /= 2), (y = Math.round(f / v));
            } else (v /= 2), (y = Math.round(f / v));
          return (
            a && ((y = s), (v = f / y)),
            { steps: y, stepValue: v, min: p, max: p + y * v }
          );
        }),
        (i.template = function (t, e) {
          function n(t, e) {
            const n = /\W/.test(t)
              ? new Function(
                  'obj',
                  `var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('${t
                    .replace(/[\t\n\r]/g, ' ')
                    .split('<%')
                    .join('	')
                    .replace(/((^|%>)[^\t]*)'/g, '$1\r')
                    .replace(/\t=(.*?)%>/g, "',$1,'")
                    .split('	')
                    .join("');")
                    .split('%>')
                    .join("p.push('")
                    .split('\r')
                    .join("\\'")}');}return p.join('');`,
                )
              : (i[t] = i[t]);
            return e ? n(e) : n;
          }
          if (t instanceof Function) return t(e);
          var i = {};
          return n(t, e);
        })),
      C =
        ((i.generateLabels = function (t, e, n, i) {
          const s = new Array(e);
          return (
            labelTemplateString &&
              o(s, (e, o) => {
                s[o] = w(t, { value: n + i * (o + 1) });
              }),
            s
          );
        }),
        (i.easingEffects = {
          linear(t) {
            return t;
          },
          easeInQuad(t) {
            return t * t;
          },
          easeOutQuad(t) {
            return -1 * t * (t - 2);
          },
          easeInOutQuad(t) {
            return (t /= 0.5) < 1 ? 0.5 * t * t : -0.5 * (--t * (t - 2) - 1);
          },
          easeInCubic(t) {
            return t * t * t;
          },
          easeOutCubic(t) {
            return 1 * ((t = t / 1 - 1) * t * t + 1);
          },
          easeInOutCubic(t) {
            return (t /= 0.5) < 1
              ? 0.5 * t * t * t
              : 0.5 * ((t -= 2) * t * t + 2);
          },
          easeInQuart(t) {
            return t * t * t * t;
          },
          easeOutQuart(t) {
            return -1 * ((t = t / 1 - 1) * t * t * t - 1);
          },
          easeInOutQuart(t) {
            return (t /= 0.5) < 1
              ? 0.5 * t * t * t * t
              : -0.5 * ((t -= 2) * t * t * t - 2);
          },
          easeInQuint(t) {
            return 1 * (t /= 1) * t * t * t * t;
          },
          easeOutQuint(t) {
            return 1 * ((t = t / 1 - 1) * t * t * t * t + 1);
          },
          easeInOutQuint(t) {
            return (t /= 0.5) < 1
              ? 0.5 * t * t * t * t * t
              : 0.5 * ((t -= 2) * t * t * t * t + 2);
          },
          easeInSine(t) {
            return -1 * Math.cos((t / 1) * (Math.PI / 2)) + 1;
          },
          easeOutSine(t) {
            return 1 * Math.sin((t / 1) * (Math.PI / 2));
          },
          easeInOutSine(t) {
            return -0.5 * (Math.cos((Math.PI * t) / 1) - 1);
          },
          easeInExpo(t) {
            return 0 === t ? 1 : 1 * 2 ** (10 * (t / 1 - 1));
          },
          easeOutExpo(t) {
            return 1 === t ? 1 : 1 * (-(2 ** ((-10 * t) / 1)) + 1);
          },
          easeInOutExpo(t) {
            return 0 === t
              ? 0
              : 1 === t
              ? 1
              : (t /= 0.5) < 1
              ? 0.5 * 2 ** (10 * (t - 1))
              : 0.5 * (-(2 ** (-10 * --t)) + 2);
          },
          easeInCirc(t) {
            return t >= 1 ? t : -1 * (Math.sqrt(1 - (t /= 1) * t) - 1);
          },
          easeOutCirc(t) {
            return 1 * Math.sqrt(1 - (t = t / 1 - 1) * t);
          },
          easeInOutCirc(t) {
            return (t /= 0.5) < 1
              ? -0.5 * (Math.sqrt(1 - t * t) - 1)
              : 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
          },
          easeInElastic(t) {
            let e = 1.70158,
              n = 0,
              i = 1;
            return 0 === t
              ? 0
              : 1 == (t /= 1)
              ? 1
              : (n || (n = 0.3),
                i < Math.abs(1)
                  ? ((i = 1), (e = n / 4))
                  : (e = (n / (2 * Math.PI)) * Math.asin(1 / i)),
                -(
                  i *
                  2 ** (10 * (t -= 1)) *
                  Math.sin((2 * (1 * t - e) * Math.PI) / n)
                ));
          },
          easeOutElastic(t) {
            let e = 1.70158,
              n = 0,
              i = 1;
            return 0 === t
              ? 0
              : 1 == (t /= 1)
              ? 1
              : (n || (n = 0.3),
                i < Math.abs(1)
                  ? ((i = 1), (e = n / 4))
                  : (e = (n / (2 * Math.PI)) * Math.asin(1 / i)),
                i * 2 ** (-10 * t) * Math.sin((2 * (1 * t - e) * Math.PI) / n) +
                  1);
          },
          easeInOutElastic(t) {
            let e = 1.70158,
              n = 0,
              i = 1;
            return 0 === t
              ? 0
              : 2 == (t /= 0.5)
              ? 1
              : (n || (n = 0.3 * 1.5),
                i < Math.abs(1)
                  ? ((i = 1), (e = n / 4))
                  : (e = (n / (2 * Math.PI)) * Math.asin(1 / i)),
                1 > t
                  ? -0.5 *
                    i *
                    2 ** (10 * (t -= 1)) *
                    Math.sin((2 * (1 * t - e) * Math.PI) / n)
                  : i *
                      2 ** (-10 * (t -= 1)) *
                      Math.sin((2 * (1 * t - e) * Math.PI) / n) *
                      0.5 +
                    1);
          },
          easeInBack(t) {
            const e = 1.70158;
            return 1 * (t /= 1) * t * ((e + 1) * t - e);
          },
          easeOutBack(t) {
            const e = 1.70158;
            return 1 * ((t = t / 1 - 1) * t * ((e + 1) * t + e) + 1);
          },
          easeInOutBack(t) {
            let e = 1.70158;
            return (t /= 0.5) < 1
              ? 0.5 * t * t * (((e *= 1.525) + 1) * t - e)
              : 0.5 * ((t -= 2) * t * (((e *= 1.525) + 1) * t + e) + 2);
          },
          easeInBounce(t) {
            return 1 - C.easeOutBounce(1 - t);
          },
          easeOutBounce(t) {
            return (t /= 1) < 1 / 2.75
              ? 7.5625 * t * t
              : 2 / 2.75 > t
              ? 1 * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75)
              : 2.5 / 2.75 > t
              ? 1 * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375)
              : 1 * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375);
          },
          easeInOutBounce(t) {
            return 0.5 > t
              ? 0.5 * C.easeInBounce(2 * t)
              : 0.5 * C.easeOutBounce(2 * t - 1) + 0.5;
          },
        })),
      S = (i.requestAnimFrame = (function () {
        return (
          window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          function (t) {
            return window.setTimeout(t, 1e3 / 60);
          }
        );
      })()),
      T =
        ((i.cancelAnimFrame = (function () {
          return (
            window.cancelAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.mozCancelAnimationFrame ||
            window.oCancelAnimationFrame ||
            window.msCancelAnimationFrame ||
            function (t) {
              return window.clearTimeout(t, 1e3 / 60);
            }
          );
        })()),
        (i.animationLoop = function (t, e, n, i, o, s) {
          let r = 0,
            a = C[n] || C.linear,
            l = function () {
              r++;
              const n = r / e,
                h = a(n);
              t.call(s, h, n, r),
                i.call(s, h, n),
                e > r ? (s.animationFrame = S(l)) : o.apply(s);
            };
          S(l);
        }),
        (i.getRelativePosition = function (t) {
          let e,
            n,
            i = t.originalEvent || t,
            o = t.currentTarget || t.srcElement,
            s = o.getBoundingClientRect();
          return (
            i.touches
              ? ((e = i.touches[0].clientX - s.left),
                (n = i.touches[0].clientY - s.top))
              : ((e = i.clientX - s.left), (n = i.clientY - s.top)),
            { x: e, y: n }
          );
        }),
        (i.addEvent = function (t, e, n) {
          t.addEventListener
            ? t.addEventListener(e, n)
            : t.attachEvent
            ? t.attachEvent(`on${e}`, n)
            : (t[`on${e}`] = n);
        })),
      k = (i.removeEvent = function (t, e, n) {
        t.removeEventListener
          ? t.removeEventListener(e, n, !1)
          : t.detachEvent
          ? t.detachEvent(`on${e}`, n)
          : (t[`on${e}`] = c);
      }),
      P =
        ((i.bindEvents = function (t, e, n) {
          t.events || (t.events = {}),
            o(e, e => {
              (t.events[e] = function () {
                n.apply(t, arguments);
              }),
                T(t.chart.canvas, e, t.events[e]);
            });
        }),
        (i.unbindEvents = function (t, e) {
          o(e, (e, n) => {
            k(t.chart.canvas, n, e);
          });
        })),
      L = (i.getMaximumWidth = function (t) {
        const e = t.parentNode;
        return e.clientWidth;
      }),
      A = (i.getMaximumHeight = function (t) {
        const e = t.parentNode;
        return e.clientHeight;
      }),
      E =
        ((i.getMaximumSize = i.getMaximumWidth),
        (i.retinaScale = function (t) {
          const e = t.ctx,
            n = t.canvas.width,
            i = t.canvas.height;
          window.devicePixelRatio &&
            ((e.canvas.style.width = `${n}px`),
            (e.canvas.style.height = `${i}px`),
            (e.canvas.height = i * window.devicePixelRatio),
            (e.canvas.width = n * window.devicePixelRatio),
            e.scale(window.devicePixelRatio, window.devicePixelRatio));
        })),
      F = (i.clear = function (t) {
        t.ctx.clearRect(0, 0, t.width, t.height);
      }),
      R = (i.fontString = function (t, e, n) {
        return `${e} ${t}px ${n}`;
      }),
      N = (i.longestText = function (t, e, n) {
        t.font = e;
        let i = 0;
        return (
          o(n, e => {
            const n = t.measureText(e).width;
            i = n > i ? n : i;
          }),
          i
        );
      }),
      D = (i.drawRoundedRectangle = function (t, e, n, i, o, s) {
        t.beginPath(),
          t.moveTo(e + s, n),
          t.lineTo(e + i - s, n),
          t.quadraticCurveTo(e + i, n, e + i, n + s),
          t.lineTo(e + i, n + o - s),
          t.quadraticCurveTo(e + i, n + o, e + i - s, n + o),
          t.lineTo(e + s, n + o),
          t.quadraticCurveTo(e, n + o, e, n + o - s),
          t.lineTo(e, n + s),
          t.quadraticCurveTo(e, n, e + s, n),
          t.closePath();
      });
    (n.instances = {}),
      (n.Type = function (t, e, i) {
        (this.options = e),
          (this.chart = i),
          (this.id = u()),
          (n.instances[this.id] = this),
          e.responsive && this.resize(),
          this.initialize.call(this, t);
      }),
      r(n.Type.prototype, {
        initialize() {
          return this;
        },
        clear() {
          return F(this.chart), this;
        },
        stop() {
          return i.cancelAnimFrame.call(t, this.animationFrame), this;
        },
        resize(t) {
          this.stop();
          const e = this.chart.canvas,
            n = L(this.chart.canvas),
            i = this.options.maintainAspectRatio
              ? n / this.chart.aspectRatio
              : A(this.chart.canvas);
          return (
            (e.width = this.chart.width = n),
            (e.height = this.chart.height = i),
            E(this.chart),
            'function' === typeof t &&
              t.apply(this, Array.prototype.slice.call(arguments, 1)),
            this
          );
        },
        reflow: c,
        render(t) {
          return (
            t && this.reflow(),
            this.options.animation && !t
              ? i.animationLoop(
                  this.draw,
                  this.options.animationSteps,
                  this.options.animationEasing,
                  this.options.onAnimationProgress,
                  this.options.onAnimationComplete,
                  this,
                )
              : (this.draw(), this.options.onAnimationComplete.call(this)),
            this
          );
        },
        generateLegend() {
          return w(this.options.legendTemplate, this);
        },
        destroy() {
          this.clear(), P(this, this.events);
          const t = this.chart.canvas;
          (t.width = this.chart.width),
            (t.height = this.chart.height),
            t.style.removeProperty
              ? (t.style.removeProperty('width'),
                t.style.removeProperty('height'))
              : (t.style.removeAttribute('width'),
                t.style.removeAttribute('height')),
            delete n.instances[this.id];
        },
        showTooltip(t, e) {
          'undefined' === typeof this.activeElements &&
            (this.activeElements = []);
          const s = function (t) {
            let e = !1;
            return t.length !== this.activeElements.length
              ? (e = !0)
              : (o(
                  t,
                  function (t, n) {
                    t !== this.activeElements[n] && (e = !0);
                  },
                  this,
                ),
                e);
          }.call(this, t);
          if (s || e) {
            if (
              ((this.activeElements = t),
              this.draw(),
              this.options.customTooltips && this.options.customTooltips(!1),
              t.length > 0)
            )
              if (this.datasets && this.datasets.length > 1) {
                for (
                  var r, a, h = this.datasets.length - 1;
                  h >= 0 &&
                  ((r =
                    this.datasets[h].points ||
                    this.datasets[h].bars ||
                    this.datasets[h].segments),
                  (a = l(r, t[0])),
                  -1 === a);
                  h--
                );
                const c = [],
                  u = [],
                  d = function () {
                    let t,
                      e,
                      n,
                      o,
                      s,
                      r = [],
                      l = [],
                      h = [];
                    return (
                      i.each(this.datasets, e => {
                        (t = e.points || e.bars || e.segments),
                          t[a] && t[a].hasValue() && r.push(t[a]);
                      }),
                      i.each(
                        r,
                        function (t) {
                          l.push(t.x),
                            h.push(t.y),
                            c.push(
                              i.template(this.options.multiTooltipTemplate, t),
                            ),
                            u.push({
                              fill: t._saved.fillColor || t.fillColor,
                              stroke: t._saved.strokeColor || t.strokeColor,
                            });
                        },
                        this,
                      ),
                      (s = m(h)),
                      (n = g(h)),
                      (o = m(l)),
                      (e = g(l)),
                      { x: o > this.chart.width / 2 ? o : e, y: (s + n) / 2 }
                    );
                  }.call(this, a);
                new n.MultiTooltip({
                  x: d.x,
                  y: d.y,
                  xPadding: this.options.tooltipXPadding,
                  yPadding: this.options.tooltipYPadding,
                  xOffset: this.options.tooltipXOffset,
                  fillColor: this.options.tooltipFillColor,
                  textColor: this.options.tooltipFontColor,
                  fontFamily: this.options.tooltipFontFamily,
                  fontStyle: this.options.tooltipFontStyle,
                  fontSize: this.options.tooltipFontSize,
                  titleTextColor: this.options.tooltipTitleFontColor,
                  titleFontFamily: this.options.tooltipTitleFontFamily,
                  titleFontStyle: this.options.tooltipTitleFontStyle,
                  titleFontSize: this.options.tooltipTitleFontSize,
                  cornerRadius: this.options.tooltipCornerRadius,
                  labels: c,
                  legendColors: u,
                  legendColorBackground: this.options.multiTooltipKeyBackground,
                  title: t[0].label,
                  chart: this.chart,
                  ctx: this.chart.ctx,
                  custom: this.options.customTooltips,
                }).draw();
              } else
                o(
                  t,
                  function (t) {
                    const e = t.tooltipPosition();
                    new n.Tooltip({
                      x: Math.round(e.x),
                      y: Math.round(e.y),
                      xPadding: this.options.tooltipXPadding,
                      yPadding: this.options.tooltipYPadding,
                      fillColor: this.options.tooltipFillColor,
                      textColor: this.options.tooltipFontColor,
                      fontFamily: this.options.tooltipFontFamily,
                      fontStyle: this.options.tooltipFontStyle,
                      fontSize: this.options.tooltipFontSize,
                      caretHeight: this.options.tooltipCaretSize,
                      cornerRadius: this.options.tooltipCornerRadius,
                      text: w(this.options.tooltipTemplate, t),
                      chart: this.chart,
                      custom: this.options.customTooltips,
                    }).draw();
                  },
                  this,
                );
            return this;
          }
        },
        toBase64Image() {
          return this.chart.canvas.toDataURL.apply(
            this.chart.canvas,
            arguments,
          );
        },
      }),
      (n.Type.extend = function (t) {
        const e = this,
          i = function () {
            return Reflect.apply(e, this, arguments);
          };
        if (
          ((i.prototype = s(e.prototype)),
          r(i.prototype, t),
          (i.extend = n.Type.extend),
          t.name || e.prototype.name)
        ) {
          const o = t.name || e.prototype.name,
            l = n.defaults[e.prototype.name]
              ? s(n.defaults[e.prototype.name])
              : {};
          (n.defaults[o] = r(l, t.defaults)),
            (n.types[o] = i),
            (n.prototype[o] = function (t, e) {
              const s = a(n.defaults.global, n.defaults[o], e || {});
              return new i(t, s, this);
            });
        } else
          d("Name not provided for this chart, so it hasn't been registered");
        return e;
      }),
      (n.Element = function (t) {
        r(this, t),
          Reflect.apply(this.initialize, this, arguments),
          this.save();
      }),
      r(n.Element.prototype, {
        initialize() {},
        restore(t) {
          return (
            t
              ? o(
                  t,
                  function (t) {
                    this[t] = this._saved[t];
                  },
                  this,
                )
              : r(this, this._saved),
            this
          );
        },
        save() {
          return (this._saved = s(this)), delete this._saved._saved, this;
        },
        update(t) {
          return (
            o(
              t,
              function (t, e) {
                (this._saved[e] = this[e]), (this[e] = t);
              },
              this,
            ),
            this
          );
        },
        transition(t, e) {
          return (
            o(
              t,
              function (t, n) {
                this[n] = (t - this._saved[n]) * e + this._saved[n];
              },
              this,
            ),
            this
          );
        },
        tooltipPosition() {
          return { x: this.x, y: this.y };
        },
        hasValue() {
          return f(this.value);
        },
      }),
      (n.Element.extend = h),
      (n.Point = n.Element.extend({
        display: !0,
        inRange(t, e) {
          const n = this.hitDetectionRadius + this.radius;
          return (t - this.x) ** 2 + (e - this.y) ** 2 < n ** 2;
        },
        draw() {
          if (this.display) {
            const t = this.ctx;
            t.beginPath(),
              t.arc(this.x, this.y, this.radius, 0, 2 * Math.PI),
              t.closePath(),
              (t.strokeStyle = this.strokeColor),
              (t.lineWidth = this.strokeWidth),
              (t.fillStyle = this.fillColor),
              t.fill(),
              t.stroke();
          }
        },
      })),
      (n.Arc = n.Element.extend({
        inRange(t, e) {
          const n = i.getAngleFromPoint(this, { x: t, y: e }),
            o = n.angle >= this.startAngle && n.angle <= this.endAngle,
            s =
              n.distance >= this.innerRadius && n.distance <= this.outerRadius;
          return o && s;
        },
        tooltipPosition() {
          const t = this.startAngle + (this.endAngle - this.startAngle) / 2,
            e = (this.outerRadius - this.innerRadius) / 2 + this.innerRadius;
          return { x: this.x + Math.cos(t) * e, y: this.y + Math.sin(t) * e };
        },
        draw(t) {
          const e = this.ctx;
          e.beginPath(),
            e.arc(
              this.x,
              this.y,
              this.outerRadius,
              this.startAngle,
              this.endAngle,
            ),
            e.arc(
              this.x,
              this.y,
              this.innerRadius,
              this.endAngle,
              this.startAngle,
              !0,
            ),
            e.closePath(),
            (e.strokeStyle = this.strokeColor),
            (e.lineWidth = this.strokeWidth),
            (e.fillStyle = this.fillColor),
            e.fill(),
            (e.lineJoin = 'bevel'),
            this.showStroke && e.stroke();
        },
      })),
      (n.Rectangle = n.Element.extend({
        draw() {
          let t = this.ctx,
            e = this.width / 2,
            n = this.x - e,
            i = this.x + e,
            o = this.base - (this.base - this.y),
            s = this.strokeWidth / 2;
          this.showStroke && ((n += s), (i -= s), (o += s)),
            t.beginPath(),
            (t.fillStyle = this.fillColor),
            (t.strokeStyle = this.strokeColor),
            (t.lineWidth = this.strokeWidth),
            t.moveTo(n, this.base),
            t.lineTo(n, o),
            t.lineTo(i, o),
            t.lineTo(i, this.base),
            t.fill(),
            this.showStroke && t.stroke();
        },
        height() {
          return this.base - this.y;
        },
        inRange(t, e) {
          return (
            t >= this.x - this.width / 2 &&
            t <= this.x + this.width / 2 &&
            e >= this.y &&
            e <= this.base
          );
        },
      })),
      (n.Tooltip = n.Element.extend({
        draw() {
          const t = this.chart.ctx;
          (t.font = R(this.fontSize, this.fontStyle, this.fontFamily)),
            (this.xAlign = 'center'),
            (this.yAlign = 'above');
          const e = (this.caretPadding = 2),
            n = t.measureText(this.text).width + 2 * this.xPadding,
            i = this.fontSize + 2 * this.yPadding,
            o = i + this.caretHeight + e;
          this.x + n / 2 > this.chart.width
            ? (this.xAlign = 'left')
            : this.x - n / 2 < 0 && (this.xAlign = 'right'),
            this.y - o < 0 && (this.yAlign = 'below');
          let s = this.x - n / 2,
            r = this.y - o;
          if (((t.fillStyle = this.fillColor), this.custom)) this.custom(this);
          else {
            switch (this.yAlign) {
              case 'above':
                t.beginPath(),
                  t.moveTo(this.x, this.y - e),
                  t.lineTo(
                    this.x + this.caretHeight,
                    this.y - (e + this.caretHeight),
                  ),
                  t.lineTo(
                    this.x - this.caretHeight,
                    this.y - (e + this.caretHeight),
                  ),
                  t.closePath(),
                  t.fill();
                break;
              case 'below':
                (r = this.y + e + this.caretHeight),
                  t.beginPath(),
                  t.moveTo(this.x, this.y + e),
                  t.lineTo(
                    this.x + this.caretHeight,
                    this.y + e + this.caretHeight,
                  ),
                  t.lineTo(
                    this.x - this.caretHeight,
                    this.y + e + this.caretHeight,
                  ),
                  t.closePath(),
                  t.fill();
            }
            switch (this.xAlign) {
              case 'left':
                s = this.x - n + (this.cornerRadius + this.caretHeight);
                break;
              case 'right':
                s = this.x - (this.cornerRadius + this.caretHeight);
            }
            D(t, s, r, n, i, this.cornerRadius),
              t.fill(),
              (t.fillStyle = this.textColor),
              (t.textAlign = 'center'),
              (t.textBaseline = 'middle'),
              t.fillText(this.text, s + n / 2, r + i / 2);
          }
        },
      })),
      (n.MultiTooltip = n.Element.extend({
        initialize() {
          (this.font = R(this.fontSize, this.fontStyle, this.fontFamily)),
            (this.titleFont = R(
              this.titleFontSize,
              this.titleFontStyle,
              this.titleFontFamily,
            )),
            (this.height =
              this.labels.length * this.fontSize +
              (this.labels.length - 1) * (this.fontSize / 2) +
              2 * this.yPadding +
              1.5 * this.titleFontSize),
            (this.ctx.font = this.titleFont);
          const t = this.ctx.measureText(this.title).width,
            e = N(this.ctx, this.font, this.labels) + this.fontSize + 3,
            n = g([e, t]);
          this.width = n + 2 * this.xPadding;
          const i = this.height / 2;
          this.y - i < 0
            ? (this.y = i)
            : this.y + i > this.chart.height &&
              (this.y = this.chart.height - i),
            this.x > this.chart.width / 2
              ? (this.x -= this.xOffset + this.width)
              : (this.x += this.xOffset);
        },
        getLineHeight(t) {
          const e = this.y - this.height / 2 + this.yPadding,
            n = t - 1;
          return 0 === t
            ? e + this.titleFontSize / 2
            : e +
                (1.5 * this.fontSize * n + this.fontSize / 2) +
                1.5 * this.titleFontSize;
        },
        draw() {
          if (this.custom) this.custom(this);
          else {
            D(
              this.ctx,
              this.x,
              this.y - this.height / 2,
              this.width,
              this.height,
              this.cornerRadius,
            );
            const t = this.ctx;
            (t.fillStyle = this.fillColor),
              t.fill(),
              t.closePath(),
              (t.textAlign = 'left'),
              (t.textBaseline = 'middle'),
              (t.fillStyle = this.titleTextColor),
              (t.font = this.titleFont),
              t.fillText(
                this.title,
                this.x + this.xPadding,
                this.getLineHeight(0),
              ),
              (t.font = this.font),
              i.each(
                this.labels,
                function (e, n) {
                  (t.fillStyle = this.textColor),
                    t.fillText(
                      e,
                      this.x + this.xPadding + this.fontSize + 3,
                      this.getLineHeight(n + 1),
                    ),
                    (t.fillStyle = this.legendColorBackground),
                    t.fillRect(
                      this.x + this.xPadding,
                      this.getLineHeight(n + 1) - this.fontSize / 2,
                      this.fontSize,
                      this.fontSize,
                    ),
                    (t.fillStyle = this.legendColors[n].fill),
                    t.fillRect(
                      this.x + this.xPadding,
                      this.getLineHeight(n + 1) - this.fontSize / 2,
                      this.fontSize,
                      this.fontSize,
                    );
                },
                this,
              );
          }
        },
      })),
      (n.Scale = n.Element.extend({
        initialize() {
          this.fit();
        },
        buildYLabels() {
          this.yLabels = [];
          for (let t = v(this.stepValue), e = 0; e <= this.steps; e++)
            this.yLabels.push(
              w(this.templateString, {
                value: (this.min + e * this.stepValue).toFixed(t),
              }),
            );
          this.yLabelWidth =
            this.display && this.showLabels
              ? N(this.ctx, this.font, this.yLabels)
              : 0;
        },
        addXLabel(t) {
          this.xLabels.push(t), this.valuesCount++, this.fit();
        },
        removeXLabel() {
          this.xLabels.shift(), this.valuesCount--, this.fit();
        },
        fit() {
          (this.startPoint = this.display ? this.fontSize : 0),
            (this.endPoint = this.display
              ? this.height - 1.5 * this.fontSize - 5
              : this.height),
            (this.startPoint += this.padding),
            (this.endPoint -= this.padding);
          let t,
            e = this.endPoint - this.startPoint;
          for (
            this.calculateYRange(e),
              this.buildYLabels(),
              this.calculateXLabelRotation();
            e > this.endPoint - this.startPoint;

          )
            (e = this.endPoint - this.startPoint),
              (t = this.yLabelWidth),
              this.calculateYRange(e),
              this.buildYLabels(),
              t < this.yLabelWidth && this.calculateXLabelRotation();
        },
        calculateXLabelRotation() {
          this.ctx.font = this.font;
          let t,
            e,
            n = this.ctx.measureText(this.xLabels[0]).width,
            i = this.ctx.measureText(
              this.xLabels[this.xLabels.length - 1],
            ).width;
          if (
            ((this.xScalePaddingRight = i / 2 + 3),
            (this.xScalePaddingLeft =
              n / 2 > this.yLabelWidth + 10 ? n / 2 : this.yLabelWidth + 10),
            (this.xLabelRotation = 0),
            this.display)
          ) {
            let o,
              s = N(this.ctx, this.font, this.xLabels);
            this.xLabelWidth = s;
            for (
              let r = Math.floor(this.calculateX(1) - this.calculateX(0)) - 6;
              (this.xLabelWidth > r && 0 === this.xLabelRotation) ||
              (this.xLabelWidth > r &&
                this.xLabelRotation <= 90 &&
                this.xLabelRotation > 0);

            )
              (o = Math.cos(y(this.xLabelRotation))),
                (t = o * n),
                (e = o * i),
                t + this.fontSize / 2 > this.yLabelWidth + 8 &&
                  (this.xScalePaddingLeft = t + this.fontSize / 2),
                (this.xScalePaddingRight = this.fontSize / 2),
                this.xLabelRotation++,
                (this.xLabelWidth = o * s);
            this.xLabelRotation > 0 &&
              (this.endPoint -= Math.sin(y(this.xLabelRotation)) * s + 3);
          } else
            (this.xLabelWidth = 0),
              (this.xScalePaddingRight = this.padding),
              (this.xScalePaddingLeft = this.padding);
        },
        calculateYRange: c,
        drawingArea() {
          return this.startPoint - this.endPoint;
        },
        calculateY(t) {
          const e = this.drawingArea() / (this.min - this.max);
          return this.endPoint - e * (t - this.min);
        },
        calculateX(t) {
          let e =
              (this.xLabelRotation > 0,
              this.width - (this.xScalePaddingLeft + this.xScalePaddingRight)),
            n = e / (this.valuesCount - (this.offsetGridLines ? 0 : 1)),
            i = n * t + this.xScalePaddingLeft;
          return this.offsetGridLines && (i += n / 2), Math.round(i);
        },
        update(t) {
          i.extend(this, t), this.fit();
        },
        draw() {
          const t = this.ctx,
            e = (this.endPoint - this.startPoint) / this.steps,
            n = Math.round(this.xScalePaddingLeft);
          this.display &&
            ((t.fillStyle = this.textColor),
            (t.font = this.font),
            o(
              this.yLabels,
              function (o, s) {
                let r = this.endPoint - e * s,
                  a = Math.round(r),
                  l = this.showHorizontalLines;
                (t.textAlign = 'right'),
                  (t.textBaseline = 'middle'),
                  this.showLabels && t.fillText(o, n - 10, r),
                  0 !== s || l || (l = !0),
                  l && t.beginPath(),
                  s > 0
                    ? ((t.lineWidth = this.gridLineWidth),
                      (t.strokeStyle = this.gridLineColor))
                    : ((t.lineWidth = this.lineWidth),
                      (t.strokeStyle = this.lineColor)),
                  (a += i.aliasPixel(t.lineWidth)),
                  l &&
                    (t.moveTo(n, a),
                    t.lineTo(this.width, a),
                    t.stroke(),
                    t.closePath()),
                  (t.lineWidth = this.lineWidth),
                  (t.strokeStyle = this.lineColor),
                  t.beginPath(),
                  t.moveTo(n - 5, a),
                  t.lineTo(n, a),
                  t.stroke(),
                  t.closePath();
              },
              this,
            ),
            o(
              this.xLabels,
              function (e, n) {
                let i = this.calculateX(n) + x(this.lineWidth),
                  o =
                    this.calculateX(n - (this.offsetGridLines ? 0.5 : 0)) +
                    x(this.lineWidth),
                  s = this.xLabelRotation > 0,
                  r = this.showVerticalLines;
                0 !== n || r || (r = !0),
                  r && t.beginPath(),
                  n > 0
                    ? ((t.lineWidth = this.gridLineWidth),
                      (t.strokeStyle = this.gridLineColor))
                    : ((t.lineWidth = this.lineWidth),
                      (t.strokeStyle = this.lineColor)),
                  r &&
                    (t.moveTo(o, this.endPoint),
                    t.lineTo(o, this.startPoint - 3),
                    t.stroke(),
                    t.closePath()),
                  (t.lineWidth = this.lineWidth),
                  (t.strokeStyle = this.lineColor),
                  t.beginPath(),
                  t.moveTo(o, this.endPoint),
                  t.lineTo(o, this.endPoint + 5),
                  t.stroke(),
                  t.closePath(),
                  t.save(),
                  t.translate(i, s ? this.endPoint + 12 : this.endPoint + 8),
                  t.rotate(-1 * y(this.xLabelRotation)),
                  (t.font = this.font),
                  (t.textAlign = s ? 'right' : 'center'),
                  (t.textBaseline = s ? 'middle' : 'top'),
                  t.fillText(e, 0, 0),
                  t.restore();
              },
              this,
            ));
        },
      })),
      (n.RadialScale = n.Element.extend({
        initialize() {
          (this.size = m([this.height, this.width])),
            (this.drawingArea = this.display
              ? this.size / 2 - (this.fontSize / 2 + this.backdropPaddingY)
              : this.size / 2);
        },
        calculateCenterOffset(t) {
          const e = this.drawingArea / (this.max - this.min);
          return (t - this.min) * e;
        },
        update() {
          this.lineArc
            ? (this.drawingArea = this.display
                ? this.size / 2 - (this.fontSize / 2 + this.backdropPaddingY)
                : this.size / 2)
            : this.setScaleSize(),
            this.buildYLabels();
        },
        buildYLabels() {
          this.yLabels = [];
          for (let t = v(this.stepValue), e = 0; e <= this.steps; e++)
            this.yLabels.push(
              w(this.templateString, {
                value: (this.min + e * this.stepValue).toFixed(t),
              }),
            );
        },
        getCircumference() {
          return (2 * Math.PI) / this.valuesCount;
        },
        setScaleSize() {
          let t,
            e,
            n,
            i,
            o,
            s,
            r,
            a,
            l,
            h,
            c,
            u,
            d = m([
              this.height / 2 - this.pointLabelFontSize - 5,
              this.width / 2,
            ]),
            p = this.width,
            g = 0;
          for (
            this.ctx.font = R(
              this.pointLabelFontSize,
              this.pointLabelFontStyle,
              this.pointLabelFontFamily,
            ),
              e = 0;
            e < this.valuesCount;
            e++
          )
            (t = this.getPointPosition(e, d)),
              (n =
                this.ctx.measureText(
                  w(this.templateString, { value: this.labels[e] }),
                ).width + 5),
              0 === e || e === this.valuesCount / 2
                ? ((i = n / 2),
                  t.x + i > p && ((p = t.x + i), (o = e)),
                  t.x - i < g && ((g = t.x - i), (r = e)))
                : e < this.valuesCount / 2
                ? t.x + n > p && ((p = t.x + n), (o = e))
                : e > this.valuesCount / 2 &&
                  t.x - n < g &&
                  ((g = t.x - n), (r = e));
          (l = g),
            (h = Math.ceil(p - this.width)),
            (s = this.getIndexAngle(o)),
            (a = this.getIndexAngle(r)),
            (c = h / Math.sin(s + Math.PI / 2)),
            (u = l / Math.sin(a + Math.PI / 2)),
            (c = f(c) ? c : 0),
            (u = f(u) ? u : 0),
            (this.drawingArea = d - (u + c) / 2),
            this.setCenterPoint(u, c);
        },
        setCenterPoint(t, e) {
          const n = this.width - e - this.drawingArea,
            i = t + this.drawingArea;
          (this.xCenter = (i + n) / 2), (this.yCenter = this.height / 2);
        },
        getIndexAngle(t) {
          const e = (2 * Math.PI) / this.valuesCount;
          return t * e - Math.PI / 2;
        },
        getPointPosition(t, e) {
          const n = this.getIndexAngle(t);
          return {
            x: Math.cos(n) * e + this.xCenter,
            y: Math.sin(n) * e + this.yCenter,
          };
        },
        draw() {
          if (this.display) {
            const t = this.ctx;
            if (
              (o(
                this.yLabels,
                function (e, n) {
                  if (n > 0) {
                    let i,
                      o = n * (this.drawingArea / this.steps),
                      s = this.yCenter - o;
                    if (this.lineWidth > 0)
                      if (
                        ((t.strokeStyle = this.lineColor),
                        (t.lineWidth = this.lineWidth),
                        this.lineArc)
                      )
                        t.beginPath(),
                          t.arc(this.xCenter, this.yCenter, o, 0, 2 * Math.PI),
                          t.closePath(),
                          t.stroke();
                      else {
                        t.beginPath();
                        for (let r = 0; r < this.valuesCount; r++)
                          (i = this.getPointPosition(
                            r,
                            this.calculateCenterOffset(
                              this.min + n * this.stepValue,
                            ),
                          )),
                            0 === r ? t.moveTo(i.x, i.y) : t.lineTo(i.x, i.y);
                        t.closePath(), t.stroke();
                      }
                    if (this.showLabels) {
                      if (
                        ((t.font = R(
                          this.fontSize,
                          this.fontStyle,
                          this.fontFamily,
                        )),
                        this.showLabelBackdrop)
                      ) {
                        const a = t.measureText(e).width;
                        (t.fillStyle = this.backdropColor),
                          t.fillRect(
                            this.xCenter - a / 2 - this.backdropPaddingX,
                            s - this.fontSize / 2 - this.backdropPaddingY,
                            a + 2 * this.backdropPaddingX,
                            this.fontSize + 2 * this.backdropPaddingY,
                          );
                      }
                      (t.textAlign = 'center'),
                        (t.textBaseline = 'middle'),
                        (t.fillStyle = this.fontColor),
                        t.fillText(e, this.xCenter, s);
                    }
                  }
                },
                this,
              ),
              !this.lineArc)
            ) {
              (t.lineWidth = this.angleLineWidth),
                (t.strokeStyle = this.angleLineColor);
              for (let e = this.valuesCount - 1; e >= 0; e--) {
                if (this.angleLineWidth > 0) {
                  const n = this.getPointPosition(
                    e,
                    this.calculateCenterOffset(this.max),
                  );
                  t.beginPath(),
                    t.moveTo(this.xCenter, this.yCenter),
                    t.lineTo(n.x, n.y),
                    t.stroke(),
                    t.closePath();
                }
                const i = this.getPointPosition(
                  e,
                  this.calculateCenterOffset(this.max) + 5,
                );
                (t.font = R(
                  this.pointLabelFontSize,
                  this.pointLabelFontStyle,
                  this.pointLabelFontFamily,
                )),
                  (t.fillStyle = this.pointLabelFontColor);
                const s = this.labels.length,
                  r = this.labels.length / 2,
                  a = r / 2,
                  l = a > e || e > s - a,
                  h = e === a || e === s - a;
                (t.textAlign =
                  0 === e
                    ? 'center'
                    : e === r
                    ? 'center'
                    : r > e
                    ? 'left'
                    : 'right'),
                  (t.textBaseline = h ? 'middle' : l ? 'bottom' : 'top'),
                  t.fillText(this.labels[e], i.x, i.y);
              }
            }
          }
        },
      })),
      i.addEvent(
        window,
        'resize',
        (function () {
          let t;
          return function () {
            clearTimeout(t),
              (t = setTimeout(() => {
                o(n.instances, t => {
                  t.options.responsive && t.resize(t.render, !0);
                });
              }, 50));
          };
        })(),
      ),
      p
        ? define(() => {
            return n;
          })
        : 'object' === typeof module && module.exports && (module.exports = n),
      (t.Chart = n),
      (n.noConflict = function () {
        return (t.Chart = e), n;
      });
  }.call(this),
  function () {
    'use strict';
    const t = this,
      e = t.Chart,
      n = e.helpers,
      i = {
        scaleBeginAtZero: !0,
        scaleShowGridLines: !0,
        scaleGridLineColor: 'rgba(0,0,0,.05)',
        scaleGridLineWidth: 1,
        scaleShowHorizontalLines: !0,
        scaleShowVerticalLines: !0,
        barShowStroke: !0,
        barStrokeWidth: 2,
        barValueSpacing: 5,
        barDatasetSpacing: 1,
        legendTemplate:
          '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].fillColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>',
      };
    e.Type.extend({
      name: 'Bar',
      defaults: i,
      initialize(t) {
        const i = this.options;
        (this.ScaleClass = e.Scale.extend({
          offsetGridLines: !0,
          calculateBarX(t, e, n) {
            const o = this.calculateBaseWidth(),
              s = this.calculateX(n) - o / 2,
              r = this.calculateBarWidth(t);
            return s + r * e + e * i.barDatasetSpacing + r / 2;
          },
          calculateBaseWidth() {
            return (
              this.calculateX(1) - this.calculateX(0) - 2 * i.barValueSpacing
            );
          },
          calculateBarWidth(t) {
            const e = this.calculateBaseWidth() - (t - 1) * i.barDatasetSpacing;
            return e / t;
          },
        })),
          (this.datasets = []),
          this.options.showTooltips &&
            n.bindEvents(this, this.options.tooltipEvents, function (t) {
              const e = 'mouseout' !== t.type ? this.getBarsAtEvent(t) : [];
              this.eachBars(t => {
                t.restore(['fillColor', 'strokeColor']);
              }),
                n.each(e, t => {
                  (t.fillColor = t.highlightFill),
                    (t.strokeColor = t.highlightStroke);
                }),
                this.showTooltip(e);
            }),
          (this.BarClass = e.Rectangle.extend({
            strokeWidth: this.options.barStrokeWidth,
            showStroke: this.options.barShowStroke,
            ctx: this.chart.ctx,
          })),
          n.each(
            t.datasets,
            function (e) {
              const i = {
                label: e.label || null,
                fillColor: e.fillColor,
                strokeColor: e.strokeColor,
                bars: [],
              };
              this.datasets.push(i),
                n.each(
                  e.data,
                  function (n, o) {
                    i.bars.push(
                      new this.BarClass({
                        value: n,
                        label: t.labels[o],
                        datasetLabel: e.label,
                        strokeColor: e.strokeColor,
                        fillColor: e.fillColor,
                        highlightFill: e.highlightFill || e.fillColor,
                        highlightStroke: e.highlightStroke || e.strokeColor,
                      }),
                    );
                  },
                  this,
                );
            },
            this,
          ),
          this.buildScale(t.labels),
          (this.BarClass.prototype.base = this.scale.endPoint),
          this.eachBars(function (t, e, i) {
            n.extend(t, {
              width: this.scale.calculateBarWidth(this.datasets.length),
              x: this.scale.calculateBarX(this.datasets.length, i, e),
              y: this.scale.endPoint,
            }),
              t.save();
          }, this),
          this.render();
      },
      update() {
        this.scale.update(),
          n.each(this.activeElements, t => {
            t.restore(['fillColor', 'strokeColor']);
          }),
          this.eachBars(t => {
            t.save();
          }),
          this.render();
      },
      eachBars(t) {
        n.each(
          this.datasets,
          function (e, i) {
            n.each(e.bars, t, this, i);
          },
          this,
        );
      },
      getBarsAtEvent(t) {
        for (
          var e,
            i = [],
            o = n.getRelativePosition(t),
            s = function (t) {
              i.push(t.bars[e]);
            },
            r = 0;
          r < this.datasets.length;
          r++
        )
          for (e = 0; e < this.datasets[r].bars.length; e++)
            if (this.datasets[r].bars[e].inRange(o.x, o.y))
              return n.each(this.datasets, s), i;
        return i;
      },
      buildScale(t) {
        const e = this,
          i = function () {
            const t = [];
            return (
              e.eachBars(e => {
                t.push(e.value);
              }),
              t
            );
          },
          o = {
            templateString: this.options.scaleLabel,
            height: this.chart.height,
            width: this.chart.width,
            ctx: this.chart.ctx,
            textColor: this.options.scaleFontColor,
            fontSize: this.options.scaleFontSize,
            fontStyle: this.options.scaleFontStyle,
            fontFamily: this.options.scaleFontFamily,
            valuesCount: t.length,
            beginAtZero: this.options.scaleBeginAtZero,
            integersOnly: this.options.scaleIntegersOnly,
            calculateYRange(t) {
              const e = n.calculateScaleRange(
                i(),
                t,
                this.fontSize,
                this.beginAtZero,
                this.integersOnly,
              );
              n.extend(this, e);
            },
            xLabels: t,
            font: n.fontString(
              this.options.scaleFontSize,
              this.options.scaleFontStyle,
              this.options.scaleFontFamily,
            ),
            lineWidth: this.options.scaleLineWidth,
            lineColor: this.options.scaleLineColor,
            showHorizontalLines: this.options.scaleShowHorizontalLines,
            showVerticalLines: this.options.scaleShowVerticalLines,
            gridLineWidth: this.options.scaleShowGridLines
              ? this.options.scaleGridLineWidth
              : 0,
            gridLineColor: this.options.scaleShowGridLines
              ? this.options.scaleGridLineColor
              : 'rgba(0,0,0,0)',
            padding: this.options.showScale
              ? 0
              : this.options.barShowStroke
              ? this.options.barStrokeWidth
              : 0,
            showLabels: this.options.scaleShowLabels,
            display: this.options.showScale,
          };
        this.options.scaleOverride &&
          n.extend(o, {
            calculateYRange: n.noop,
            steps: this.options.scaleSteps,
            stepValue: this.options.scaleStepWidth,
            min: this.options.scaleStartValue,
            max:
              this.options.scaleStartValue +
              this.options.scaleSteps * this.options.scaleStepWidth,
          }),
          (this.scale = new this.ScaleClass(o));
      },
      addData(t, e) {
        n.each(
          t,
          function (t, n) {
            this.datasets[n].bars.push(
              new this.BarClass({
                value: t,
                label: e,
                x: this.scale.calculateBarX(
                  this.datasets.length,
                  n,
                  this.scale.valuesCount + 1,
                ),
                y: this.scale.endPoint,
                width: this.scale.calculateBarWidth(this.datasets.length),
                base: this.scale.endPoint,
                strokeColor: this.datasets[n].strokeColor,
                fillColor: this.datasets[n].fillColor,
              }),
            );
          },
          this,
        ),
          this.scale.addXLabel(e),
          this.update();
      },
      removeData() {
        this.scale.removeXLabel(),
          n.each(
            this.datasets,
            t => {
              t.bars.shift();
            },
            this,
          ),
          this.update();
      },
      reflow() {
        n.extend(this.BarClass.prototype, {
          y: this.scale.endPoint,
          base: this.scale.endPoint,
        });
        const t = n.extend({
          height: this.chart.height,
          width: this.chart.width,
        });
        this.scale.update(t);
      },
      draw(t) {
        const e = t || 1;
        this.clear();
        this.chart.ctx;
        this.scale.draw(e),
          n.each(
            this.datasets,
            function (t, i) {
              n.each(
                t.bars,
                function (t, n) {
                  t.hasValue() &&
                    ((t.base = this.scale.endPoint),
                    t
                      .transition(
                        {
                          x: this.scale.calculateBarX(
                            this.datasets.length,
                            i,
                            n,
                          ),
                          y: this.scale.calculateY(t.value),
                          width: this.scale.calculateBarWidth(
                            this.datasets.length,
                          ),
                        },
                        e,
                      )
                      .draw());
                },
                this,
              );
            },
            this,
          );
      },
    });
  }.call(this),
  function () {
    'use strict';
    const t = this,
      e = t.Chart,
      n = e.helpers,
      i = {
        segmentShowStroke: !0,
        segmentStrokeColor: '#fff',
        segmentStrokeWidth: 2,
        percentageInnerCutout: 50,
        animationSteps: 100,
        animationEasing: 'easeOutBounce',
        animateRotate: !0,
        animateScale: !1,
        legendTemplate:
          '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>',
      };
    e.Type.extend({
      name: 'Doughnut',
      defaults: i,
      initialize(t) {
        (this.segments = []),
          (this.outerRadius =
            (n.min([this.chart.width, this.chart.height]) -
              this.options.segmentStrokeWidth / 2) /
            2),
          (this.SegmentArc = e.Arc.extend({
            ctx: this.chart.ctx,
            x: this.chart.width / 2,
            y: this.chart.height / 2,
          })),
          this.options.showTooltips &&
            n.bindEvents(this, this.options.tooltipEvents, function (t) {
              const e = 'mouseout' !== t.type ? this.getSegmentsAtEvent(t) : [];
              n.each(this.segments, t => {
                t.restore(['fillColor']);
              }),
                n.each(e, t => {
                  t.fillColor = t.highlightColor;
                }),
                this.showTooltip(e);
            }),
          this.calculateTotal(t),
          n.each(
            t,
            function (t, e) {
              this.addData(t, e, !0);
            },
            this,
          ),
          this.render();
      },
      getSegmentsAtEvent(t) {
        const e = [],
          i = n.getRelativePosition(t);
        return (
          n.each(
            this.segments,
            t => {
              t.inRange(i.x, i.y) && e.push(t);
            },
            this,
          ),
          e
        );
      },
      addData(t, e, n) {
        const i = e || this.segments.length;
        this.segments.splice(
          i,
          0,
          new this.SegmentArc({
            value: t.value,
            outerRadius: this.options.animateScale ? 0 : this.outerRadius,
            innerRadius: this.options.animateScale
              ? 0
              : (this.outerRadius / 100) * this.options.percentageInnerCutout,
            fillColor: t.color,
            highlightColor: t.highlight || t.color,
            showStroke: this.options.segmentShowStroke,
            strokeWidth: this.options.segmentStrokeWidth,
            strokeColor: this.options.segmentStrokeColor,
            startAngle: 1.5 * Math.PI,
            circumference: this.options.animateRotate
              ? 0
              : this.calculateCircumference(t.value),
            label: t.label,
          }),
        ),
          n || (this.reflow(), this.update());
      },
      calculateCircumference(t) {
        return 2 * Math.PI * (t / this.total);
      },
      calculateTotal(t) {
        (this.total = 0),
          n.each(
            t,
            function (t) {
              this.total += t.value;
            },
            this,
          );
      },
      update() {
        this.calculateTotal(this.segments),
          n.each(this.activeElements, t => {
            t.restore(['fillColor']);
          }),
          n.each(this.segments, t => {
            t.save();
          }),
          this.render();
      },
      removeData(t) {
        const e = n.isNumber(t) ? t : this.segments.length - 1;
        this.segments.splice(e, 1), this.reflow(), this.update();
      },
      reflow() {
        n.extend(this.SegmentArc.prototype, {
          x: this.chart.width / 2,
          y: this.chart.height / 2,
        }),
          (this.outerRadius =
            (n.min([this.chart.width, this.chart.height]) -
              this.options.segmentStrokeWidth / 2) /
            2),
          n.each(
            this.segments,
            function (t) {
              t.update({
                outerRadius: this.outerRadius,
                innerRadius:
                  (this.outerRadius / 100) * this.options.percentageInnerCutout,
              });
            },
            this,
          );
      },
      draw(t) {
        const e = t ? t : 1;
        this.clear(),
          n.each(
            this.segments,
            function (t, n) {
              t.transition(
                {
                  circumference: this.calculateCircumference(t.value),
                  outerRadius: this.outerRadius,
                  innerRadius:
                    (this.outerRadius / 100) *
                    this.options.percentageInnerCutout,
                },
                e,
              ),
                (t.endAngle = t.startAngle + t.circumference),
                t.draw(),
                0 === n && (t.startAngle = 1.5 * Math.PI),
                n < this.segments.length - 1 &&
                  (this.segments[n + 1].startAngle = t.endAngle);
            },
            this,
          );
      },
    }),
      e.types.Doughnut.extend({
        name: 'Pie',
        defaults: n.merge(i, { percentageInnerCutout: 0 }),
      });
  }.call(this),
  function () {
    'use strict';
    const t = this,
      e = t.Chart,
      n = e.helpers,
      i = {
        scaleShowGridLines: !0,
        scaleGridLineColor: 'rgba(0,0,0,.05)',
        scaleGridLineWidth: 1,
        scaleShowHorizontalLines: !0,
        scaleShowVerticalLines: !0,
        bezierCurve: !0,
        bezierCurveTension: 0.4,
        pointDot: !0,
        pointDotRadius: 4,
        pointDotStrokeWidth: 1,
        pointHitDetectionRadius: 20,
        datasetStroke: !0,
        datasetStrokeWidth: 2,
        datasetFill: !0,
        legendTemplate:
          '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].strokeColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>',
      };
    e.Type.extend({
      name: 'Line',
      defaults: i,
      initialize(t) {
        (this.PointClass = e.Point.extend({
          strokeWidth: this.options.pointDotStrokeWidth,
          radius: this.options.pointDotRadius,
          display: this.options.pointDot,
          hitDetectionRadius: this.options.pointHitDetectionRadius,
          ctx: this.chart.ctx,
          inRange(t) {
            return (
              (t - this.x) ** 2 < (this.radius + this.hitDetectionRadius) ** 2
            );
          },
        })),
          (this.datasets = []),
          this.options.showTooltips &&
            n.bindEvents(this, this.options.tooltipEvents, function (t) {
              const e = 'mouseout' !== t.type ? this.getPointsAtEvent(t) : [];
              this.eachPoints(t => {
                t.restore(['fillColor', 'strokeColor']);
              }),
                n.each(e, t => {
                  (t.fillColor = t.highlightFill),
                    (t.strokeColor = t.highlightStroke);
                }),
                this.showTooltip(e);
            }),
          n.each(
            t.datasets,
            function (e) {
              const i = {
                label: e.label || null,
                fillColor: e.fillColor,
                strokeColor: e.strokeColor,
                pointColor: e.pointColor,
                pointStrokeColor: e.pointStrokeColor,
                points: [],
              };
              this.datasets.push(i),
                n.each(
                  e.data,
                  function (n, o) {
                    i.points.push(
                      new this.PointClass({
                        value: n,
                        label: t.labels[o],
                        datasetLabel: e.label,
                        strokeColor: e.pointStrokeColor,
                        fillColor: e.pointColor,
                        highlightFill: e.pointHighlightFill || e.pointColor,
                        highlightStroke:
                          e.pointHighlightStroke || e.pointStrokeColor,
                      }),
                    );
                  },
                  this,
                ),
                this.buildScale(t.labels),
                this.eachPoints(function (t, e) {
                  n.extend(t, {
                    x: this.scale.calculateX(e),
                    y: this.scale.endPoint,
                  }),
                    t.save();
                }, this);
            },
            this,
          ),
          this.render();
      },
      update() {
        this.scale.update(),
          n.each(this.activeElements, t => {
            t.restore(['fillColor', 'strokeColor']);
          }),
          this.eachPoints(t => {
            t.save();
          }),
          this.render();
      },
      eachPoints(t) {
        n.each(
          this.datasets,
          function (e) {
            n.each(e.points, t, this);
          },
          this,
        );
      },
      getPointsAtEvent(t) {
        const e = [],
          i = n.getRelativePosition(t);
        return (
          n.each(
            this.datasets,
            t => {
              n.each(t.points, t => {
                t.inRange(i.x, i.y) && e.push(t);
              });
            },
            this,
          ),
          e
        );
      },
      buildScale(t) {
        const i = this,
          o = function () {
            const t = [];
            return (
              i.eachPoints(e => {
                t.push(e.value);
              }),
              t
            );
          },
          s = {
            templateString: this.options.scaleLabel,
            height: this.chart.height,
            width: this.chart.width,
            ctx: this.chart.ctx,
            textColor: this.options.scaleFontColor,
            fontSize: this.options.scaleFontSize,
            fontStyle: this.options.scaleFontStyle,
            fontFamily: this.options.scaleFontFamily,
            valuesCount: t.length,
            beginAtZero: this.options.scaleBeginAtZero,
            integersOnly: this.options.scaleIntegersOnly,
            calculateYRange(t) {
              const e = n.calculateScaleRange(
                o(),
                t,
                this.fontSize,
                this.beginAtZero,
                this.integersOnly,
              );
              n.extend(this, e);
            },
            xLabels: t,
            font: n.fontString(
              this.options.scaleFontSize,
              this.options.scaleFontStyle,
              this.options.scaleFontFamily,
            ),
            lineWidth: this.options.scaleLineWidth,
            lineColor: this.options.scaleLineColor,
            showHorizontalLines: this.options.scaleShowHorizontalLines,
            showVerticalLines: this.options.scaleShowVerticalLines,
            gridLineWidth: this.options.scaleShowGridLines
              ? this.options.scaleGridLineWidth
              : 0,
            gridLineColor: this.options.scaleShowGridLines
              ? this.options.scaleGridLineColor
              : 'rgba(0,0,0,0)',
            padding: this.options.showScale
              ? 0
              : this.options.pointDotRadius + this.options.pointDotStrokeWidth,
            showLabels: this.options.scaleShowLabels,
            display: this.options.showScale,
          };
        this.options.scaleOverride &&
          n.extend(s, {
            calculateYRange: n.noop,
            steps: this.options.scaleSteps,
            stepValue: this.options.scaleStepWidth,
            min: this.options.scaleStartValue,
            max:
              this.options.scaleStartValue +
              this.options.scaleSteps * this.options.scaleStepWidth,
          }),
          (this.scale = new e.Scale(s));
      },
      addData(t, e) {
        n.each(
          t,
          function (t, n) {
            this.datasets[n].points.push(
              new this.PointClass({
                value: t,
                label: e,
                x: this.scale.calculateX(this.scale.valuesCount + 1),
                y: this.scale.endPoint,
                strokeColor: this.datasets[n].pointStrokeColor,
                fillColor: this.datasets[n].pointColor,
              }),
            );
          },
          this,
        ),
          this.scale.addXLabel(e),
          this.update();
      },
      removeData() {
        this.scale.removeXLabel(),
          n.each(
            this.datasets,
            t => {
              t.points.shift();
            },
            this,
          ),
          this.update();
      },
      reflow() {
        const t = n.extend({
          height: this.chart.height,
          width: this.chart.width,
        });
        this.scale.update(t);
      },
      draw(t) {
        const e = t || 1;
        this.clear();
        const i = this.chart.ctx,
          o = function (t) {
            return null !== t.value;
          },
          s = function (t, e, i) {
            return n.findNextWhere(e, o, i) || t;
          },
          r = function (t, e, i) {
            return n.findPreviousWhere(e, o, i) || t;
          };
        this.scale.draw(e),
          n.each(
            this.datasets,
            function (t) {
              const a = n.where(t.points, o);
              n.each(
                t.points,
                function (t, n) {
                  t.hasValue() &&
                    t.transition(
                      {
                        y: this.scale.calculateY(t.value),
                        x: this.scale.calculateX(n),
                      },
                      e,
                    );
                },
                this,
              ),
                this.options.bezierCurve &&
                  n.each(
                    a,
                    function (t, e) {
                      const i =
                        e > 0 && e < a.length - 1
                          ? this.options.bezierCurveTension
                          : 0;
                      (t.controlPoints = n.splineCurve(
                        r(t, a, e),
                        t,
                        s(t, a, e),
                        i,
                      )),
                        t.controlPoints.outer.y > this.scale.endPoint
                          ? (t.controlPoints.outer.y = this.scale.endPoint)
                          : t.controlPoints.outer.y < this.scale.startPoint &&
                            (t.controlPoints.outer.y = this.scale.startPoint),
                        t.controlPoints.inner.y > this.scale.endPoint
                          ? (t.controlPoints.inner.y = this.scale.endPoint)
                          : t.controlPoints.inner.y < this.scale.startPoint &&
                            (t.controlPoints.inner.y = this.scale.startPoint);
                    },
                    this,
                  ),
                (i.lineWidth = this.options.datasetStrokeWidth),
                (i.strokeStyle = t.strokeColor),
                i.beginPath(),
                n.each(
                  a,
                  function (t, e) {
                    if (0 === e) i.moveTo(t.x, t.y);
                    else if (this.options.bezierCurve) {
                      const n = r(t, a, e);
                      i.bezierCurveTo(
                        n.controlPoints.outer.x,
                        n.controlPoints.outer.y,
                        t.controlPoints.inner.x,
                        t.controlPoints.inner.y,
                        t.x,
                        t.y,
                      );
                    } else i.lineTo(t.x, t.y);
                  },
                  this,
                ),
                i.stroke(),
                this.options.datasetFill &&
                  a.length > 0 &&
                  (i.lineTo(a[a.length - 1].x, this.scale.endPoint),
                  i.lineTo(a[0].x, this.scale.endPoint),
                  (i.fillStyle = t.fillColor),
                  i.closePath(),
                  i.fill()),
                n.each(a, t => {
                  t.draw();
                });
            },
            this,
          );
      },
    });
  }.call(this),
  function () {
    'use strict';
    const t = this,
      e = t.Chart,
      n = e.helpers,
      i = {
        scaleShowLabelBackdrop: !0,
        scaleBackdropColor: 'rgba(255,255,255,0.75)',
        scaleBeginAtZero: !0,
        scaleBackdropPaddingY: 2,
        scaleBackdropPaddingX: 2,
        scaleShowLine: !0,
        segmentShowStroke: !0,
        segmentStrokeColor: '#fff',
        segmentStrokeWidth: 2,
        animationSteps: 100,
        animationEasing: 'easeOutBounce',
        animateRotate: !0,
        animateScale: !1,
        legendTemplate:
          '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>',
      };
    e.Type.extend({
      name: 'PolarArea',
      defaults: i,
      initialize(t) {
        (this.segments = []),
          (this.SegmentArc = e.Arc.extend({
            showStroke: this.options.segmentShowStroke,
            strokeWidth: this.options.segmentStrokeWidth,
            strokeColor: this.options.segmentStrokeColor,
            ctx: this.chart.ctx,
            innerRadius: 0,
            x: this.chart.width / 2,
            y: this.chart.height / 2,
          })),
          (this.scale = new e.RadialScale({
            display: this.options.showScale,
            fontStyle: this.options.scaleFontStyle,
            fontSize: this.options.scaleFontSize,
            fontFamily: this.options.scaleFontFamily,
            fontColor: this.options.scaleFontColor,
            showLabels: this.options.scaleShowLabels,
            showLabelBackdrop: this.options.scaleShowLabelBackdrop,
            backdropColor: this.options.scaleBackdropColor,
            backdropPaddingY: this.options.scaleBackdropPaddingY,
            backdropPaddingX: this.options.scaleBackdropPaddingX,
            lineWidth: this.options.scaleShowLine
              ? this.options.scaleLineWidth
              : 0,
            lineColor: this.options.scaleLineColor,
            lineArc: !0,
            width: this.chart.width,
            height: this.chart.height,
            xCenter: this.chart.width / 2,
            yCenter: this.chart.height / 2,
            ctx: this.chart.ctx,
            templateString: this.options.scaleLabel,
            valuesCount: t.length,
          })),
          this.updateScaleRange(t),
          this.scale.update(),
          n.each(
            t,
            function (t, e) {
              this.addData(t, e, !0);
            },
            this,
          ),
          this.options.showTooltips &&
            n.bindEvents(this, this.options.tooltipEvents, function (t) {
              const e = 'mouseout' !== t.type ? this.getSegmentsAtEvent(t) : [];
              n.each(this.segments, t => {
                t.restore(['fillColor']);
              }),
                n.each(e, t => {
                  t.fillColor = t.highlightColor;
                }),
                this.showTooltip(e);
            }),
          this.render();
      },
      getSegmentsAtEvent(t) {
        const e = [],
          i = n.getRelativePosition(t);
        return (
          n.each(
            this.segments,
            t => {
              t.inRange(i.x, i.y) && e.push(t);
            },
            this,
          ),
          e
        );
      },
      addData(t, e, n) {
        const i = e || this.segments.length;
        this.segments.splice(
          i,
          0,
          new this.SegmentArc({
            fillColor: t.color,
            highlightColor: t.highlight || t.color,
            label: t.label,
            value: t.value,
            outerRadius: this.options.animateScale
              ? 0
              : this.scale.calculateCenterOffset(t.value),
            circumference: this.options.animateRotate
              ? 0
              : this.scale.getCircumference(),
            startAngle: 1.5 * Math.PI,
          }),
        ),
          n || (this.reflow(), this.update());
      },
      removeData(t) {
        const e = n.isNumber(t) ? t : this.segments.length - 1;
        this.segments.splice(e, 1), this.reflow(), this.update();
      },
      calculateTotal(t) {
        (this.total = 0),
          n.each(
            t,
            function (t) {
              this.total += t.value;
            },
            this,
          ),
          (this.scale.valuesCount = this.segments.length);
      },
      updateScaleRange(t) {
        const e = [];
        n.each(t, t => {
          e.push(t.value);
        });
        const i = this.options.scaleOverride
          ? {
              steps: this.options.scaleSteps,
              stepValue: this.options.scaleStepWidth,
              min: this.options.scaleStartValue,
              max:
                this.options.scaleStartValue +
                this.options.scaleSteps * this.options.scaleStepWidth,
            }
          : n.calculateScaleRange(
              e,
              n.min([this.chart.width, this.chart.height]) / 2,
              this.options.scaleFontSize,
              this.options.scaleBeginAtZero,
              this.options.scaleIntegersOnly,
            );
        n.extend(this.scale, i, {
          size: n.min([this.chart.width, this.chart.height]),
          xCenter: this.chart.width / 2,
          yCenter: this.chart.height / 2,
        });
      },
      update() {
        this.calculateTotal(this.segments),
          n.each(this.segments, t => {
            t.save();
          }),
          this.render();
      },
      reflow() {
        n.extend(this.SegmentArc.prototype, {
          x: this.chart.width / 2,
          y: this.chart.height / 2,
        }),
          this.updateScaleRange(this.segments),
          this.scale.update(),
          n.extend(this.scale, {
            xCenter: this.chart.width / 2,
            yCenter: this.chart.height / 2,
          }),
          n.each(
            this.segments,
            function (t) {
              t.update({
                outerRadius: this.scale.calculateCenterOffset(t.value),
              });
            },
            this,
          );
      },
      draw(t) {
        const e = t || 1;
        this.clear(),
          n.each(
            this.segments,
            function (t, n) {
              t.transition(
                {
                  circumference: this.scale.getCircumference(),
                  outerRadius: this.scale.calculateCenterOffset(t.value),
                },
                e,
              ),
                (t.endAngle = t.startAngle + t.circumference),
                0 === n && (t.startAngle = 1.5 * Math.PI),
                n < this.segments.length - 1 &&
                  (this.segments[n + 1].startAngle = t.endAngle),
                t.draw();
            },
            this,
          ),
          this.scale.draw();
      },
    });
  }.call(this),
  function () {
    'use strict';
    const t = this,
      e = t.Chart,
      n = e.helpers;
    e.Type.extend({
      name: 'Radar',
      defaults: {
        scaleShowLine: !0,
        angleShowLineOut: !0,
        scaleShowLabels: !1,
        scaleBeginAtZero: !0,
        angleLineColor: 'rgba(0,0,0,.1)',
        angleLineWidth: 1,
        pointLabelFontFamily: "'Arial'",
        pointLabelFontStyle: 'normal',
        pointLabelFontSize: 10,
        pointLabelFontColor: '#666',
        pointDot: !0,
        pointDotRadius: 3,
        pointDotStrokeWidth: 1,
        pointHitDetectionRadius: 20,
        datasetStroke: !0,
        datasetStrokeWidth: 2,
        datasetFill: !0,
        legendTemplate:
          '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].strokeColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>',
      },
      initialize(t) {
        (this.PointClass = e.Point.extend({
          strokeWidth: this.options.pointDotStrokeWidth,
          radius: this.options.pointDotRadius,
          display: this.options.pointDot,
          hitDetectionRadius: this.options.pointHitDetectionRadius,
          ctx: this.chart.ctx,
        })),
          (this.datasets = []),
          this.buildScale(t),
          this.options.showTooltips &&
            n.bindEvents(this, this.options.tooltipEvents, function (t) {
              const e = 'mouseout' !== t.type ? this.getPointsAtEvent(t) : [];
              this.eachPoints(t => {
                t.restore(['fillColor', 'strokeColor']);
              }),
                n.each(e, t => {
                  (t.fillColor = t.highlightFill),
                    (t.strokeColor = t.highlightStroke);
                }),
                this.showTooltip(e);
            }),
          n.each(
            t.datasets,
            function (e) {
              const i = {
                label: e.label || null,
                fillColor: e.fillColor,
                strokeColor: e.strokeColor,
                pointColor: e.pointColor,
                pointStrokeColor: e.pointStrokeColor,
                points: [],
              };
              this.datasets.push(i),
                n.each(
                  e.data,
                  function (n, o) {
                    let s;
                    this.scale.animation ||
                      (s = this.scale.getPointPosition(
                        o,
                        this.scale.calculateCenterOffset(n),
                      )),
                      i.points.push(
                        new this.PointClass({
                          value: n,
                          label: t.labels[o],
                          datasetLabel: e.label,
                          x: this.options.animation ? this.scale.xCenter : s.x,
                          y: this.options.animation ? this.scale.yCenter : s.y,
                          strokeColor: e.pointStrokeColor,
                          fillColor: e.pointColor,
                          highlightFill: e.pointHighlightFill || e.pointColor,
                          highlightStroke:
                            e.pointHighlightStroke || e.pointStrokeColor,
                        }),
                      );
                  },
                  this,
                );
            },
            this,
          ),
          this.render();
      },
      eachPoints(t) {
        n.each(
          this.datasets,
          function (e) {
            n.each(e.points, t, this);
          },
          this,
        );
      },
      getPointsAtEvent(t) {
        let e = n.getRelativePosition(t),
          i = n.getAngleFromPoint(
            { x: this.scale.xCenter, y: this.scale.yCenter },
            e,
          ),
          o = (2 * Math.PI) / this.scale.valuesCount,
          s = Math.round((i.angle - 1.5 * Math.PI) / o),
          r = [];
        return (
          (s >= this.scale.valuesCount || 0 > s) && (s = 0),
          i.distance <= this.scale.drawingArea &&
            n.each(this.datasets, t => {
              r.push(t.points[s]);
            }),
          r
        );
      },
      buildScale(t) {
        (this.scale = new e.RadialScale({
          display: this.options.showScale,
          fontStyle: this.options.scaleFontStyle,
          fontSize: this.options.scaleFontSize,
          fontFamily: this.options.scaleFontFamily,
          fontColor: this.options.scaleFontColor,
          showLabels: this.options.scaleShowLabels,
          showLabelBackdrop: this.options.scaleShowLabelBackdrop,
          backdropColor: this.options.scaleBackdropColor,
          backdropPaddingY: this.options.scaleBackdropPaddingY,
          backdropPaddingX: this.options.scaleBackdropPaddingX,
          lineWidth: this.options.scaleShowLine
            ? this.options.scaleLineWidth
            : 0,
          lineColor: this.options.scaleLineColor,
          angleLineColor: this.options.angleLineColor,
          angleLineWidth: this.options.angleShowLineOut
            ? this.options.angleLineWidth
            : 0,
          pointLabelFontColor: this.options.pointLabelFontColor,
          pointLabelFontSize: this.options.pointLabelFontSize,
          pointLabelFontFamily: this.options.pointLabelFontFamily,
          pointLabelFontStyle: this.options.pointLabelFontStyle,
          height: this.chart.height,
          width: this.chart.width,
          xCenter: this.chart.width / 2,
          yCenter: this.chart.height / 2,
          ctx: this.chart.ctx,
          templateString: this.options.scaleLabel,
          labels: t.labels,
          valuesCount: t.datasets[0].data.length,
        })),
          this.scale.setScaleSize(),
          this.updateScaleRange(t.datasets),
          this.scale.buildYLabels();
      },
      updateScaleRange(t) {
        const e = (function () {
            let e = [];
            return (
              n.each(t, t => {
                t.data
                  ? (e = e.concat(t.data))
                  : n.each(t.points, t => {
                      e.push(t.value);
                    });
              }),
              e
            );
          })(),
          i = this.options.scaleOverride
            ? {
                steps: this.options.scaleSteps,
                stepValue: this.options.scaleStepWidth,
                min: this.options.scaleStartValue,
                max:
                  this.options.scaleStartValue +
                  this.options.scaleSteps * this.options.scaleStepWidth,
              }
            : n.calculateScaleRange(
                e,
                n.min([this.chart.width, this.chart.height]) / 2,
                this.options.scaleFontSize,
                this.options.scaleBeginAtZero,
                this.options.scaleIntegersOnly,
              );
        n.extend(this.scale, i);
      },
      addData(t, e) {
        this.scale.valuesCount++,
          n.each(
            t,
            function (t, n) {
              const i = this.scale.getPointPosition(
                this.scale.valuesCount,
                this.scale.calculateCenterOffset(t),
              );
              this.datasets[n].points.push(
                new this.PointClass({
                  value: t,
                  label: e,
                  x: i.x,
                  y: i.y,
                  strokeColor: this.datasets[n].pointStrokeColor,
                  fillColor: this.datasets[n].pointColor,
                }),
              );
            },
            this,
          ),
          this.scale.labels.push(e),
          this.reflow(),
          this.update();
      },
      removeData() {
        this.scale.valuesCount--,
          this.scale.labels.shift(),
          n.each(
            this.datasets,
            t => {
              t.points.shift();
            },
            this,
          ),
          this.reflow(),
          this.update();
      },
      update() {
        this.eachPoints(t => {
          t.save();
        }),
          this.reflow(),
          this.render();
      },
      reflow() {
        n.extend(this.scale, {
          width: this.chart.width,
          height: this.chart.height,
          size: n.min([this.chart.width, this.chart.height]),
          xCenter: this.chart.width / 2,
          yCenter: this.chart.height / 2,
        }),
          this.updateScaleRange(this.datasets),
          this.scale.setScaleSize(),
          this.scale.buildYLabels();
      },
      draw(t) {
        const e = t || 1,
          i = this.chart.ctx;
        this.clear(),
          this.scale.draw(),
          n.each(
            this.datasets,
            function (t) {
              n.each(
                t.points,
                function (t, n) {
                  t.hasValue() &&
                    t.transition(
                      this.scale.getPointPosition(
                        n,
                        this.scale.calculateCenterOffset(t.value),
                      ),
                      e,
                    );
                },
                this,
              ),
                (i.lineWidth = this.options.datasetStrokeWidth),
                (i.strokeStyle = t.strokeColor),
                i.beginPath(),
                n.each(
                  t.points,
                  (t, e) => {
                    0 === e ? i.moveTo(t.x, t.y) : i.lineTo(t.x, t.y);
                  },
                  this,
                ),
                i.closePath(),
                i.stroke(),
                (i.fillStyle = t.fillColor),
                i.fill(),
                n.each(t.points, t => {
                  t.hasValue() && t.draw();
                });
            },
            this,
          );
      },
    });
  }.call(this);
