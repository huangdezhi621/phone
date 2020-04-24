export default function copy(obj) {
  debugger
  var dst = obj.constructor === Array ? [] : {};
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if(typeof obj[prop] == 'object'){
        dst[prop] = copy(obj[prop])
      }else{
        dst[prop] = obj[prop];
      }
    }
  }
  return dst;
};
