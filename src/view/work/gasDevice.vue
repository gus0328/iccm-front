<template>
  <div ref="showContent" style="width:100%;height:100%">
    <div style="width:100%;height:37px;line-height:37px;">
      <Form ref="queryFormRef" inline :model="form">
        <Form-item prop="itemCode">
          <label style="margin-right:10px;">设备编号</label><Input v-model="form.itemCode" style="width:200px"></Input>
        </Form-item>
        <Form-item prop="itemName">
          <label style="margin-right:10px;">设备名称</label><Input v-model="form.itemName" style="width:200px"></Input>
        </Form-item>
        <Form-item prop="spareWord1">
          <label style="margin-right:10px;">设备类型</label>
          <Select class="form-input" v-model="form.spareWord1" style="width:140px !important">
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
    <Button style="margin:5px 0;" type="info" @click="add">新增</Button>
    <Table class="content-table" :loading="loading" :columns="columns" :data="data" :height="rootTableHeight">
      <template slot-scope="{ row, index }" slot="action">
        <Button style="margin-right:10px;" size="small" type="primary" @click="edit(row)">编辑</Button>
        <Button size="small" type="error" @click="del(row)">删除</Button>
      </template>
      <template slot-scope="{row}" slot="type">
        {{typeList[row.spareWord1].label}}
      </template>
    </Table>
    <template>
      <Page ref="dictPage" :total="deviceCount" :current="devicePageNo" :page-size="devicePageSize" :page-size-opts="devicePageSizeOpt"
        @on-change="onDevicePageChange" @on-page-size-change="onDevicePageSizeChange" show-sizer show-elevator show-total />
    </template>
    <Modal v-model="editModal" width="480" :title="editTitle" :mask-closable="false" :closable="false">
      <div style="text-align:center">
        <Form ref="editForm" :model="editForm" :rules="editRules" inline :label-width="70">
          <Form-item label="设备编号" prop="itemCode">
            <Input class="form-input" v-model="editForm.itemCode" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="设备名称" prop="itemName">
            <Input class="form-input" v-model="editForm.itemName" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="设备类型" prop="spareWord1">
            <Select v-model="editForm.spareWord1" style="width:200px">
                    <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
          </Form-item>
          <Form-item label="区域" prop="purpose">
            <Input class="form-input" v-model="editForm.purpose" type="textarea" :autosize="{minRows: 4,maxRows: 10}"
              placeholder="请输入"></Input>
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
    name: 'gasDevice',
    data() {
      return {
        typeList:[{
          value:"0",
          label:"氧气监测设备"
        },{
          value:"1",
          label:"一氧化碳监测设备"
        },{
          value:"2",
          label:"硫化氢监测设备"
        },{
          value:"3",
          label:"瓦斯监测设备"
        },{
          value:"4",
          label:"温度监测设备"
        }],
        form: {
          itemCode: "",
          itemName: "",
          spareWord1:""
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
          purpose: "",
          remark: "",
          spareWord1:""
        },
        editFormCopy: {
          itemCode: "",
          itemName: "",
          purpose: "",
          remark: "",
          spareWord1:""
        },
        editRules: {
          itemName: [{
            required: true,
            message: '请输入设备名称',
            trigger: 'blur'
          }],
          itemCode: [{
            required: true,
            type: 'string',
            message: '请输入设备编号',
            trigger: 'blur'
          }],
          spareWord1:[{
            required: true,
            type: 'string',
            message: '请选择类型',
            trigger: 'blur'
          }]
        },
        columns: [{
            title: '设备编号',
            key: 'itemCode',
            align: 'center'
          },
          {
            title: '设备名称',
            key: 'itemName',
            align: 'center'
          },
          {
            title: '设备类型',
            key: 'spareWord1',
            align: 'center',
            slot: "type"
          },
          {
            title: '区域',
            key: 'purpose',
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
        let url = "/work/gasDevice/pageList?pageNum=" + this.devicePageNo + "&pageSize=" + this.devicePageSize +
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
              url: "/work/gasDevice/remove",
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
            let url = "/work/gasDevice/edit";
            if (this.editTitle == "新增") {
              url = "/work/gasDevice/add";
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
