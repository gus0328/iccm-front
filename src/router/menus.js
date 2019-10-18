import Main from '@/components/main'
import parentView from '@/components/parent-view'
export default [{
    path: '/work',
    name: 'work',
    component: Main,
    meta: {
      icon: 'logo-buffer',
      title: '作业监控'
    },
    children: [{
      path: '/wearDevice',
      name: 'wearDevice',
      meta: {
        title: '穿戴设备',
        icon: 'md-home'
      },
      component: () => import('@/view/work/wearDevice')
    },
    {
      path: '/gasDevice',
      name: 'gasDevice',
      meta: {
        title: '气体监测设备',
        icon: 'md-home'
      },
      component: () => import('@/view/work/gasDevice')
    },
    {
      path: '/monitorDevice',
      name: 'monitorDevice',
      meta: {
        title: '监控设备',
        icon: 'md-home'
      },
      component: () => import('@/view/work/monitorDevice')
    },
    {
      path: '/siteWork',
      name: 'siteWork',
      meta: {
        title: '所有作业',
        icon: 'md-home'
      },
      component: () => import('@/view/work/siteWork')
    },
    {
      path: '/ownSiteWork',
      name: 'ownSiteWork',
      meta: {
        title: '负责作业',
        icon: 'md-home'
      },
      component: () => import('@/view/work/ownSiteWork')
    }]
  }, {
    path: '/contract',
    name: 'contract',
    component: Main,
    meta: {
      icon: 'logo-buffer',
      title: '合同管理'
    },
    children: [{
      path: '/contractData',
      name: 'contractData',
      meta: {
        title: '数据导入',
        icon: 'md-home'
      },
      component: () => import('@/view/contract/contract-data')
    }]
  },
  {
    path: '/system',
    name: 'system',
    component: Main,
    meta: {
      icon: 'logo-buffer',
      title: '系统管理'
    },
    children: [{
        path: '/depart',
        name: 'depart',
        meta: {
          title: '部门管理',
          icon: 'md-home'
        },
        component: () => import('@/view/system/depart')
      },
      {
        path: '/dict',
        name: 'dict',
        meta: {
          title: '字典管理',
          icon: 'md-home'
        },
        component: () => import('@/view/system/dict')
      },
      {
        path: '/anthorities',
        name: 'anthorities',
        meta: {
          title: '权限管理',
          icon: 'md-home'
        },
        component: () => import('@/view/system/authorities')
      },
      {
        path: '/role',
        name: 'role',
        meta: {
          title: '角色管理',
          icon: 'md-home'
        },
        component: () => import('@/view/system/role')
      },
      {
        path: '/menu',
        name: 'menu',
        meta: {
          title: '菜单管理',
          icon: 'md-home'
        },
        component: () => import('@/view/system/menu')
      },
      {
        path: '/user',
        name: 'user',
        meta: {
          title: '用户管理',
          icon: 'md-home'
        },
        component: () => import('@/view/system/user')
      },
      {
        path: '/post',
        name: 'post',
        meta: {
          title: '岗位管理',
          icon: 'md-home'
        },
        component: () => import('@/view/system/post')
      },
      {
        path: '/log',
        name: 'log',
        meta: {
          title: '日志管理',
          icon: 'md-home',
          // access: ['super_admin'],
          showAlways: true
        },
        component: parentView,
        children: [{
            path: '/loginLog',
            name: 'loginLog',
            meta: {
              title: '登录日志',
              icon: 'md-home'
            },
            component: () => import('@/view/system/log/login-log')
          },
          {
            path: '/operLog',
            name: 'operLog',
            meta: {
              title: '操作日志',
              icon: 'md-home'
            },
            component: () => import('@/view/system/log/oper-log')
          }
        ]
      },
      {
        path: '/updateNotice',
        name: 'updateNotice',
        meta: {
          title: 'APP版本',
          icon: 'md-home'
        },
        component: () => import('@/view/system/updateNotice')
      },
      {
        path: '/feedback',
        name: 'feedback',
        meta: {
          title: '意见反馈',
          icon: 'md-home'
        },
        component: () => import('@/view/system/feedback')
      }
    ]
  }
]
