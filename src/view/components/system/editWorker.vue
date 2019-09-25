<template>
  <div ref="showContent" style="width:100%;height:100%">
    <Button style="margin:5px 0;" type="info" @click="add">新增</Button>
    <Table class="content-table" :loading="loading" :columns="columns" :data="data" :height="rootTableHeight">
      <template slot-scope="{ row, index }" slot="action">
        <Button style="margin-right:10px;" size="small" type="primary" @click="edit(row,index)">编辑</Button>
        <Button size="small" type="error" @click="del(index)">删除</Button>
      </template>
      <template slot-scope="{row}" slot="itemCode">
       <span v-for="(item,index) in row.devices" :key="item.itemCode">
          <span v-if="index==row.devices.length-1">
            {{item.itemCode}}
          </span>
          <span v-else>
            {{item.itemCode}},
          </span>
       </span>
      </template>
      <template slot-scope="{row}" slot="itemName">
       <span v-for="(item,index) in row.devices" :key="item.itemName">
          <span v-if="index==row.devices.length-1">
            {{item.itemName}}
          </span>
          <span v-else>
            {{item.itemName}},
          </span>
       </span>
      </template>
    </Table>
    <Modal v-model="editModal" width="480" :title="editTitle" :mask-closable="false" :closable="false">
      <div style="text-align:center">
        <Form ref="editForm" :model="editForm" :rules="editRules" inline :label-width="70">
          <Form-item label="作业人员" prop="personName">
            <Input class="form-input" v-model="editForm.personName" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="联系方式" prop="mobileNum">
            <Input class="form-input" v-model="editForm.mobileNum" placeholder="请输入"></Input>
          </Form-item>
        </Form>
        <Button icon="md-add" type="info" @click="chooseOpen">选择穿戴设备</Button>
        <Table ref="wearTable" :columns="deviceColumns" :data="editForm.devices">
        </Table>
      </div>
      <div slot="footer" style="text-align:center">
        <Button type="primary" style="width:80px;" @click="editSave">保存</Button>
        <Button type="error" style="width:80px;" @click="editWdClose">取消</Button>
      </div>
    </Modal>
    <Modal :z-index="100000" v-model="chooseDeviceModal" width="600" :transfer="true" title="选择穿戴设备" :footer-hide="true" :mask-closable="false">
    	<chooseWearDevice ref="chooseWearDeviceRef" v-on:save="chooseSave" v-on:quit="chooseQuit"></chooseWearDevice>
    </Modal>
    <Button style="width:70px;margin-left:300px;margin-top:15px;" type="primary" @click="save">确定</Button>
    <Button style="margin-left:20px;width:70px;margin-top:15px;" @click="quit" type="error">退出</Button>
  </div>
</template>
<script>
  import chooseWearDevice from "./chooseWearDevice.vue"
  export default {
    name: 'editWorder',
    components: {
      chooseWearDevice
    },
    data() {
      return {
        deviceColumns:[
          {
            type:"index",
            width:60,
            align:"center"
          },
          {
            title: '设备编号',
            key: 'itemCode',
            align: 'center',
            minWidth: 100
          },
          {
            title: '设备名称',
            key: 'itemName',
            align: 'center',
            minWidth: 120
          }
				],
        currentIndex:-1,
        data: [],
        rootTableHeight: 400,
        chooseDeviceModal:false,
        editModal: false,
        loading: false,
        editTitle: "新增",
        editForm: {
          personName: "",
          mobileNum: "",
          devices:[]
        },
        editFormCopy: {
          personName: "",
          mobileNum: "",
          devices:[]
        },
        editRules: {
          personName: [{
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          }],
          mobileNum: [{
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          }, {
            validator: this.$validatePhone,
            trigger: 'blur'
          }],
          wearDeviceId:[{
            required: true,
            message: '请选择穿戴设备',
            trigger: 'blur'
          }]
        },
        columns: [{
            title: '作业人员',
            key: 'personName',
            align: 'center',
            width: 90
          },
          {
            title: '联系方式',
            key: 'mobileNum',
            align: 'center',
            width:120
          },
          {
            title: '设备编号',
            key: 'itemCode',
            align: 'center',
            slot: "itemCode"
          },
          {
            title: '设备名称',
            key: 'itemName',
            align: 'center',
            slot: "itemName"
          },
          {
            title: '操作',
            key: 'control',
            width: 140,
            align: 'center',
            slot: "action"
          }
        ]
      }
    },
    methods: {
      edit(row,index) {
        this.currentIndex = index;
        this.editForm = Object.assign({},row);
        this.editTitle = "修改";
        this.editModal = true;
      },
      del(index) {
        let object = this;
        this.$Modal.confirm({
          title: '删除',
          content: '您确定删除此数据？',
          onOk: function() {
            let data = [];
            for(var int = 0; int < object.data.length;int++){
              if(int!=index){
                data.push(object.data[int]);
              }
            }
            object.data = data;
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
            if (this.editTitle == "新增") {
              this.data.push(Object.assign({},this.editForm));
              this.editWdClose();
            }else{
              let data = [];
              for(var int = 0; int < this.data.length;int++){
                data.push(this.data[int]);
              }
              data[this.currentIndex] = Object.assign({},this.editForm);
              this.data = data;
              this.editWdClose();
            }
          }
        })
      },
      editWdClose() {
        this.editModal = false;
        this.editForm = Object.assign({},this.editFormCopy);
      },
      save(){
      	if(this.data.length<1){
      		this.$Message.warning("请至少添加一个作业人员");
      	}else{
      		this.$emit("save",this.data)
      	}
      },
      quit(){
      	this.$emit("quit");
      },
      init(data){
        this.data = data;
        this.editForm = Object.assign({},this.editFormCopy);
      },
      chooseOpen(){
        this.$refs.chooseWearDeviceRef.init();
        this.chooseDeviceModal = true;
      },
      chooseQuit(){
      	this.chooseDeviceModal = false;
      },
      chooseSave(rows){
      	this.editForm.devices = rows;
      	this.chooseDeviceModal = false;
      },
    },
    mounted() {
      this.data = [];
    }
  }
</script>

<style>
  .form-input {
    width: 200px;
  }
</style>
