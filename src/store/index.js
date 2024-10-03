import Vue from 'vue'
import Vuex from 'vuex'
import { FeathersVuex } from '@/plugins/auth/feathers-client'
import authPlugin from './vuex.plugin.auth'
// import caslPlugin from './vuex.plugin.casl'
import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)
Vue.use(FeathersVuex)

const requireModule = require.context(
  // The path where the service modules live
  '@/services',
  // Whether to look in subfolders
  false,
  // Only include .js files (prevents duplicate imports`)
  /.js$/
)
const servicePlugins = requireModule
  .keys()
  .map(modulePath => requireModule(modulePath).default)

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  plugins: [...servicePlugins, authPlugin /*, caslPlugin*/],
  strict: process.env.NODE_ENV !== 'production'
})
