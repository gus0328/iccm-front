<template>
  <div ref="showContent" style="width:100%;height:100%">
    <div style="width:100%;height:37px;line-height:37px;">
      <Form ref="queryFormRef" inline :model="form">
       <Form-item prop="status">
          <label style="margin-right:10px;">状态</label>
          <Select class="form-input" v-model="form.workStatus" style="width:100px !important">
            <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Form-item>
        <Form-item prop="workSite">
          <label style="margin-right:10px;">作业地点</label>
          <Input v-model="form.workSite" style="width:150px" />
        </Form-item>
        <Form-item prop="params">
          <label style="margin-right:10px;">开始时间</label>
          <DatePicker @on-change="beginTimeText" v-model="form.begin" format="yyyy-MM-dd HH:mm:ss" type="datetime" :editable="false" placeholder="Select month" style="width: 160px"></DatePicker>
          ~
          <DatePicker @on-change="endTimeText" v-model="form.end" format="yyyy-MM-dd HH:mm:ss" type="datetime" :editable="false" placeholder="Select month" style="width: 160px"></DatePicker>
        </Form-item>
        <Form-item><Button type="primary" @click="query">查询</Button></Form-item>
        <Form-item><Button @click="resetQueryForm">重置</Button></Form-item>
      </Form>
    </div>
    <Button style="margin:5px 0;" type="info" @click="add">新增</Button>
    <Table class="content-table" :loading="loading" :columns="columns" :data="data" :height="rootTableHeight">
      <template slot-scope="{ row, index }" slot="action">
        <Button size="small" type="info" :disabled="row.workStatus!=1" style="margin-right:10px;" @click="showWorkData(row)">作业监控</Button>
        <Button style="margin-right:10px;" size="small" type="primary" @click="edit(row)">编辑</Button>
        <Button size="small" type="error" @click="del(row)">删除</Button>
      </template>
      <template slot="status" slot-scope="{row}">
        <div style="width:60px;color:white;border-radius:10px;background:#ed4014;margin: auto;" v-if="row.workStatus==0">未开始</div>
        <div style="width:60px;color: white;border-radius:10px;background: #19be6b;margin: auto;" v-if="row.workStatus==1">正在作业</div>
        <div style="width:60px;color: white;border-radius:10px;background: #ff9900;margin: auto;" v-if="row.workStatus==2">暂停作业</div>
        <div style="width:60px;color: #657180;border-radius:10px;background: #e8eaec;margin: auto;" v-if="row.workStatus==3">完成作业</div>
      </template>
    </Table>
    <template>
      <Page
        ref="dictPage"
        :total="workCount"
        :current="workPageNo"
        :page-size="workPageSize"
        :page-size-opts="workPageSizeOpt"
        @on-change="onworkPageChange"
        @on-page-size-change="onworkPageSizeChange"
        show-sizer
        show-elevator
        show-total
      />
    </template>
    <Modal v-model="editModal" width="1000" :title="editTitle" :mask-closable="false" :closable="false">
      <div style="text-align:center">
        <Row :gutter="16">
          <Col span="8">
            <Form ref="editForm" :model="editForm" :rules="editRules" inline :label-width="70" style="float:left">
              <Form ref="siteWork" :model="editForm.siteWork" :rules="editRules" inline :label-width="70">
                <Form-item label="作业地点" prop="workSite"><Input :disabled="rowWorkStatus>0&&editTitle=='修改'" class="form-input" v-model="editForm.siteWork.workSite" placeholder="请输入" /></Form-item>
              </Form>
              <Form-item label="开始时间" prop="startTimeTp">
                <DatePicker :disabled="rowWorkStatus>0&&editTitle=='修改'"
                  v-model="editForm.startTimeTp"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  :editable="false"
                  placeholder="选择日期"
                  style="width: 200px"
                ></DatePicker>
              </Form-item>
              <Form-item label="状态">
                <RadioGroup v-model="editForm.siteWork.workStatus">
                  <Radio label="0" :disabled="rowWorkStatus>0&&editTitle=='修改'">未开始</Radio>
                  <Radio label="1" :disabled="rowWorkStatus>2&&editTitle=='修改'">正在作业</Radio>
                  <Radio label="2" :disabled="rowWorkStatus>2&&editTitle=='修改'">暂停作业</Radio>
                  <Radio label="3">完成作业</Radio>
                </RadioGroup>
              </Form-item>
            </Form>
          </Col>
          <Col span="5">
           <span style="margin-right:10px;">作业人员</span>
            <Button v-if="rowWorkStatus<3" icon="md-add" type="info" @click="workerOpen"></Button>
            <Button v-if="rowWorkStatus>2&&editTitle=='修改'" icon="md-list-box" type="success" @click="workerShowOpen"></Button>
            <List size="small">
                <ListItem v-for="(item, index) in editForm.workers" :key="index">{{item.personName}}</ListItem>
            </List>
          </Col>
          <Col span="6">
            <label style="margin-right:10px;">气体采集</label>
            <Button v-if="rowWorkStatus<3" icon="md-add" type="info" @click="gasDeviceOpen"></Button>
            <Button v-if="rowWorkStatus>2&&editTitle=='修改'" icon="md-list-box" type="success" @click="gasShowOpen"></Button>
            <List size="small">
                <ListItem v-for="(item, index) in editForm.gases" :key="index">{{item.itemCode}}</ListItem>
            </List>
          </Col>
          <Col span="5">
            <label style="margin-right:10px;">视屏监控</label>
            <Button v-if="rowWorkStatus<3" icon="md-add" type="info" @click="monitorDeviceOpen"></Button>
            <Button v-if="rowWorkStatus>2&&editTitle=='修改'" icon="md-list-box" type="success" @click="monitorShowOpen"></Button>
            <List size="small">
                <ListItem v-for="(item, index) in editForm.monitors" :key="index">{{ item.ipAdress }}</ListItem>
            </List>
          </Col>
        </Row>
      </div>
      <div slot="footer" style="text-align:center">
        <Button :disabled="rowWorkStatus>2&&editTitle=='修改'" type="primary" style="width:80px;" @click="editSave">保存</Button>
        <Button type="error" style="width:80px;" @click="editWdClose">取消</Button>
      </div>
<!--      <Spin size="large" fix v-if="editSaveSpin"></Spin> -->
    </Modal>
    <Modal v-model="editWorkerModal" width="800" :transfer="false" title="作业人员" :footer-hide="true" :mask-closable="false" :closable="false">
      <worker ref="editWorkerRef" v-on:save="workerSave" v-on:quit="workerQuit"></worker>
    </Modal>
    <Modal v-model="editGasDeviceModal" width="800" :transfer="false" title="气体监测设备" :footer-hide="true" :mask-closable="false" :closable="false">
      <chooseGasDevice ref="editGasDeviceRef" v-on:save="gasDeviceSave" v-on:quit="gasDeviceQuit"></chooseGasDevice>
    </Modal>
    <Modal v-model="editMonitorDeviceModal" width="800" :transfer="false" title="视屏监控设备" :footer-hide="true" :mask-closable="false" :closable="false">
      <chooseMonitorDevice ref="editMonitorDeviceRef" v-on:save="monitorDeviceSave" v-on:quit="monitorDeviceQuit"></chooseMonitorDevice>
    </Modal>
    <Modal v-model="workerShowModal" width="800" :transfer="false" title="作业人员" :footer-hide="true" :mask-closable="false" :closable="false">
      <workerShow ref="workerShowModalRef" v-on:quit="workerShowQuit"></workerShow>
    </Modal>
    <Modal v-model="gasShowModal" width="800" :transfer="false" title="气体监控设备" :footer-hide="true" :mask-closable="false" :closable="false">
      <gasShow ref="gasShowModalRef" v-on:quit="gasShowQuit"></gasShow>
    </Modal>
    <Modal v-model="monitorShowModal" width="800" :transfer="false" title="视屏监控设备" :footer-hide="true" :mask-closable="false" :closable="false">
      <monitorShow ref="monitorShowModalRef" v-on:quit="monitorShowQuit"></monitorShow>
    </Modal>
    <Modal v-model="workDataModal" class="workDataModalclass" fullscreen width="100%" height="100%" :transfer="false" :footer-hide="true" :mask-closable="false" :closable="false">
      <workData :workId='workId' v-if="workDataModal" v-on:close="closeWorkDataModal"></workData>
    </Modal>
  </div>
</template>
<script>
import worker from '../components/system/editWorker.vue';
import chooseGasDevice from '../components/system/chooseGasDevice.vue';
import chooseMonitorDevice from '../components/system/chooseMonitorDevice.vue';
import workerShow from '../components/system/workerShow';
import gasShow from '../components/system/gasShow';
import monitorShow from '../components/system/monitorShow'
import workData from '../components/system/workData.vue'
export default {
  name: 'ownSitWork',
  components: {
    worker,
    chooseGasDevice,
    chooseMonitorDevice,
    workerShow,
    gasShow,
    monitorShow,
    workData
  },
  data() {
    const beginTime = this.$dateUtils.getTodayStartTime();
    const endTime = this.$dateUtils.getTodayEndTime();
    return {
      editSaveSpin:false,
      rowWorkStatus:-1,
      statusList: [
        {
          value: '0',
          label: '未开始'
        },
        {
          value: '1',
          label: '正在作业'
        },
        {
          value: '2',
          label: '暂停作业'
        },
        {
          value: '3',
          label: '完成作业'
        }
      ],
      editWorkerModal: false,
      editGasDeviceModal: false,
      editMonitorDeviceModal: false,
      workerShowModal:false,
      gasShowModal:false,
      monitorShowModal:false,
      workDataModal:false,
      form: {
        workSite: '',
        workStatus: '',
        begin:beginTime,
        end:endTime,
        params: {
          beginTime: beginTime,
          endTime: endTime
        }
      },
      data: [],
      rootTableHeight: 400,
      editModal: false,
      loading: false,
      workCount: 0,
      workPageSize: 50,
      workPageNo: 1,
      workPageSizeOpt: [50, 100, 150, 200],
      editTitle: '新增',
      editForm: {
        siteWork: {
          workSite: '',
          startTime: '',
          workStatus: '0'
        },
        workers: [],
        gases: [],
        monitors: [],
        startTimeTp: '',
        workId:""
      },
      editFormCopy: {
        siteWork: {
          workSite: '',
          startTime: '',
          workStatus: '0'
        },
        workers: [],
        gases: [],
        monitors: [],
        startTimeTp: new Date()
      },
      editRules: {
        workSite: [
          {
            required: true,
            type: 'string',
            message: '请填写作业区域',
            trigger: 'blur'
          }
        ],
        startTimeTp: [
          {
            required: true,
            type: 'date',
            message: '请选择开始时间',
            trigger: 'blur'
          }
        ]
      },
      columns: [
        {
          type:'index',
          width:60,
          algin:'center'
        },
        {
          title: '作业单号',
          key: 'id',
          align: 'center'
        },
        {
          title: '负责人',
          key: 'leadUserName',
          align: 'center'
        },
        {
          title: '作业地点',
          key: 'workSite',
          align: 'center'
        },
        {
          title: '状态',
          key: 'workStatus',
          align: 'center',
          slot:'status'
        },
        {
          title: '开始时间',
          key: 'startTime',
          align: 'center'
        },
        {
          title: '创建时间',
          key: 'createTime',
          align: 'center'
        },
        {
          title: '结束时间',
          key: 'endTime',
          align: 'center'
        },
        {
          title: '操作',
          key: 'control',
          width: 220,
          align: 'center',
          slot: 'action'
        }
      ]
    };
  },
  methods: {
    queryworks() {
      this.loading = true;
      let url = '/work/siteWork/ownPageList?pageNum=' + this.workPageNo + '&pageSize=' + this.workPageSize + '&orderByColumn=id&isAsc=desc';
      this.$ajax
        .request({
          url: url,
          data: this.form,
          method: 'post'
        })
        .then(res => {
          this.data = res.data.data.rows;
          this.workCount = res.data.data.total;
          this.loading = false;
        });
    },
    resetQueryForm() {
      this.form = {
        workSite: '',
        workStatus: '',
        begin: '',
        end: '',
        params: {
          beginTime: '',
          endTime: ''
        }
      }
    },
    onworkPageChange(num) {
      this.workPageNo = num;
      this.queryworks();
    },
    onworkPageSizeChange(pageSize) {
      this.workPageSize = pageSize;
      this.workPageNo = 1;
      this.queryworks();
    },
    edit(row) {
      this.$ajax.request({
        url:"/work/siteWork/getWorkDetails",
        method:"post",
        data:{id:row.id}
      }).then((res) => {
        this.rowWorkStatus = parseInt(res.data.details.siteWork.workStatus);
        this.editForm = res.data.details;
        this.editForm["startTimeTp"] = this.editForm.siteWork.startTime;
        this.editForm.siteWork.workStatus = this.editForm.siteWork.workStatus+'';
      })
      this.editTitle = '修改';
      this.editModal = true;
    },
    del(row) {
      let object = this;
      this.$Modal.confirm({
        title: '删除',
        content: '您确定删除此数据？',
        onOk: function() {
          this.$ajax
            .request({
              url: '/work/siteWork/remove',
              data: {
                id: row.id
              },
              method: 'post'
            })
            .then(res => {
              object.$Message.success(res.data.msg);
              object.queryworks();
            });
        }
      });
    },
    add(row) {
      this.rowWorkStatus = -1;
      this.editTitle = '新增';
      this.editForm = {
        siteWork: {
          workSite: '',
          startTime: '',
          workStatus: '0'
        },
        workers: [],
        gases: [],
        monitors: [],
        startTimeTp: new Date()
      };
      this.editModal = true;
    },
    editSave() {
      let config = { title: '提示', content: '', okText: '确定' };
      this.$refs.siteWork.validate(valid => {
        if (valid) {
          this.$refs.editForm.validate(valid => {
            if (valid) {
              if (this.editForm.workers.length < 1) {
                config.content = '请填写作业人员';
                this.$Modal.warning(config);
                return;
              }
              if (this.editForm.gases.length < 1) {
                config.content = '请填写气体监测设备';
                this.$Modal.warning(config);
                return;
              }
              if (this.editForm.monitors.length < 1) {
                config.content = '请填写视屏监控设备';
                this.$Modal.warning(config);
                return;
              }
              this.editForm.siteWork.startTime = this.editForm.startTimeTp.Format("yyyy-MM-dd HH:mm:ss");
              let url = '/work/siteWork/edit';
              if (this.editTitle == '新增') {
                url = '/work/siteWork/ownAdd';
              }
              this.editSaveSpin = true;
              this.$ajax
                .request({
                  url: url,
                  data: this.editForm,
                  method: 'post'
                })
                .then(res => {
                   this.editSaveSpin = false;
                  this.$Message.success(res.data.msg);
                  this.editWdClose();
                  this.queryworks();
                });
            }
          });
        }
      });
    },
    editWdClose() {
      this.editForm = {
        siteWork: {
          workSite: '',
          startTime: '',
          workStatus: '0'
        },
        workers: [],
        gases: [],
        monitors: [],
        startTimeTp: new Date()
      };
      this.editModal = false;
    },
    query() {
      this.workPageNo = 1;
      this.queryworks();
    },
    beginTimeText(text) {
      this.form.params.beginTime = text;
    },
    endTimeText(text) {
      this.form.params.endTime = text;
    },
    workerOpen() {
      this.editWorkerModal = true;
      this.$refs.editWorkerRef.init(this.editForm.workers);
    },
    workerSave(workers) {
      this.editForm.workers = workers;
      this.editWorkerModal = false;
    },
    workerQuit() {
      this.editWorkerModal = false;
    },
    monitorDeviceOpen() {
      this.editMonitorDeviceModal = true;
      this.$refs.editMonitorDeviceRef.init();
      this.$refs.editMonitorDeviceRef.initData(this.editForm.monitors);
    },
    monitorDeviceSave(monitors) {
      this.editForm.monitors = monitors;
      this.editMonitorDeviceModal = false;
    },
    monitorDeviceQuit() {
      this.editMonitorDeviceModal = false;
    },
    gasDeviceOpen() {
      this.editGasDeviceModal = true;
      this.$refs.editGasDeviceRef.init();
      this.$refs.editGasDeviceRef.initData(this.editForm.gases);
    },
    gasDeviceSave(gases) {
      this.editForm.gases = gases;
      this.editGasDeviceModal = false;
    },
    gasDeviceQuit() {
      this.editGasDeviceModal = false;
    },
    workerShowOpen(){
      this.$refs.workerShowModalRef.init(this.editForm.workers);
      this.workerShowModal = true;
    },
    workerShowQuit(){
      this.workerShowModal = false;
    },
    gasShowOpen(){
      this.$refs.gasShowModalRef.init(this.editForm.gases);
      this.gasShowModal = true;
    },
    gasShowQuit(){
      this.gasShowModal = false;
    },
    monitorShowOpen(){
      this.$refs.monitorShowModalRef.init(this.editForm.monitors);
      this.monitorShowModal = true;
    },
    monitorShowQuit(){
      this.monitorShowModal = false;
    },
    showWorkData(row){
      this.workId = row.id;
      this.workDataModal = true;
    },
    closeWorkDataModal(){
      this.workDataModal = false;
    }
  },
  mounted() {
    this.rootTableHeight = this.$refs.showContent.offsetHeight - 110;
    this.queryworks();
  }
};
</script>

<style>
.form-input {
  width: 200px;
}
.workDataModalclass .ivu-modal-content{
  background:#1B243C;
}
.workDataModalclass .ivu-modal-body{
  overflow: hidden;
}
</style>
