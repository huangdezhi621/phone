

var util = {

  /***
   * 按照一定长度分割数组
   * arr 传过来的数组
   * length 按照这个长度分割
   * return 二维数组
   */
  division(arr,length){
    var array = [[]],key=0;
    for(let i=0,j=0;i<arr.length;i++,j++){
      if(i&&i%length==0){
        j = 0;
        ++key;
      }
      if(!array[key])array[key]=[];
      array[key][j] = arr[i];
    }
    return array;
  },

  /**
   * 深复制
   * @param src
   * @returns {{}}
   */
  copy(obj) {
    var dst = obj.constructor === Array ? [] : {};
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        if(typeof obj[prop] == 'object'){
          dst[prop] = this.copy(obj[prop])
        }else{
          dst[prop] = obj[prop];
        }
      }
    }
    return dst;
  },

};

export default util
