import axios from 'axios'

const baseURL = 'http://39.106.10.110:9999'

const instance = axios.create({
  baseURL
})

instance.interceptors.request.use(config => {
  // console.log('经过拦截器')
  // return Promise.resolve(config)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let session = ''
      resolve(session)
    }, 200)
  })
}, error => {
  console.log('请求发生错误')
  console.log(error)
  return Promise.reject(error)
})

instance.interceptors.response.use(response => {
  console.log('拦截到响应')
  return Promise.resolve(response.data)
}, error => {
  console.log('响应时发生错误')
  console.log(error)
  return Promise.reject(error)
})

export default instance