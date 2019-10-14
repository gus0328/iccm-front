<template>
  <Card shadow>
    <div>
      <div class="message-page-con message-category-con">
        <Menu width="auto" active-name="unread" @on-select="handleSelect">
          <MenuItem name="unread">
            <span class="category-title">已收消息</span><Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge><Badge style="margin-left: 10px" class-name="gray-dadge" :count="messageReadCount"></Badge>
          </MenuItem>
         <!-- <MenuItem name="readed">
            <span class="category-title">已读消息</span><Badge style="margin-left: 10px" class-name="gray-dadge" :count="messageReadedCount"></Badge>
          </MenuItem> -->
         <MenuItem name="trash">
            <span class="category-title">回收站</span><Badge style="margin-left: 10px" class-name="gray-dadge" :count="messageTrashCount"></Badge>
          </MenuItem>
        </Menu>
      </div>
      <div class="message-page-con message-list-con" style="width:300px;">
        <Spin fix v-if="listLoading" size="large"></Spin>
        <Menu
          width="auto"
          active-name=""
          :class="titleClass"
          @on-select="handleView"
        >
          <MenuItem v-for="item in messageList" :name="item" :key="`msg_${item.id}`">
            <div>
              <Icon v-if="item.status==0" type="md-mail" color="#FF9933" />
              <Icon v-if="item.status==1" type="md-mail-open" color="#E8E8E8"/>
              <span class="msg-title"> {{ item.title }}</span>
              <!-- <Badge status="default" :text="item.sendTime" /> -->
            </div>
          </MenuItem>
          <template>
            <Page ref="dictPage" :total="messageCount" :current="messagePageNo" :page-size="messagePageSize"
              @on-change="onMessagePageChange" simple />
          </template>
        </Menu>
      </div>
      <div class="message-page-con message-view-con">
        <Spin fix v-if="contentLoading" size="large"></Spin>
        <div class="message-view-header">
          <h2 class="message-view-title">{{ showingMsgItem.title }}</h2>
          <time class="message-view-time">{{ showingMsgItem.sendTime }}</time>
          <h6 style="margin-left:50px;" class="message-view-title">{{ showingMsgItem.sendUser }}</h6>
          <Button @click="messageUpdate(2)" v-if="showingMsgItem.status==0||showingMsgItem.status==1" type="error" style="margin-left:100px;" size="small">删除</Button>
        </div>
        <div v-html="messageContent"></div>
      </div>
    </div>
  </Card>
</template>

<script>
export default {
  name: 'message_page',
  data () {
    return {
      messageCount:0,
      messagePageNo:1,
      messagePageSize:10,
      messageUnreadCount:0,
      messageTrashCount:0,
      messageReadCount:0,
      listLoading: false,
      contentLoading: false,
      currentMessageType: 'unread',
      messageContent: '',
      showingMsgItem: {},
      messageList:[]
    }
  },
  methods: {
    stopLoading (name) {
      this[name] = false
    },
    handleSelect (name) {
      this.currentMessageType = name
      this.messagePageNo = 1;
      this.getMessageList();
      this.showingMsgItem = {};
      this.messageContent = "";
    },
    handleView (item) {
      this.$ajax.request({
        url:"/system/message/queryContentById",
        method:"get",
        params:{
          id:item.id
        }
      }).then((res) => {
        this.messageContent = res.data.data.message;
        this.showingMsgItem = res.data.data;
        if(res.data.data.status==0){
          this.showingMsgItem.status = 1;
          item.status = 1;
          this.messageUnreadCount = this.messageUnreadCount -1;
          this.messageReadCount = this.messageReadCount + 1;
          this.messageUpdate(1);
          this.$store.state.user.unreadCount = this.messageUnreadCount;
        }
      })
      // this.contentLoading = true
      // this.getContentByMsgId({ msg_id }).then(content => {
      //   this.messageContent = content
      //   const item = this.messageList.find(item => item.msg_id === msg_id)
      //   if (item) this.showingMsgItem = item
      //   if (this.currentMessageType === 'unread') this.hasRead({ msg_id })
      //   this.stopLoading('contentLoading')
      // }).catch(() => {
      //   this.stopLoading('contentLoading')
      // })
    },
    removeMsg (item) {
      item.loading = true
      const msg_id = item.msg_id
      if (this.currentMessageType === 'readed') this.removeReaded({ msg_id })
      else this.restoreTrash({ msg_id })
    },
    getMessageList() {
      this.listLoading = true;
      let url = "/system/message/queryNormalList";
      let type = "accept";
      if(this.currentMessageType=="trash"){
        type = "del";
        url = "/system/message/queryDelList";
      }
      this.$ajax.request({
        url:url,
        method:"get",
        params:{
          pageNum:this.messagePageNo,
          pageSize:this.messagePageSize
        }
      }).then((res) => {
        this.listLoading = false;
        if(this.currentMessageType=="unread"){
          this.messageUnreadCount = res.data.unread;
          this.messageReadCount = res.data.read;
        }else if(this.currentMessageType=="trash"){
          this.messageTrashCount = res.data.data.total;
        }
        this.messageList = res.data.data.rows;
        this.messageCount = res.data.data.total;
      })
    },
    titleClass () {
      return {
        'not-unread-list': this.currentMessageType !== 'unread'
      }
    },
    onMessagePageChange(){
      this.messagePageNo = num;
      this.getMessageList();
    },
    messageUpdate(status){
      let data = {"id":this.showingMsgItem.id,"status":status};
      this.$ajax.request({
        url:"/system/message/edit",
        method:"post",
        data:data
      }).then((res) =>{
        if(status==2){
          this.messageContent = "";
          this.getMessageList();
        }
      })
    }
  },
  mounted () {
    // 请求获取消息列表
    this.getMessageList();
    // this.getMessageList().then(() => this.stopLoading('listLoading')).catch(() => this.stopLoading('listLoading'))
  }
}
</script>

<style lang="less">
.message-page{
  &-con{
    height: ~"calc(100vh - 176px)";
    display: inline-block;
    vertical-align: top;
    position: relative;
    &.message-category-con{
      border-right: 1px solid #e6e6e6;
      width: 200px;
    }
    &.message-list-con{
      border-right: 1px solid #e6e6e6;
      width: 230px;
    }
    &.message-view-con{
      position: absolute;
      left: 500px;
      top: 16px;
      right: 16px;
      bottom: 16px;
      overflow: auto;
      padding: 12px 20px 0;
      .message-view-header{
        margin-bottom: 20px;
        .message-view-title{
          display: inline-block;
        }
        .message-view-time{
          margin-left: 20px;
        }
      }
    }
    .category-title{
      display: inline-block;
      width: 65px;
    }
    .gray-dadge{
      background: gainsboro;
    }
    .not-unread-list{
      .msg-title{
        color: rgb(170, 169, 169);
      }
      .ivu-menu-item{
        .ivu-btn.ivu-btn-text.ivu-btn-small.ivu-btn-icon-only{
          display: none;
        }
        &:hover{
          .ivu-btn.ivu-btn-text.ivu-btn-small.ivu-btn-icon-only{
            display: inline-block;
          }
        }
      }
    }
  }
}
</style>
