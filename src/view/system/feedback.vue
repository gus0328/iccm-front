<template>
  <div ref="showContent" style="width:100%;height:98%">
    <div style="width:100%;height:37px;line-height:37px;">
      <Form ref="queryFormRef" inline :model="form">
        <Form-item prop="createBy">
          <label style="margin-right:10px;">提交人员</label><Input v-model="form.createBy" style="width:100px"></Input>
        </Form-item>
        <Form-item prop="status">
          <label style="margin-right:10px;">意见状态</label>
          <Select class="form-input" v-model="form.status" style="width:100px !important">
            <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Form-item>
        <Form-item prop="params">
          <label style="margin-right:10px;">提交时间</label>
          <DatePicker v-model="date.begin" @on-change="beginTimeText" type="datetime" :editable="false" placeholder="Select month"
            style="width: 160px"></DatePicker>~
          <DatePicker v-model="date.end" @on-change="endTimeText" type="datetime" :editable="false" placeholder="Select month" style="width: 160px"></DatePicker>
        </Form-item>
        <Form-item>
          <Button type="primary" @click="query">查询</Button>
        </Form-item>
        <Form-item>
          <Button @click="resetQueryForm">重置</Button>
        </Form-item>
      </Form>
    </div>
    <Table class="content-table" :loading="loading" :columns="columns" :data="data" :height="rootTableHeight">
      <template slot="status" slot-scope="{ row }">
        <div style="width:60px;color:white;border-radius:10px;background: #5cadff;margin: auto;" v-if="row.status==0">未查看</div>
        <div style="width:60px;color: white;border-radius:10px;background: #e8eaec;margin: auto;" v-if="row.status==1">已查看</div>
        <div style="width:60px;color: white;border-radius:10px;background: #19be6b;margin: auto;" v-if="row.status>=2">已回复</div>
      </template>
      <template slot="action" slot-scope="{ row }">
        <Button style="margin-right:10px;" size="small" type="primary" @click="details(row)">详情</Button>
      </template>
    </Table>
    <template>
      <Page ref="dictPage" :total="logCount" :current="logPageNo" :page-size="logPageSize" :page-size-opts="logPageSizeOpt"
        @on-change="onLogPageChange" @on-page-size-change="onLogPageSizeChange" show-sizer show-elevator show-total />
    </template>
    <Modal v-model="dataDetailsModal" width="600px" title="操作详情" :mask-closable="false" :closable="false">
      <div>
        <Form ref="replyForm" :model="detailsData" :rules="editRules">
          <FormItem label="提交信息:">
            <Icon type="md-people" />{{detailsData.detpName}} <Icon type="md-person" />{{detailsData.createBy}} <Icon type="ios-time-outline" />{{detailsData.createTime}}
          </FormItem>
          <FormItem label="主题:">
            {{detailsData.title}}
          </FormItem>
          <FormItem label="意见/建议:">
            {{detailsData.content}}
          </FormItem>
          <FormItem v-if="detailsData.status>=2" label="回复时间:">
            {{detailsData.updateTime}}
          </FormItem>
          <FormItem v-if="detailsData.status>=2" label="回复内容:">
            {{detailsData.replyContent}}
          </FormItem>
          <Form-item v-if="detailsData.status<2" label="回复内容" prop="replyContent">
            <Input v-model="detailsData.replyContent" type="textarea" :autosize="{minRows: 6,maxRows: 10}"
              placeholder="请输入"></Input>
          </Form-item>
        </Form>
      </div>
      <div slot="footer" style="text-align:center">
        <Button v-if="detailsData.status<2" type="primary" style="width:120px;" @click="reply">回复</Button>
        <Button type="error" style="width:120px;marign-left:10px;" @click="dataDetailsClose">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        dataDetailsModal: false,
        statusList: [{
            value: "",
            label: "所有"
          },
          {
            value: "0",
            label: "未查看"
          },
          {
            value: "1",
            label: "已查看"
          },
          {
            value: "4",
            label: "已回复"
          }
        ],
        form: {
          createBy: "",
          status: "",
          params: {
            beginTime: "",
            endTime: ""
          }
        },
        date:{
          begin:"",
          end:""
        },
        detailsData:{},
        editRules:{
          replyContent: [{
            required: true,
            message: '回复内容不能为空',
            trigger: 'blur'
          }]
        },
        loading: false,
        data: [],
        rootTableHeight: 400,
        logCount: 0,
        logPageSize: 50,
        logPageNo: 1,
        logPageSizeOpt: [50, 100, 150, 200],
        columns: [{
            type: 'index',
            width: 60,
            align: 'center'
          }, {
            title: '提交人',
            key: 'createBy',
            align: 'center',
            minWidth: 100
          },
          {
            title: '部门',
            key: 'detpName',
            align: 'center',
            minWidth: 100
          },
          {
            title: '提交时间',
            key: 'createTime',
            align: 'center',
            minWidth: 120
          },
          {
            title: '主题',
            key: 'title',
            align: 'center',
            minWidth: 200
          },
          {
            title: '操作状态',
            key: 'status',
            slot: "status",
            align: 'center',
            minWidth: 120
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            slot: 'action',
            minWidth: 80
          }
        ]
      }
    },
    methods: {
      query() {
        this.loading = true;
        let url = "/system/feedback/pageList?pageNum=" + this.logPageNo + "&pageSize=" + this.logPageSize +
          "&orderByColumn=createTime&isAsc=desc"
        this.$ajax.request({
          url: url,
          data: this.form,
          method: "post"
        }).then((res) => {
          this.data = res.data.data.rows;
          this.logCount = res.data.data.total;
          this.loading = false;
        })
      },
      resetQueryForm() {
        this.$refs.queryFormRef.resetFields();
        this.date = {begin:"",end:""};
      },
      onLogPageChange(num) {
        this.logPageNo = num;
        this.query();
      },
      onLogPageSizeChange(pageSize) {
        this.logPageSize = pageSize;
        this.logPageNo = 1;
        this.query();
      },
      details(row) {
        if(row.status==0){
          let data = {id:row.id,status:1};
          this.$ajax.request({
            url:"/system/feedback/changeStatus",
            data: data,
            method:"post"
          })
        }
        this.detailsData = row;
        this.dataDetailsModal = true;
      },
      dataDetailsClose() {
        this.detailsData = {};
        this.dataDetailsModal = false;
      },
      beginTimeText(text){
        this.form.params.beginTime = text;
      },
      endTimeText(text){
        this.form.params.endTime = text;
      },
      reply(){
        this.$refs.replyForm.validate((valid) => {
          this.detailsData.status = 2;
          if (valid) {
            let url = "/system/feedback/edit";
            this.$ajax.request({
              url: url,
              data: this.detailsData,
              method: "post"
            }).then((res) => {
              this.$Message.success(res.data.msg);
             this.dataDetailsClose();
             this.query();
            })
          }
        })
      }
    },
    mounted() {
      this.query();
      this.rootTableHeight = this.$refs.showContent.offsetHeight - 50;
    }
  }
</script>

<style>
</style>
