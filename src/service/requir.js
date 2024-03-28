import axios from 'axios'

export function request(config) {
  // 1.创建axios的实例
  const instance = axios.create({
    // baseURL:  "http://localhost:3000",
    baseURL:  "http://localhost:8080",
    timeout: 10000
  })

  // 2.axios的拦截器
  // 2.1.请求拦截的作用
  instance.interceptors.request.use(config => {
      // 请求头中使用Authorization字段获取token值
      config.headers.Authorization=window.sessionStorage.getItem('token')
    return config
  }, err => {
    console.log(err);
  })

  // 2.2.响应拦截
  instance.interceptors.response.use(res => {
    return res.data
  }, err => {
    console.log(err);
  })

  console.log(config);
  // 3.发送真正的网络请求
  return instance(config)
}
