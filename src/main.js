import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
Vue.use(VueCompositionApi)

import App from './App.vue'
import router from './router'
import store from './store'

import './assets/styles/base.css'
import './assets/styles/chat.css'
import vuetify from './plugins/vuetify/vuetify'
import vueI18n from './plugins/localization/vue-i18n'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  vueI18n,
  render: h => h(App)
}).$mount('#app')
