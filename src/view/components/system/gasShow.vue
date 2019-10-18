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
        typeList:[{
          value:"0",
          label:"氧气监测设备"
        },{
          value:"1",
          label:"一氧化碳监测设备"
        },{
          value:"2",
          label:"硫化氢监测设备"
        },{
          value:"3",
          label:"瓦斯监测设备"
        },{
          value:"4",
          label:"温度监测设备"
        }],
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
			}
		}
	}
</script>
