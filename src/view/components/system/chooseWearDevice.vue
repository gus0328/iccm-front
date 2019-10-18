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
		<Table ref="chooseTable" :loading="loading" :columns="columns1" :data="data1" :height="250" :highlight-row="true">
      <template slot-scope="{ row, index }" slot="action">
        <Button :disabled="initButton(row.itemCode)" size="small" type="primary" @click="addRow(row)">+</Button>
      </template>
		</Table>
    <Table ref="choosedTable" :columns="columns2" :data="data2" :height="250">
      <template slot-scope="{row,index}" slot="action">
        <Button size="small" type="error" @click="delRow(index,row.itemCode)">-</Button>
      </template>
    </Table>
		<Button style="width:70px;margin-left:250px;margin-top:15px;" type="primary" @click="save">确定</Button>
	</div>
</template>
<script>
	export default {
		name: 'downFile',
		data() {
			return {
        chooseItem:"",
				loading: false,
				data1: [],
        data2:[],
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
            title: '操作',
            key: 'action',
            align: 'center',
            slot:"action",
            minWidth: 60
          }
				],
        columns2: [
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
            title: '操作',
            key: 'action',
            align: 'center',
            slot:"action",
            minWidth: 80
          }
        ]
			}
		},
		methods: {
      initData(data){
        this.chooseItem = "";
        for(let int = 0 ;int < data.length;int++){
          this.chooseItem+=data[int].itemCode+",";
        }
        this.data2 = data;
      },
			init() {
				this.query();
			},
			query() {
        this.loading = true;
        this.$ajax.request({
          url:"/work/siteWork/wearSelect",
          method:'post',
          data:this.queryForm
        }).then((res) =>{
          this.loading = false;
          this.data1 = res.data.data;
        })
			},
			save(){
        this.$emit("quit");
			},
      resetQueryForm() {
        this.$refs.queryForm.resetFields();
      },
      addRow(row){
        if(this.chooseItem.indexOf(row.itemCode+",")==-1){
          this.data2.push(JSON.parse(JSON.stringify(row)));
          this.chooseItem+=row.itemCode+","
        }else{
          this.$Message.warning("此设备已选择");
        }
      },
      delRow(index,itemCode){
        this.data2.splice(index,1);
        this.chooseItem = this.chooseItem.replace(itemCode+",","");
      },
      initButton(itemCode){
        if(this.chooseItem.indexOf(itemCode+",")==-1){
          return false;
        }
        return true;
      }
		},
		mounted(){
      this.resetQueryForm();
			this.init();
		}
	}
</script>
