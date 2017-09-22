import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters.js'
import actions from './actions.js'
import mutations from './mutations.js'

Vue.use(Vuex)

const vuexStore = {
    state: {
        bounds: {},// 地图视野
        zoom: 18,// 地图缩放等级
        searchData: {},
        searchParams: {}
    },
    mutations,
    getters,
    actions,
    strict: true
}

const store = new Vuex.Store(vuexStore)

export default store