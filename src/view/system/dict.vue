<template>
  <div ref="showContent" style="width:100%;height:100%">
    <div style="width:100%;height:37px;line-height:37px;">
      <Form ref="queryFormRef" inline :model="form">
        <Form-item prop="dictName">
          <label style="margin-right:10px;">字典名称</label><Input v-model="form.dictName" style="width:200px"></Input>
        </Form-item>
        <Form-item prop="dictType">
          <label style="margin-right:10px;">字典类型</label><Input v-model="form.dictType" style="width:200px"></Input>
        </Form-item>
        <Form-item prop="status">
          <label style="margin-right:10px;">字典状态</label>
          <Select class="form-input" v-model="form.status">
            <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Form-item>
        <Form-item>
          <Button type="primary" @click="queryDicts">查询</Button>
        </Form-item>
        <Form-item>
          <Button @click="resetQueryForm">重置</Button>
        </Form-item>
      </Form>
    </div>
    <Button style="margin:5px 0;" type="info" @click="addTypeModal=true">新增</Button>
    <Table class="content-table" ref="dictTable" :loading="loading" :columns="columns1" :data="data1" :height="rootTableHeight">
      <template slot-scope="{ row }" slot="dictType">
        <div @click="showDetails(row)" style="color: #337ab7;cursor: pointer;">{{row.dictType}}</div>
      </template>
      <template slot-scope="{ row }" slot="status">
        <div style="width:40px;color:white;border-radius:10px;background: green;margin: auto;" v-if="row.status==0">正常</div>
        <div style="width:40px;color: white;border-radius:10px;background: red;margin: auto;" v-else>停用</div>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <Button style="margin-right:10px;" size="small" type="primary" @click="edit(row)">编辑</Button>
        <Button size="small" type="error" @click="del(row)">删除</Button>
      </template>
    </Table>
    <template>
      <Page ref="dictPage" :total="dictCount" :current="dictPageNo" :page-size="dictPageSize" :page-size-opts="dictPageSizeOpt"
        @on-change="onDictPageChange" @on-page-size-change="onDictPageSizeChange" show-sizer show-elevator show-total />
    </template>
    <Modal v-model="addTypeModal" width="480" :title="addTypeTitle" :mask-closable="false" :closable="false">
      <div style="text-align:center">
        <Form ref="addTypeForm" :model="addTypeForm" :rules="addTypeRules" inline :label-width="70">
          <Form-item label="字典名称" prop="dictName">
            <Input class="form-input" v-model="addTypeForm.dictName" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="字典类型" prop="dictType">
            <Input class="form-input" v-model="addTypeForm.dictType" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="备注" prop="remark">
            <Input class="form-input" v-model="addTypeForm.remark" type="textarea" :autosize="{minRows: 4,maxRows: 10}"
              placeholder="请输入"></Input>
          </Form-item>
        </Form>
      </div>
      <div slot="footer" style="text-align:center">
        <Button type="primary" style="width:80px;" @click="addTypeSave('add')">保存</Button>
        <Button type="error" style="width:80px;" @click="typeWdClose">取消</Button>
      </div>
    </Modal>
    <Modal v-model="editTypeModal" width="480" :title="editTypeTitle" :mask-closable="false" :closable="false">
      <div style="text-align:center">
        <Form ref="editTypeForm" :model="editTypeForm" :rules="addTypeRules" inline :label-width="70">
          <Form-item label="字典名称" prop="dictName">
            <Input class="form-input" v-model="editTypeForm.dictName" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="字典类型" prop="dictType">
            <Input class="form-input" v-model="editTypeForm.dictType" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="备注" prop="remark">
            <Input class="form-input" v-model="editTypeForm.remark" type="textarea" :autosize="{minRows: 4,maxRows: 10}"
              placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="状态" prop="status">
            <RadioGroup v-model="editTypeForm.status">
              <Radio label="0">正常</Radio>
              <Radio label="1">停用</Radio>
            </RadioGroup>
          </Form-item>
        </Form>
      </div>
      <div slot="footer" style="text-align:center">
        <Button type="primary" style="width:80px;" @click="editTypeSave">保存</Button>
        <Button type="error" style="width:80px;" @click="typeEditWdClose">取消</Button>
      </div>
    </Modal>
    <Modal v-model="dataDetailsModal" width="80%" :title="dataDetailsTitle" :mask-closable="false" :closable="false">
      <Button type="info" @click="dictDataAdd" style="margin-bottom: 15px;width:80px;">新增</Button>
      <div style="text-align:center">
        <Table class="content-table" ref="dictDataTable" :loading="dataLoading" :columns="columns2" :data="data2"
          :height="dataTableHeight">
          <template slot-scope="{ row }" slot="status">
            <div style="width:40px;color:white;border-radius:10px;background: green;margin: auto;" v-if="row.status==0">正常</div>
            <div style="width:40px;color: white;border-radius:10px;background: red;margin: auto;" v-else>停用</div>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button style="margin-right:10px;" size="small" type="primary" @click="editData(row)">编辑</Button>
            <Button size="small" type="error" @click="delData(row)">删除</Button>
          </template>
        </Table>

      </div>
      <div slot="footer" style="text-align:center">
        <Button type="error" style="width:120px;marign-left:10px;" @click="dataDetailsClose">关闭</Button>
      </div>
    </Modal>
    <Modal v-model="editDataModal" width="480" :title="editDataTitle" :mask-closable="false" :closable="false">
      <div style="text-align:center">
        <Form ref="editDataForm" :model="editDataForm" :rules="editDataRules" inline :label-width="70">
          <Form-item label="字典类型" prop="dictType">
            <Input class="form-input" readonly v-model="editDataForm.dictType" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="字典标签" prop="dictLabel">
            <Input class="form-input" v-model="editDataForm.dictLabel" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="字典键值" prop="dictValue">
            <Input class="form-input" v-model="editDataForm.dictValue" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="备注" prop="remark">
            <Input class="form-input" v-model="editDataForm.remark" type="textarea" :autosize="{minRows: 4,maxRows: 10}"
              placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="状态" prop="status">
            <RadioGroup v-model="editDataForm.status">
              <Radio label="0">正常</Radio>
              <Radio label="1">停用</Radio>
            </RadioGroup>
          </Form-item>
        </Form>
      </div>
      <div slot="footer" style="text-align:center">
        <Button type="primary" style="width:80px;" @click="editDataSave">保存</Button>
        <Button type="error" style="width:80px;" @click="dataEditWdClose">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  export default {
    name: 'depart',
    data() {
      return {
        addTypeModal: false,
        editTypeModal: false,
        dataDetailsModal: false,
        addDataModal: false,
        editDataModal: false,
        editDataTitle: "新增",
        addTypeTitle: "新增",
        editTypeTitle: "修改",
        dataDetailsTitle: "数据详情",
        loading: false,
        dataLoading: false,
        data1: [],
        data2: [],
        rootTableHeight: 500,
        dataTableHeight: 600,
        dictCount: 0,
        dictPageSize: 50,
        dictPageNo: 1,
        dictPageSizeOpt: [50, 100, 150, 200],
        isfold: false,
        statusList:[
          {
            value:"",
            label:"所有"
          },
          {
            value:"0",
            label:"正常"
          },
          {
            value:"1",
            label:"停用"
          }
        ],
        form: {
          dictName: "",
          dictType: "",
          status: ""
        },
        editDataForm: {
          dictType: "",
          dictLabel: "",
          dictValue: "",
          remark: "",
          status: '0'
        },
        editDataFormCopy: {
          dictType: "",
          dictLabel: "",
          dictValue: "",
          remark: "",
          status: '0'
        },
        editTypeForm: {
          dictName: "",
          dictType: "",
          remark: "",
          status: ""
        },
        addTypeForm: {
          dictName: "",
          dictType: "",
          remark: "",
          status: 0
        },
        editDataRules: {
          dictLabel: [{
            required: true,
            message: '字典标签不能为空',
            trigger: 'blur'
          }],
          dictValue: [{
            required: true,
            message: '字典键值不能为空',
            trigger: 'blur'
          }]
        },
        addTypeRules: {
          dictName: [{
            required: true,
            message: '字典名称不能为空',
            trigger: 'blur'
          }],
          dictType: [{
            required: true,
            message: '字典类型不能为空',
            trigger: 'blur'
          }]
        },
        columns1: [{
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '字典名称',
            key: 'dictName',
            align: 'center'
          },
          {
            title: '字典类型',
            key: 'dictType',
            align: 'center',
            slot: "dictType"
          },
          {
            title: '状态',
            key: 'status',
            align: 'center',
            slot: "status"
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
            width: 180,
            align: 'center',
            slot: 'action'
          }
        ],
        columns2: [{
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '字典标签',
            key: 'dictLabel',
            align: 'center'
          },
          {
            title: '字典键值',
            key: 'dictValue',
            align: 'center'
          },
          {
            title: '字典排序',
            key: 'dictSort',
            align: 'center'
          },
          {
            title: '状态',
            key: 'status',
            align: 'center',
            slot: "status"
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
            width: 180,
            align: 'center',
            slot: 'action'
          }
        ]
      }
    },
    methods: {
      addTypeSave() {
        this.$refs.addTypeForm.validate((valid) => {
          if (valid) {
            this.$ajax.request({
              url: "/system/dict/add",
              data: this.addTypeForm,
              method: "post"
            }).then((res) => {
              if (res.data.code == 200) {
                this.$Message.success(res.data.msg);
                this.typeWdClose();
                this.queryDicts();
              } else {
                this.$Message.error(res.data.msg);
              }
            })
          }
        })
      },
      editTypeSave() {
        this.$refs.editTypeForm.validate((valid) => {
          if (valid) {
            this.$ajax.request({
              url: "/system/dict/edit",
              data: this.editTypeForm,
              method: "post"
            }).then((res) => {
              if (res.data.code == 200) {
                this.$Message.success(res.data.msg);
                this.typeEditWdClose();
                this.queryDicts();
              } else {
                this.$Message.error(res.data.msg);
              }
            })
          }
        })
      },
      editDataSave() {
        this.$refs.editDataForm.validate((valid) => {
          if (valid) {
            let url = "/system/dict/data/edit";
            if (this.editDataTitle == "新增") {
              url = "/system/dict/data/add";
            }
            this.$ajax.request({
              url: url,
              data: this.editDataForm,
              method: "post"
            }).then((res) => {
              if (res.data.code == 200) {
                this.$Message.success(res.data.msg);
                this.dataEditWdClose();
                this.queryDataByType();
              } else {
                this.$Message.error(res.data.msg);
              }
            })
          }
        })
      },
      dataEditWdClose() {
        this.$refs.editDataForm.resetFields();
        this.editDataModal = false;
      },
      typeWdClose() {
        this.addTypeModal = false;
        this.$refs.addTypeForm.resetFields();
      },
      typeEditWdClose() {
        this.editTypeModal = false;
        this.$refs.editTypeForm.resetFields();
        this.editDataFormCopy.dictType = "";
      },
      onDictPageChange(num) {
        this.dictPageNo = num;
        this.queryDicts();
      },
      onDictPageSizeChange(pageSize) {
        this.dictPageSize = pageSize;
        this.dictPageNo = 1;
        this.queryDicts();
      },
      queryDicts() {
        this.loading = true;
        let url = "/system/dict/list?pageNum=" + this.dictPageNo + "&pageSize=" + this.dictPageSize +
          "&orderByColumn=createTime&isAsc=desc"
        this.$ajax.request({
          url: url,
          data: this.form,
          method: "post"
        }).then((res) => {
          this.data1 = res.data.rows;
          this.dictCount = res.data.total;
          this.loading = false;
        })
      },
      resetQueryForm() {
        this.$refs.queryFormRef.resetFields();
      },
      dictDataAdd() {
        this.editDataForm = Object.assign({}, this.editDataFormCopy);
        this.editDataModal = true;
        this.editDataTitle = "新增";
      },
      editData(row) {
        this.editDataForm = Object.assign({}, row);
        this.editDataModal = true;
        this.editDataTitle = "修改";
      },
      delData(row) {
        let object = this;
        this.$Modal.confirm({
          title: '删除',
          content: '您确定删除此数据？',
          onOk: function() {
            this.$ajax.request({
              url: "/system/dict/data/removeById",
              data: {
                "id": row.dictCode
              },
              method: "post"
            }).then((res) => {
              if (res.data.code == 200) {
                object.$Message.success(res.data.msg);
                object.queryDataByType();
              } else {
                object.$Message.error(res.data.msg);
              }
            })
          }
        })

      },
      edit(row) {
        this.editTypeForm = Object.assign({}, row);
        this.editTypeModal = true;
      },
      del(row) {
        let object = this;
        this.$Modal.confirm({
          title: '删除',
          content: '您确定删除此数据？',
          onOk: function() {
            this.$ajax.request({
              url: "/system/dict/removeById",
              data: {
                "id": row.dictId
              },
              method: "post"
            }).then((res) => {
              if (res.data.code == 200) {
                object.$Message.success(res.data.msg);
                object.queryDicts();
              } else {
                object.$Message.error(res.data.msg);
              }
            })
          }
        })
      },
      dataDetailsClose() {
        this.data2 = [];
        this.dataDetailsModal = false;
      },
      showDetails(row) {
        this.dataDetailsModal = true;
        this.editDataFormCopy.dictType = row.dictType;
        this.queryDataByType();
      },
      queryDataByType() {
        this.dataLoading = true;
        this.$ajax.request({
          url: "/system/dict/data/list1",
          data: {
            "id": this.editDataFormCopy.dictType
          },
          method: "post"
        }).then((res) => {
          this.dataLoading = false;
          this.data2 = res.data;
        })
      }
    },
    mounted() {
      this.rootTableHeight = this.$refs.showContent.offsetHeight - 110;
      this.dataTableHeight = this.$refs.showContent.offsetHeight - 200;
      this.queryDicts();
    }
  }
</script>

<style>
  .form-input {
    width: 200px;
  }
</style>
