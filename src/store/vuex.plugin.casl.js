/* eslint-disable no-unused-vars */
import {
  PureAbility,
  Ability,
  createAliasResolver,
  detectSubjectType as defaultDetector
} from '@casl/ability'
import { BaseModel } from '@/plugins/auth/feathers-client'

const debug = require('debug')('app:store.vuex.plugin.casl')
let isDebug = true

const detectSubjectType = subject => {
  if (typeof subject === 'string') return subject
  if (!(subject instanceof BaseModel)) return defaultDetector(subject)
  return subject.constructor.servicePath
}

const resolveAction = createAliasResolver({
  update: 'patch', // define the same rules for update & patch
  read: ['get', 'find'], // use 'read' as a equivalent for 'get' & 'find'
  delete: 'remove' // use 'delete' or 'remove'
})

const ability = new Ability([], { detectSubjectType, resolveAction })

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
      let rules = null
      const isAuthenticate = (action.type === 'auth/responseHandler')
      const isLogout = (action.type === 'auth/logout')
      if (isAuthenticate) {
        if (isDebug && action) debug('caslPlugin.action:', action)
        const { rules } = action.payload
        if (!rules || !state.auth.user) {
          store.commit('casl/setRules', [])
          return
        }
        store.commit('casl/setRules', rules)
      } else if (isLogout) {
        if (isDebug && action) debug('caslPlugin.action:', action)
        store.commit('casl/setRules', [])
        
      }
      if(isAuthenticate || isLogout){
        ability = store.state.casl.ability
        rules = store.state.casl.rules
        debug(
          'updateAbilityForUser.ability.can("read", "users"):',
          ability.can('read', 'users')
        )
        debug(
          'updateAbilityForUser.ability.can("delete", "roles"):',
          ability.can('delete', 'roles')
        )
        debug('updateAbilityForUser.rules:', rules)
      }
    }
  })
}

export default caslPlugin
