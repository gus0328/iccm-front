<template>
	<div>
		<div style="width:100%;height:37px;line-height:37px;">
			<Form ref="queryForm" :model="queryForm" inline>
				<Form-item prop="ipAdress">
				  <label style="margin-right:10px;">ip地址</label><Input v-model="queryForm.ipAdress" style="width:100px"></Input>
				</Form-item>
        <Form-item>
          <Button type="primary" @click="query">查询</Button>
        </Form-item>
        <Form-item>
          <Button @click="resetQueryForm">重置</Button>
        </Form-item>
			</Form>
		</div>
		<Table ref="chooseTable" :loading="loading" :columns="columns1" :data="data1" :height="250">
      <template slot-scope="{ row, index }" slot="action">
        <Button :disabled="initButton(row.ipAdress)" size="small" type="primary" @click="addRow(row)">+</Button>
      </template>
		</Table>
    <Table ref="choosedTable" :columns="columns1" :data="data2" :height="250">
      <template slot-scope="{ row, index }" slot="action">
        <Button size="small" type="error" @click="delRow(index,row.ipAdress)">-</Button>
      </template>
    </Table>
		<Button style="width:70px;margin-left:350px;margin-top:15px;" type="primary" @click="save">确定</Button>
<!-- 		<Button style="margin-left:20px;width:70px;margin-top:15px;" @click="quit" type="error">退出</Button> -->
	</div>
</template>
<script>
	export default {
		name: 'chooseMonitor',
		data() {
			return {
        chooseItem:"",
				loading: false,
				data1: [],
        data2: [],
				queryForm:{
					ipAdress:""
				},
				columns1: [
          {
            type:"index",
            width:60,
            align:"center"
          },
          {
            title: 'ip地址',
            key: 'ipAdress',
            align: 'center',
            minWidth: 120
          },
          {
            title: '备注',
            key: 'remark',
            align: 'center',
            minWidth: 120
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            slot:"action",
            minWidth: 120
          }
				]
			}
		},
		methods: {
      initData(data){
        this.chooseItem = "";
        for(let int = 0 ;int < data.length;int++){
          this.chooseItem+=data[int].ipAdress+",";
        }
        this.data2 = data;
      },
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
        this.$emit("save",this.data2)
			},
			quit(){
				this.$emit("quit");
			},
      resetQueryForm() {
        this.$refs.queryForm.resetFields();
      },
      addRow(row){
        if(this.chooseItem.indexOf(row.ipAdress+",")==-1){
          this.data2.push(JSON.parse(JSON.stringify(row)));
          this.chooseItem+=row.ipAdress+","
        }else{
          this.$Message.warning("此设备已选择");
        }
      },
      delRow(index,ipAdress){
        this.data2.splice(index,1);
        this.chooseItem = this.chooseItem.replace(ipAdress+",","");
      },
      initButton(ipAdress){
        if(this.chooseItem.indexOf(ipAdress+",")==-1){
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
