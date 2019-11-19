import axios from '@/libs/api.request'

export const login = ({ username, password,validateCode}) => {
  const data = {
    username,
    password,
    validateCode
  }
  return axios.request({
    url: '/login/login',
    data,
    method: 'post',
    spin:false
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: 'main/user/info',
    method: 'get',
    spin:false
  })
}

export const logout = (token) => {
  return axios.request({
    url: '/login/logout',
    method: 'get',
    spin:false
  })
}

export const getUnreadCount = () => {
  return axios.request({
    url: 'message/count',
    method: 'get',
    spin:false
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get',
    spin:false
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'message/content',
    method: 'get',
    spin:false,
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const verifyToken = (token) => {
  return axios.request({
    url: 'login/verifyPcToken',
    method: 'get'
  })
}
