var axios = require('axios') || {};

const {_post, _get} = axios;
const all_ajax_set = new Set();

const _axios = function () {
  return fn(axios,arguments)
};

extend(_axios,axios)

_axios.prototype = axios.prototype;

_axios.get = function () {
  return fn(_get,arguments)
}

_axios.post = function () {
  return fn(_post,arguments)
}

function extend(to, _from) {
  for (let key in _from) {
    to[key] = _from[key];
  }
  return to;
}

function fn(fn,arg){
  if(!fn)return;
  const JSON_opts = JSON.stringify(arg);
  if(all_ajax_set.has(JSON_opts)){
    return new Promise((resolve, reject) => {
      reject('重复提交!')
    });
  }
  all_ajax_set.add(JSON_opts);
  return new Promise((resolve, reject) => {
    fn.apply(null,arg).then(value => {
      resolve(value);
      all_ajax_set.delete(JSON_opts);
    }).catch(reason => {
      reject(reason);
      all_ajax_set.delete(JSON_opts);
    })
  });
}

export default _axios;
