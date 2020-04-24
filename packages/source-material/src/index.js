var CONFIRM_TEXT = '确定';
var CANCEL_TEXT = '取消';

var defaults = {
  title: '提示',
  message: '',
  type: '',
  url: '',
  video: false,
  music: false,
  closeOnPressEscape: true,
  showInput: false,
  showClose: true,
  modalFade: false,
  lockScroll: false,
  closeOnClickModal: true,
  inputValue: null,
  inputPlaceholder: '',
  inputPattern: null,
  inputValidator: null,
  inputErrorMessage: '',
  showConfirmButton: true,
  showCancelButton: false,
  confirmButtonPosition: 'right',
  confirmButtonHighlight: false,
  cancelButtonHighlight: false,
  confirmButtonText: CONFIRM_TEXT,
  cancelButtonText: CANCEL_TEXT,
  confirmButtonClass: '',
  cancelButtonClass: '',
};

import Vue from 'vue';
import source from './source-material.vue';
import merge from '@/util/merge';

var sourceConstructor = Vue.extend(source),
    currentMsg,     // 传递参数的copy对象
    instance,       // mapNav 组件实例化
    msgQueue = [];  // 传递的参数

const initInstance = function() {
  instance = new sourceConstructor({
    el: document.createElement('div')
  });
  instance.callback = defaultCallback;
};

const defaultCallback = action => {
  if (currentMsg) {
    var callback = currentMsg.callback;
    if (typeof callback === 'function') {
      if (instance.showInput) {
        callback(instance.inputValue, action);
      } else{
        callback(action);
      }
    }
    if (currentMsg.resolve) {
      if(action=='cancel'){
        currentMsg.reject('cancel');
      }else{
        currentMsg.resolve(action);
      }
    }
  }
};

const showNextMsg = function() {
  if(!instance){
    initInstance();
  }
  if (!instance.value || instance.closeTimer) {
    if (msgQueue.length > 0) {
      currentMsg = msgQueue.shift();
      var options = currentMsg.options;
      for (var prop in options) {
        if (options.hasOwnProperty(prop)) {
          instance[prop] = options[prop];
        }
      }
      options.beforeOpen && options.beforeOpen.call(instance);

      communicator();

      if (options.callback === undefined) {
        instance.callback = defaultCallback;
      }
      ['modal', 'showClose', 'closeOnClickModal', 'closeOnPressEscape'].forEach(prop => {
        if (instance[prop] === undefined) {
          instance[prop] = true;
        }
      });

      document.body.appendChild(instance.$el);

      Vue.nextTick(() => {
        instance.value = true;
      });
    }
  }
};

const communicator = () => {

  let lib = ['image','video','music'];

  let selectType;
  if(isNaN(parseInt(instance.selecType))){
    selectType= instance.selecType?1:0;
  }else{
    selectType= instance.selecType;
  }
  if(instance.video){
    instance.materialUrl = instance.imageboxUrl + "?isRadio=" + selectType;
  }else if(instance.music){
    instance.materialUrl = instance.imageboxUrl
  }else{
    instance.materialUrl = instance.imageboxUrl + "?selectType=" + selectType;
  }
  window.addEventListener("message", function funcListen(e) {
    let  data = e.data;
    if(typeof data !== 'string')return;
    if(/^go_back/.test(data)){
      instance.handleAction('cancel');
      window.removeEventListener('message',funcListen);
    }else{
      for(let val of lib){
        let reg = new RegExp('^' + val + '\\((.*)\\)$');
        if(reg.test(data)){
          try {
            let regData = RegExp.$1;
            let regNull = new RegExp('(.*),null$');
            if(regNull.test(regData)) instance.handleAction(JSON.parse(RegExp.$1));
            else instance.handleAction(JSON.parse(regData));
          }catch (e) {
            let regRadio = new RegExp('^' + val + "\\('(.*)','(.*)'\\)$");
            if(regRadio.test(data)){
                instance.handleAction([{id:RegExp.$1,url:RegExp.$2}]);
            }
          }
          window.removeEventListener('message',funcListen);
          break;
        }
      }
    }
  });

};

const Material = function(options, callback) {
  if (options.callback && !callback) {
    callback = options.callback;
  }

  if (typeof Promise !== 'undefined') {
    return new Promise(function(resolve, reject) {

      msgQueue.push({
        options: merge({}, defaults, Material.defaults || {}, options),
        callback: callback,
        resolve: resolve,
        reject: reject
      });

      showNextMsg();
    });
  } else {
    msgQueue.push({
      options: merge({}, defaults, Material.defaults || {}, options),
      callback: callback
    });

    showNextMsg();
  }
};

Material.setDefaults = function(defaults) {
  Material.defaults = defaults;
};

Material.show = function(options) {
  if(!this instanceof Vue){
    throw new Error('Please call in the instance object of the Vue');
  }

  return Material(merge({
    $type: 'material'
  }, options));
};

Material.close = function() {
  if (!instance) return;
  instance = [];
  msgQueue = [];
  currentMsg = null;
};

export default Material;
