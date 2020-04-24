// import Vue from 'vue';

import './util/popup.js';
import ElementUI from 'element-ui'
// Vue.use(ElementUI);
import jquery from 'jquery';
window.$ = window.jQuery = jquery;

// import axios from './util/axios.js';
// Vue.prototype.$axios = Vue.$axios = axios;

import material from 'packages/source-material/index.js'
import transfer from 'packages/transfer/index.js'
import wangEditor from 'packages/wangEditor/index.js'

const components = [
	transfer,
];

let elComponents = [];
Object.keys(ElementUI).forEach(row => {
  elComponents[row] = ElementUI[row];
});

const elinstall = elComponents.install;

const install = function(Vue, opts = {}) {

  elinstall(Vue,opts);

  components.map(component => {
    Vue.component(component.name, component);
  });
  Vue.prototype.$material = material.show;
  window.wangEditor = wangEditor;
};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

const gtComponents = {
  version: $$version,
  install,
  material,
  transfer,
  wangEditor,
};

module.exports = Object.assign(elComponents,gtComponents);

module.exports.default = module.exports;
