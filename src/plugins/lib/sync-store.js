/* eslint-disable no-unused-vars */
import cookies from 'browser-cookies'
import util from './util'
const loPick = require('lodash/pick')

const debug = require('debug')('app:plugins.sync-store')
const isDebug = false
//-----------------------------------------------------

/**
 * setThemePrimary
 * @param ct {Object}
 */
const setThemePrimary = ct => {
  const storeThemePrimary = ct.store.state.theme.primary
  const serverCookieThemePrimary =
    process.server && !process.static
      ? util.readCookie(ct.req.headers.cookie, 'theme_primary')
      : storeThemePrimary
  const cookiesThemePrimary = process.server
    ? serverCookieThemePrimary
    : cookies.get('theme_primary')
  if (util.isClient() && !cookiesThemePrimary) {
    cookies.set('theme_primary', storeThemePrimary)
  } else if (cookiesThemePrimary !== storeThemePrimary) {
    ct.store.commit('SET_THEME_PRIMARY', cookiesThemePrimary)
  }
}

/**
 * setThemeDark
 * @param ct {Object}
 */
const setThemeDark = ct => {
  const storeThemeDark = ct.store.state.theme.dark ? '1' : '0'
  const serverCookieThemeDark =
    process.server && !process.static
      ? util.readCookie(ct.req.headers.cookie, 'theme_dark')
      : storeThemeDark
  const cookiesThemeDark = process.server
    ? serverCookieThemeDark
    : cookies.get('theme_dark')
  if (util.isClient() && cookiesThemeDark === null) {
    cookies.set('theme_dark', storeThemeDark)
  } else if (cookiesThemeDark !== storeThemeDark) {
    ct.store.commit('SET_THEME_DARK', util.isTrue(cookiesThemeDark))
  }
}

/**
 * setLocale
 * @param ct {Object}
 */
const setLocale = ct => {
  const storeLocale = ct.store.state.config.locale
  const serverCookie =
    process.server && !process.static
      ? util.readCookie(ct.req.headers.cookie, 'locale')
      : storeLocale
  const cookiesLocale = process.server ? serverCookie : cookies.get('locale')
  if (util.isClient() && !cookiesLocale) {
    cookies.set('locale', storeLocale)
  } else if (cookiesLocale !== storeLocale) {
    ct.store.commit('SET_LANG', cookiesLocale)
  }
}

/**
 * Set notices checkAt
 * @param ct {Object}
 */
const setNoticesCheckAt = ct => {
  const storeNoticesCheckAt = ct.store.state.notices.checkAt
  const serverCookieNoticesCheckAt =
    process.server && !process.static
      ? util.readCookie(ct.req.headers.cookie, 'notices_checkAt')
      : storeNoticesCheckAt
  const cookiesNoticesCheckAt = process.server
    ? serverCookieNoticesCheckAt
    : cookies.get('notices_checkAt')
  if (util.isClient() && !cookiesNoticesCheckAt) {
    cookies.set('notices_checkAt', storeNoticesCheckAt)
  } else if (cookiesNoticesCheckAt !== storeNoticesCheckAt) {
    ct.store.commit('SET_NOTICES_CHECKAT', cookiesNoticesCheckAt)
  }
}

/**
 * Set chat checkAt
 * @param ct {Object}
 */
const setChatCheckAt = ct => {
  const storeChatCheckAt = ct.store.state.chat.checkAt
  const serverCookieChatCheckAt =
    process.server && !process.static
      ? util.readCookie(ct.req.headers.cookie, 'chat_checkAt')
      : storeChatCheckAt
  const cookiesChatCheckAt = process.server
    ? serverCookieChatCheckAt
    : cookies.get('chat_checkAt')
  if (util.isClient() && !cookiesChatCheckAt) {
    cookies.set('chat_checkAt', storeChatCheckAt)
  } else if (cookiesChatCheckAt !== storeChatCheckAt) {
    ct.store.commit('SET_CHAT_CHECKAT', cookiesChatCheckAt)
  }
}

/**
 * Set chat selected item
 * @param ct {Object}
 */
const setChatSelectedItem = ct => {
  let storeChatSelectedItem = loPick(ct.store.state.chat, [
    'userSelected',
    'roleSelected',
    'teamSelected'
  ])
  storeChatSelectedItem = JSON.stringify(storeChatSelectedItem)
  const serverCookieChatSelectedItem =
    process.server && !process.static
      ? util.readCookie(ct.req.headers.cookie, 'chat_selectedItem')
      : storeChatSelectedItem
  const cookiesChatSelectedItem = process.server
    ? serverCookieChatSelectedItem
    : cookies.get('chat_selectedItem')
  if (util.isClient() && !cookiesChatSelectedItem) {
    cookies.set('chat_selectedItem', storeChatSelectedItem)
  } else if (cookiesChatSelectedItem !== storeChatSelectedItem) {
    ct.store.commit(
      'SET_CHAT_SELECTED_ITEM',
      JSON.parse(cookiesChatSelectedItem)
    )
  }
}

/**
 * Init vuetify
 * @param ctVue {Object}
 * @param isUpdateColor {Boolean}
 */
const initVuetify = function(ctVue, isUpdateColor = false) {
  // Get store theme
  const theme = ctVue.$store.state.theme
  if (isDebug && theme) debug('initVuetify.theme:', theme)
  // Get color
  const color = ctVue.$store.getters['getPrimaryColor']
  if (isDebug && color) debug('initVuetify.primaryColor:', color)
  // if (isLog) debug('initVuetify.ctVue.$vuetify', ctVue.$vuetify)
  // Set theme dark
  ctVue.$vuetify.theme.dark = theme.dark
  // Set theme primary
  ctVue.$vuetify.theme.themes.dark.primary = color
  ctVue.$vuetify.theme.themes.light.primary = color
  // Update color
  if (isUpdateColor) {
    // if (isDebug && isUpdateColor) debug('initVuetify.ctVue.$refs:', ctVue.$refs)
    // const themeSettings = ctVue.$refs.rightDrawer.$refs.themeSettings
    // let themeColor = themeSettings.themeColor
    // if (themeColor !== 'indigo') {
    //   themeSettings.updateThemeColor()
    // }
  }
}

export default {
  setThemePrimary,
  setThemeDark,
  setLocale,
  setNoticesCheckAt,
  setChatCheckAt,
  setChatSelectedItem,
  initVuetify
}
