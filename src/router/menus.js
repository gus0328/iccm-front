import Main from '@/components/main'
import parentView from '@/components/parent-view'
export default [{
    path: '/contract',
    name: 'contract',
    component: Main,
    meta: {
      icon: 'logo-buffer',
      title: '合同管理'
    },
    children: [
      {
          path: '/contractData',
          name: 'contractData',
          meta: {
            title: '数据导入',
            icon: 'md-home'
          },
          component: () => import('@/view/contract/contract-data')
        }
    ]
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
      }
    ]
  }
]
