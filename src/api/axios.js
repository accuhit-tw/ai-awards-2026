import axios from 'axios'
import { STATUS } from '@/httpResponse.js'

const service = axios.create({
  baseURL: ''
})

service.interceptors.response.use(
  (response) => {
    if (response.data.code !== STATUS.SUCCESS) {
      return Promise.reject(response.data)
    }
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default service
