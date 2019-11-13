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
        <Form-item prop="spareWord1">
          <label style="margin-right:10px;">设备类型</label>
          <Select class="form-input" v-model="queryForm.spareWord1" style="width:140px !important">
            <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
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
      <template slot-scope="{row}" slot="type">
        {{typeList[row.spareWord1].label}}
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <Button :disabled="initButton(row.itemCode)" size="small" type="primary" @click="addRow(row)">+</Button>
      </template>
		</Table>
    <Table ref="choosedTable" :columns="columns2" :data="data2" :height="250">
      <template slot-scope="{row}" slot="type">
        {{typeList[row.spareWord1].label}}
      </template>
      <template slot-scope="{row,index}" slot="action">
        <Button size="small" type="error" @click="delRow(index,row.itemCode,row.spareWord1)">-</Button>
      </template>
    </Table>
		<Button style="width:70px;margin-left:350px;margin-top:15px;" type="primary" @click="save">确定</Button>
		<!-- <Button style="margin-left:20px;width:70px;margin-top:15px;" @click="quit" type="error">退出</Button> -->
	</div>
</template>
<script>
	export default {
		name: 'chooseGasDevice',
		data() {
			return {
        chooseItem:"",
        chooseType:"",
        typeList:[],
				loading: false,
				data1: [],
        data2: [],
				queryForm:{
					itemCode:"",
          itemName:"",
          spareWord1:""
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
          {
            title: '操作',
            key: 'action',
            align: 'center',
            slot: "action",
            minWidth: 100
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
          {
            title: '操作',
            key: 'action',
            align: 'center',
            slot: "action",
            minWidth: 100
          }
        ]
			}
		},
		methods: {
      initData(data){
        this.chooseItem = "";
        this.chooseType = "";
        for(let int = 0 ;int < data.length;int++){
          this.chooseItem+=data[int].itemCode+",";
          this.chooseType+=data[int].spareWord1+","
        }
        this.data2 = data;
      },
			init() {
				this.query();
			},
			query() {
        this.loading = true;
        this.$ajax.request({
          url:"/work/siteWork/gasSelect",
          method:'post',
          data:this.queryForm
        }).then((res) =>{
          this.loading = false;
          this.data1 = res.data.data;
        })
			},
			save(){
        this.$emit("save",this.data2)
			},
      addRow(row){
        if(this.chooseType.indexOf(row.spareWord1+",")!=-1){
          this.$Message.warning("此类型设备已选择");
          return;
        }
        if(this.chooseItem.indexOf(row.itemCode+",")==-1){
          this.data2.push(JSON.parse(JSON.stringify(row)));
          this.chooseItem+=row.itemCode+","
          this.chooseType+=row.spareWord1+","
        }else{
          this.$Message.warning("此设备已选择");
        }
      },
      delRow(index,itemCode,spareWord1){
        this.data2.splice(index,1);
        this.chooseItem = this.chooseItem.replace(itemCode+",","");
        this.chooseType = this.chooseType.replace(spareWord1+",","");
      },
			quit(){
				this.$emit("quit");
			},
      resetQueryForm() {
        this.$refs.queryForm.resetFields();
      },
      initButton(itemCode){
        if(this.chooseItem.indexOf(itemCode+",")==-1){
          return false;
        }
        return true;
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
      this.resetQueryForm();
			this.init();
		}
	}
</script>
