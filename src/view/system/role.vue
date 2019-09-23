<template>
  <div ref="showContent" style="width:100%;height:98%">
    <div style="width:100%;height:37px;line-height:37px;">
      <Form ref="queryFormRef" inline :model="form">
        <Form-item prop="roleId">
          <label style="margin-right:10px;">角色名称</label>
          <Select class="form-input" v-model="form.roleId">
            <Option v-for="item in roleNameList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Form-item>
        <Form-item>
          <Button type="primary" @click="queryRoles">查询</Button>
        </Form-item>
        <Form-item>
          <Button @click="resetQueryForm">重置</Button>
        </Form-item>
      </Form>
    </div>
    <Button style="margin:5px 0;" type="info" @click="add">新增</Button>
    <Table class="content-table" ref="dictTable" :loading="loading" :columns="columns1" :data="data" :height="roleTableHeight">
      <template slot-scope="{ row, index }" slot="action">
        <Button style="margin-right:10px;" size="small" type="primary" @click="edit(row)">编辑</Button>
        <Button style="margin-right:10px;" size="small" type="success" @click="authAssign(row)">权限分配</Button>
        <Button size="small" type="error" @click="del(row)">删除</Button>
      </template>
    </Table>
    <Modal v-model="editModal" width="480" :title="editModalTitle" :mask-closable="false" :closable="false">
      <div style="text-align:center">
        <Form ref="editForm" :model="editForm" :rules="editRules" inline :label-width="70">
          <Form-item label="角色名称" prop="roleName">
            <Input class="form-input" v-model="editForm.roleName" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="角色编码" prop="roleKey">
            <Input class="form-input" v-model="editForm.roleKey" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="排序编号" prop="roleSort">
            <Input class="form-input" v-model="editForm.roleSort" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="备注" prop="remark">
            <Input class="form-input" v-model="editForm.remark" type="textarea" :autosize="{minRows: 4,maxRows: 10}"
              placeholder="请输入"></Input>
          </Form-item>
        </Form>
      </div>
      <div slot="footer" style="text-align:center">
        <Button type="primary" style="width:80px;" @click="save">保存</Button>
        <Button type="error" style="width:80px;" @click="close">取消</Button>
      </div>
    </Modal>
    <Modal v-model="menuAuthModal" title="权限分配" width="80%" :mask-closable="false" :closable="false">

      <Row>
        <Col span="12">
        <Card :bordered="false">
          <p slot="title">菜单分配</p>
          <div v-bind:style="{maxHeight:treeTableHeight,overflow:'scroll'}">
            <tree-table expand-key="menuTitle" :is-fold="isMenufold" :selectable="false" :columns="menuColumns" :data="menuData">
              <template slot="flag" slot-scope="{ row }">
                <i-switch v-model="row.flag" size="large" @on-change="menuChange(row)">
                  <span slot="open">开启</span>
                  <span slot="close">关闭</span>
                </i-switch>
              </template>
            </tree-table>
          </div>
        </Card>
        </Col>
        <Col span="12">
        <Card shadow>
          <p slot="title">后台接口分配</p>
          <div v-bind:style="{maxHeight:treeTableHeight,overflow:'scroll'}">
            <tree-table expand-key="" :is-fold="isAuthfold" :selectable="false" :columns="authColumns" :data="authData">
              <template slot="flag" slot-scope="{ row }">
                <i-switch v-model="row.flag" size="large" @on-change="authChange(row)">
                  <span slot="open">开启</span>
                  <span slot="close">关闭</span>
                </i-switch>
              </template>
            </tree-table>
          </div>
        </Card>
        </Col>
      </Row>
      <div slot="footer" style="text-align:center">
        <Button type="error" style="width:120px;marign-left:10px;" @click="menuAuthModalClose">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        form: {
          roleId: ""
        },
        menuAuthModal: false,
        menuAuthTitle: "菜单",
        isMenufold: false,
        isAuthfold: false,
        roleNameList: [],
        treeTableHeight: '500px',
        chooseRoleId: "",
        menuColumns: [{
            title: '菜单标题',
            key: 'menuTitle',
            align: 'center',
            headerAlign: "center"
          },
          {
            title: '菜单路径',
            key: 'menuUrl',
            align: 'center',
            headerAlign: "center"
          },
          {
            title: '状态',
            key: 'flag',
            align: 'center',
            headerAlign: "center",
            type: 'template',
            template: 'flag'
          }
        ],
        authColumns: [{
            title: '模块/接口名称',
            key: 'authorityName',
            align: 'center',
            headerAlign: "center"
          },
          {
            title: '权限标识',
            key: 'authority',
            align: 'center',
            headerAlign: "center"
          },
          {
            title: '状态',
            key: 'flag',
            align: 'center',
            headerAlign: "center",
            type: 'template',
            template: 'flag'
          }
        ],
        menuData: [],
        authData: [],
        columns1: [{
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '角色名称',
            key: 'roleName',
            align: 'center'
          },
          {
            title: '角色编码',
            key: 'roleKey',
            align: 'center'
          },
          {
            title: '排序编号',
            key: 'roleSort',
            align: 'center'
          },
          {
            title: '备注',
            key: 'remark',
            align: 'center'
          },
          {
            title: '创建时间',
            key: 'createTime',
            align: 'center'
          },
          {
            title: '操作',
            key: 'control',
            width: 220,
            align: 'center',
            slot: 'action'
          }
        ],
        data: [],
        loading: false,
        editModal: false,
        editModalTitle: "新增",
        roleTableHeight: 400,
        editForm: {
          roleName: "",
          roleKey: "",
          roleSort: "",
          remark: ""
        },
        editFormCopy: {
          roleName: "",
          roleKey: "",
          roleSort: "",
          remark: ""
        },
        editRules: {
          roleName: [{
            required: true,
            message: '角色名称不能为空',
            trigger: 'blur'
          }],
          roleSort: [{
              required: true,
              message: '排序号不能为空',
              trigger: 'blur'
            },
            {
              validator: this.$validateNumber,
              trigger: 'blur'
            }
          ],
          roleKey: [{
            required: true,
            type: 'string',
            message: '角色编码不能为空',
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      queryRoles() {
        this.loading = true;
        this.$ajax.request({
          url: "/system/role/list",
          data: this.form,
          method: "post"
        }).then((res) => {
          this.loading = false;
          this.data = res.data.data;
        })
      },
      resetQueryForm() {
        this.$refs.queryFormRef.resetFields();
      },
      add() {
        this.editModalTitle = '新增';
        this.editForm = Object.assign({}, this.editFormCopy);
        this.editModal = true;
      },
      edit(row) {
        this.editModalTitle = '修改';
        this.editForm = Object.assign({}, row);
        this.editModal = true;
      },
      authAssign(row) {
        this.chooseRoleId = row.roleId;
        this.queryAuthoritiesByRoleId();
        this.queryMenusByRoleId();
        this.menuAuthModal = true;
      },
      del(row) {
        let object = this;
        this.$Modal.confirm({
          title: '删除',
          content: '您确定删除此数据？',
          onOk: function() {
            this.$ajax.request({
              url: "/system/role/remove",
              data: {
                "id": row.roleId
              },
              method: "post"
            }).then((res) => {
              object.$Message.success(res.data.msg);
              object.queryRoles();
            })
          }
        })
      },
      save() {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            let url = "/system/role/edit";
            if (this.editModalTitle == "新增") {
              url = "/system/role/add";
            }
            this.$ajax.request({
              url: url,
              data: this.editForm,
              method: "post"
            }).then((res) => {
              this.$Message.success(res.data.msg);
              this.close();
              this.queryRoles();
              this.querySelect();
            })
          }
        })
      },
      close() {
        this.editModal = false;
        this.$refs.editForm.resetFields();
      },
      querySelect() {
        this.$ajax.request({
          url: "/system/role/roleSelect",
          method: "get"
        }).then((res) => {
          this.roleNameList = res.data.data;
        })
      },
      menuChange(row) {
        row.roleId = this.chooseRoleId;
        this.$ajax.request({
          url: "/system/role/menu/change",
          data: row,
          method: "post"
        })
      },
      authChange(row) {
        row.roleId = this.chooseRoleId;
        this.$ajax.request({
          url: "/system/role/authority/change",
          data: row,
          method: "post"
        })
      },
      menuAuthModalClose() {
        this.menuData = [];
        this.authData = [];
        this.chooseRoleId = "";
        this.menuAuthModal = false;
      },
      queryMenusByRoleId() {
        this.$ajax.request({
          url: "/system/role/menus",
          data: {
            "id": this.chooseRoleId
          },
          method: "post"
        }).then((res) => {
          this.menuData = res.data.data;
        })
      },
      queryAuthoritiesByRoleId() {
        this.$ajax.request({
          url: "/system/role/authorities",
          data: {
            "id": this.chooseRoleId
          },
          method: "post"
        }).then((res) => {
          this.authData = res.data.data;
        })
      },
    },
    mounted() {
      this.roleTableHeight = this.$refs.showContent.offsetHeight - 75;
      this.treeTableHeight = (this.$refs.showContent.offsetHeight - 250) + "px";
      this.queryRoles();
      this.querySelect();
    }
  }
</script>

<style>
  .form-input {
    width: 200px;
  }
</style>
