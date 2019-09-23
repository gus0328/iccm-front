<template>
  <div ref="showContent" style="width:100%;height:98%">
    <div style="width:100%;height:37px;line-height:37px;">
      <Form ref="queryFormRef" inline :model="form">
        <Form-item prop="menuTitle">
          <label style="margin-right:10px;">菜单标题</label><Input v-model="form.menuTitle" style="width:200px"></Input>
        </Form-item>
        <Form-item prop="menuType">
          <label style="margin-right:10px;">菜单类型</label>
          <Select class="form-input" v-model="form.menuType">
            <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Form-item>
        <Form-item>
          <Button type="primary" @click="queryMenus">查询</Button>
        </Form-item>
        <Form-item>
          <Button @click="resetQueryForm">重置</Button>
        </Form-item>
      </Form>
    </div>
    <Button style="margin:5px 0;" type="info" @click="addRootModal=true">新增</Button>
    <Button style="margin-left:10px;" @click="foldChange" type="success">展开折叠</Button>
    <tree-table expand-key="menuTitle" :is-fold="isfold" :selectable="false" :columns="columns" :max-height="menuTableHeight"
      :data="data">
      <template slot="control" slot-scope="scope">
        <Button style="margin-right:10px;" size="small" type="primary" @click="edit(scope)">编辑</Button>
        <Button style="margin-right:10px;" size="small" type="info" @click="add(scope)">新增</Button>
        <Button size="small" type="error" @click="del(scope)">删除</Button>
      </template>
    </tree-table>
    <Modal v-model="addRootModal" width="480" :title="addRootTitle" :mask-closable="false" :closable="false">
      <div style="text-align:center">
        <Form ref="addRootForm" :model="addRootForm" :rules="rootRules" inline :label-width="70">
          <Form-item label="菜单标题" prop="menuTitle">
            <Input class="form-input" v-model="addRootForm.menuTitle" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="排序" prop="orderNum">
            <Input class="form-input" v-model="addRootForm.orderNum" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="菜单名称" prop="menuName">
            <Input class="form-input" v-model="addRootForm.menuName" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="菜单路径" prop="menuUrl">
            <Input class="form-input" v-model="addRootForm.menuUrl" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="菜单类型" prop="menuType">
            <Select class="form-input" v-model="addRootForm.menuType">
              <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Form-item>
          <Form-item label="备注" prop="remark">
            <Input class="form-input" v-model="addRootForm.remark" type="textarea" :autosize="{minRows: 4,maxRows: 10}"
              placeholder="请输入"></Input>
          </Form-item>
        </Form>
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
          <Form-item label="上级菜单">
            <TreeSelectSingle class="form-input" :disabled="treeSelectFlag" :title="editForm.parentName" v-on:on-select="selectParent"
              :data="treeData"></TreeSelectSingle>
          </Form-item>
          <Form-item label="菜单标题" prop="menuTitle">
            <Input class="form-input" v-model="editForm.menuTitle" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="排序" prop="orderNum">
            <Input class="form-input" v-model="editForm.orderNum" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="菜单名称" prop="menuName">
            <Input class="form-input" v-model="editForm.menuName" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="菜单路径" prop="menuUrl">
            <Input class="form-input" v-model="editForm.menuUrl" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="菜单类型" prop="menuType">
            <Select class="form-input" v-model="editForm.menuType">
              <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Form-item>
          <Form-item label="备注" prop="remark">
            <Input class="form-input" v-model="editForm.remark" type="textarea" :autosize="{minRows: 4,maxRows: 10}"
              placeholder="请输入"></Input>
          </Form-item>
        </Form>
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
        menuTableHeight: 400,
        editModal: false,
        addRootTitle: "新增",
        editModalTitle: "新增",
        treeSelectFlag: false,
        typeList: [{
            value: "PC",
            label: "PC"
          },
          {
            value: "APP",
            label: "APP"
          }
        ],
        addRootForm: {
          parentId: 0,
          menuName: "",
          menuTitle: "",
          menuUrl: "",
          menuType: "",
          orderNum: "",
          remark: ""
        },
        editForm: {
          parentName: "",
          parentId: "",
          menuName: "",
          menuTitle: "",
          menuUrl: "",
          menuType: "",
          orderNum: "",
          remark: ""
        },
        editFormCopy: {
          parentName: "",
          parentId: "",
          menuName: "",
          menuTitle: "",
          menuUrl: "",
          menuType: "",
          order: "",
          remark: ""
        },
        form: {
          menuTitle: "",
          menuType: ""
        },
        isfold: false,
        columns: [{
            title: '菜单标题',
            key: 'menuTitle',
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
            title: '菜单名称',
            key: 'menuName',
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
            title: '菜单类型',
            key: 'menuType',
            align: 'center',
            headerAlign: "center"
          },
          {
            title: '备注',
            key: 'remark',
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
          menuTitle: [{
              required: true,
              message: '菜单标题不能为空',
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
              message: '排序号不能为空',
              trigger: 'blur'
            },
            {
              validator: this.$validateNumber,
              trigger: 'blur'
            }
          ],
          menuName: [{
            required: true,
            type: 'string',
            message: '请输入菜单名称',
            trigger: 'blur'
          }],
          menuUrl: [{
            required: true,
            type: 'string',
            message: '请输入菜单路径',
            trigger: 'blur'
          }],
          type: [{
            required: true,
            type: 'string',
            message: '请选择菜单类型',
            trigger: 'blur'
          }]
        },
        editRules: {
          menuTitle: [{
              required: true,
              message: '菜单标题不能为空',
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
              message: '排序号不能为空',
              trigger: 'blur'
            },
            {
              validator: this.$validateNumber,
              trigger: 'blur'
            }
          ],
          menuName: [{
            required: true,
            type: 'string',
            message: '请输入菜单名称',
            trigger: 'blur'
          }],
          menuUrl: [{
            required: true,
            type: 'string',
            message: '请输入菜单路径',
            trigger: 'blur'
          }],
          type: [{
            required: true,
            type: 'string',
            message: '请选择菜单类型',
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
      queryMenus() {
        this.$ajax.request({
          url: "/system/menu/list",
          data: this.form,
          method: "post"
        }).then((res) => {
          if (res.data.code == 200) {
            this.data = res.data.data;
          } else {
            this.$Message.error(res.data.msg);
          }

        })
      },
      addRoot() {
        this.$refs.addRootForm.validate((valid) => {
          if (valid) {
            this.$ajax.request({
              url: "/system/menu/add",
              data: this.addRootForm,
              method: "post"
            }).then((res) => {
              this.$Message.success(res.data.msg);
              this.rootWdClose();
              this.queryMenus();
              this.getTreeData();
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
            let url = "/system/menu/edit";
            if (this.editModalTitle == "新增") {
              url = "/system/menu/add";
            }
            this.$ajax.request({
              url: url,
              data: this.editForm,
              method: "post"
            }).then((res) => {
              this.$Message.success(res.data.msg);
              this.close();
              this.queryMenus();
              this.getTreeData();
            })
          }
        })
      },
      add(scope) {
        this.editModalTitle = "新增";
        this.treeSelectFlag = false;
        this.editForm = Object.assign({}, this.editFormCopy);
        this.editForm.parentName = scope.row.menuTitle;
        this.editForm.parentId = scope.row.menuId;
        this.editForm.menuType = scope.row.menuType;
        this.editModal = true;
      },
      edit(scope) {
        this.editForm = Object.assign({}, scope.row);
        if (this.editForm.parentId == 0) {
          this.editForm["parentName"] = "一级菜单";
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
              url: "/system/menu/remove",
              data: {
                "id": scope.row.menuId
              },
              method: "post"
            }).then((res) => {
              object.$Message.success(res.data.msg);
              object.queryMenus();
              object.getTreeData()
            })
          }
        })

      },
      getTreeData() {
        this.$ajax.request({
          url: "/system/menu/treeSelect",
          method: "get"
        }).then((res) => {
          this.treeData = res.data.data;
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
      this.menuTableHeight = this.$refs.showContent.offsetHeight - 75;
      this.queryMenus();
      this.getTreeData();
    }
  }
</script>

<style>
  .form-input {
    width: 200px;
  }
</style>
