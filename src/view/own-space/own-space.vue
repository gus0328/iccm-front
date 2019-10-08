<style lang="less">
@import './own-space.less';
</style>

<template>
  <div>
    <Card>
      <p slot="title">
        <Icon type="person"></Icon>
        个人信息
      </p>
      <div>
        <Form ref="userForm" :model="userForm" :label-width="100" label-position="right" :rules="inforValidate">
          <FormItem label="用户姓名：" prop="userName">
            <div style="display:inline-block;width:300px;"><Input v-model="userForm.userName" /></div>
          </FormItem>
          <FormItem label="用户手机：" prop="phonenumber">
            <div style="display:inline-block;width:300px;"><Input v-model="userForm.phonenumber" /></div>
          </FormItem>
          <FormItem label="用户头像：">
            <div style="display:inline-block;width:300px;">
              <img :src="imgurl" style="width:100px;height:120px;" />
              <Upload
                ref="upload"
                :on-success="handleSuccess"
                :format="['jpg', 'jpeg', 'png']"
                :max-size="30720"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                type="drag"
                :action="avatorPath"
                with-credentials
                :show-upload-list="false"
                style="display: inline-block;width:100px;margin-left:20px;"
              >
                <div style="width: 100px;height:120px;line-height: 120px;"><Icon type="ios-camera" size="20"></Icon></div>
              </Upload>
            </div>
          </FormItem>
          <FormItem label="所属部门：">
            <span>{{ userForm.dept.deptName }}</span>
          </FormItem>
          <FormItem label="用户角色：">
            <span>{{ userForm.roleNames }}</span>
          </FormItem>
          <FormItem label="用户岗位：">
            <span>{{ userForm.postNames }}</span>
          </FormItem>
          <FormItem label="最近登录时间：">
            <span>{{ userForm.loginDate }}</span>
          </FormItem>
          <FormItem label="登录密码："><Button type="text" size="small" @click="showEditPassword" style="color:blue">修改密码</Button></FormItem>
          <div>
            <Button type="primary" style="width: 100px;" :loading="save_loading" @click="saveEdit">保存</Button>
          </div>
        </Form>
      </div>
    </Card>
    <Modal v-model="editPasswordModal" :closable="false" :mask-closable="false" :width="500">
      <h3 slot="header" style="color:#2D8CF0">修改密码</h3>
      <Form ref="editPasswordForm" :model="editPasswordForm" :label-width="100" label-position="right" :rules="passwordValidate">
        <FormItem label="原密码" prop="oldPass" :error="oldPassError"><Input v-model="editPasswordForm.oldPass" placeholder="请输入现在使用的密码" type="password" /></FormItem>
        <FormItem label="新密码" prop="newPass"><Input v-model="editPasswordForm.newPass" placeholder="请输入新密码，至少6位字符" type="password" /></FormItem>
        <FormItem label="确认新密码" prop="rePass"><Input v-model="editPasswordForm.rePass" placeholder="请再次输入新密码" type="password" /></FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelEditPass">取消</Button>
        <Button type="primary" :loading="savePassLoading" @click="saveEditPass">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import config from '@/config'
  const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
export default {
  name: 'ownspace_index',
  data() {
    const validePhone = (rule, value, callback) => {
      var re = /^1[0-9]{10}$/;
      if (!re.test(value)) {
        callback(new Error('请输入正确格式的手机号'));
      } else {
        callback();
      }
    };
    const valideRePassword = (rule, value, callback) => {
      if (value !== this.editPasswordForm.newPass) {
        callback(new Error('两次输入密码不一致'));
      } else {
        callback();
      }
    };
    const validOldPass = (rule, value, callback) => {
      this.$ajax.request({
        url:"/main/verifyOldPass",
        method:"get",
        params:{ oldPass: value }
      }).then(res =>{
        if (res.data.data == false) {
          callback(new Error('原密码不正确！'));
        } else {
          callback();
        }
      })
    };
    return {
      imgurl:"",
      avatorPath:"/upload/uploadAvator?resource=PC",
      userForm: {
        userName: '',
        phonenumber: '',
        avator: '',
        dept: {
          deptName:""
        },
        loginDate:"",
        roleNames:"",
        postNames:""
      },
      phoneHasChanged: false, // 是否编辑了手机
      save_loading: false,
      editPasswordModal: false, // 修改密码模态框显示
      savePassLoading: false,
      oldPassError: '',
      checkIdentifyCodeLoading: false,
      inforValidate: {
        userName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        phonenumber: [{ required: true, message: '请输入手机号码' }, { validator: validePhone }]
      },
      editPasswordForm: {
        oldPass: '',
        newPass: '',
        rePass: ''
      },
      passwordValidate: {
        oldPass: [{ required: true, message: '请输入原密码', trigger: 'blur' }, { validator: validOldPass }],
        newPass: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '请至少输入6个字符', trigger: 'blur' },
          { max: 32, message: '最多输入32个字符', trigger: 'blur' }
        ],
        rePass: [{ required: true, message: '请再次输入新密码', trigger: 'blur' }, { validator: valideRePassword, trigger: 'blur' }]
      },
      initPhone: ''
    };
  },
  methods: {
    showEditPassword() {
      this.editPasswordModal = true;
    },
    saveEdit() {
      this.$refs['userForm'].validate(valid => {
        if (valid) {
          this.saveInfoAjax();
        }
      });
    },
    cancelEditPass() {
      this.editPasswordModal = false;
      this.$refs.editPasswordForm.resetFields();
    },
    saveEditPass() {
      this.$refs['editPasswordForm'].validate(valid => {
        if (valid) {
          this.savePassLoading = true;
          this.$ajax.request({
            url:"/main/ownpacePassSave",
            method:"post",
            data:{
              id: this.editPasswordForm.newPass }
          }).then(res => {
            this.$Message.success('密码修改成功');
            this.cancelEditPass();
            this.savePassLoading = false;
          });
        }
      });
    },
    init() {
      this.$ajax.request({
        url:"/main/ownspaceInfo",
        method:"get"
      }).then(res => {
        this.userForm = res.data.data;
        this.imgurl = baseUrl+ res.data.data.avatar;
        this.avatorPath = this.avatorPath+"&token="+res.data.token;
      });
    },
    cancelInputCodeBox() {
      this.inputCodeVisible = false;
      this.userForm.cellphone = this.initPhone;
    },
    hasChangePhone() {
      this.phoneHasChanged = true;
      this.hasGetIdentifyCode = false;
      this.identifyCodeRight = false;
    },
    saveInfoAjax() {
      this.save_loading = true;
      this.$ajax.request({
        url:"/main/ownspaceInfoSave",
        method:"post",
        params:{ userName: this.userForm.userName, telephone: this.userForm.phonenumber }
      }).then(res => {
        this.$Message.success('保存成功');
        this.save_loading = false;
      });
    },
    handleView(name) {
      this.imgName = name;
      this.visible = true;
    },
    handleRemove(file) {
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
    },
    handleSuccess(res, file) {
      this.$store.state.user.avatarImgPath = baseUrl+ res.data;
      this.imgurl = baseUrl+ res.data;
      // file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
      // file.name = '7eb99afb9d5f317c912f08b5212fd69a';
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: '选择文件类型不正确',
        desc: '文件【' + file.name + '】类型不正确, 请选择 jpg 或 png.'
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: '文件太大',
        desc: '文件【' + file.name + '】最多不能超过30M.'
      });
    }
  },
  mounted() {
    this.init();
  }
};
</script>
