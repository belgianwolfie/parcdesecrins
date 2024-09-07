var $app = (function(h) {
  var y, V;
  "use strict";

  // Utility functions
  var defineProperty = Object.defineProperty;
  var setProperty = (obj, key, value) => key in obj ? defineProperty(obj, key, { enumerable: true, configurable: true, writable: true, value: value }) : obj[key] = value;
  var privateMethodCheck = (obj, weakMap, message) => { if (!weakMap.has(obj)) throw TypeError("Cannot " + message); };
  var addPrivateMethod = (obj, weakMap, value) => { if (weakMap.has(obj)) throw TypeError("Cannot add the same private member more than once"); weakMap instanceof WeakSet ? weakMap.add(obj) : weakMap.set(obj, value); };
  var accessPrivateMethod = (obj, weakMap, fn) => { privateMethodCheck(obj, weakMap, "access private method"); return fn; };

  // Attribute constants
  var i = (e => (
    e.ID = "x-oid", e.TEXT = "x-text", e.HTML = "x-html", e.SYNC = "x-sync", e.MODEL = "x-model", e.SHOW = "x-show", e.FOR = "x-for",
    e.BIND_SRC = "x-bind:src", e.BIND_HREF = "x-bind:href", e.BIND_CHECKED = "x-bind:checked", e.BIND_VALUE = "x-bind:value",
    e.BIND_SELECTED = "x-bind:selected", e.BIND_CLASS = "x-bind:class", e.BIND_DISABLED = "x-bind:disabled", e.BIND_REQUIRED = "x-bind:required",
    e.ON_INPUT = "x-on:input", e.ON_CHANGE = "x-on:change", e.ON_CLICK = "x-on:click", e.ON_SUBMIT = "x-on:submit", e.ON_MOUNTED = "x-on:mounted", e
  ))(i || {});

  // Event constants
  var l = (e => (e.INPUT = "input", e.CHANGE = "change", e.CLICK = "click", e.SUBMIT = "submit", e))(l || {});

  // Webflow initialization function
  const initWebflow = async (components) => {
    const { Webflow } = window;
    if (!Webflow || !("destroy" in Webflow) || !("ready" in Webflow) || !("require" in Webflow)) return;
    if (!components || components.length === 0) {
      Webflow.destroy();
      Webflow.ready();
    }
    if (!components || components.includes("ix2")) {
      const ix2 = Webflow.require("ix2");
      if (ix2) {
        const { store, actions } = ix2;
        const { eventState } = store.getState().ixSession;
        const stateEntries = Object.entries(eventState);
        if (!components) ix2.destroy();
        ix2.init();
        await Promise.all(stateEntries.map(entry => store.dispatch(actions.eventStateChanged(...entry))));
      }
    }
    if (!components || components.includes("commerce")) {
      const commerce = Webflow.require("commerce");
      const siteId = document.documentElement.getAttribute("data-wf-site");
      if (commerce && siteId) {
        commerce.destroy();
        commerce.init({ siteId, apiUrl: "https://render.webflow.com" });
      }
    }
    if (components && components.includes("lightbox")) {
      const lightbox = Webflow.require("lightbox");
      if (lightbox) lightbox.ready();
    }
    if (components && components.includes("slider")) {
      const slider = Webflow.require("slider");
      if (slider) {
        slider.redraw();
        slider.ready();
      }
    }
    return new Promise(resolve => Webflow.push(() => resolve(void 0)));
  };

  // Function to query elements with specified attributes
  function queryElements(root, attr, prefix = "") {
    let selector = `${prefix}[${attr}]`;
    if (attr === i.SYNC) selector += `, ${prefix}[${i.MODEL}]`;

    let elements = Array.from(root.querySelectorAll(selector.replaceAll(":", "\\:"))).filter(el => el instanceof HTMLElement && el.parentElement && !el.parentElement.closest(`[${i.FOR}]`));

    if (attr !== i.FOR) elements = elements.filter(el => !el.hasAttribute(i.FOR));

    if (root.hasAttribute(attr)) elements.push(root);

    return elements;
  }

  // Function to bind values to target object properties
  function bindValue(target, key, value) {
    const keys = key.split(".");
    const prop = keys.pop() || "";
    const obj = keys.reduce((acc, cur) => acc[cur], target);
    obj[prop] = value;
  }

  // Function to retrieve value from an object using dot notation
  function getValue(target, key) {
    return !target || !key ? void 0 : key.split(".").reduce((acc, cur) => acc && acc[cur], target);
  }

  // Utility to inject styles
  function injectGlobalStyles() {
    const style = document.createElement("style");
    style.title = "soFetch - Global Styles";
    document.head.appendChild(style);
    style.sheet?.insertRule(`[${i.FOR}] { display: none; }`);
  }

  // Watch for Webflow domain
  function isWebflowDomain() {
    return document.documentElement.hasAttribute("data-wf-domain");
  }

  // Restart Webflow with components
  async function restartWebflow(components) {
    await initWebflow(components);
    if (!components) document.dispatchEvent(new Event("readystatechange"));
  }

  // Proxy-based reactive class
  class ProxyHandler {
    constructor(target, handler, path = []) {
      setProperty(this, "target", target);
      return new Proxy(this.target, this.createHandler(handler, path));
    }

    createHandler(handler, path) {
      return {
        set: (obj, prop, value, receiver) => {
          if (obj[prop] === value) return true;

          const oldVal = Array.isArray(obj[prop]) ? handler.targetMap.get(obj[prop]) : null;
          const success = Reflect.set(obj, prop, value, receiver);

          if (oldVal) {
            handler.targetMap.delete(obj[prop]);
            handler.targetMap.set(receiver[prop], oldVal);
          }

          handler.trigger(receiver, prop);

          if (window.$app.inspector && typeof window.$app.inspector === "function") {
            window.$app.inspector(handler.name, handler.store);
          }

          return success;
        },

        get: (obj, prop, receiver) => {
          if (prop === "_isProxy") return true;

          if (typeof obj[prop] === "function") return obj[prop];

          if (prop in obj && typeof obj[prop] === "object" && obj[prop] !== null && !obj[prop]._isProxy) {
            obj[prop] = new ProxyHandler(obj[prop], handler, path.concat(prop));
          }

          if (typeof prop !== "symbol" && handler.activeEffect.el && handler.activeEffect.fn && handler.activeEffect.ctx) {
            handler.watch(receiver, prop, handler.activeEffect.el, handler.activeEffect.fn, handler.activeEffect.ctx);
          }

          return obj[prop];
        }
      };
    }
  }

  // Component manager
  class ComponentManager {
    constructor(name, store) {
      addPrivateMethod(this, y);
      setProperty(this, "name", name);
      setProperty(this, "store", new ProxyHandler(store, this));
      setProperty(this, "initialStateMap", new Map());
      setProperty(this, "activeEffect", { fn: null, el: null, ctx: null });
      setProperty(this, "element", null);
      setProperty(this, "targetMap", new WeakMap());
    }

    mount(selector) {
      if (typeof selector === "string") {
        this.element = document.querySelector(selector);
      } else if (selector) {
        this.element = selector;
      } else if (document.currentScript) {
        const parent = document.currentScript?.parentElement?.parentElement;
        this.element = isWebflowDomain() && parent ? parent : document.currentScript.parentElement;
      }

      if (!this.element) throw new Error(`Element not found using selector '${selector}'`);

      this.initializeComponentAttributes();

      if (this.element.hasAttribute(i.ON_MOUNTED)) {
        const mountedHandler = this.element.getAttribute(i.ON_MOUNTED);
        evaluateExpression(this.store, this.store, `${mountedHandler}`, this.element);
      }

      return this;
    }

    initializeComponentAttributes() {
      // Set up all attributes
      const attributes = [
        [i.BIND_VALUE, bindValueToElement],
        [i.BIND_SRC, bindSrcToElement],
        [i.BIND_CHECKED, bindCheckedToElement],
        [i.BIND_SELECTED, bindSelectedToElement],
        [i.BIND_DISABLED, bindDisabledToElement],
        [i.BIND_REQUIRED, bindRequiredToElement],
        [i.BIND_HREF, bindHrefToElement],
        [i.BIND_CLASS, bindClassToElement],
        [i.TEXT, bindTextToElement],
        [i.HTML, bindHtmlToElement],
        [i.SHOW, bindShowToElement],
        [i.ON_INPUT, null, l.INPUT, handleInputEvent],
        [i.ON_CHANGE, null, l.CHANGE, handleChangeEvent],
        [i.ON_CLICK, null, l.CLICK, handleClickEvent],
        [i.ON_SUBMIT, null, l.SUBMIT, handleSubmitEvent]
      ];

      for (const [attr, binder, event, handler] of attributes) {
        const elements = queryElements(this.element, attr);
        for (const el of elements) {
          if (binder) binder.call(this, el);
          if (event && handler) el.addEventListener(event, handler.bind(this));
        }
      }
    }

    // To be continued with more methods...

  }

  return { ComponentManager };
})(window);

// Example usage of the component manager
const appManager = new $app.ComponentManager("myApp", { exampleData: "Hello, World!" });
appManager.mount("#app");
