/* eslint-disable no-unused-vars */
import Vue from 'vue'
import { abilitiesPlugin } from '@casl/vue'
import {
  defineRulesFor,
  defineAbilitiesFor
} from '@/store/plugins/ability-builder'

const debug = require('debug')('app:store.vuex.plugin.casl')
let isDebug = false

const ability = defineAbilitiesFor()

const caslPlugin = store => {
  store.registerModule('casl', {
    namespaced: true,
    state: {
      ability: ability,
      rules: []
    },
    mutations: {
      setRules(state, rules) {
        state.rules = rules
        state.ability.update(rules)
      }
    }
  })
  store.subscribeAction({
    after: (action, state) => {
      let ability = null
      let clientRules = []
      //-----------------------------------
      const isAuthenticate = action.type === 'auth/responseHandler'
      const isLogout = action.type === 'auth/logout'
      const isOpcuaValues = action.type === 'opcua-values/addOrUpdate'

      if (isDebug && action) debug('caslPlugin.action:', action)
      if (isDebug && isOpcuaValues)
        debug('caslPlugin.action.isOpcuaValues:', action)

      // Authenticate user
      if (isAuthenticate) {
        if (isDebug && action) debug('caslPlugin.action:', action)

        // Get rules from server
        const { rules } = action.payload
        if (!rules || !state.auth.user) {
          store.commit('casl/setRules', [])
          return
        }
        if (isDebug && rules.length)
          debug('caslPlugin.isAuthenticate.rules:', rules)

        // Merge two arrays (rules + clientRules)
        clientRules = defineRulesFor(state.auth.user)
        if (isDebug && clientRules.length)
          debug('caslPlugin.isAuthenticate.clientRules:', clientRules)
        clientRules = rules.concat(clientRules)
        if (isDebug && clientRules.length)
          debug('caslPlugin.isAuthenticate.(rules + clientRules):', clientRules)
        // Mutations.setRules
        store.commit('casl/setRules', clientRules)

        // Logout user
      } else if (isLogout) {
        if (isDebug && action) debug('caslPlugin.isLogout.action:', action)
        // clientRules = []
        // Define rules for user => NULL
        clientRules = defineRulesFor(null)
        if (isDebug && clientRules.length)
          debug('caslPlugin.isLogout.clientRules:', clientRules)
        store.commit('casl/setRules', clientRules)
      }
      if (isDebug && (isAuthenticate || isLogout)) {
        ability = store.state.casl.ability
        Vue.use(abilitiesPlugin, ability)

        // debug(
        //   'defineRulesFor.ability.can("enable", "/dashboard"):',
        //   ability.can('enable', '/dashboard')
        // )

        // debug(`defineRulesFor.clientRules:`, clientRules)
      }
    }
  })
}

export default caslPlugin
