<template>
  <div ref="showContent" style="width:100%;height:100%">
    <div style="width:100%;height:37px;line-height:37px;">
      <Form ref="queryFormRef" inline :model="form">
        <Form-item prop="ipAdress">
          <label style="margin-right:10px;">ip地址</label><Input v-model="form.ipAdress" style="width:200px"></Input>
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
      <template slot-scope="{ row, index }" slot="action">
        <Button style="margin-right:10px;" size="small" type="primary" @click="edit(row)">编辑</Button>
        <Button size="small" type="error" @click="del(row)">删除</Button>
      </template>
    </Table>
    <template>
      <Page ref="dictPage" :total="deviceCount" :current="devicePageNo" :page-size="devicePageSize" :page-size-opts="devicePageSizeOpt"
        @on-change="onDevicePageChange" @on-page-size-change="onDevicePageSizeChange" show-sizer show-elevator show-total />
    </template>
    <Modal v-model="editModal" width="480" :title="editTitle" :mask-closable="false" :closable="false">
      <div style="text-align:center">
        <Form ref="editForm" :model="editForm" :rules="editRules" inline :label-width="70">
          <Form-item label="ip地址" prop="ipAdress">
            <Input class="form-input" v-model="editForm.ipAdress" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="用户名" prop="itemCode">
            <Input class="form-input" v-model="editForm.itemCode" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="密码" prop="itemName">
            <Input class="form-input" v-model="editForm.itemName" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="端口号" prop="spareWord1">
            <Input class="form-input" v-model="editForm.spareWord1" placeholder="请输入"></Input>
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
  </div>
</template>
<script>
  export default {
    name: 'monitorDevice',
    data() {
      return {
        form: {
          ipAdress: ""
        },
        data: [],
        rootTableHeight: 400,
        editModal: false,
        loading: false,
        deviceCount: 0,
        devicePageSize: 50,
        devicePageNo: 1,
        devicePageSizeOpt: [50, 100, 150, 200],
        editTitle: "新增",
        editForm: {
          itemCode: "",
          itemName: "",
          ipAdress: "",
          remark: "",
          spareWord1:""
        },
        editFormCopy: {
          itemCode: "",
          itemName: "",
          ipAdress: "",
          remark: "",
          spareWord1:""
        },
        editRules: {
          itemName: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }],
          itemCode: [{
            required: true,
            type: 'string',
            message: '请输入用户名',
            trigger: 'blur'
          }],
          ipAdress: [{
            required: true,
            message: '请输入ip地址',
            trigger: 'blur'
          }],
          spareWord1: [{
            required: true,
            message: '请输入端口号',
            trigger: 'blur'
          }]
        },
        columns: [{
            title: 'ip地址',
            key: 'ipAdress',
            align: 'center'
          },{
            title: '用户名',
            key: 'itemCode',
            align: 'center'
          },
          {
            title: '密码',
            key: 'itemName',
            align: 'center'
          },
          {
            title: '端口号',
            key: 'spareWord1',
            align: 'center'
          },
          {
            title: '创建时间',
            key: 'createTime',
            align: 'center'
          },
          {
            title: '备注',
            key: 'remark',
            align: 'center'
          },
          {
            title: '操作',
            key: 'control',
            width: 180,
            align: 'center',
            slot: "action"
          }
        ]
      }
    },
    methods: {
      queryDevices() {
        this.loading = true;
        let url = "/work/monitorDevice/pageList?pageNum=" + this.devicePageNo + "&pageSize=" + this.devicePageSize +
          "&orderByColumn=createTime&isAsc=desc"
        this.$ajax.request({
          url: url,
          data: this.form,
          method: "post"
        }).then((res) => {
          this.data = res.data.data.rows;
          this.deviceCount = res.data.data.total;
          this.loading = false;
        })
      },
      resetQueryForm() {
        this.$refs.queryFormRef.resetFields();
      },
      onDevicePageChange(num) {
        this.devicePageNo = num;
        this.queryDevices();
      },
      onDevicePageSizeChange(pageSize) {
        this.devicePageSize = pageSize;
        this.devicePageNo = 1;
        this.queryDevices();
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
              url: "/work/monitorDevice/remove",
              data: {
                "id": row.id
              },
              method: "post"
            }).then((res) => {
              object.$Message.success(res.data.msg);
              object.queryDevices();
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
            let url = "/work/monitorDevice/edit";
            if (this.editTitle == "新增") {
              url = "/work/monitorDevice/add";
            }
            this.$ajax.request({
              url: url,
              data: this.editForm,
              method: "post"
            }).then((res) => {
              this.$Message.success(res.data.msg);
              this.editWdClose();
              this.queryDevices();
            })
          }
        })
      },
      editWdClose() {
        this.editModal = false;
        this.$refs.editForm.resetFields();
      },
      query(){
        this.devicePageNo = 1;
        this.queryDevices();
      }
    },
    mounted() {
      this.rootTableHeight = this.$refs.showContent.offsetHeight - 110;
      this.queryDevices();
    }
  }
</script>

<style>
  .form-input {
    width: 200px;
  }
</style>
