import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
Vue.use(VueCompositionApi)

import App from './App.vue'
import router from './router'
import store from './store'

import './assets/styles/base.css'
import './assets/styles/chat.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

/**
 $ npm outdated --depth=0
Package                            Current  Wanted  Latest  Location
@feathersjs/authentication-client   4.5.18  4.5.18  5.0.27  feathers-opcua-client
@feathersjs/feathers                4.5.17  4.5.17  5.0.27  feathers-opcua-client
@feathersjs/socketio-client         4.5.18  4.5.18  5.0.27  feathers-opcua-client
@vue/cli-plugin-babel               4.5.13  4.5.19   5.0.8  feathers-opcua-client
@vue/cli-plugin-eslint              4.5.13  4.5.19   5.0.8  feathers-opcua-client
@vue/cli-plugin-router              4.5.13  4.5.19   5.0.8  feathers-opcua-client
@vue/cli-plugin-vuex                4.5.13  4.5.19   5.0.8  feathers-opcua-client
@vue/cli-service                    4.5.13  4.5.19   5.0.8  feathers-opcua-client
@vue/composition-api                 0.3.4   0.3.4   1.7.2  feathers-opcua-client
@vue/eslint-config-prettier          5.1.0   5.1.0   9.0.0  feathers-opcua-client
core-js                             3.12.1  3.37.1  3.37.1  feathers-opcua-client
date-fns                            2.21.3  2.30.0   3.6.0  feathers-opcua-client
debug                                4.3.1   4.3.5   4.3.5  feathers-opcua-client
dotenv-webpack                       1.8.0   1.8.0   8.1.0  feathers-opcua-client
eslint                              5.16.0  5.16.0   9.6.0  feathers-opcua-client
eslint-plugin-prettier               3.4.0   3.4.1   5.1.3  feathers-opcua-client
eslint-plugin-vue                    5.2.3   5.2.3  9.27.0  feathers-opcua-client
feathers-hooks-common               4.20.7  4.20.7   8.1.3  feathers-opcua-client
prettier                            1.19.1  1.19.1   3.3.2  feathers-opcua-client
serve                               13.0.4  13.0.4  14.2.3  feathers-opcua-client
socket.io-client                     2.5.0   2.5.0   4.7.5  feathers-opcua-client
vue                                 2.6.12  2.7.16  3.4.31  feathers-opcua-client
vue-router                           3.5.1   3.6.5   4.4.0  feathers-opcua-client
vue-template-compiler               2.6.12  2.7.16  2.7.16  feathers-opcua-client
vuex                                 3.6.2   3.6.2   4.1.0  feathers-opcua-client
 */
