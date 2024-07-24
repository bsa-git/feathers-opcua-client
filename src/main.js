import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
Vue.use(VueCompositionApi)

import App from './App.vue'
import router from './router'
import store from './store'

import './assets/styles/app.sass'
import './assets/styles/variables.sass'
import vuetify from './plugins/vuetify/vuetify'
import i18n from './i18n'
import veeValidate from './plugins/vuetify/vee-validate'

veeValidate(i18n)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')
