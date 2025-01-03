/* eslint-disable no-unused-vars */
import cookies from 'browser-cookies'
import typeOf from '@/plugins/lib/type-of'
import util from '@/plugins/lib/util'

const debug = require('debug')('app:store.mutations')
const isDebug = true

const motations = {
  //--- LOCALE ---//
  /**
   * Set locale
   * @param state {Object}
   * @param locale {String}
   */
  SET_LANG(state, locale) {
    const locales = state.config.locales
    if (isDebug && locales.length) debug('SET_LANG.locales', locales)
    if (Array.isArray(locales) && locales.indexOf(locale) >= 0) {
      state.config.locale = locale
      if (typeOf.isClient() && cookies.get('locale') !== locale) {
        util.setCookieWithAttributes('locale', locale)
        if (isDebug && locale)
          debug('SET_LANG.cookies.locale', cookies.get('locale'))
      }
    }
  },

  //--- THEME ---//
  /**
   * Set primary color for theme
   * @param state {Object}
   * @param color {String}
   */
  SET_THEME_PRIMARY(state, color) {
    state.theme.primary = color
    if (typeOf.isClient() && cookies.get('theme_primary') !== color) {
      util.setCookieWithAttributes('theme_primary', color)
      if (isDebug && color)
        debug(
          'SET_THEME_PRIMARY.cookies.theme_primary',
          cookies.get('theme_primary')
        )
    }
  },

  /**
   * Set dark color for theme
   * @param state {Object}
   * @param isDark {Boolean}
   */
  SET_THEME_DARK(state, isDark) {
    state.theme.dark = isDark
    state.theme.name = isDark ? 'dark' : 'light'
    const _isDark = isDark ? '1' : '0'
    if (typeOf.isClient() && cookies.get('theme_dark') !== _isDark) {
      util.setCookieWithAttributes('theme_dark', _isDark)
      util.setCookieWithAttributes('theme_name', state.theme.name)
      if (isDebug && state.theme.name)
        debug('SET_THEME_DARK.cookies.theme_dark', cookies.get('theme_dark'))
      if (isDebug && state.theme.name)
        debug('SET_THEME_DARK.cookies.theme_name', cookies.get('theme_name'))
    }
  },

  //--- NOTIFICATIONS ---//
  /**
   * Set checkAt for notices
   * @param state {Object}
   * @param checkAt {Object|String}
   */
  SET_NOTICES_CHECKAT(state, checkAt) {
    state.notices.checkAt = typeOf.isObject(checkAt)
      ? JSON.stringify(checkAt)
      : checkAt
    if (
      typeOf.isClient() &&
      cookies.get('notices_checkAt') !== state.notices.checkAt
    ) {
      util.setCookieWithAttributes('notices_checkAt', state.notices.checkAt)
    }
  },

  //--- CHAT ---//
  /**
   * Set checkAt for chat
   * @param state {Object}
   * @param checkAt {Array|String}
   */
  SET_CHAT_CHECKAT(state, checkAt) {
    state.chat.checkAt = Array.isArray(checkAt)
      ? JSON.stringify(checkAt)
      : checkAt
    if (
      typeOf.isClient() &&
      cookies.get('chat_checkAt') !== state.chat.checkAt
    ) {
      util.setCookieWithAttributes('chat_checkAt', state.chat.checkAt)
    }
  },

  /**
   * Set chat selected item
   * @param state {Object}
   * @param selectedItem {Object}
   */
  SET_CHAT_SELECTED_ITEM(state, selectedItem) {
    state.chat = Object.assign(state.chat, selectedItem)
    if (
      typeOf.isClient() &&
      cookies.get('chat_selectedItem') !== JSON.stringify(selectedItem)
    ) {
      util.setCookieWithAttributes('chat_selectedItem', JSON.stringify(selectedItem))
    }
  },

  /**
   * Set chat selected contact
   * @param state {Object}
   * @param selectedContact {Number}
   */
  SET_CHAT_SELECTED_CONTACT(state, selectedContact) {
    state.chat.contactSelected = selectedContact
  },

  //--- SYSTEM ---//
  /**
   * Set system
   * @param state {Object}
   * @param system {Object}
   */
  SET_SYSTEM(state, system) {
    state.system = Object.assign(state.system, system)
  },

  /**
   * Set system loading
   * @param state {Object}
   * @param loading {Boolean}
   */
  SET_LOADING(state, loading) {
    state.system.loading = loading
    if (loading && state.system.loadingDelay > 0) {
      setTimeout(() => {
        if (state.system.loading) {
          state.system.loading = false
          state.system.loadingDelay = 0
        }
      }, state.system.loadingDelay)
    }
  },

  /**
   * Set system loadingDelay
   * @param state {Object}
   * @param delay {Number}
   */
  SET_LOADING_DELAY(state, delay) {
    state.system.loadingDelay = delay
  },

  //--- SNACKBAR ---//
  /**
   * Set snack bar
   * @param state {Object}
   * @param snackbar {Object}
   */
  SET_SNACK_BAR(state, snackbar) {
    state.snackbar = Object.assign(state.snackbar, snackbar)
  },

  /**
   * Show success
   * @param state {Object}
   * @param value {Object|String}
   */
  SHOW_SUCCESS(state, value) {
    if (typeOf.isString(value)) {
      state.snackbar = { show: true, color: 'success', text: value }
    } else {
      state.snackbar = {
        show: true,
        color: 'success',
        text: value.text,
        timeout: value.timeout
      }
    }
  },

  /**
   * Show info
   * @param state {Object}
   * @param value {Object|String}
   */
  SHOW_INFO(state, value) {
    if (typeOf.isString(value)) {
      state.snackbar = { show: true, color: 'info', text: value }
    } else {
      state.snackbar = {
        show: true,
        color: 'info',
        text: value.text,
        timeout: value.timeout
      }
    }
  },

  /**
   * Show warning
   * @param state {Object}
   * @param value {Object|String}
   */
  SHOW_WARNING(state, value) {
    if (typeOf.isString(value)) {
      state.snackbar = { show: true, color: 'warning', text: value }
    } else {
      state.snackbar = {
        show: true,
        color: 'warning',
        text: value.text,
        timeout: value.timeout
      }
    }
  },

  /**
   * Show error
   * @param state {Object}
   * @param value {Object|String}
   */
  SHOW_ERROR(state, value) {
    if (typeOf.isString(value)) {
      state.snackbar = { show: true, color: 'error', text: value }
    } else {
      state.snackbar = {
        show: true,
        color: 'error',
        text: value.text,
        timeout: value.timeout
      }
    }
  },

  //--- ECHARTS ---//
  INCREMENT_DEMO_RADAR_DATA({ echarts }, { amount = 1, index = 0 }) {
    let data = echarts.demoRadarData
    let metric = data[index]
    metric.value = Math.max(Math.min(metric.value + amount, metric.max), 0)
    if (isDebug)
      debug('mutations.INCREMENT_DEMO_RADAR_DATA.value:', metric.value)
  }
}

export default motations
