<template>
  <div ref="showContent" style="width:100%;height:98%">
    <Row>
      <Col span="3">
      <Card v-bind:style="{marginRight:'15px',height:deptHeight}">
        <p slot="title">组织机构</p>
        <Tree :data="deptTreeData" @on-select-change="chooseDept" />
      </Card>
      </Col>
      <Col span="21">
      <div style="width:100%;height:37px;line-height:37px;">
        <Form ref="queryFormRef" inline :model="form">
          <Form-item prop="userName">
            <label style="margin-right:10px;">姓名</label><Input v-model="form.userName" style="width:200px"></Input>
          </Form-item>
          <Form-item prop="loginName">
            <label style="margin-right:10px;">用户名</label><Input v-model="form.loginName" style="width:200px"></Input>
          </Form-item>
          <Form-item prop="status">
            <label style="margin-right:10px;">用户状态</label>
            <Select class="form-input" v-model="form.status">
              <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
      <Button style="margin:5px 0;" type="info" @click="add">新增</Button>
      <Table class="content-table" :loading="loading" :columns="columns" :data="data" :height="rootTableHeight">
        <template slot="status" slot-scope="{ row }">
          <i-switch true-value="0" false-value="1" v-model="row.status" size="large" @on-change="changeStatus(row)">
            <span slot="open">正常</span>
            <span slot="close">注销</span>
          </i-switch>
        </template>
        <template slot="dept" slot-scope="{ row }">
          <span>{{row.dept.deptName}}</span>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Button style="margin-right:10px;" size="small" type="primary" @click="edit(row)">编辑</Button>
          <Button size="small" style="margin-right:10px;" type="error" @click="del(row)">删除</Button>
          <Button size="small" type="success" @click="resetPass(row)">重置密码</Button>
        </template>
      </Table>
      <template>
        <Page ref="dictPage" :total="userCount" :current="userPageNo" :page-size="userPageSize" :page-size-opts="userPageSizeOpt"
          @on-change="onUserPageChange" @on-page-size-change="onUserPageSizeChange" show-sizer show-elevator show-total />
      </template>
      <Modal inline v-model="editModal" width="600" :title="editTitle" :mask-closable="false" :closable="false">
        <div style="text-align:center">
          <Form ref="editForm" :model="editForm" :rules="editRules" inline :label-width="70">
            <Form-item label="用户姓名" prop="userName">
              <Input class="form-input" v-model="editForm.userName" placeholder="请输入"></Input>
            </Form-item>
            <Form-item label="用户名" prop="loginName">
              <Input class="form-input" v-model="editForm.loginName" placeholder="请输入"></Input>
            </Form-item>
            <Form-item label="手机号码" prop="phonenumber">
              <Input class="form-input" v-model="editForm.phonenumber" placeholder="请输入"></Input>
            </Form-item>
            <Form-item label="归属部门" prop="deptId">
              <TreeSelectSingle class="form-input" :disabled="false" :title="editForm.dept.deptName" v-on:on-select="selectDept"
                :data="deptTreeData1"></TreeSelectSingle>
            </Form-item>
            <Form-item label="登录密码" prop="password">
              <Input class="form-input" type="password" v-model="editForm.password" placeholder="请输入"></Input>
            </Form-item>
            <Form-item label="重复密码" prop="rpassword">
              <Input class="form-input" type="password" v-model="editForm.rpassword" placeholder="请输入"></Input>
            </Form-item>
            <Form-item label="岗位" prop="postIds">
              <div class="form-input">
                <Select v-model="editForm.postIds" multiple style="width:260px">
                  <Option v-for="item in postList" :value="item.postId" :key="item.postId">{{ item.postName }}</Option>
                </Select>
              </div>
            </Form-item>
            <Form-item label="角色" prop="roleIds">
              <div class="form-input">
                <Select v-model="editForm.roleIds" multiple style="width:260px">
                  <Option v-for="item in roleList" :value="item.roleId" :key="item.roleId">{{ item.roleName }}</Option>
                </Select>
              </div>
            </Form-item>
            <Form-item label="用户性别" prop="sex">
              <div class="form-input" style="text-align: left;">
                <RadioGroup v-model="editForm.sex">
                  <Radio label="0">男性</Radio>
                  <Radio label="1">女性</Radio>
                </RadioGroup>
              </div>
            </Form-item>
            <Form-item label="用户邮箱" prop="email">
              <Input class="form-input" v-model="editForm.email" placeholder="请输入"></Input>
            </Form-item>
            <Form-item label="状态">
              <div class="form-input" style="text-align: left;">
                <i-switch true-value="0" false-value="1" v-model="editForm.status" size="large">
                  <span slot="open">正常</span>
                  <span slot="close">注销</span>
                </i-switch>
              </div>
            </Form-item>
            <Form-item label="备注" prop="remark">
              <Input class="form-input" v-model="editForm.remark" type="textarea" :autosize="{minRows: 4,maxRows: 10}"
                placeholder="请输入"></Input>
            </Form-item>
          </Form>
        </div>
        <div slot="footer" style="text-align:center">
          <Button type="primary" style="width:80px;" @click="editSave">保存</Button>
          <Button type="error" style="width:80px;" @click="editWdClose">取消</Button>
        </div>
      </Modal>
      </Col>
    </Row>
  </div>
</template>

<script>
  import TreeSelectSingle from '../components/tree-select-single/index.vue'
  export default {
    name: 'user',
    components: {
      TreeSelectSingle
    },
    data() {
      const validateoldps = (rule, value, callback) => {
        // console.log(rule);
        // var reg = /^[a-zA-Z0-9]{6,10}$/;
        var reg = /.{6,16}$/;
        if (value === '') {
          callback(new Error('请输入新密码'));
        } else if (new RegExp(reg).test(value) == false) {
          callback(new Error('密码长度大于6位少于16位'));
        } else {
          callback();
        }
      };
      const validatenewps = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入确认密码'));
        } else if (value !== this.editForm.password) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      };
      return {
        deptHeight: 400,
        deptTreeData: [],
        deptTreeData1: [],
        form: {
          postName: "",
          postCode: "",
          deptId: ""
        },
        postList: [],
        roleList: [],
        statusList: [{
            value: "",
            label: "所有"
          },
          {
            value: "0",
            label: "正常"
          },
          {
            value: "1",
            label: "注销"
          }
        ],
        data: [],
        rootTableHeight: 400,
        editModal: false,
        loading: false,
        userCount: 0,
        userPageSize: 50,
        userPageNo: 1,
        userPageSizeOpt: [50, 100, 150, 200],
        editTitle: "新增",
        editForm: {
          userName: "",
          loginName: "",
          sex: "",
          phonenumber: "",
          deptId: "",
          password: "",
          rpassword: "",
          email: "",
          remark: "",
          postIds: [],
          roleIds: [],
          dept: {},
          status: ""
        },
        editFormCopy: {
          userName: "",
          loginName: "",
          sex: "0",
          phonenumber: "",
          deptId: "",
          dept: {
            deptName: "",
            deptId: ""
          },
          password: "",
          rpassword: "",
          email: "",
          remark: "",
          postIds: [],
          roleIds: [],
          status: "0"
        },
        editRules: {
          email: [{
            required: true,
            message: '邮箱不能为空',
            trigger: 'blur'
          }, {
            validator: this.$validateEmail,
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '登录密码不能为空',
            trigger: 'blur'
          }, {
            validator: validateoldps,
            trigger: 'blur'
          }],
          rpassword: [{
            required: true,
            message: '请重复登录密码',
            trigger: 'blur'
          }, {
            validator: validatenewps,
            trigger: 'blur'
          }],
          loginName: [{
            required: true,
            message: '用户名不能为空',
            trigger: 'blur'
          }],
          phonenumber: [{
            required: true,
            message: '手机号不能为空',
            trigger: 'blur'
          }, {
            validator: this.$validatePhone,
            trigger: 'blur'
          }],
          userName: [{
            required: true,
            message: '用户姓名不能为空',
            trigger: 'blur'
          }],
          // postIds: [{
          //   required: true,
          //   message: '请选择岗位',
          //   trigger: 'blur'
          // }],
          // roleIds: [{
          //   required: true,
          //   message: '请选择角色',
          //   trigger: 'blur'
          // }]
        },
        columns: [{
            type: 'index',
            width: 60,
            align: 'center'
          }, {
            title: '用户名',
            key: 'loginName',
            align: 'center',
            minWidth: 100
          },
          {
            title: '用户姓名',
            key: 'userName',
            align: 'center',
            minWidth: 100
          },
          {
            title: '部门',
            key: 'dept',
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
          },
          {
            title: '用户角色',
            key: 'roleNames',
            align: 'center',
            minWidth: 120
          },
          {
            title: '登录时间',
            key: 'loginDate',
            align: 'center',
            minWidth: 120
          },
          {
            title: '用户状态',
            key: 'status',
            align: 'center',
            slot: "status",
            minWidth: 60
          },
          {
            title: '操作',
            key: 'control',
            fixed: 'right',
            width: 220,
            align: 'center',
            slot: "action"
          }
        ]
      }
    },
    methods: {
      changeStatus(row) {
        this.$ajax.request({
          url: "/system/user/changeStatus",
          data: row,
          method: 'post'
        }).then((res) => {
          if(row.status == "0"){
            this.$Message.success("此用户已恢复使用");
          }else{
            this.$Message.success("此用户已停用");
          }
        })
      },
      queryUsers() {
        this.loading = true;
        let url = "/system/user/list?pageNum=" + this.userPageNo + "&pageSize=" + this.userPageSize +
          "&orderByColumn=createTime&isAsc=desc"
        this.$ajax.request({
          url: url,
          data: this.form,
          method: "post"
        }).then((res) => {
          this.data = res.data.data.rows;
          this.userCount = res.data.data.total;
          this.loading = false;
        })
      },
      resetQueryForm() {
        this.$refs.queryFormRef.resetFields();
      },
      onUserPageChange(num) {
        this.userPageNo = num;
        this.queryUsers();
      },
      onUserPageSizeChange(pageSize) {
        this.userPageSize = pageSize;
        this.userPageNo = 1;
        this.queryUsers();
      },
      resetPass(row) {
        let object = this;
        this.$Modal.confirm({
          title: '重置密码',
          content: '您确定重置此用户密码?',
          onOk: function() {
            this.$ajax.request({
              url: "/system/user/adminResetPwd",
              data: {
                "id": row.userId
              },
              method: "post"
            }).then((res) => {
              object.$Message.success(res.data.msg);
            })
          }
        })
      },
      edit(row) {
        this.editForm = Object.assign({}, row);
        this.editTitle = "修改";
        this.editModal = true;
      },
      del(row) {
        let object = this;
        this.$Modal.confirm({
          title: '删除',
          content: '您确定删除此数据？',
          onOk: function() {
            this.$ajax.request({
              url: "/system/user/remove",
              data: {
                "id": row.userId
              },
              method: "post"
            }).then((res) => {
              object.$Message.success(res.data.msg);
              object.queryUsers();
            })
          }
        })
      },
      add(row) {
        this.editTitle = "新增";
        this.editForm = Object.assign({}, this.editFormCopy);
        this.editModal = true;
      },
      editSave() {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            let url = "/system/user/edit";
            if (this.editTitle == "新增") {
              url = "/system/user/add";
            }
            this.$ajax.request({
              url: url,
              data: this.editForm,
              method: "post"
            }).then((res) => {
              this.$Message.success(res.data.msg);
              this.editWdClose();
              this.queryUsers();
            })
          }
        })
      },
      editWdClose() {
        this.editModal = false;
        this.$refs.editForm.resetFields();
      },
      getTreeData() {
        this.$ajax.request({
          url: "/system/dept/treeSelect",
          method: "get"
        }).then((res) => {
          this.deptTreeData = res.data.data;
          this.deptTreeData1 = Object.assign([], res.data.data);
        })
      },
      query() {
        this.userPageNo = 1;
        this.queryUsers();
      },
      chooseDept(rows, row) {
        this.userPageNo = 1;
        this.form.deptId = row.value;
        this.queryUsers()
      },
      selectDept(title, value) {
        this.editForm.deptId = value;
        this.editForm.dept = {
          deptName: title,
          deptId: value
        };
      },
      queryPostList() {
        this.$ajax.request({
          url: "/system/post/list",
          data: {},
          method: "post"
        }).then((res) => {
          this.postList = res.data.data;
        })
      },
      queryRoleList() {
        this.$ajax.request({
          url: "/system/role/list",
          data: {},
          method: "post"
        }).then((res) => {
          this.roleList = res.data.data;
        })
      }
    },
    mounted() {
      this.rootTableHeight = this.$refs.showContent.offsetHeight - 90;
      this.deptHeight = this.$refs.showContent.offsetHeight + "px";
      this.queryUsers();
      this.getTreeData();
      this.queryPostList();
      this.queryRoleList();
    }
  }
</script>

<style>
  .form-input,
  .form-input .ivu-select-multiple {
    width: 200px !important;
  }
</style>
