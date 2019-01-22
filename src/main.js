import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import Cart from './components/Cart'
import NotFound from './components/NotFound'

Vue.use(VueRouter)
Vue.use(Vuex)

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/cart', component: Cart },
    { path: '/products/:id', component: Cart },
    { path: '*', component: NotFound },
  ],
})

const store = new Vuex.Store({
  state: {
    count: 0,
  },
  actions: {
    increment({ commit }) {
      commit('plus')
    },
  },
  mutations: {
    plus(state) {
      state.count++
    },
  },
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: function (h) { return h(App) },
}).$mount('#app')
