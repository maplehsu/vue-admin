import axios from 'axios'
import store from '@/store/index'
import * as types from '@/store/types'
import router from '@/router'

axios.interceptors.request.use(
  config => {
    if (store.state.token) {
      config.headers['token'] = store.state.token
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

axios.interceptors.response.use(
  response => {
    if (response.data.Code === '402') {
      router.replace({
        path: '/',
        query: {redirect: router.currentRoute.fullPath}
      })
    } else {
      return response
    }

  },
  error => {
    return Promise.reject(error.response.data)
  }
)

export default axios
