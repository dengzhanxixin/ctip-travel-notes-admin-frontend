import axios from 'axios'

export function request(config) {
  // 创建axios的实例
  const instance = axios.create({
    // baseURL:  "http://localhost:8080",
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 10000,
    withCredentials: true  // 确保跨域请求时发送Cookies
  })

  // axios的拦截器
  instance.interceptors.request.use(config => {
      // 请求头中使用Authorization字段获取token值
      config.headers.Authorization=window.sessionStorage.getItem('token')
    return config
  }, err => {
    console.log(err);
  })

  // 响应拦截
  instance.interceptors.response.use(res => {
    return res.data
  }, err => {
    console.log(err);
  })

  console.log(config);
  // 发送真正的网络请求
  return instance(config)
}
