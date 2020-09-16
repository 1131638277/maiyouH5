import axios from 'axios'

axios.defaults.timeout = 36000 // 响应时间
axios.defaults.headers.post['Content-Type'] = 'application/json' // 配置请求头
axios.defaults.baseURL = '/api' // 配置接口地址
const imgBaseURL = '/api' // 图片地址

// POST传参序列化(添加请求拦截器)
axios.interceptors.request.use((config) => {
  // 在发送请求之前做某件事
  if (config.method === 'post') {
    // config.data = qs.stringify(config.data);
  }
  return config
}, (error) => {
  console.log('错误的传参', 'fail')
  return Promise.reject(error)
})
// 返回状态判断(添加响应拦截器)
axios.interceptors.response.use((res) => {
  // 对响应数据做些事
  if (res.data.code != '0') {
    // console.log(res.data.msg);
    return Promise.reject(res)
  }
  return res.data
}, (error) => {
  console.log('网络异常', 'fail')
  return Promise.reject(error)
})

// 返回一个Promise(发送post请求)
export function fetch (url, params, method = 'post') {
  return new Promise((resolve, reject) => {
    if (method === 'get') {
      axios.get(url, params).then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      }).catch((error) => {
        reject(error)
      })
    } else {
      axios.post(url, params).then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      }).catch((error) => {
        reject(error)
      })
    }
  })
}

let api = {

  getSystemInformation(params){
    return fetch('/systemmonitorrecord1/qureySysteminfo',params,'get')
  },
  getSystemCname(params){
    return fetch('/GetSystemCname/GetsystemCname',params,'get')
  },
  getAlarmInfo(params){
    return fetch('/alarminfo/qureyAlarmInfo' ,params, 'get')
  },
  getCaseEquipmentNo(params) {
    return fetch('/caseinfo/getCaseEquipmentNo',params,'get')
  },
  getCaseMonitorInfo(params)
  {
    return fetch('/sensorhygroclipresult/qureymonitorinfo',params,'get')
  },
  getSystemConfigInfo(params)
  {
    return fetch('/SystemConfig/queryConfig',params,'get')
  },
  getCaseCname (params) {
    return fetch('/GetCaseCname/GetsystemCname', params, 'get')
  },
  upDateConfig (params) {
    return fetch('/SystemConfig/updateConfig', params, 'post')
  },
  addSystem (params) {
    return fetch('/SystemConfig/insertConfig', params, 'post')
  },
  deleteSystem (params) {
    return fetch('/SystemConfig/deleteConfig', params, 'post')
  },
  insertSensor (params) {
    return fetch('/Sensorarrtibute/insertSensor', params, 'post')
  },
  querySensorType (params) {
    return fetch('/sensortypes/querySensorType', params, 'get')
  },
  querysignaltype (params) {
    return fetch('/signaltype/querysignaltype', params, 'get')
  },
  insertCmd (params) {
    return fetch('/sensorcmds/insertCmd', params, 'post')
  },
  qureymonitorinfoN (params) {
    return fetch('/Sensorsrsresult/qureymonitorinfoN', params, 'get')
  },
  qurePrintdata(params){
    return fetch('/Sensorsrsresult/qureymonitorinfoPrint', params, 'get')
  },
  localCreate(params)
  {
    return fetch('/Sensorsrsresult/exclrExport', params, 'post')
  },
  internetDownload(params)
  {
    return fetch('/Sensorsrsresult/testDownload', params, 'get')
  },
  pm500rusult(params)
  {
    return fetch('/pm500result/qureymonitorinfoNpm500', params, 'get')
  },
  queryechartsX(params)
  {
    return fetch('/Sensorarrtibute/qureymonitor', params, 'get')
  }
}

export default api

