<template>
  <div ref="showContent" style="width:100%;height:100%">
    <div style="width:100%;height:37px;line-height:37px;">
      <Form ref="queryFormRef" inline :model="form">
        <Form-item prop="versionCode">
          <label style="margin-right:10px;">版本编号</label><Input v-model="form.version" style="width:200px"></Input>
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
        <Button style="margin-right:10px;" size="small" type="error" @click="del(row)">删除</Button>
        <Button size="small" type="info" @click="details(row)">内容详情</Button>
      </template>
    </Table>
    <template>
      <Page ref="noticePage" :total="noticeCount" :current="noticePageNo" :page-size="noticePageSize" :page-size-opts="noticePageSizeOpt"
        @on-change="onnoticePageChange" @on-page-size-change="onnoticePageSizeChange" show-sizer show-elevator show-total />
    </template>
    <Modal v-model="editModal" width="480" :title="editTitle" :mask-closable="false" :closable="false">
      <div style="text-align:center">
        <Form ref="editForm" :model="editForm" :rules="editRules" inline :label-width="70">
          <Form-item label="版本编号" prop="versionCode">
            <Input class="form-input" v-model="editForm.versionCode" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="内容地址" prop="contentUrl">
            <Input class="form-input" v-model="editForm.contentUrl" placeholder="请输入"></Input>
          </Form-item>
        </Form>
      </div>
      <div slot="footer" style="text-align:center">
        <Button type="primary" style="width:80px;" @click="editSave">保存</Button>
        <Button type="error" style="width:80px;" @click="editWdClose">取消</Button>
      </div>
    </Modal>
    <Modal v-model="detailsModal" width="720" title="内容详情" :mask-closable="false" :closable="false">
        <iframe style="width:100%;height:500px;" :src="detailsUrl"></iframe>
    </Modal>
  </div>
</template>
<script>
  export default {
    name: 'notice',
    data() {
      return {
        detailsModal:false,
        detailsUrl:"",
        form: {
          versionCode: ""
        },
        data: [],
        rootTableHeight: 400,
        editModal: false,
        loading: false,
        noticeCount: 0,
        noticePageSize: 50,
        noticePageNo: 1,
        noticePageSizeOpt: [50, 100, 150, 200],
        editTitle: "新增",
        editForm: {
          versionCode: "",
          contentUrl: ""
        },
        editFormCopy: {
          versionCode: "",
          contentUrl: ""
        },
        editRules: {
          versionCode: [{
            required: true,
            message: '版本编号不能为空',
            trigger: 'blur'
          }],
          contentUrl: [{
            required: true,
            type: 'string',
            message: '内容地址不能为空',
            trigger: 'blur'
          }],
        },
        columns: [{
            title: '版本编号',
            key: 'versionCode',
            align: 'center'
          },
          {
            title: '内容地址',
            key: 'contentUrl',
            align: 'center'
          },
          {
            title: '创建人',
            key: 'createBy',
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
            width: 260,
            align: 'center',
            slot: "action"
          }
        ]
      }
    },
    methods: {
      querynotices() {
        this.loading = true;
        let url = "/system/notice/pageList?pageNum=" + this.noticePageNo + "&pageSize=" + this.noticePageSize +
          "&orderByColumn=createTime&isAsc=desc"
        this.$ajax.request({
          url: url,
          data: this.form,
          method: "post"
        }).then((res) => {
          this.data = res.data.data.rows;
          this.noticeCount = res.data.data.total;
          this.loading = false;
        })
      },
      resetQueryForm() {
        this.$refs.queryFormRef.resetFields();
      },
      onnoticePageChange(num) {
        this.noticePageNo = num;
        this.querynotices();
      },
      onnoticePageSizeChange(pageSize) {
        this.noticePageSize = pageSize;
        this.noticePageNo = 1;
        this.querynotices();
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
              url: "/system/notice/remove",
              data: {
                "id": row.id
              },
              method: "post"
            }).then((res) => {
              object.$Message.success(res.data.msg);
              object.querynotices();
            })
          }
        })
      },
      details(row){
        this.detailsUrl = row.contentUrl;
        this.detailsModal = true;
      },
      add(row) {
        this.editTitle = "新增";
        this.editForm = Object.assign({}, this.editFormCopy);
        this.editModal = true;
      },
      editSave() {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            let url = "/system/notice/edit";
            if (this.editTitle == "新增") {
              url = "/system/notice/add";
            }
            this.$ajax.request({
              url: url,
              data: this.editForm,
              method: "post"
            }).then((res) => {
              this.$Message.success(res.data.msg);
              this.editWdClose();
              this.querynotices();
            })
          }
        })
      },
      editWdClose() {
        this.editModal = false;
        this.$refs.editForm.resetFields();
      },
      query(){
        this.noticePageNo = 1;
        this.querynotices();
      }
    },
    mounted() {
      this.rootTableHeight = this.$refs.showContent.offsetHeight - 110;
      this.querynotices();
    }
  }
</script>

<style>
  .form-input {
    width: 200px;
  }
</style>
