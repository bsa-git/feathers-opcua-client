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


  // PUBLIC_PATHS="/; /guest-dashboard; /media; /widgets; /components; /pickers; /layout; /forms; /system; /user/verify; /user/forgot; /user/change;"
  // ADMIN_PATHS="/admins; /services"

  // Define path public rules for guest
  const definePathRulesFor_Guest = () => {
    can('enable', '/')
    can('enable', '/user/signup')
    can('enable', '/user/login')
    can('enable', '/guest-dashboard')
    can('enable', '/media')
    can('enable', '/widgets')
    can('enable', '/components')
    can('enable', '/pickers')
    can('enable', '/layout')
    can('enable', '/forms')
    can('enable', '/system')
  }

  // Define path public rules for user
  const definePathRulesFor_User = () => {
    can('enable', '/user/profile')
    can('enable', '/user/verify')
    can('enable', '/user/forgot')
    can('enable', '/user/change')
    can('enable', '/log')
    can('enable', '/chat')
    can('enable', '/rtdata')
  }
  
  // Define path rules for administrator
  const definePathRulesFor_Admin = () => {
    can('enable', '/admins')
    can('enable', '/services')
  }

  //-----------------------------------------------

  // Define rules for guest
  if (!user) {
    definePathRulesFor_Guest()
    return rules
  }

  // Define rules for administrator
  if (user && user.roleAlias === 'isAdministrator') {
    definePathRulesFor_Admin()
  }

  // Define rules for user
  definePathRulesFor_User()
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
}

export { defineRulesFor, defineAbilitiesFor }
