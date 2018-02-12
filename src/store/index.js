import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './types'

Vue.use(Vuex)

var mutations = {}

mutations[types.LOGIN] = (state, data) => {
  localStorage.token = data;
  state.token = data;
}

mutations[types.LOGOUT] = (state) => {
  localStorage.removeItem('token');
  state.token = null
}

export default new Vuex.Store({
    state: {
      token: null
    },
    mutations: mutations
})
