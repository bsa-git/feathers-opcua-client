import Vue from 'vue'
import VueMeta from 'vue-meta'
import VueCompositionApi from '@vue/composition-api'
Vue.use(VueCompositionApi)

import App from '@/App.vue'
import router from '@/router'
import store from '@/store'

import '@/assets/styles/app.sass'
import '@/assets/styles/variables.sass'
import vuetify from '@/plugins/vue/vuetify'
import i18n from '@/plugins/vue/i18n'
import veeValidate from '@/plugins/vue/vee-validate'

veeValidate(i18n)
Vue.config.productionTip = false
Vue.use(VueMeta, {
  keyName: 'metaInfo',
  attribute: 'data-vue-meta',
  ssrAttribute: 'data-vue-meta-server-rendered',
  tagIDKeyName: 'vmid',
  refreshOnceOnNavigation: true
})

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')
