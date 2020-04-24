<template>
    <section class="source-material">
        <div class="mint-msgbox" v-show="value" :style="{width:width+'px',height:height+'px'}">
            <iframe :src="materialUrl" :width="width" :height="height" ref="material"></iframe>
        </div>
    </section>
</template>
<script>
  import Popup from '@/util/popup/index.js';

  export default {
    mixins: [Popup],
    data() {
      return {
        materialUrl: '',
        imageboxUrl: '',
        selecType: false,
        width: 820,
        height: 500,
      }
    },
    watch: {
      value(_new) {
        let overflow = '';
        if (_new) {
          overflow = 'hidden';
          this.$refs.material.style.display = 'none';
          setTimeout(() => {
            this.$refs.material.style.display = '';
          }, 200);
        }else {
          overflow = '';
        }
        document.getElementsByTagName('html')[0].style.overflow = overflow;
        document.getElementsByTagName('body')[0].style.overflow = overflow;
      }
    },
    methods: {
      doClose() {
        this.value = false;
        this._closing = true;
        this.onClose && this.onClose();
        setTimeout(() => {
          if (this.modal && this.bodyOverflow !== 'hidden') {
            document.body.style.overflow = this.bodyOverflow;
            document.body.style.paddingRight = this.bodyPaddingRight;
          }
          this.bodyOverflow = null;
          this.bodyPaddingRight = null;
        }, 200);
        this.opened = false;
        if (!this.transition) {
          this.doAfterClose();
        }
      },
      handleAction(action) {
        this.value = false;
        this.callback(action);
      },
      onClose() {
        this.callback('cancel')
      }
    },
  }

</script>
