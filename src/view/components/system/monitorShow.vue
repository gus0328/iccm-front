<template>
	<div>
		<Table ref="userTable" :loading="loading" :columns="columns1" :data="data1" :height="400" :highlight-row="true">
		</Table>
		<Button style="margin-left:360px;width:70px;margin-top:15px;" @click="quit" type="error">退出</Button>
	</div>
</template>
<script>
	export default {
		name: 'monitorShow',
		data() {
			return {
				loading: false,
				data1: [],
				columns1: [
          {
            type:"index",
            width:60,
            align:"center"
          },
          {
            title: 'ip地址',
            key: 'itemCode',
            align: 'center',
            minWidth: 100
          },
          {
            title: '备注',
            key: 'remark',
            align: 'center',
            minWidth: 120
          }
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
