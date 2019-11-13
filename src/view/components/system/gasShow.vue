<template>
	<div>
		<Table ref="userTable" :loading="loading" :columns="columns1" :data="data1" :height="400" :highlight-row="true">
      <template slot-scope="{row}" slot="type">
        {{typeList[row.spareWord1].label}}
      </template>
		</Table>
		<Button style="margin-left:360px;width:70px;margin-top:15px;" @click="quit" type="error">退出</Button>
	</div>
</template>
<script>
	export default {
		name: 'gasShow',
		data() {
			return {
        typeList:[],
				loading: false,
				data1: [],
				columns1: [
				  {
				    type:"index",
				    width:60,
				    align:"center"
				  },
				  {
				    title: '设备编号',
				    key: 'itemCode',
				    align: 'center',
				    minWidth: 100
				  },
				  {
				    title: '设备名称',
				    key: 'itemName',
				    align: 'center',
				    minWidth: 120
				  },
				  {
				    title: '设备类型',
				    key: 'spareWord1',
				    align: 'center',
				    slot: "type",
				    minWidth: 100
				  },
				  {
				    title: '区域',
				    key: 'purpose',
				    align: 'center',
				    minWidth: 100
				  },
				]
			}
		},
		methods: {
			init(data) {
				this.data1 = data;
			},
			quit(){
				this.$emit("quit");
			},
      getTypeList(){
        this.$ajax.request({
          url:'/system/dict/data/selectDataByType',
          method:'get',
          params:{"type":"sitework_gas_type"}
        }).then((res) =>{
          this.typeList = res.data.data;
        })
      }
		},
    mounted(){
      this.getTypeList();
    }
	}
</script>
