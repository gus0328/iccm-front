import axios from 'axios'
import store from '@/store'
import { Spin } from 'iview'
import { Message } from 'iview'
import { Modal } from 'iview'
import router from '../router'
const addErrorLog = errorInfo => {
  const { statusText, status, request: { responseURL } } = errorInfo
  let info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  //if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        //
        token:store.state.user.token
      },
      validateStatus: function (status) {
        return (status >= 200 && status < 300)||status>=600; // default
      },
    }
    return config
  }
  destroy (url,spin) {
    Spin.hide()
    delete this.queue[url]
    // if (!Object.keys(this.queue).length&&spin==true) {
    //    Spin.hide()
    // }
  }
  interceptors (instance, url,spin) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length&&spin==true) {
         Spin.show({
                    render: (h) => {
                        return h('div', [
                            h('Icon', {
                                'class': 'demo-spin-icon-load',
                                props: {
                                    type: 'ios-loading',
                                    size: 18
                                }
                            }),
                            h('div', 'Loading')
                        ])
                    }
                }) // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })

    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url,spin)
      if(res.status == 601){
        store.dispatch('foreExit')
      }
      if(res.data["code"]>200){
        if(res.data["code"]==466){
          let config = {title:"错误",content:res.data.msg,okText:"确定",onOk(){
            store.dispatch('foreExit')
          }}
          Modal.error(config);
          return Promise.reject(res.data.msg);
        }
        let config = {title:"错误",content:res.data.msg,okText:"确定",cancelText:"取消"}
        Modal.error(config);
        return Promise.reject(res.data.msg);
      }
      const { data, status } = res

      return { data, status }

    }, error => {
      this.destroy(url,spin)
      let errorInfo = error.response
      if (!errorInfo) {
        const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
        errorInfo = {
          statusText,
          status,
          request: { responseURL: config.url }
        }
      }
      addErrorLog(errorInfo)
      return Promise.reject(error)
    })
  }
  request (options) {
    var spin = options["spin"];
    if(spin!=false){
      spin = true;
    }
    axios.defaults.withCredentials = true;//携带cookie
    axios.defaults.headers.common["request_source"] = "PC";
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url,spin)
    return instance(options)
  }
}
export default HttpRequest
