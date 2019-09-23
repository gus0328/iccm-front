<template>
  <div ref="showContent" style="width:100%;height:100%">
    <div style="width:100%;height:37px;line-height:37px;">
      <Form ref="queryFormRef" inline :model="form">
        <Form-item prop="postCode">
          <label style="margin-right:10px;">岗位编码</label><Input v-model="form.postCode" style="width:200px"></Input>
        </Form-item>
        <Form-item prop="postName">
          <label style="margin-right:10px;">岗位名称</label><Input v-model="form.postName" style="width:200px"></Input>
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
      <Page ref="dictPage" :total="postCount" :current="postPageNo" :page-size="postPageSize" :page-size-opts="postPageSizeOpt"
        @on-change="onPostPageChange" @on-page-size-change="onPostPageSizeChange" show-sizer show-elevator show-total />
    </template>
    <Modal v-model="editModal" width="480" :title="editTitle" :mask-closable="false" :closable="false">
      <div style="text-align:center">
        <Form ref="editForm" :model="editForm" :rules="editRules" inline :label-width="70">
          <Form-item label="岗位名称" prop="postName">
            <Input class="form-input" v-model="editForm.postName" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="岗位编码" prop="postCode">
            <Input class="form-input" v-model="editForm.postCode" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="排序编号" prop="postSort">
            <Input class="form-input" v-model="editForm.postSort" placeholder="请输入"></Input>
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
    name: 'post',
    data() {
      return {
        form: {
          postName: "",
          postCode: ""
        },
        data: [],
        rootTableHeight: 400,
        editModal: false,
        loading: false,
        postCount: 0,
        postPageSize: 50,
        postPageNo: 1,
        postPageSizeOpt: [50, 100, 150, 200],
        editTitle: "新增",
        editForm: {
          postName: "",
          postCode: "",
          postSort: "",
          remark: ""
        },
        editFormCopy: {
          postName: "",
          postCode: "",
          postSort: "",
          remark: ""
        },
        editRules: {
          postName: [{
            required: true,
            message: '岗位名称不能为空',
            trigger: 'blur'
          }],
          postSort: [{
              required: true,
              message: '排序号不能为空',
              trigger: 'blur'
            },
            {
              validator: this.$validateNumber,
              trigger: 'blur'
            }
          ],
          postCode: [{
            required: true,
            type: 'string',
            message: '请输入菜单名称',
            trigger: 'blur'
          }],
        },
        columns: [{
            title: '岗位名称',
            key: 'postName',
            align: 'center'
          },
          {
            title: '岗位编码',
            key: 'postCode',
            align: 'center'
          },
          {
            title: '排序编号',
            key: 'postSort',
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
      queryPosts() {
        this.loading = true;
        let url = "/system/post/pageList?pageNum=" + this.dictPageNo + "&pageSize=" + this.dictPageSize +
          "&orderByColumn=createTime&isAsc=desc"
        this.$ajax.request({
          url: url,
          data: this.form,
          method: "post"
        }).then((res) => {
          this.data = res.data.data.rows;
          this.postCount = res.data.data.total;
          this.loading = false;
        })
      },
      resetQueryForm() {
        this.$refs.queryFormRef.resetFields();
      },
      onPostPageChange(num) {
        this.postPageNo = num;
        this.queryPosts();
      },
      onPostPageSizeChange(pageSize) {
        this.postPageSize = pageSize;
        this.postPageNo = 1;
        this.queryPosts();
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
              url: "/system/post/remove",
              data: {
                "id": row.postId
              },
              method: "post"
            }).then((res) => {
              object.$Message.success(res.data.msg);
              object.queryPosts();
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
            let url = "/system/post/edit";
            if (this.editTitle == "新增") {
              url = "/system/post/add";
            }
            this.$ajax.request({
              url: url,
              data: this.editForm,
              method: "post"
            }).then((res) => {
              this.$Message.success(res.data.msg);
              this.editWdClose();
              this.queryPosts();
            })
          }
        })
      },
      editWdClose() {
        this.editModal = false;
        this.$refs.editForm.resetFields();
      },
      query(){
        this.postPageNo = 1;
        this.queryPosts();
      }
    },
    mounted() {
      this.rootTableHeight = this.$refs.showContent.offsetHeight - 110;
      this.queryPosts();
    }
  }
</script>

<style>
  .form-input {
    width: 200px;
  }
</style>
