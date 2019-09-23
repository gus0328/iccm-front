<template>
  <div ref="showContent" style="width:100%;height:98%">
    <Button style="margin:5px 0;" type="info" @click="sync">同步</Button>
    <Button style="margin-left:10px;" @click="foldChange" type="success">展开折叠</Button>
    <tree-table expand-key="authorityName" :is-fold="isfold" :selectable="false" :columns="columns" :data="data">
    </tree-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        isfold: true,
        data: [],
        columns: [{
            title: '模块/接口名称',
            key: 'authorityName',
            width: '400px',
            align: 'center',
            headerAlign: "center"
          },
          {
            title: '排序',
            key: 'orderNum',
            minWidth: '50px',
            align: 'center',
            headerAlign: "center"
          },
          {
            title: '授权标识',
            key: 'authority',
            align: 'center',
            headerAlign: "center"
          },
          {
            title: '父级标识',
            key: 'parentUrl',
            align: 'center',
            headerAlign: "center"
          },
          {
            title: '创建时间',
            key: 'createTime',
            align: 'center',
            headerAlign: "center"
          }
        ]
      }
    },
    methods: {
      sync() {
        let object = this;
        this.$Modal.confirm({
          title: '同步',
          content: '您确定要同步数据？',
          onOk: function() {
            this.$ajax.request({
              url: "/system/authorities/sync",
              data: {},
              method: "post"
            }).then((res) => {
              object.$Message.success("同步成功");
              object.queryTreeData();
            })
          }
        })
      },
      queryTreeData(){
        this.$ajax.request({
          url: "/system/authorities/list",
          data: {},
          method: "post"
        }).then((res) => {
          this.data = res.data.data;
        })
      },
      foldChange(){
        this.isfold = !this.isfold;
      }
    },
    mounted() {
      this.queryTreeData();
    }
  }
</script>

<style>
</style>
