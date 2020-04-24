import popup from "element-ui/lib/utils/popup";

const visible = popup.watch.visible;

popup.watch.visible = function(to,from){
  if(to){
    parent.window.postMessage('openMask()', '*')
  }else{
    parent.window.postMessage('closeMask()', '*')
  }
  visible.call(this,to,from)
};
