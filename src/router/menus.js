import Main from '@/components/main'
export default [
  {
    path: '/system',
    name: 'system',
    component: Main,
    meta: {
      icon: 'logo-buffer',
      title: '系统管理'
    },
    children: [
      {
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
      }
    ]
  }
]
