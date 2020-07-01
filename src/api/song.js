import {commonParams} from './config'
import axios from 'axios'

export function getLyric(mid) {
  const url = '/api/lyric'

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getBaidu() {
  const url = '/baidu'

  const data = Object.assign({}, {
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    data: {
      "req":{
        "module":"CDN.SrfCdnDispatchServer",
        "method":"GetCdnDispatch",
        "param":{
          "guid":"6624120925",
          "calltype":0,
          "userip":""
        }
      },
      "req_0":{
        "module":"vkey.GetVkeyServer",
        "method":"CgiGetVkey",
        "param":{
          "guid":"6624120925",
          "songmid":["002sfEiz3m2cMX"],
          "songtype":[0],"uin":"0",
          "loginflag":1,"platform":"20"
        }
        },
      "comm":{
        "uin":0,
        "format":"json",
        "ct":24,
        "cv":0
      }
    }
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    console.log(res)
    return Promise.resolve(res.data)
  })
}
