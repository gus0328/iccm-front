<template>
  <div ref="showContent" style="width:100%;height:98%">
    <div style="width:100%;height:37px;line-height:37px;">
      <Form ref="queryFormRef" inline :model="form">
        <Form-item prop="title">
          <label style="margin-right:10px;">系统模块</label><Input v-model="form.title" style="width:100px"></Input>
        </Form-item>
        <Form-item prop="operName">
          <label style="margin-right:10px;">操作人员</label><Input v-model="form.operName" style="width:100px"></Input>
        </Form-item>
        <Form-item prop="status">
          <label style="margin-right:10px;">操作状态</label>
          <Select class="form-input" v-model="form.status" style="width:100px !important">
            <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Form-item>
        <Form-item prop="params">
          <label style="margin-right:10px;">操作时间</label>
          <DatePicker @on-change="beginTimeText" type="datetime" :editable="false" placeholder="Select month"
            style="width: 160px"></DatePicker>~
          <DatePicker @on-change="endTimeText" type="datetime" :editable="false" placeholder="Select month" style="width: 160px"></DatePicker>
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
        <div style="width:40px;color:white;border-radius:10px;background: green;margin: auto;" v-if="row.status==0">成功</div>
        <div style="width:40px;color: white;border-radius:10px;background: red;margin: auto;" v-else>失败</div>
      </template>
      <template slot="action" slot-scope="{ row }">
        <Button style="margin-right:10px;" size="small" type="primary" @click="details(row)">详情</Button>
      </template>
    </Table>
    <template>
      <Page ref="dictPage" :total="logCount" :current="logPageNo" :page-size="logPageSize" :page-size-opts="logPageSizeOpt"
        @on-change="onLogPageChange" @on-page-size-change="onLogPageSizeChange" show-sizer show-elevator show-total />
    </template>
    <Modal v-model="dataDetailsModal" width="400px" title="操作详情" :mask-closable="false" :closable="false">
      <div>
        <Form>
          <FormItem label="操作模块:">
            {{detailsData.title}}/{{detailsData.operatorType}}
          </FormItem>
          <FormItem label="登录信息:">
            {{detailsData.operName}}/{{detailsData.deptName}}/{{detailsData.operIp}}/{{detailsData.operLocation}}
          </FormItem>
          <FormItem label="请求地址:">
            {{detailsData.operUrl}}
          </FormItem>
          <FormItem label="请求方式:">
            {{detailsData.requestMethod}}
          </FormItem>
          <FormItem label="操作方法:">
            {{detailsData.method}}
          </FormItem>
          <FormItem label="请求参数:">
            {{detailsData.operParam}}
          </FormItem>
          <FormItem label="状态">
            <div style="width:40px;color:white;border-radius:10px;background: green;margin: auto;float:left;text-align: center;" v-if="detailsData.status==0">成功</div>
            <div style="width:40px;color: white;border-radius:10px;background: red;margin: auto;float:left;text-align: center;" v-else>失败</div>
          </FormItem>
        </Form>
       <!-- <label style="margin-right:10px;">操作模块</label>
        <label style="margin-right:10px;">登录信息</label>
        <label style="margin-right:10px;">请求地址</label>
        <label style="margin-right:10px;">请求方式</label>
        <label style="margin-right:10px;">操作方法</label>
        <label style="margin-right:10px;">请求参数</label>
        <label style="margin-right:10px;">状态</label> -->
      </div>
      <div slot="footer" style="text-align:center">
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
            label: "成功"
          },
          {
            value: "1",
            label: "失败"
          }
        ],
        form: {
          title: "",
          operName: "",
          status: "",
          params: {
            beginTime: "",
            endTime: ""
          }
        },
        detailsData:{},
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
            title: '系统模块',
            key: 'title',
            align: 'center',
            minWidth: 100
          },
          {
            title: '操作类型',
            key: 'operatorType',
            align: 'center',
            minWidth: 100
          },
          {
            title: '操作人员',
            key: 'operName',
            align: 'center',
            minWidth: 100
          },
          {
            title: '部门名称',
            key: 'deptName',
            align: 'center',
            minWidth: 100
          },
          {
            title: '请求ip',
            key: 'operIp',
            align: 'center',
            minWidth: 100
          },
          {
            title: '操作地点',
            key: 'operLocation',
            align: 'center',
            minWidth: 100
          },
          {
            title: '操作状态',
            key: 'msg',
            slot: "status",
            align: 'center',
            minWidth: 120
          },
          {
            title: '登录时间',
            key: 'operTime',
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
        let url = "/monitor/operlog/list?pageNum=" + this.logPageNo + "&pageSize=" + this.logPageSize +
          "&orderByColumn=operTime&isAsc=desc"
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
