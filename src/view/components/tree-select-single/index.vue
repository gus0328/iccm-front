<template>
  <Select  :id="id" ref="select" disabled :placeholder="show">
    <Tree :render="renderContent" :data="data" />
  </Select>
</template>

<script>
  export default {
    name: "TreeSelectSingle",
    props: {
      data: {
        type: Array,
        default: () => []
      },
      title: {
        type: String,
        default: () => ""
      },
      disabled:{
        type:Boolean,
        default: () => true
      }
    },
    data() {
      return {
        show: "请选择",
        id: "tree-select" + (new Date().getTime()),
        open: false
      }
    },
    watch: {
      data: {
        handler() {}
      },
      title: {
        handler(title) {
          this.show = title;
        }
      },
      disabled:{
        handler(disabled){
          if(disabled){
            let target = "#" + this.id + " .ivu-select-selection";
            let dom = document.querySelector(target);
            dom.style.background = "#ccc";
          }else{
            let target = "#" + this.id + " .ivu-select-selection";
            let dom = document.querySelector(target);
            dom.style.background = "#fff";
          }
        }
      }
    },
    methods: {
      treeSelect(array, row) {
        alert(row.value)
        this.value = row.value;
      },
      treeDataControl() {
        if (this.open) {
          this.closeTreeData();
        } else {
          this.openTreeData();
        }
      },
      openTreeData() {
        if(this.disabled)
        return;
        let target = "#" + this.id + " .ivu-select-dropdown";
        let dom = document.querySelector(target);
        dom.style.display = "block";
        dom.style.top = "33px";
        this.open = true;
      },
      closeTreeData() {
        if(this.disabled)
        return;
        let target = "#" + this.id + " .ivu-select-dropdown";
        let dom = document.querySelector(target);
        dom.style.display = "none";
        dom.style.top = "33px";
        this.open = false;
      },
      selectValue(title, value) {
        this.show = title;
        this.$emit("on-select",title, value);
      },
      renderContent(h, {
        root,
        node,
        data
      }) {
        return h('span', [
          h('span', {
            style: {
              cursor: "pointer",
            },
            on: {
              click: () => {
                this.selectValue(data.title, data.value);
                this.closeTreeData();
              }
            }
          }, [
            h('Icon', {
              props: {
                type: 'ios-paper-outline'
              },
              style: {
                marginRight: "6px"
              }
            }),
            h('span', data.title)
          ])
        ]);
      },
    },
    mounted() {
      let target = "#" + this.id + " .ivu-select-selection";
      let dom = document.querySelector(target);
      dom.style.cursor = "pointer";
      dom.style.background = "#fff";
      let object = this;
      dom.onclick = function() {
        object.treeDataControl();
      };
    }
  }
</script>

<style>
  .ivu-select-placeholder {
    color: #515a6e !important;
  }
</style>
