var $app = function () {
  function z(e, t, s = "") {
    let r = `${s}[${t}]`;
    if (t === i.SYNC) {
      r += `, ${s}[${i.MODEL}]`;
    }
    let n = Array.from(e.querySelectorAll(r.replaceAll(":", "\\:"))).filter(o => o instanceof HTMLElement && o.parentElement && !o.parentElement.closest(`[${i.FOR}]`));
    if (t !== i.FOR) {
      n = n.filter(o => !o.hasAttribute(i.FOR));
    }
    if (e.hasAttribute(t)) {
      n.push(e);
    }
    return n;
  }
  function J(e, t, s) {
    const r = t.split(".");
    const n = r.pop() || "";
    const o = r.reduce((c, a) => c[a], e);
    o[n] = s;
  }
  function w(e, t) {
    if (!e || !t) {
      return;
    } else {
      return t.split(".").reduce((r, n) => r && r[n], e);
    }
  }
  function Z() {
    var t;
    const e = document.createElement("style");
    e.title = "soFetch - Global Styles";
    document.head.appendChild(e);
    if ((t = e.sheet) != null) {
      t.insertRule(`[${i.FOR}] {display: none;}`);
    }
  }
  function tt() {
    return document.documentElement.hasAttribute("data-wf-domain");
  }
  async function et(e) {
    await X(e);
    if (!e) {
      document.dispatchEvent(new Event("readystatechange"));
    }
  }
  function it(e, t = 100, s = false) {
    let r;
    return function (...n) {
      const o = this;
      const c = function () {
        r = void 0;
        if (!s) {
          e.apply(o, n);
        }
      };
      const a = s && !r;
      clearTimeout(r);
      r = setTimeout(c, t);
      if (a) {
        e.apply(o, n);
      }
    };
  }
  async function* ct(e) {
    /\r?\n/;
    new TextDecoder;
    e.read();
  }
  var h = {};
  var ut = Object.defineProperty;
  var lt = (h, i, l) => i in h ? ut(h, i, {enumerable: true, configurable: true, writable: true, value: l}) : h[i] = l;
  var A = (h, i, l) => (lt(h, typeof i != "symbol" ? i + "" : i, l), l);
  var ft = (h, i, l) => {
    if (!i.has(h)) {
      throw TypeError("Cannot " + l);
    }
  };
  var G = (h, i, l) => {
    if (i.has(h)) {
      throw TypeError("Cannot add the same private member more than once");
    }
    if (i instanceof WeakSet) {
      i.add(h);
    } else {
      i.set(h, l);
    }
  };
  var Y = (h, i, l) => (ft(h, i, "access private method"), l);
  var i = (e => (e.ID = "x-oid", e.TEXT = "x-text", e.HTML = "x-html", e.SYNC = "x-sync", e.MODEL = "x-model", e.SHOW = "x-show", e.FOR = "x-for", e.BIND_SRC = "x-bind:src", e.BIND_HREF = "x-bind:href", e.BIND_CHECKED = "x-bind:checked", e.BIND_VALUE = "x-bind:value", e.BIND_SELECTED = "x-bind:selected", e.BIND_CLASS = "x-bind:class", e.BIND_DISABLED = "x-bind:disabled", e.BIND_REQUIRED = "x-bind:required", e.ON_INPUT = "x-on:input", e.ON_CHANGE = "x-on:change", e.ON_CLICK = "x-on:click", e.ON_SUBMIT = "x-on:submit", e.ON_MOUNTED = "x-on:mounted", e))(i || {});
  var l = (e => (e.INPUT = "input", e.CHANGE = "change", e.CLICK = "click", e.SUBMIT = "submit", e))(l || {});
  const Q = (e = document) => e.documentElement.getAttribute("data-wf-site");
  const X = async e => {
    var s;
    var r;
    const {Webflow: t} = window;
    if (!!t && !!("destroy" in t) && !!("ready" in t) && !!("require" in t) && (!e || !!e.length)) {
      if (!e) {
        t.destroy();
        t.ready();
      }
      if (!e || e.includes("ix2")) {
        const n = t.require("ix2");
        if (n) {
          const {store: o, actions: c} = n;
          const {eventState: a} = o.getState().ixSession;
          const u = Object.entries(a);
          if (!e) {
            n.destroy();
          }
          n.init();
          await Promise.all(u.map(f => o.dispatch(c.eventStateChanged(...f))));
        }
      }
      if (!e || e.includes("commerce")) {
        const n = t.require("commerce");
        const o = Q();
        if (n && o) {
          n.destroy();
          n.init({siteId: o, apiUrl: "https://render.webflow.com"});
        }
      }
      if (e != null && e.includes("lightbox")) {
        if ((s = t.require("lightbox")) != null) {
          s.ready();
        }
      }
      if (e != null && e.includes("slider")) {
        const n = t.require("slider");
        if (n) {
          n.redraw();
          n.ready();
        }
      }
      if (e != null && e.includes("tabs")) {
        if ((r = t.require("tabs")) != null) {
          r.redraw();
        }
      }
      return new Promise(n => t.push(() => n(void 0)));
    }
  };
  class m {
    constructor(t, s, r = []) {
      A(this, "target");
      this.target = t;
      return new Proxy(this.target, this.createHandler(s, r));
    }
    createHandler(t, s) {
      return {set(r, n, o, c) {
        let a = null;
        if (r[n] === o) {
          return true;
        }
        if (Array.isArray(r[n])) {
          a = t.targetMap.get(r[n]);
        }
        const u = Reflect.set(r, n, o, c);
        if (a) {
          t.targetMap.delete(r[n]);
          t.targetMap.set(c[n], a);
        }
        t.trigger(c, n);
        if (window.$app.inspector && typeof window.$app.inspector == "function") {
          window.$app.inspector(t.name, t.store);
        }
        return u;
      }, get: function (r, n, o) {
        if (n === "_isProxy") {
          return true;
        } else {
          if (typeof r[n] != "function") {
            if (n in r && typeof r[n] == "object" && r[n] !== null && !r[n]._isProxy) {
              r[n] = new m(r[n], t, s.concat(n));
            }
            if (typeof n != "symbol" && t.activeEffect.el && t.activeEffect.fn && t.activeEffect.ctx) {
              t.watch(o, n, t.activeEffect.el, t.activeEffect.fn, t.activeEffect.ctx);
            }
          }
          return r[n];
        }
      }};
    }
  }
  const x = Object.create(null);
  const b = (e, t, s, r, n) => rt(e, t, `return(${s})`, r, n);
  const rt = (e, t, s, r, n) => {
    const o = x[s] || (x[s] = nt(s));
    try {
      return o(e, t, r, n);
    } catch (c) {
      console.error(c);
    }
  };
  const nt = e => {
    try {
      return new Function("$store", "$scope", "$el", "$event", `with($scope){${e}}`);
    } catch (t) {
      console.error(`${t.message} in expression: ${e}`);
      return () => {};
    }
  };
  const M = (e, t, s, r, n) => {
    n.preventDefault();
    b(e, t, `${s}`, r, n);
  };
  const st = it((e, t, s, r, n) => (n.preventDefault(), b(e, t, s, r, n)), 300);
  const T = (e, t, s) => {
    if (!(t instanceof HTMLInputElement) && !(t instanceof HTMLTextAreaElement) && !(t instanceof HTMLSelectElement)) {
      console.error(`${i.SYNC} only supports <input> elements.`);
      return;
    }
    const r = t.getAttribute(i.SYNC) || t.getAttribute(i.MODEL);
    if (r) {
      if (r.includes(".")) {
        const n = r.split(".");
        const o = n.pop();
        const c = w(s, n.join("."));
        t.value = c[o];
      } else {
        t.value = s[r];
      }
    }
  };
  const D = (e, t, s, r, n) => {
    if (!(r instanceof HTMLInputElement) && !(r instanceof HTMLTextAreaElement) && !(r instanceof HTMLSelectElement)) {
      console.error(`${i.SYNC} only supports <input> elements.`);
      return;
    }
    n.preventDefault();
    J(t, s, r.value);
  };
  const C = (e, t, s) => {
    const r = t.getAttribute(i.TEXT);
    if (r) {
      t.textContent = b(e.store, s, r, t);
    }
  };
  const _ = (e, t, s) => {
    if (!(t instanceof HTMLImageElement)) {
      console.error(`${i.BIND_SRC} only supports <src> elements.`);
      return;
    }
    const r = t.getAttribute(i.BIND_SRC);
    if (r) {
      t.src = b(e.store, s, r, t);
    }
  };
  const L = (e, t, s, r, n) => {
    n.preventDefault();
    b(e, t, `${s}`, r, n);
  };
  const O = (e, t, s) => {
    var o;
    const r = t.getAttribute(i.SHOW);
    const n = t.getAttribute(i.ID);
    if (r && n) {
      const c = b(e.store, s, r, t);
      t.style.display = c === true ? ((o = e.initialStateMap.get(n)) == null ? void 0 : o.display) || "block" : "none";
    }
  };
  const B = (e, t, s, r, n) => {
    n.preventDefault();
    n.stopPropagation();
    b(e, t, `${s}`, r, n);
  };
  const H = (e, t, s) => {
    var o;
    var c;
    var a;
    var u;
    if (!(t instanceof HTMLInputElement)) {
      console.error(`${i.BIND_CHECKED} only supports <input> elements.`);
      return;
    }
    const r = t.type === "checkbox" && ((o = t.previousElementSibling) == null ? void 0 : o.classList.contains("w-checkbox-input--inputType-custom")) || t.type === "radio" && ((c = t.previousElementSibling) == null ? void 0 : c.classList.contains("w-form-formradioinput--inputType-custom"));
    const n = t.getAttribute(i.BIND_CHECKED);
    if (n) {
      t.checked = b(e.store, s, n, t);
      if (r) {
        if (t.checked) {
          if ((a = t.previousElementSibling) != null) {
            a.classList.add("w--redirected-checked");
          }
        } else if ((u = t.previousElementSibling) != null) {
          u.classList.remove("w--redirected-checked");
        }
      }
    }
  };
  const R = (e, t, s) => {
    if (!(t instanceof HTMLAnchorElement)) {
      console.error(`${i.BIND_HREF} does not support <a> elements.`);
      return;
    }
    const r = t.getAttribute(i.BIND_HREF);
    if (r) {
      t.href = b(e.store, s, r, t);
    }
  };
  const $ = (e, t, s, r, n) => {
    n.preventDefault();
    n.stopPropagation();
    b(e, t, `${s}`, r, n);
  };
  const U = (e, t, s) => {
    if (!(t instanceof HTMLInputElement) && !(t instanceof HTMLOptionElement) && !(t instanceof HTMLTextAreaElement)) {
      console.error(`${i.BIND_VALUE} does not support <input> and <option> elements.`);
      return;
    }
    const r = t.getAttribute(i.BIND_VALUE);
    if (r) {
      t.value = b(e.store, s, r, t);
    }
  };
  const P = (e, t, s) => {
    if (!(t instanceof HTMLOptionElement)) {
      console.error(`${i.BIND_SELECTED} does not support <option> elements.`);
      return;
    }
    const r = t.getAttribute(i.BIND_SELECTED);
    if (r) {
      t.selected = b(e.store, s, r, t);
    }
  };
  const v = (e, t, s) => {
    const r = /^([a-zA-Z-_]+)\s+(?:if)\s+([\s\S]+)$/;
    const n = t.getAttribute(i.BIND_CLASS);
    const o = n && n.match(r);
    if (!o) {
      console.warn(`invalid x-bind:class expression: ${n}`);
      return;
    }
    const c = o[1].trim();
    const a = o[2].trim();
    if (a) {
      if (b(e.store, s, a, t)) {
        t.classList.add(c);
      } else {
        t.classList.remove(c);
      }
    }
  };
  const W = (e, t, s) => {
    const r = t.getAttribute(i.HTML);
    if (r) {
      t.innerHTML = b(e.store, s, r, t);
    }
  };
  const k = (e, t, s) => {
    if (!(t instanceof HTMLInputElement) && !(t instanceof HTMLTextAreaElement) && !(t instanceof HTMLButtonElement) && !(t instanceof HTMLSelectElement) && !(t instanceof HTMLOptionElement)) {
      console.error(`${i.BIND_DISABLED} only supports <input>, <textarea>, <button>, <select> & <option> elements.`);
      return;
    }
    const r = t.getAttribute(i.BIND_DISABLED);
    if (r) {
      t.disabled = b(e.store, s, r, t);
    }
  };
  const F = (e, t, s) => {
    if (!(t instanceof HTMLInputElement) && !(t instanceof HTMLTextAreaElement) && !(t instanceof HTMLSelectElement)) {
      console.error(`${i.BIND_REQUIRED} only supports <input>, <textarea>, <button>, <select> & <option> elements.`);
      return;
    }
    const r = t.getAttribute(i.BIND_REQUIRED);
    if (r) {
      t.required = b(e.store, s, r, t);
    }
  };
  const g = (e, t, s) => {
    const r = /^([a-zA-Z]+)\s+(?:in)\s+([\s\S]+)$/;
    const n = t.getAttribute(i.FOR);
    const o = n && n.match(r);
    if (!o) {
      console.warn(`invalid x-for expression: ${n}`);
      return;
    }
    const c = o[1].trim();
    const a = o[2].trim();
    const u = b(e.store, s, a, t);
    e.activeEffect = {fn: null, el: null, ctx: null};
    if (!u || !Array.isArray(u)) {
      return;
    }
    let f;
    let E;
    if (a.includes(".")) {
      const I = a.lastIndexOf(".");
      const S = a.substring(0, I);
      E = a.substring(I + 1);
      f = w(s, S);
    } else {
      E = a;
      f = s;
    }
    e.watch(f, E, t, g, s);
    for (e.watch(f[E], "__root__", t, g, s); t.parentElement && t.nextSibling;) {
      t.parentElement.removeChild(t.nextSibling);
    }
    u.forEach((I, S) => {
      var q;
      const p = t.cloneNode(true);
      p.removeAttribute(i.FOR);
      const d = Object.create(s);
      Object.defineProperties(d, Object.getOwnPropertyDescriptors({[c]: I, index: S}));
      e.registerAttribute(i.TEXT, d, p, C);
      e.registerAttribute(i.HTML, d, p, W);
      e.registerAttribute(i.SHOW, d, p, O);
      e.registerAttribute(i.BIND_VALUE, d, p, U);
      e.registerAttribute(i.BIND_SRC, d, p, _);
      e.registerAttribute(i.BIND_CHECKED, d, p, H);
      e.registerAttribute(i.BIND_SELECTED, d, p, P);
      e.registerAttribute(i.BIND_DISABLED, d, p, k);
      e.registerAttribute(i.BIND_REQUIRED, d, p, F);
      e.registerAttribute(i.BIND_HREF, d, p, R);
      e.registerAttribute(i.BIND_CLASS, d, p, v);
      e.registerAttribute(i.ON_INPUT, d, p, null, l.INPUT, M);
      e.registerAttribute(i.ON_CHANGE, d, p, null, l.CHANGE, $);
      e.registerAttribute(i.ON_CLICK, d, p, null, l.CLICK, L);
      e.registerAttribute(i.ON_SUBMIT, d, p, null, l.SUBMIT, B);
      e.registerAttribute(i.SYNC, d, p, T, l.INPUT, D);
      e.registerAttribute(i.FOR, d, p, g);
      if ((q = t.parentElement) != null) {
        q.appendChild(p);
      }
    });
  };
  class ot {
    constructor(t, s) {
      G(this, y);
      A(this, "name");
      A(this, "store");
      A(this, "initialStateMap");
      A(this, "activeEffect");
      A(this, "element");
      A(this, "targetMap");
      this.name = t;
      this.element = null;
      this.store = new m(s, this);
      this.targetMap = new WeakMap;
      this.initialStateMap = new Map;
      this.activeEffect = {fn: null, el: null, ctx: null};
    }
    mount(t) {
      var s;
      var r;
      if (t) {
        if (typeof t == "string") {
          this.element = document.querySelector(t);
        } else {
          this.element = t;
        }
      } else if (document.currentScript) {
        if (tt() && ((r = (s = document.currentScript) == null ? void 0 : s.parentElement) != null && r.parentElement)) {
          this.element = document.currentScript.parentElement.parentElement;
        } else {
          this.element = document.currentScript.parentElement;
        }
      }
      if (!this.element) {
        throw new Error(`element not found using selector  '${t}'`);
      }
      Array.from(this.element.querySelectorAll(`[${i.SHOW}]`)).forEach(n => {
        const o = crypto.randomUUID();
        n.setAttribute(i.ID, o);
        let c = getComputedStyle(n).display;
        if (n.classList.contains("w-form-done") || n.classList.contains("w-form-fail")) {
          c = "block";
        }
        this.initialStateMap.set(o, {display: c});
      });
      this.registerRootAttribute(i.BIND_VALUE, U);
      this.registerRootAttribute(i.BIND_SRC, _);
      this.registerRootAttribute(i.BIND_CHECKED, H);
      this.registerRootAttribute(i.BIND_SELECTED, P);
      this.registerRootAttribute(i.BIND_DISABLED, k);
      this.registerRootAttribute(i.BIND_REQUIRED, F);
      this.registerRootAttribute(i.BIND_HREF, R);
      this.registerRootAttribute(i.BIND_CLASS, v);
      this.registerRootAttribute(i.TEXT, C);
      this.registerRootAttribute(i.HTML, W);
      this.registerRootAttribute(i.SHOW, O);
      this.registerRootAttribute(i.ON_INPUT, null, l.INPUT, M);
      this.registerRootAttribute(i.ON_CHANGE, null, l.CHANGE, $);
      this.registerRootAttribute(i.ON_CLICK, null, l.CLICK, L);
      this.registerRootAttribute(i.ON_SUBMIT, null, l.SUBMIT, B);
      this.registerRootAttribute(i.SYNC, T, l.INPUT, D);
      this.registerRootAttribute(i.FOR, g);
      if (this.element.hasAttribute(i.ON_MOUNTED)) {
        const n = this.element.getAttribute(i.ON_MOUNTED);
        b(this.store, this.store, `${n}`, this.element);
      }
      return this;
    }
    registerAttribute(t, s, r, n, o, c) {
      z(r, t).forEach(u => {
        let f = u.getAttribute(t);
        if (u.hasAttribute(i.MODEL)) {
          console.warn("DEPRECATION WARNING: x-model is being replaced by x-sync and will be removed in a future release. Please update your code accordingly. For more information, see the x-sync documentation at https://shinyobjectlabs.gitbook.io/framework-js/attributes/x-sync");
        }
        if (!f && t === i.SYNC) {
          f = u.getAttribute(i.MODEL);
        }
        if (t === i.ON_INPUT && u instanceof HTMLInputElement && (u.type === "text" || u.type === "textarea")) {
          c = st;
        }
        if (f) {
          if (c && o) {
            u.addEventListener(o, E => {
              if (c && f) {
                c(this.store, s, f, u, E);
              }
            });
          }
          if (n) {
            Y(this, y, V).call(this, n, s, f, u);
          }
        }
      });
    }
    registerRootAttribute(t, s, r, n) {
      if (this.element) {
        this.registerAttribute(t, this.store, this.element, s, r, n);
      }
    }
    watch(t, s, r, n, o) {
      if (s === "" || typeof t != "object") {
        return;
      }
      const c = this.targetMap.get(t);
      if (c) {
        const a = c.get(s);
        if (a) {
          const u = a.get(r);
          if (u) {
            u.context = o;
            u.effects.add(n);
          } else {
            const f = new Set;
            f.add(n);
            const E = {context: o, effects: f};
            a.set(r, E);
          }
        } else {
          const u = new Set;
          u.add(n);
          const f = {context: o, effects: u};
          const E = new Map;
          E.set(r, f);
          c.set(s, E);
        }
      } else {
        const a = new Set;
        a.add(n);
        const u = {context: o, effects: a};
        const f = new Map;
        f.set(r, u);
        const E = new Map;
        E.set(s, f);
        this.targetMap.set(t, E);
      }
    }
    trigger(t, s) {
      const r = this.targetMap.get(t);
      if (r) {
        if (Array.isArray(t) || Array.isArray(t[s])) {
          for (let [n, o] of r) {
            this.processElementMap(o);
          }
        } else {
          const n = r.get(s);
          if (!n) {
            return;
          }
          this.processElementMap(n);
        }
      }
    }
    processElementMap(t) {
      const s = Array.from(t.keys());
      for (const r of s) {
        const n = t.get(r);
        if (!n) {
          return;
        }
        const o = Array.from(n.effects);
        for (let c of o) {
          if (!r) {
            t.delete(r);
            return;
          }
          const a = n.context || this.store;
          c(this, r, a);
        }
      }
    }
  }
  var y = new WeakSet;
  var V = function (t, s, r, n) {
    this.activeEffect.fn = t;
    if (this.activeEffect.fn) {
      this.activeEffect.el = n;
      this.activeEffect.ctx = s;
      this.activeEffect.fn(this, n, s);
    }
    this.activeEffect = {fn: null, el: null, ctx: null};
  };
  const N = {};
  const j = {};
  const K = {};
  h.inspector = void 0;
  console.log("SO-Framework v0.1.2");
  Z();
  const at = (e, t = {}) => (N[e] = new ot(e, t), N[e]);
  j.restartWebflow = async function (e) {
    await et(e);
  };
  K.ndjson = function (e) {
    return ct(e);
  };
  h.inspector = null;
  h.components = N;
  h.createComponent = at;
  h.generators = K;
  h.helpers = j;
  Object.defineProperty(h, Symbol.toStringTag, {value: "Module"});
  return h;
}();
