<template>
  <div ref="showContent" style="width:100%;height:100%">
    <Table class="content-table" :loading="loading" :columns="columns" :data="data" :height="rootTableHeight">
      <template slot-scope="{row}" slot="itemCode">
       <span v-for="(item,index) in row.devices" :key="item.itemCode">
          <span v-if="index==row.devices.length-1">
            {{item.itemCode}}
          </span>
          <span v-else>
            {{item.itemCode}},
          </span>
       </span>
      </template>
      <template slot-scope="{row}" slot="itemName">
       <span v-for="(item,index) in row.devices" :key="item.itemName">
          <span v-if="index==row.devices.length-1">
            {{item.itemName}}
          </span>
          <span v-else>
            {{item.itemName}},
          </span>
       </span>
      </template>
    </Table>
    <Button style="margin-left:360px;width:70px;margin-top:15px;" @click="quit" type="error">退出</Button>
  </div>
</template>
<script>
  export default {
    name: 'editWorder',
    data() {
      return {
        data: [],
        rootTableHeight: 400,
        loading: false,
        columns: [{
            title: '作业人员',
            key: 'personName',
            align: 'center',
            width: 90
          },
          {
            title: '联系方式',
            key: 'mobileNum',
            align: 'center',
            width:120
          },
          {
            title: '设备编号',
            key: 'itemCode',
            align: 'center',
            slot: "itemCode"
          },
          {
            title: '设备名称',
            key: 'itemName',
            align: 'center',
            slot: "itemName"
          }
        ]
      }
    },
    methods: {
      quit(){
      	this.$emit("quit");
      },
      init(data){
        this.data = data;
      }
    },
    mounted() {
      this.data = [];
    }
  }
</script>

<style>
  .form-input {
    width: 200px;
  }
</style>
