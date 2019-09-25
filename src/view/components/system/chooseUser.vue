<template>
	<div>
		<div style="width:100%;height:37px;line-height:37px;">
			<Form ref="queryUserForm" :model="queryForm" inline :rules="queryRoles">
				<Form-item prop="userName">
				  <label style="margin-right:10px;">姓名</label><Input v-model="queryForm.userName" style="width:200px"></Input>
				</Form-item>
        <Form-item>
          <Button type="primary" @click="queryUser">查询</Button>
        </Form-item>
        <Form-item>
          <Button @click="resetQueryForm">重置</Button>
        </Form-item>
			</Form>
		</div>
		<Table ref="userTable" :loading="loading" :columns="columns1" :data="data1" :height="400" @on-row-click="clickRow" :highlight-row="true">
      <template slot="dept" slot-scope="{ row }">
        <span>{{row.dept.deptName}}</span>
      </template>
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
				selectRow:{},
				queryForm:{
					userName:""
				},
        queryRoles:{
         userName: [{
           required: true,
           message: '请输入用户姓名',
           trigger: 'blur'
         }]
        },
				columns1: [{
            title: '用户姓名',
            key: 'userName',
            align: 'center',
            minWidth: 100
          },
          {
            title: '部门',
            key: 'dept.deptName',
            align: 'center',
            slot: "dept",
            minWidth: 120
          },
          {
            title: '手机',
            key: 'phonenumber',
            align: 'center',
            minWidth: 100
          },
          {
            title: '用户岗位',
            key: 'postNames',
            align: 'center',
            minWidth: 120
          }
				]
			}
		},
		methods: {
			init() {
				this.data1 = [];
			},
			queryUser() {
        this.$refs.queryUserForm.validate((valid) => {
          if(valid){
            this.loading = true;
            this.$ajax.request({
              url:"/system/user/chooseUser",
              method:'post',
              data:this.queryForm
            }).then((res) =>{
              this.loading = false;
              this.data1 = res.data.data;
            })
          }else{
            this.$Message.warning("请输入用户姓名");
          }
        })
			},
			clickRow(row){
				this.selectRow = row;
			},
			save(){
				if(this.selectRow==null||this.selectRow=={}){
					this.$Message.warning("请先选择一个用户");
				}else{
					this.$emit("save",this.selectRow)
				}
			},
			quit(){
				this.$emit("quit");
			},
      resetQueryForm() {
        this.$refs.queryUserForm.resetFields();
      }
		},
		mounted(){
			this.init();
		}
	}
</script>
