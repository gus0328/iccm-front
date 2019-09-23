<template>
  <div>
    <Upload multiple type="drag" action="/upload/test">
      <div style="padding: 20px 0">
        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
        <p>Click or drag files here to upload</p>
      </div>
    </Upload>
    <Button type="primary" style="width:80px;" @click="query">刷新</Button>
    <Table class="content-table" :loading="loading" :columns="columns" :data="data">
      <template slot-scope="{ row }" slot="status">
        <div style="width:50px;color:white;border-radius:10px;background: lightblue;margin: auto;" v-if="row.status==0">未到期</div>
        <div style="width:50px;color: white;border-radius:10px;background: green;margin: auto;" v-else>已通知</div>
      </template>
    </Table>
  </div>
</template>

<script>
  export default{
    data(){
      return{
        loading:false,
        columns:[{
            type: 'index',
            width: 60,
            align: 'center'
          }, {
            title: '合同编号',
            key: 'contractNo',
            align: 'center',
            minWidth: 100
          },
          {
            title: '合同签订日期',
            key: 'contractDate',
            align: 'center',
            minWidth: 100
          },
          {
            title: '合同超期提醒日期',
            key: 'expiryDate',
            align: 'center',
            minWidth: 120
          },
          {
            title: '导入日期',
            key: 'createTime',
            align: 'center',
            minWidth: 100
          },
          {
            title: '状态',
            key: 'status',
            align: 'center',
            slot: "status",
            minWidth: 120
          }
        ],
        data:[]
      }
    },
    methods:{
      query(){
        this.loading = true;
        this.$ajax.request({
          url:"/upload/query",
          method:"get"
        }).then((res) => {
          this.loading = false;
          this.data = res.data.data;
        })
      }
    },
    mounted() {
      this.query();
    }
  }
</script>

<style>
</style>
