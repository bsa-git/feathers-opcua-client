/* eslint-disable no-unused-vars */
import {
  PureAbility,
  createAliasResolver,
  detectSubjectType as defaultDetector
} from '@casl/ability'
import { BaseModel } from '@/plugins/auth/feathers-client'

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

const ability = new PureAbility([], { detectSubjectType, resolveAction })

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
      if (action.type === 'auth/responseHandler') {
        const { rules } = action.payload
        if (!rules || !state.auth.user) {
          store.commit('casl/setRules', [])
          return
        }

        store.commit('casl/setRules', rules)
      } else if (action.type === 'auth/logout') {
        store.commit('casl/setRules', [])
      }
    }
  })
}

export default { ability, caslPlugin }
