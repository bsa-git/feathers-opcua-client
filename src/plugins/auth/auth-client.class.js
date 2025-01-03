/* eslint-disable no-unused-vars */
const loConcat = require('lodash/concat')
const loReplace = require('lodash/replace')
import appMenu from '@/api/app/app-menu'
import feathersClient from '@/plugins/auth/feathers-client'

const debug = require('debug')('app:plugins.auth-client.class')
const isDebug = false

class AuthClient {
  /**
   * Constructor
   * @param store
   */
  constructor(store) {
    this.store = store
    this.menu = appMenu
    this.config = store.getters.getConfig
    this.locales = this.config.locales
    this.envPublicPaths = this.config.publicPaths
    this.envAdminPaths = this.config.adminPaths
    this.envPublicServices = this.config.publicServices
    this.envAdminServices = this.config.adminServices
    this.envRoles = store.getters.getRoles()
    const { auth } = store.state
    this.user = auth ? auth.user : null
    this.isAuth = store.getters.isAuth
    this.isAdmin = store.getters.isAdmin
    this.myRole = store.getters.getMyRole
    this.ability = store.state.casl.ability
    // Set this.envRoles
    if (isDebug && this.envRoles.length) debug('envRoles:', this.envRoles)
  }

  /**
   * Is access right for path
   * @param toRoute {Route}
   * @return Boolean
   */
  isAccess(toRoute) {
    let path = ''
    //--------------------
    const lang = toRoute.params.lang ? toRoute.params.lang : ''
    path = lang ? '/' + loReplace(toRoute.path, `/${lang}/`, '') : toRoute.path
    const canAbility = this.ability.can('enable', path)
    if (isDebug && toRoute)
      debug(
        'isAccess:',
        `path="${path}",`,
        `canAbility="${canAbility}",`,
        `roleName: "${this.myRole.name}"`
      )
    return canAbility
  }

  /**
   * Get public paths for auth
   * @param envPaths Array
   * @return Array
   */
  listPaths(envPaths = []) {
    let paths = []
    let filterEnvPaths
    let localePaths = []
    //--------------------------
    // Get paths from menu
    this.menu.forEach(item => {
      if (item.to) {
        if (envPaths.includes(item.to)) {
          paths.push(item.to)
          if (item.items) {
            item.items.forEach(i => {
              if (i.children) {
                i.children.forEach(child => {
                  if (child.to) paths.push(child.to)
                })
              }
              if (i.to) paths.push(i.to)
            })
          }
        } else {
          if (item.items) {
            item.items.forEach(i => {
              if (i.to) {
                if (envPaths.includes(i.to)) {
                  paths.push(i.to)
                  if (i.children) {
                    i.children.forEach(child => {
                      if (child.to) paths.push(child.to)
                    })
                  }
                } else {
                  if (i.children) {
                    i.children.forEach(child => {
                      if (child.to) {
                        if (envPaths.includes(child.to)) {
                          paths.push(child.to)
                        }
                      }
                    })
                  }
                }
              }
            })
          }
        }
      }
    })
    if (isDebug && paths.length) debug('AuthClient.listPaths.paths:', paths)
    // Get paths from envPaths
    filterEnvPaths = envPaths.filter(envPath => {
      return !paths.includes(envPath)
    })
    if (isDebug && filterEnvPaths.length)
      debug('AuthClient.listPaths.filterEnvPaths:', filterEnvPaths)
    paths = loConcat(paths, filterEnvPaths)
    // Get localePaths from paths
    this.locales.forEach(locale => {
      localePaths = loConcat(
        localePaths,
        paths.map(path => `/${locale}${path}`)
      )
    })
    if (isDebug && localePaths.length)
      debug('AuthClient.listPaths.localePaths:', localePaths)
    // localePaths = loConcat(localePaths, paths)
    return localePaths
  }

  /**
   * Filter menu for different access rights
   * @return Array
   */
  filterMenu() {
    return this.menu.filter(item => {
      if (item.divider) return true //
      if (item.header && item.alias === 'apps') return true
      if (
        item.header &&
        item.alias === 'ui_elements' &&
        this.ability.can('show', '/components')
      )
        return true
      if (
        item.header &&
        item.alias === 'extras' &&
        this.ability.can('show', '/user/signup')
      )
        return true
      return this.ability.can('show', item.to)
    })
  }

  /**
   * Get list services
   * e.g. { users: ['create'], roles: ['find', 'create', 'update', 'patch', 'remove'] }
   * @param envServices
   * @return {Object}
   */
  listServices(envServices = '') {
    const _services = {}
    envServices.forEach(service => {
      Object.assign(_services, service)
    })
    return _services
  }

  /**
   * Get public paths for auth
   * @return Array
   */
  publicPaths() {
    return this.listPaths(this.envPublicPaths)
  }

  /**
   * Get admin paths for auth
   * @return Array
   */
  adminPaths() {
    return this.listPaths(this.envAdminPaths)
  }

  /**
   * Get public services for auth
   * e.g. { users: ['create'], roles: ['find', 'create', 'update', 'patch', 'remove'] }
   * @return Object
   */
  publicServices() {
    return this.listServices(this.envPublicServices)
  }

  /**
   * Get admin services for auth
   * e.g. { users: ['create'], roles: ['find', 'create', 'update', 'patch', 'remove'] }
   * @return Object
   */
  adminServices() {
    return this.listServices(this.envAdminServices)
  }

  /**
   * getJWT
   * Get a jwt token with appClient.passwort.
   * @async
   * @param {Object} passport
   * @return {String}
   */
  static async getPassportJWT(passport) {
    if (!passport) new Error('No passport!')
    if (passport.passport) passport = passport.passport
    return await passport.getJWT()
  }

  /**
   * verifyPassportJWT
   * Verify a jwt token with appClient.passwort.
   * @async
   * @param {Object} passport
   * @param {String} jwt
   * @return {Object}
   */
  static async verifyPassportJWT(passport, jwt) {
    if (!passport) new Error('No passport!')
    if (!jwt) new Error('No jwt!')
    if (passport.passport) passport = passport.passport
    return await passport.verifyJWT(jwt)
  }

  /**
   * isPassportPayloadValid
   * Verify a payload token with appClient.passwort.
   * @async
   * @param {Object} passport
   * @param {String} jwt
   * @return {Boolean}
   */
  static async isPassportPayloadValid(passport, jwt) {
    if (!passport) new Error('No passport!')
    if (!jwt) new Error('No jwt!')
    if (passport.passport) passport = passport.passport
    return await passport.payloadIsValid(jwt)
  }

  /**
   * Check unique
   * check props are unique in the users items
   * @param identifyUser
   * @param ownId
   * @param ifErrMsg
   * @return {Promise.<*>}
   */
  static async checkUnique(identifyUser, ownId, ifErrMsg) {
    const authManagement = feathersClient.service('auth-management')
    // check props are unique in the users items
    const result = await authManagement.create({
      action: 'checkUnique',
      value: identifyUser, // e.g. {email, username}. Props with null or undefined are ignored.
      ownId, // excludes your current user from the search
      meta: { noErrMsg: ifErrMsg } // if return an error.message if not unique
    })
    return result
  }

  /**
   * Resend verify signup
   * resend sign up verification notification
   * @param identifyUser
   * @param notifierOptions
   * @return {Promise.<*>}
   */
  static async resendVerifySignup(identifyUser, notifierOptions) {
    const authManagement = feathersClient.service('auth-management')
    // resend sign up verification notification
    const result = await authManagement.create({
      action: 'resendVerifySignup',
      value: identifyUser, // {email}, {token: verifyToken}
      notifierOptions // options passed to options.notifier, e.g. {preferredComm: 'cellphone'}
    })
    return result
  }

  /**
   * Verify signup long
   * sign up or identityChange verification with long token
   * @param verifyToken
   * @return {Promise.<*>}
   */
  static async verifySignupLong(verifyToken) {
    const authManagement = feathersClient.service('auth-management')
    // sign up or identityChange verification with long token
    const result = await authManagement.create({
      action: 'verifySignupLong',
      value: verifyToken // compares to verifyToken
    })
    return result
  }

  /**
   * Verify sign up short
   * sign up or identityChange verification with short token
   * @param verifyShortToken
   * @param identifyUser
   * @return {Promise.<*>}
   */
  static async verifySignupShort(verifyShortToken, identifyUser) {
    const authManagement = feathersClient.service('auth-management')
    // sign up or identityChange verification with short token
    const result = await authManagement.create({
      action: 'verifySignupShort',
      value: {
        user: identifyUser, // identify user, e.g. {email: 'a@a.com'}. See options.identifyUserProps.
        token: verifyShortToken // compares to .verifyShortToken
      }
    })
    return result
  }

  /**
   * Send reset pwd
   * send forgotten password notification
   * @param identifyUser
   * @param notifierOptions
   * @return {Promise.<*>}
   */
  static async sendResetPwd(identifyUser, notifierOptions) {
    const authManagement = feathersClient.service('auth-management')
    // send forgotten password notification
    const result = await authManagement.create({
      action: 'sendResetPwd',
      value: identifyUser, // {email}, {token: verifyToken}
      notifierOptions // options passed to options.notifier, e.g. {preferredComm: 'email'}
    })
    return result
  }

  /**
   * Reset pwd long
   * forgotten password verification with long token
   * @param resetToken
   * @param password
   * @return {Promise.<*>}
   */
  static async resetPwdLong(resetToken, password) {
    const authManagement = feathersClient.service('auth-management')
    // forgotten password verification with long token
    const result = await authManagement.create({
      action: 'resetPwdLong',
      value: {
        token: resetToken, // compares to .resetToken
        password // new password
      }
    })
    return result
  }

  /**
   * Reset pwd short
   * forgotten password verification with short token
   * @param resetShortToken
   * @param identifyUser
   * @param password
   * @return {Promise.<*>}
   */
  static async resetPwdShort(resetShortToken, identifyUser, password) {
    const authManagement = feathersClient.service('auth-management')
    // forgotten password verification with short token
    const result = await authManagement.create({
      action: 'resetPwdShort',
      value: {
        user: identifyUser, // identify user, e.g. {email: 'a@a.com'}. See options.identifyUserProps.
        token: resetShortToken, // compares to .resetShortToken
        password // new password
      }
    })
    return result
  }

  /**
   * Password change
   * change password
   * @param oldPassword
   * @param password
   * @param identifyUser
   * @return {Promise.<*>}
   */
  static async passwordChange(oldPassword, password, identifyUser) {
    const authManagement = feathersClient.service('auth-management')
    // change password
    const result = await authManagement.create({
      action: 'passwordChange',
      value: {
        user: identifyUser, // identify user, e.g. {email: 'a@a.com'}. See options.identifyUserProps.
        oldPassword, // old password for verification
        password // new password
      }
    })
    return result
  }

  /**
   * Identity change
   * change communications
   * @param password
   * @param changesIdentifyUser
   * @param identifyUser
   * @return {Promise.<*>}
   */
  static async identityChange(password, changesIdentifyUser, identifyUser) {
    const authManagement = feathersClient.service('auth-management')
    // change communications
    const result = await authManagement.create({
      action: 'identityChange',
      value: {
        user: identifyUser, // identify user, e.g. {email: 'a@a.com'}. See options.identifyUserProps.
        password, // current password for verification
        changes: changesIdentifyUser // {email: 'a@a.com'} or {email: 'a@a.com', cellphone: '+1-800-555-1212'}
      }
    })
    return result
  }
}

export default AuthClient
