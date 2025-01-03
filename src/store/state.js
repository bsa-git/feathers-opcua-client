/* eslint-disable no-unused-vars */
import cookies from 'browser-cookies'
import util from '@/plugins/lib/util'

const debug = require('debug')('app:store.state')
const isDebug = false

/**
 * Get locales
 * @param envLocales
 * @return {Array}
 */
const getLocales = envLocales => {
  const _locales = util
    .stripSpecific(envLocales, ';')
    .split(';')
    .map(item => item.trim())
  if (isDebug && _locales.length) debug('getLocales.locales:', _locales)
  return _locales
}

/**
 * Get locale
 * @method getLocale
 * @returns {String}
 */
const getLocale = () => {
  let locale
  //-------------------------
  locale = process.env.LOCALE.trim()
  if (util.isClient() && cookies.get('locale')) {
    locale = cookies.get('locale')
  }
  if (isDebug && locale) debug('getLocale.locale:', locale)
  return locale
}

/**
 * Get theme
 * @method getTheme
 * @returns {Object}
 */
const getTheme = () => {
  const theme = {
    primary: 'indigo',
    dark: false,
    name: 'light'
  }
  //-------------------------
  if (util.isClient() && cookies.get('theme_primary')) {
    theme.primary = cookies.get('theme_primary')
  }
  if (util.isClient() && cookies.get('theme_dark')) {
    theme.dark = cookies.get('theme_dark') === '1' ? true : false
    theme.name = theme.dark ? 'dark' : 'light'
  }
  if (isDebug && theme) debug('getTheme.theme:', theme)
  return theme
}

/**
 * Get auth services
 * @param envServices
 * @return {Array}
 */
const authServices = envServices => {
  return util
    .stripSpecific(envServices, ';')
    .split(';')
    .map(service => {
      const all = ['find', 'get', 'create', 'update', 'patch', 'remove']
      const items = service
        .trim()
        .split('.')
        .map(item => item.trim())
      return {
        [items[0]]:
          items[1] === '*'
            ? all
            : util
                .stripSpecific(items[1], ',')
                .split(',')
                .map(item => item.trim())
      }
    })
}

/**
 * Get auth paths
 * @param envPaths
 * @return {Array}
 */
const authPaths = envPaths => {
  return util
    .stripSpecific(envPaths, ';')
    .split(';')
    .map(item => item.trim())
}

/**
 * Get auth roles
 * e.g. [{isAdministrator: 'Administrator'}, {isGuest: 'Guest'}, {isSuperRole: 'superRole'}]
 * @param envRoles
 * @return {Array}
 */
const authRoles = envRoles => {
  return util
    .stripSpecific(envRoles, ';')
    .split(';')
    .map(role => {
      const items = role
        .trim()
        .split(':')
        .map(item => item.trim())
      return { [items[0]]: items[1] }
    })
}

/**
 * Get base roles
 * e.g. [{isAdministrator: 'Administrator'}, {isGuest: 'Guest'}]
 * @param envBaseRoles
 * @return {Array}
 */
const baseRoles = envBaseRoles => {
  const _baseRoles = util
    .stripSpecific(envBaseRoles, ';')
    .split(';')
    .map(item => item.trim())
  return authRoles(process.env.ROLES).filter(role => {
    const key = Object.keys(role)[0]
    return _baseRoles.indexOf(key) >= 0
  })
}

/**
 * Get external accounts
 * @param envAccounts
 * @returns {Array}
 */
const externalAccounts = envAccounts => {
  return util
    .stripSpecific(envAccounts, ';')
    .split(';')
    .map(item => item.trim())
}

const state = () => ({
  config: {
    //--- LOCALES ---//
    locales: getLocales(process.env.LOCALES),
    locale: getLocale(), //(process.env.LOCALE || 'en').trim(),
    fallbackLocale: (process.env.FALLBACK_LOCALE || 'en').trim(),
    //--- AUTH ---//
    isAuthManager:
      process.env.IS_AUTH_MANAGER !== undefined
        ? util.isTrue(process.env.IS_AUTH_MANAGER)
        : true,
    roles: authRoles(process.env.ROLES),
    baseRoles: baseRoles(process.env.BASE_ROLES),
    publicPaths: authPaths(process.env.PUBLIC_PATHS),
    adminPaths: authPaths(process.env.ADMIN_PATHS),
    publicServices: authServices(process.env.PUBLIC_SERVICES),
    adminServices: authServices(process.env.ADMIN_SERVICES),
    externalAccounts: externalAccounts(process.env.EXTERNAL_ACCOUNTS),
    //--- GENERAL ---//
    host: (process.env.HOST || 'localhost').trim(),
    port: (process.env.PORT || '3030').trim(),
    nodeEnv: (process.env.NODE_ENV || 'development').trim(),
    debug: (process.env.DEBUG || '').trim(),
    baseUrl: (process.env.BASE_URL || 'http://localhost:3131').trim(),
    homePath: (process.env.HOME_PATH || '/dashboard').trim(),
    //--- DATABASE ---//
    typeDB: (process.env.TYPE_DB || 'mongodb').trim(),
    mongodbNullIdValue: (
      process.env.MONGODB_NULL_ID_VALUE || '000000000000000000000000'
    ).trim(),
    //--- LOG-MESSAGES ---//
    logMsgEnable: util.isTrue(process.env.LOGMSG_ENABLE),
    logMsgMaxRows: util.getNumber(process.env.LOGMSG_MAXROWS),
    //--- OPCUA-MESSAGES ---//
    opcuaValuesMaxRows: util.getNumber(process.env.OPCUA_VALUES_MAXROWS),
    //--- SECRETS ---//
    /*
    gmail: (process.env.GMAIL || 'my@gmail.com').trim(),
    gmail_password: (process.env.GMAIL_PASSWORD || 'gmailpassword').trim(),
    githubId: (process.env.GITHUB_ID || '').trim(),
    githubSecret: (process.env.GITHUB_SECRET || '').trim(),
    googleId: (process.env.GOOGLE_ID || '').trim(),
    googleSecret: (process.env.GOOGLE_SECRET || '').trim(),
    */
    //--- PERSONAL-DATA ---//
    isAvatar: util.isTrue(process.env.PERSONAL_IS_AVATAR),
    logoImage: (process.env.PERSONAL_ICON || 'mdi-coffee').trim(),
    logoTitle: (process.env.PERSONAL_LOGO_TITLE || 'BSA Lab.').trim(),
    copyright: (
      process.env.PERSONAL_COPYRIGHT || '© 2024 Sergii Beskorovainyi'
    ).trim(),
    website: (
      process.env.PERSONAL_WEBSITE || 'http://bsa-git.github.io'
    ).trim(),
    email: (process.env.PERSONAL_EMAIL || 'bs261257@gmail.com').trim(),
    githubProject: (
      process.env.PERSONAL_GITHUB_PROJECT ||
      'https://github.com/bsa-git/feathers-opcua-client'
    ).trim()
  },
  //--- SNACKBAR ---//
  snackbar: {
    show: false,
    text: 'Test success!',
    color: 'purple',
    timeout: 6000
  },
  //--- THEME ---//
  // theme: {
  //   primary: 'indigo',
  //   dark: false,
  //   name: 'light'
  // },
  theme: getTheme(),
  //--- NOTIFICATIONS ---//
  notices: {
    checkAt: ''
  },
  //--- CHAT ---//
  chat: {
    checkAt: '',
    userSelected: -1,
    roleSelected: -1,
    teamSelected: -1,
    contactSelected: -1
  },
  //--- NOTIFICATIONS ---//
  system: {
    loading: false,
    loadingColor: 'amber',
    loadingDelay: 0
  },
  //--- ECHARTS ---//
  echarts: {
    demoRadarData: [
      { name: 'attack', max: 20, value: 19 },
      { name: 'defense', max: 20, value: 9 },
      { name: 'speed', max: 20, value: 18 },
      { name: 'power', max: 20, value: 16 },
      { name: 'endurance', max: 20, value: 16 },
      { name: 'agile', max: 20, value: 20 }
    ]
  }
})
export default state
