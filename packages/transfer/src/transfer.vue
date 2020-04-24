<template>
    <div class="gt-transfer">
        <el-dialog
                :title="title"
                :width="width"
                :top="top"
                :visible.sync="dialogVisible"
                :append-to-body="isBoolean">

            <slot></slot>

            <div class="gt-transfer-content">
                <div class="gt-transfer-left" v-if="label && data && prop">
                    <el-table
                            :data="data"
                            ref="multipleTable"
                            @selection-change="handleSelectionChange"
                            @row-click="handleRow"
                            @expand-change="handleExpand">

                        <el-table-column show-overflow-tooltip
                                         type="selection"
                                         :selectable="selectable">
                        </el-table-column>

                        <el-table-column show-overflow-tooltip
                                         v-for="(item,index) in label"
                                         :key="index"
                                         :prop="prop[index]"
                                         :label="item">
                        </el-table-column>

                        <el-table-column type="expand"
                                         :width="expandWidth"
                                         v-if="expand">
                            <template slot-scope="props">
                                <slot name="expand" v-bind="props"></slot>
                                <!--<el-checkbox v-for="item in props.row.spe" :label="item" :key="item">{{item}}</el-checkbox>-->
                            </template>
                        </el-table-column>

                    </el-table>
                </div>

                <slot name="right" v-if="right"></slot>
                <div class="gt-transfer-right" v-else>
                    <header>已选择：{{changeList.length}}</header>
                    <section>
                        <table cellspacing="0" cellpadding="0" border="0">
                            <tr v-for="(item) in changeList" v-if="item" :key="item.id">
                                <td>
                                    <span class="gt-transfer-fl-l gt-transfer-text-overflow">{{item[prop[0]]}}</span>
                                    <el-button type="text" size="mini" @click="tapRemvoe(item.id)">删除</el-button>
                                </td>
                            </tr>
                        </table>
                    </section>
                </div>
            </div>

            <div class="gt-transfer-footer" v-if="dialogVisible">
                <div class="inb-block">
                    <template v-if="total>pageSize">
                        <el-pagination background
                                       :page-size="pageSize"
                                       :current-page='page'
                                       layout="prev, pager, next, jumper"
                                       :total="total"
                                       :pager-count="5"
                                       @current-change="handleCurrentChange">
                        </el-pagination>
                    </template>
                </div>

                <div class="gt-transfer-fl-r">
                    <el-button @click="cancel">取消</el-button>
                    <el-button type="primary" @click="confirm">确认</el-button>
                </div>
            </div>

        </el-dialog>
    </div>
</template>

<script>
  import copy from '@/util/copy';

  export default {
    name: 'GtTransfer',
    props: {
      selectablenKey: {    //禁用某些复选框,selectablen
        type: String,
      },
      expandWidth: {
        type: String,
        default: '100px'
      },
      expand:{              //是否开启折叠
        type: Boolean,
        default: false
      },
      rowTabChange:{        //不用点击复选框，点击这一行其他地方都可以选中
        type: Boolean,
        default: true
      },
      right: {
        type: Boolean,       //右边选择是否自己重写
        default: false
      },
      data: {
        type: Array         //每页数据
      },
      maxLength: {
        type: [Number, String],  //最多选择多少个
        default: 0,
      },
      msg: {                //超过最多选中后的提示
        type: String
      },
      selected: {
        type: Array         //选中数据
      },
      prop: {
        type: Array         //key
      },
      label: {
        type: Array         //中文名称
      },
      visible: {
        type: Boolean       //是否显示
      },
      currentPage: {
        type: Number       //显示第几页
      },
      pageSize: {
        type: [Number, String]    //每页显示条目个数
      },
      pageCount: {
        type: [Number, String]  //总页数，total 和 page-count 设置任意一个就可以达到显示页码的功能；如果要支持 page-sizes 的更改，则需要使用 total 属性
      },
      total: {
        type: [Number, String]   //总条目数
      },
      title: {
        type: String
      },
      width: {
        type: String,
        default: '50%'
      },
      top: {
        type: String,
        default: '10vh'
      }
    },
    data() {
      return {
        dialogVisible: false, // 显示隐藏
        changeList: [],       // 选中的值
        page: 1,              // 当前第几页
        selectionold: [],     // 每页选中的值，类似watch的第二个参数
        stateSelect: false,  // data修改后会进handleSelectionChange方法传空数组，加个状态拦截下
        stateAutoSelect: false, //自动勾选中

        toSelect:[],    //取消还原数据
        isBoolean: true,
      }
    },
    watch: {
      data(){
        //防止data改完触发handleSelectionChange
        //data无论是否改变，都会触发handleSelectionChange，并且参数是[]
        if(!this.visible || this.stateSelect)return;
        this.stateSelect = true;
        this.select();
      },
      selected(_new) {
        if(JSON.stringify(this.changeList) == JSON.stringify(_new))return;
        this.changeList = [..._new];
        if(!this.visible || this.stateSelect)return;
        this.stateSelect = true;
        if(this.$refs.multipleTable)this.$refs.multipleTable.clearSelection();
        this.select();
      },
      visible(_new) {
        this.dialogVisible = _new;
        if (!_new) {
          this.page = 1;
          this.$refs.multipleTable.clearSelection();
        } else {
          this.toSelect = copy(this.selected);

          if(this.stateSelect || this.data.length <=0 )return;
          this.stateSelect = true;
          this.select();
        }
      },
      dialogVisible(_new) {
        if (_new != this.visible) {
          this.changeList = this.toSelect;
          this.$emit('update:visible', _new);
          this.$emit('cancel');
        }
      },
      changeList(_new, _old) {
        //超过了可选最大数
        if (_new.length > this.maxLength && this.maxLength > 0) {
          this.$message({
            message: this.msg || '最多不能超过' + this.maxLength + '个',
            type: 'warning'
          });
          this.$refs.multipleTable.toggleRowSelection(_new[_new.length - 1],false);
        }
        if(JSON.stringify(this.changeList) == JSON.stringify(this.selected))return;
        this.$emit('update:selected', [...this.changeList]);
      }
    },
    components: {},
    //实例初始化最之前，无法获取到data里的数据
    beforeCreate() {

    },
    //在挂载开始之前被调用
    beforeMount() {
      this.dialogVisible = this.visible;
    },
    //已成功挂载，相当ready()
    mounted() {
    },
    //相关操作事件
    methods: {
      selectable(row,index){
        if(this.selectablenKey)return row[this.selectablenKey] || false
        return true;
      },
      /**
       * 自动勾选复选框
       */
      select() {
        this.$nextTick(_ => {
          this.selectionold = [];
          this.stateSelect = false;
          this.stateAutoSelect = true;
          Array.isArray(this.changeList) && this.changeList.forEach(list => {
            this.data.forEach(row => {
              if (row.id == list.id) {
                this.$refs.multipleTable.toggleRowSelection(row,true);
              }
            });
          });
          this.stateAutoSelect = false;
        })
      },
      /**
       * 勾选复选框
       */
      handleSelectionChange(rows) {
        if(!this.visible || this.stateSelect)return;
        if(this.stateAutoSelect){
          this.selectionold = [...rows];
          return false;
        }
        if (rows.length < this.selectionold.length) {
          this.selectionold.forEach((row) => {
            if (rows.length == 0 || rows.findIndex(val => val.id == row.id) < 0) {
              this.changeList.splice(this.changeList.findIndex(val => val.id == row.id), 1);
            }
          });
        } else {
          if (this.changeList.length > 0) {
            rows.forEach(row => {
              if (this.changeList.findIndex(val => val.id == row.id) < 0) {
                this.changeList.push(row)
              }
            })
          } else {
            this.changeList = [...rows];
          }
        }
        this.selectionold = [...rows];
      },
      /**
       * 翻页
       * @param index
       */
      handleCurrentChange(index) {
        this.page = index;
        this.$emit('current-change', index);
      },
      /**
       * 确定
       */
      confirm() {
        this.$emit('update:visible', false);
        this.$emit('confirm', [...this.changeList]);
      },
      /**
       * 取消
       */
      cancel() {
        this.dialogVisible = false;
      },
      /**
       * 删除
       * @param id
       */
      tapRemvoe(id) {
        let index = this.data.findIndex(row => row.id == id);
        if(index >= 0){
          this.$refs.multipleTable.toggleRowSelection(this.data[index], false);
        }else{
          this.changeList.splice(this.changeList.findIndex(row => row.id == id),1)
        }
      },
      /**
       * 点击整行回调
       * @param row
       */
      handleRow(row){
        if(this.selectablenKey && !row[this.selectablenKey])return;
        if(this.rowTabChange)this.$refs.multipleTable.toggleRowSelection(row)
      },
      /**
       * 展开回调
       * @param row
       */
      handleExpand(row){
        new Promise((resolve, reject) => {
          this.$emit('current-expand',row,resolve,reject)
        }).then(val => {
          this.$refs.multipleTable.toggleRowSelection(row,true)
        }).catch(err => {
          this.$refs.multipleTable.toggleRowSelection(row,false)
        })
      }
    }
  }
</script>
