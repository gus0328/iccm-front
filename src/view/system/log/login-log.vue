<template>
  <div ref="showContent" style="width:100%;height:98%">
    <div style="width:100%;height:37px;line-height:37px;">
      <Form ref="queryFormRef" inline :model="form">
        <Form-item prop="ipaddr">
          <label style="margin-right:10px;">登录地址</label><Input v-model="form.ipaddr" style="width:100px"></Input>
        </Form-item>
        <Form-item prop="loginName">
          <label style="margin-right:10px;">登录名称</label><Input v-model="form.loginName" style="width:100px"></Input>
        </Form-item>
        <Form-item prop="status">
          <label style="margin-right:10px;">登录状态</label>
          <Select class="form-input" v-model="form.status" style="width:100px !important">
            <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Form-item>
        <Form-item prop="params">
          <label style="margin-right:10px;">登录时间</label>
          <DatePicker @on-change="beginTimeText" format="yyyy-MM-dd HH:mm:ss" type="datetime" :editable="false" placeholder="Select month"
            style="width: 160px"></DatePicker>~
          <DatePicker @on-change="endTimeText" format="yyyy-MM-dd HH:mm:ss" type="datetime" :editable="false" placeholder="Select month" style="width: 160px"></DatePicker>
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
    </Table>
    <template>
      <Page ref="dictPage" :total="logCount" :current="logPageNo" :page-size="logPageSize" :page-size-opts="logPageSizeOpt"
        @on-change="onLogPageChange" @on-page-size-change="onLogPageSizeChange" show-sizer show-elevator show-total />
    </template>
  </div>
</template>

<script>
  export default {
    data() {
      return {
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
          ipaddr: "",
          loginName: "",
          status: "",
          params: {
            beginTime: "",
            endTime: ""
          }
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
            title: '登录名称',
            key: 'loginName',
            align: 'center',
            minWidth: 100
          },
          {
            title: '登录地址',
            key: 'ipaddr',
            align: 'center',
            minWidth: 100
          },
          {
            title: '登录地点',
            key: 'loginLocation',
            align: 'center',
            minWidth: 120
          },
          {
            title: '浏览器',
            key: 'browser',
            align: 'center',
            minWidth: 100
          },
          {
            title: '操作系统',
            key: 'os',
            align: 'center',
            minWidth: 120
          },
          {
            title: '登录状态',
            key: 'status',
            slot: "status",
            align: 'center',
            minWidth: 60
          },
          {
            title: '操作信息',
            key: 'msg',
            align: 'center',
            minWidth: 120
          },
          {
            title: '登录时间',
            key: 'loginTime',
            align: 'center',
            minWidth: 120
          }
        ]
      }
    },
    methods: {
      query() {
        this.loading = true;
        let url = "/monitor/logininfor/list?pageNum=" + this.logPageNo + "&pageSize=" + this.logPageSize +
          "&orderByColumn=loginTime&isAsc=desc"
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
