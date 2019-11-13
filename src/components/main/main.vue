<template>
  <Layout style="height: 100%" class="main">
    <Sider hide-trigger collapsible :width="256" :collapsed-width="64" v-model="collapsed" class="left-sider" :style="{overflow: 'hidden'}">
      <side-menu accordion ref="sideMenu" :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage"
        :menu-list="menuList">
        <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
        <div class="logo-con">
          <img :src="maxLogo" key="max-logo" />
          <!--<img v-show="!collapsed" :src="maxLogo" key="max-logo" />-->
          <!--<img v-show="collapsed" :src="minLogo" key="min-logo" />-->
        </div>
      </side-menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
          <user dot :message-unread-count="unreadCount" :user-avatar="userAvatar" />
          <language v-if="$config.useI18n" @on-lang-change="setLocal" style="margin-right: 10px;" :lang="local" />
          <error-store v-if="$config.plugin['error-store'] && $config.plugin['error-store'].showInHeader" :has-read="hasReadErrorPage"
            :count="errorCount"></error-store>
          <fullscreen v-model="isFullscreen" style="margin-right: 10px;" />
        </header-bar>
      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <div class="tag-nav-wrapper">
            <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag" />
          </div>
          <Content class="content-wrapper">
            <!-- <keep-alive :include="cacheList"> -->
            <router-view />
            <!-- </keep-alive> -->
            <ABackTop :height="100" :bottom="80" :right="50" container=".content-wrapper"></ABackTop>
          </Content>
        </Layout>
      </Content>
    </Layout>
    <Modal v-model="timeOut" width="360" :mask-closable="false" :closable="false">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>登录超时</span>
      </p>
      <div style="text-align:center">
        <p>由于您长时间未操作，登录超时</p>
        <p>需要重新登录</p>
      </div>
      <div slot="footer">
        <Button type="warning" size="large" long @click="goLogin">回到登录页面</Button>
      </div>
    </Modal>
    <Modal v-model="otherLogin" width="360" :mask-closable="false" :closable="false">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>异地登录</span>
      </p>
      <div style="text-align:center">
        <p>由于您的账号在其他地方登录，您的账号被迫下线</p>
        <p>需要重新登录</p>
      </div>
      <div slot="footer">
        <Button type="warning" size="large" long @click="goLogin">回到登录页面</Button>
      </div>
    </Modal>
  </Layout>
</template>
<script>
  import SideMenu from './components/side-menu'
  import HeaderBar from './components/header-bar'
  import TagsNav from './components/tags-nav'
  import User from './components/user'
  import ABackTop from './components/a-back-top'
  import Fullscreen from './components/fullscreen'
  import Language from './components/language'
  import ErrorStore from './components/error-store'
  import {
    mapMutations,
    mapActions,
    mapGetters
  } from 'vuex'
  import {
    getNewTagList,
    routeEqual
  } from '@/libs/util'
  import routers from '@/router/routers'
  import minLogo from '@/assets/images/logo-min.jpg'
  import maxLogo from '@/assets/images/logo.png'
  import './main.less'
  import config from '@/config'
  import Cookies from 'js-cookie';
  export default {
    name: 'Main',
    components: {
      SideMenu,
      HeaderBar,
      Language,
      TagsNav,
      Fullscreen,
      ErrorStore,
      User,
      ABackTop
    },
    data() {
      return {
        timeOut: false,
        otherLogin: false,
        collapsed: false,
        minLogo,
        maxLogo,
        websocket: null,
        isFullscreen: false,
        messageType: { //消息类型
          message: 0, //个人信息
          systemNotice: 1, //系统通知
          agency: 2,
          deviceCode: 3,
          alerm: 4,
        },
        noticeType: { //通知类型
          lineOutTime: 0, //登录超时
          kickOffTheLine: 1, //被踢下线
          contractExpiry: 2 //通知消息
        },
      }
    },
    computed: {
      ...mapGetters([
        'errorCount'
      ]),
      tagNavList() {
        return this.$store.state.app.tagNavList
      },
      tagRouter() {
        return this.$store.state.app.tagRouter
      },
      userAvatar() {
        return this.$store.state.user.avatarImgPath
      },
      cacheList() {
        const list = ['ParentView', ...this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta
          .notCache)).map(item => item.name) : []]
        return list
      },
      menuList() {
        return this.$store.getters.menuList
      },
      local() {
        return this.$store.state.app.local
      },
      hasReadErrorPage() {
        return this.$store.state.app.hasReadErrorPage
      },
      unreadCount() {
        return this.$store.state.user.unreadCount
      }
    },
    methods: {
      ...mapMutations([
        'setBreadCrumb',
        'setTagNavList',
        'addTag',
        'setLocal',
        'setHomeRoute',
        'closeTag'
      ]),
      ...mapActions([
        'handleLogin',
        'getUnreadMessageCount'
      ]),
      turnToPage(route) {
        let {
          name,
          params,
          query
        } = {}
        if (typeof route === 'string') name = route
        else {
          name = route.name
          params = route.params
          query = route.query
        }
        if (name.indexOf('isTurnByHref_') > -1) {
          window.open(name.split('_')[1])
          return
        }
        this.$router.push({
          name,
          params,
          query
        })
      },
      handleCollapsedChange(state) {
        this.collapsed = state
      },
      handleCloseTag(res, type, route) {
        if (type !== 'others') {
          if (type === 'all') {
            this.turnToPage(this.$config.homeName)
          } else {
            if (routeEqual(this.$route, route)) {
              this.closeTag(route)
            }
          }
        }
        this.setTagNavList(res)
      },
      handleClick(item) {
        this.turnToPage(item)
      },
      goLogin() {
        this.$router.push({
          name: "login"
        })
      },
      initWebsocket() {
        let object = this;
        const baseUrl = process.env.NODE_ENV === 'development' ? config.wbUrl.dev : config.wbUrl.pro
        //判断当前浏览器是否支持WebSocket  
        if ('WebSocket' in window) {
          object.websocket = new WebSocket(baseUrl + "/iccmMessage/" + sessionStorage.getItme('token'));
        } else if ("MozWebSocket" in window) {
          object.websocket = new MozWebSocket(baseUrl + "/iccmMessage/" + sessionStorage.getItme('token'));
        } else {
          object.$Message.error("此浏览器不支持消息功能，您可能无法收到消息");
        }
        //连接发生错误的回调方法  
        if (object.websocket != null) {
          object.websocket.onerror = function() {
            object.$Message.error("WebSocket连接发生错误");
          };

          //连接成功建立的回调方法  
          object.websocket.onopen = function() {
            object.$Message.success("WebSocket连接成功");
          }

          //接收到消息的回调方法  
          object.websocket.onmessage = function(event) {
            var data = JSON.parse(event.data);
            var type = object.messageType[data["type"] + ""];
            switch (type) {
              case object.messageType.message:
                object.$store.state.app.messageCount = data["messageCount"];
                if (Vue.$message != null) {
                  Vue.$message.onNewMessage(data["messageCount"]);
                }
                break;
              case object.messageType.agency:
                object.$store.state.app.agencyCount = data["agencyCount"];
                break;
              case object.messageType.deviceCode:
                object.deviceId = "0006abfab9b04a3586d37bb74fad018b";
                object.model = true;
                break;
              case object.messageType.alerm:
                if (Vue.$alerm != null) {
                  Vue.$alerm.queryAlerm(data["alermCount"]);
                }
                break;
              case object.messageType.systemNotice:
                let noticeType = object.noticeType[data["notice"] + ""];
                switch (noticeType) {
                  case object.noticeType.lineOutTime:
                    object.timeOut = true;
                    sessionStorage.setItme('token','');
                    sessionStorage.setItme("access", '');
                    break; //登录超时
                  case object.noticeType.kickOffTheLine:
                    object.otherLogin = true;
                    sessionStorage.setItme('token','');
                    sessionStorage.setItme("access", '');
                    break; //被踢下线
                  case object.noticeType.contractExpiry:
                    object.$store.state.user.unreadCount = data.message;
                    break;
                }
                break;
            }
          }

          //连接关闭的回调方法  
          object.websocket.onclose = function() {
            object.$Message.info("WebSocket连接关闭");
          }
        }
      },
      showContractDetails(){
        if(this.showContracts.length>0){
          this.showContractsModal = true;
        }
      },
      closeContracts(){
        this.contractDot = false;
        this.showContracts = [];
        this.showContractsModal = false;
      }
    },
    watch: {
      '$route'(newRoute) {
        const {
          name,
          query,
          params,
          meta
        } = newRoute
        this.addTag({
          route: {
            name,
            query,
            params,
            meta
          },
          type: 'push'
        })
        this.setBreadCrumb(newRoute)
        this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
        this.$refs.sideMenu.updateOpenName(newRoute.name)
      }
    },
    mounted() {
      /**
       * @description 初始化设置面包屑导航和标签导航
       */
      this.setTagNavList()
      this.setHomeRoute(routers)
      const {
        name,
        params,
        query,
        meta
      } = this.$route
      this.addTag({
        route: {
          name,
          params,
          query,
          meta
        }
      })
      this.setBreadCrumb(this.$route)
      // 设置初始语言
      this.setLocal(this.$i18n.locale)
      // 如果当前打开页面不在标签栏中，跳到homeName页
      if (!this.tagNavList.find(item => item.name === this.$route.name)) {
        this.$router.push({
          name: this.$config.homeName
        })
      }
      this.initWebsocket();
      // 获取未读消息条数
      //    this.getUnreadMessageCount()
    },
    beforeDestroy() {
      sessionStorage.setItme('token','');
      sessionStorage.setItme("access", '');
    }
  }
</script>
<style>

 .ivu-badge-dot{
   top:10px !important
 }
</style>
