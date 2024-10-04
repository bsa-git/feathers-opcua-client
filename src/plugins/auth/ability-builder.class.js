/* eslint-disable no-unused-vars */
import {
  AbilityBuilder,
  createMongoAbility,
  PureAbility,
  Ability,
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

/**
 * defineRulesFor
 * @param {Object} user
 * @returns {Object[]}
 */
const defineRulesFor = user => {
  const { can, cannot, build, rules } = new AbilityBuilder(createMongoAbility)
  const idField = 'id' in user ? 'id' : '_id'
  if (user.roleAlias === 'isAdministrator') {
    // Administrator can do all
    can('manage', 'all')
    return rules
  }

  // Can 'users' actions
  can('create', 'users')
  can('read', 'users')
  can(
    'update',
    'users',
    ['active', 'email', 'password', 'firstName', 'lastName', 'avatar'],
    { id: user[idField] }
  )
  // can('delete', 'users', {id: user.id});

  // Can 'user-profiles' actions
  can('create', 'user-profiles')
  can('read', 'user-profiles')
  can('update', 'user-profiles', { id: user.profileId })

  // Can 'roles' actions
  can('read', 'roles')

  // Can 'teams' actions
  can('read', 'teams')

  // Can 'user-teams' actions
  can('read', 'user-teams')

  // Can 'log-messages' actions
  can('read', 'log-messages')

  // Can 'chat-messages' actions
  can('create', 'chat-messages')
  can('read', 'chat-messages')
  can('update', 'chat-messages', ['msg'], { ownerId: user[idField] })
  can('remove', 'chat-messages', { ownerId: user[idField] })

  // Can 'opcua-tags' actions
  can('read', 'opcua-tags')
  // can('manage', 'opcua-tags');
  // can('create', 'opcua-tags');
  // can('read', 'opcua-tags');
  // can('update', 'opcua-tags');
  // can('remove', 'opcua-tags');

  // Can 'opcua-values' actions
  can('read', 'opcua-values')
  // can('manage', 'opcua-values');
  // can('create', 'opcua-values');
  // can('read', 'opcua-values');
  // can('update', 'opcua-values');
  // can('remove', 'opcua-values');

  // Can 'messages' actions
  can('create', 'messages')
  can('read', 'messages')
  can('update', 'messages', ['text'], { userId: user[idField] })
  can('remove', 'messages', { userId: user[idField] })

  return rules
}

/**
 * defineAbilitiesFor
 * @param {Object} user
 * @returns {Object}
 */
const defineAbilitiesFor = user => {
  const rules = defineRulesFor(user)

  return new Ability(rules, { detectSubjectType, resolveAction })
  // return new PureAbility(rules)
}

export { defineRulesFor, defineAbilitiesFor }
