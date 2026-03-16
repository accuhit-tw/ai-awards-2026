import request from './axios'

export function get(url, params, config) {
  return request({
    url: url,
    method: 'get',
    params,
    ...config
  })
}

export function post(url, data, config) {
  return request({
    url: url,
    method: 'post',
    data,
    ...config
  })
}

export function put(url, data, config) {
  return request({
    url: url,
    method: 'put',
    data,
    ...config
  })
}
