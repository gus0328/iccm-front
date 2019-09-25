<template>
	<div>
		<div style="width:100%;height:37px;line-height:37px;">
			<Form ref="queryForm" :model="queryForm" inline>
				<Form-item prop="itemCode">
				  <label style="margin-right:10px;">设备编号</label><Input v-model="queryForm.itemCode" style="width:100px"></Input>
				</Form-item>
        <Form-item prop="itemName">
          <label style="margin-right:10px;">设备名称</label><Input v-model="queryForm.itemName" style="width:100px"></Input>
        </Form-item>
        <Form-item>
          <Button type="primary" @click="query">查询</Button>
        </Form-item>
        <Form-item>
          <Button @click="resetQueryForm">重置</Button>
        </Form-item>
			</Form>
		</div>
		<Table ref="userTable" :loading="loading" :columns="columns1" :data="data1" :height="400" :highlight-row="true"
    @on-select="updateSelectRows" @on-select-cancel="updateSelectRows" @on-select-all="updateSelectRows"
    @on-selection-change="updateSelectRows">
		</Table>
		<Button style="width:70px;margin-left:220px;margin-top:15px;" type="primary" @click="save">确定</Button>
		<Button style="margin-left:20px;width:70px;margin-top:15px;" @click="quit" type="error">退出</Button>
	</div>
</template>
<script>
	export default {
		name: 'downFile',
		data() {
			return {
				loading: false,
				data1: [],
        selectRows:[],
				selectRow:{},
				queryForm:{
					itemCode:"",
          itemName:""
				},
				columns1: [
          {
            type:"index",
            width:60,
            align:"center"
          },
          {
            type:"selection",
            width:60,
            align: 'center'
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
            title: 'ip地址',
            key: 'ipAdress',
            align: 'center',
            minWidth: 120
          }
				]
			}
		},
		methods: {
			init() {
				this.query();
			},
			query() {
        this.loading = true;
        this.$ajax.request({
          url:"/work/siteWork/monitorSelect",
          method:'post',
          data:this.queryForm
        }).then((res) =>{
          this.loading = false;
          this.data1 = res.data.data;
        })
			},
			save(){
        if(this.selectRows.length<1){
          this.$Message.warning("请至少选择一条数据");
        }else{
          this.$emit("save",this.selectRows)
        }
			},
			quit(){
				this.$emit("quit");
			},
      resetQueryForm() {
        this.$refs.queryForm.resetFields();
      },
      updateSelectRows(data) {
      	this.selectRows = data;
      }
		},
		mounted(){
      this.resetQueryForm();
			this.init();
		}
	}
</script>
