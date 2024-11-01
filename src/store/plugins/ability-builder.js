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
    can('enable', '/user/verify')
    can('enable', '/user/forgot')
    can('enable', '/guest-dashboard')
    can('enable', '/media')
    can('enable', '/widgets/chart')
    can('enable', '/widgets/echarts')
    can('enable', '/widgets/table')
    can('enable', '/widgets/widget-list')
    can('enable', '/widgets/social')
    can('enable', '/widgets/statistic')
    can('enable', '/components/calendars')
    can('enable', '/components/cards')
    can('enable', '/components/tables')
    can('enable', '/components/lists')
    can('enable', '/components/steppers')
    can('enable', '/components/timelines')
    can('enable', '/components/treeviews')
    can('enable', '/components/alerts')
    can('enable', '/components/avatars')
    can('enable', '/components/badges')
    can('enable', '/components/buttons')
    can('enable', '/components/carousels')
    can('enable', '/components/chips')
    can('enable', '/components/dialogs')
    can('enable', '/components/icons')
    can('enable', '/components/parallax')
    can('enable', '/components/snackbar')
    can('enable', '/components/progress')
    can('enable', '/components/sliders')
    can('enable', '/components/tooltips')
    can('enable', '/components/paginations')
    can('enable', '/components/typography')
    can('enable', '/components/color')
    can('enable', '/pickers/color')
    can('enable', '/pickers/date')
    can('enable', '/pickers/time')
    can('enable', '/layout/application')
    can('enable', '/layout/grids')
    can('enable', '/layout/expansion-panels')
    can('enable', '/layout/footer')
    can('enable', '/layout/menus')
    can('enable', '/layout/tabs')
    can('enable', '/layout/toolbar')
    can('enable', '/layout/timeline')
    can('enable', '/forms/basic')
    can('enable', '/forms/autocompletes')
    can('enable', '/forms/selection-controls')
    can('enable', '/forms/text-fields')
    can('enable', '/forms/steppers')
    can('enable', '/forms/editors')
    can('enable', '/error/403')
    can('enable', '/error/404')
    can('enable', '/error/500')
  }

  // Define menu public rules for guest
  const defineMenuRulesFor_Guest = () => {
    can('show', '/guest-dashboard')
    can('show', '/media')
    can('show', '/widgets')
    can('show', '/components')
    can('show', '/pickers')
    can('show', '/layout')
    can('show', '/forms')
    can('show', '/system')
  }

  // Define path public rules for user
  const definePathRulesFor_User = () => {
    can('enable', '/')
    can('enable', '/dashboard')
    can('enable', '/user/profile')
    can('enable', '/user/verify')
    can('enable', '/user/forgot')
    can('enable', '/user/change')
    can('enable', '/log')
    can('enable', '/chat/messages')
    can('enable', '/chat/contacts')
    can('enable', '/chat/settings')
    can('enable', '/rtdata/ch-azot/m51')
    can('enable', '/rtdata/ch-azot/m52')
    can('enable', '/rtdata/ch-azot/a3')
    can('enable', '/rtdata/ch-azot/ng-upg2')
    can('enable', '/rtdata/ch-azot/m7-313')
    can('enable', '/rtdata/ch-azot/m7-357')
    can('enable', '/rtdata/ch-azot/m7-657')
    can('enable', '/rtdata/ch-azot/m9')
    can('enable', '/rtdata/ch-azot/m2')
  }

  // Define menu public rules for user
  const defineMenuRulesFor_User = () => {
    can('show', '/log')
    can('show', '/chat')
    can('show', '/rtdata')
  }

  // Define path rules for administrator
  const definePathRulesFor_Admin = () => {
    can('enable', '/admins/accounts')
    can('enable', '/admins/management')
    can('enable', '/admins/settings')
    can('enable', '/services/graphql/find')
    can('enable', '/services/graphql/get')
  }

  // Define menu rules for administrator
  const defineMenuRulesFor_Admin = () => {
    can('show', '/admins')
    can('show', '/services')
  }

  //-----------------------------------------------

  // Define rules for guest
  if (!user) {
    definePathRulesFor_Guest()
    defineMenuRulesFor_Guest()
    return rules
  }

  // Define rules for administrator
  if (user && user.roleAlias === 'isAdministrator') {
    definePathRulesFor_Admin()
    defineMenuRulesFor_Admin()
  }

  // Define rules for user
  definePathRulesFor_User()
  defineMenuRulesFor_User()
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
