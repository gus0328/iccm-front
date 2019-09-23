<template>
  <div ref="showContent" style="width:100%;height:98%">
    <div style="width:100%;height:37px;line-height:37px;">
      <Form ref="queryFormRef" inline :model="form">
        <Form-item prop="deptName">
          <label style="margin-right:10px;">部门名称</label><Input v-model="form.deptName" style="width:200px"></Input>
        </Form-item>
        <Form-item prop="status">
          <label style="margin-right:10px;">部门状态</label><Input v-model="form.status" style="width:200px"></Input>
        </Form-item>
        <Form-item>
          <Button type="primary" @click="queryDeparts">查询</Button>
        </Form-item>
        <Form-item>
          <Button @click="resetQueryForm">重置</Button>
        </Form-item>
      </Form>
    </div>
    <Button style="margin:5px 0;" type="info" @click="addRootModal=true">新增</Button>
    <Button style="margin-left:10px;" @click="foldChange" type="success">展开折叠</Button>
    <tree-table expand-key="deptName" :is-fold="isfold" :selectable="false" :columns="columns" :data="data">
      <template slot="control" slot-scope="scope">
        <Button style="margin-right:10px;" size="small" type="primary" @click="edit(scope)">编辑</Button>
        <Button style="margin-right:10px;" size="small" type="info" @click="add(scope)">新增</Button>
        <Button size="small" type="error" @click="del(scope)">删除</Button>
      </template>
      <template slot="status" slot-scope="scope">
        <div style="width:40px;color:white;border-radius:10px;background: green;margin: auto;" v-if="scope.row.status==0">正常</div>
        <div style="width:40px;color: white;border-radius:10px;background: red;margin: auto;" v-else>停用</div>
      </template>
    </tree-table>
    <Modal v-model="addRootModal" width="480" :title="addRootTitle" :mask-closable="false" :closable="false">
      <div style="text-align:center">
        <Form ref="addRootForm" :model="addRootForm" :rules="rootRules" inline :label-width="70">
          <Form-item label="部门名称" prop="deptName">
            <Input class="form-input" v-model="addRootForm.deptName" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="排序" prop="orderNum">
            <Input class="form-input" v-model="addRootForm.orderNum" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="负责人" prop="leader">
            <Input class="form-input" v-model="addRootForm.leader" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="联系电话" prop="phone">
            <Input class="form-input" v-model="addRootForm.phone" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="邮箱" prop="email">
            <Input class="form-input" type="email" v-model="addRootForm.email" placeholder="请输入"></Input>
          </Form-item>
        </Form>
      </div>
      <div slot="footer" style="text-align:center">
        <Button type="primary" style="width:80px;" @click="addRoot">保存</Button>
        <Button type="error" style="width:80px;" @click="rootWdClose">取消</Button>
      </div>
    </Modal>
    <Modal v-model="editModal" width="480" :title="editModalTitle" :mask-closable="false" :closable="false">
      <div style="text-align:center">
        <Form ref="editForm" :model="editForm" :rules="editRules" inline :label-width="70">
          <Form-item label="上级部门">
            <TreeSelectSingle class="form-input" :disabled="treeSelectFlag" :title="editForm.parentName" v-on:on-select="selectParent"
              :data="treeData"></TreeSelectSingle>
          </Form-item>
          <Form-item label="部门名称" prop="deptName">
            <Input class="form-input" v-model="editForm.deptName" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="排序" prop="orderNum">
            <Input class="form-input" v-model="editForm.orderNum" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="负责人" prop="leader">
            <Input class="form-input" v-model="editForm.leader" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="联系电话" prop="phone">
            <Input class="form-input" v-model="editForm.phone" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="邮箱" prop="email">
            <Input class="form-input" type="email" v-model="editForm.email" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="状态" prop="status">
            <RadioGroup v-model="editForm.status">
              <Radio label="0">正常</Radio>
              <Radio label="1">停用</Radio>
            </RadioGroup>
          </Form-item>
        </Form>
      </div>
      <div slot="footer" style="text-align:center">
        <Button type="primary" style="width:80px;" @click="save">保存</Button>
        <Button type="error" style="width:80px;" @click="close">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import TreeSelectSingle from '../components/tree-select-single/index.vue'
  export default {
    name: 'depart',
    components: {
      TreeSelectSingle
    },
    data() {
      return {
        treeData: [],
        treeValue: [],
        addRootModal: false,
        editModal: false,
        addRootTitle: "新增",
        editModalTitle: "新增",
        treeSelectFlag: false,
        addRootForm: {
          parentId: 0,
          deptName: "",
          orderNum: "",
          leader: "",
          phone: "",
          email: ""
        },
        editForm: {
          parentName: "",
          parentId: "",
          deptName: "",
          orderNum: "",
          leader: "",
          phone: "",
          email: "",
          status: ""
        },
        editFormCopy: {
          parentName: "",
          parentId: "",
          deptName: "",
          orderNum: "",
          leader: "",
          phone: "",
          email: "",
          status: ""
        },
        form: {
          deptName: "",
          status: ""
        },
        isfold: false,
        columns: [{
            title: '部门名称',
            key: 'deptName',
            width: '400px',
            align: 'center',
            headerAlign: "center"
          },
          {
            title: '排序',
            key: 'orderNum',
            minWidth: '50px',
            align: 'center',
            headerAlign: "center"
          },
          {
            title: '状态',
            key: 'status',
            align: 'center',
            headerAlign: "center",
            type: 'template',
            template: 'status'
          },
          {
            title: '创建时间',
            key: 'createTime',
            align: 'center',
            headerAlign: "center"
          },
          {
            title: '操作',
            key: 'control',
            width: 180,
            align: 'center',
            type: 'template',
            template: 'control',
            headerAlign: "center"
          }
        ],
        data: [],
        rootRules: {
          deptName: [{
              required: true,
              message: '部门名称不能为空',
              trigger: 'blur'
            },
            {
              type: 'string',
              max: 100,
              message: '不能超过20个字符',
              trigger: 'blur'
            },
          ],
          orderNum: [{
            required: true,
            type: 'number',
            message: '请输入排序号',
            trigger: 'blur'
          }],
          leader: [{
            required: true,
            type: 'string',
            message: '请输入负责人',
            trigger: 'blur'
          }],
          phone: [{
            required: true,
            type: 'string',
            message: '电话不能为空',
            trigger: 'blur'
          }],
          email: [{
            required: true,
            type: 'email',
            message: '电话不能为空',
            trigger: 'blur'
          }]
        },
        editRules: {
          deptName: [{
              required: true,
              message: '部门名称不能为空',
              trigger: 'blur'
            },
            {
              type: 'string',
              max: 100,
              message: '不能超过20个字符',
              trigger: 'blur'
            },
          ],
          orderNum: [{
            required: true,
            type: 'number',
            message: '请输入排序号',
            trigger: 'blur'
          }],
          leader: [{
            required: true,
            type: 'string',
            message: '请输入负责人',
            trigger: 'blur'
          }],
          phone: [{
            required: true,
            type: 'string',
            message: '电话不能为空',
            trigger: 'blur'
          }],
          email: [{
            required: true,
            type: 'email',
            message: '邮箱格式不正确',
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      foldChange() {
        this.isfold = !this.isfold;
      },
      handle(scope) {
        console.log(scope)
      },
      queryDeparts() {
        this.$ajax.request({
          url: "/system/dept/list",
          data: this.form,
          method: "post"
        }).then((res) => {
		  if(res.data.code==200){
			this.data = res.data.data;
		  }else{
			this.$Message.error(res.data.msg);
		  }
        })
      },
      addRoot() {
        this.$refs.addRootForm.validate((valid) => {
          if (valid) {
            this.$ajax.request({
              url: "/system/dept/add",
              data: this.addRootForm,
              method: "post"
            }).then((res) => {
              if (res.data.code == 200) {
                this.$Message.success(res.data.msg);
                this.rootWdClose();
                this.queryDeparts();
                this.getTreeData();
              } else {
                this.$Message.error(res.data.msg);
              }
            })
          }
        })
      },
      rootWdClose() {
        this.addRootModal = false;
        this.$refs.addRootForm.resetFields();
      },
      close() {
        this.editModal = false;
        this.$refs.editForm.resetFields();
      },
      save() {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            let url = "/system/dept/edit";
            if (this.editModalTitle == "新增") {
              url = "/system/dept/add";
            }
            this.$ajax.request({
              url: url,
              data: this.editForm,
              method: "post"
            }).then((res) => {
              if (res.data.code == 200) {
                this.$Message.success(res.data.msg);
                this.close();
                this.queryDeparts();
                this.getTreeData();
              } else {
                this.$Message.error(res.data.msg);
              }
            })
          }
        })
      },
      add(scope) {
        this.editModalTitle = "新增";
        this.treeSelectFlag = false;
        this.editForm = Object.assign({},this.editFormCopy);
        this.editForm.parentName = scope.row.deptName;
        this.editForm.parentId = scope.row.deptId;
        this.editForm.status = '0';
        this.editModal = true;
      },
      edit(scope) {
        this.editForm = Object.assign({},scope.row);
        if (this.editForm.parentId == 0) {
          this.editForm["parentName"] = "一级部门";
          this.treeSelectFlag = true;
        } else {
          this.treeSelectFlag = false;
        }
        this.editModalTitle = "修改";
        this.editModal = true;
      },
      del(scope) {
        let object = this;
        this.$Modal.confirm({
          title: '删除',
          content: '您确定删除此数据？',
          onOk: function() {
            this.$ajax.request({
              url: "/system/dept/remove",
              data: {
                "deptId": scope.row.deptId
              },
              method: "post"
            }).then((res) => {
              if (res.data.code == 200) {
                object.$Message.success(res.data.msg);
                object.queryDeparts();
                object.getTreeData()
              } else {
                object.$Message.error(res.data.msg);
              }
            })
          }
        })

      },
      getTreeData() {
        this.$ajax.request({
          url: "/system/dept/treeSelect",
          method: "get"
        }).then((res) => {
		  if(res.data.code==200){
			this.treeData = res.data.data;
		  }else{
			this.$Message.error(res.data.msg);
		  }
        })
      },
      selectParent(title, value) {
        this.editForm.parentId = value;
        this.editForm.parentName = title;
      },
      resetQueryForm() {
        this.$refs.queryFormRef.resetFields();
      }
    },
    mounted() {
      this.queryDeparts();
      this.getTreeData();
    }
  }
</script>

<style>
  .form-input {
    width: 200px;
  }
</style>
