/* eslint-disable no-unused-vars */
import Vue from 'vue'
import { abilitiesPlugin } from '@casl/vue'
import {
  defineRulesFor,
  defineAbilitiesFor
} from '@/plugins/auth/ability-builder.class'

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
      let _rules = []
      //-----------------------------------
      if (true && action) debug('caslPlugin.action:', action)
      const isAuthenticate = action.type === 'auth/responseHandler'
      const isLogout = action.type === 'auth/logout'
      // Authenticate user
      if (isAuthenticate) {
        if (isDebug && action) debug('caslPlugin.action:', action)

        // Get rules from server
        const { rules } = action.payload
        if (!rules || !state.auth.user) {
          store.commit('casl/setRules', [])
          return
        }
        if (isDebug && rules.length) debug('caslPlugin.isAuthenticate.rules:', rules)

        // Merge two arrays (rules + _rules)
        _rules = defineRulesFor(state.auth.user)
        if (isDebug && _rules.length) debug('caslPlugin.isAuthenticate._rules:', _rules)
        _rules = rules.concat(_rules)
        if (isDebug && _rules.length)
          debug('caslPlugin.isAuthenticate.rules + _rules:', _rules)
        // Mutations.setRules
        store.commit('casl/setRules', _rules)
        // Logout user
      } else if (isLogout) {
        if (isDebug && action) debug('caslPlugin.isLogout.action:', action)
        _rules = []
        store.commit('casl/setRules', _rules)
        if (isDebug && _rules) debug('caslPlugin.isLogout.rules:', _rules)
      }
      if (isDebug && (isAuthenticate || isLogout)) {
        ability = store.state.casl.ability
        Vue.use(abilitiesPlugin, ability)

        debug(
          'updateAbilityForUser.ability.can("read", "users"):',
          ability.can('read', 'users')
        )
        debug(
          'updateAbilityForUser.ability.can("delete", "roles"):',
          ability.can('delete', 'roles')
        )

        _rules = store.state.casl.rules
        debug('updateAbilityForUser.rules:', _rules)
      }
    }
  })
}

export default caslPlugin
