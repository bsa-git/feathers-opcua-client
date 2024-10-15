/* eslint-disable no-unused-vars */
import Vue from 'vue'
import VueI18n from 'vue-i18n'

import util from '@/plugins/lib/util'
const loMerge = require('lodash/merge')

Vue.use(VueI18n)

let en = require('@/locales/en.json')
let ru = require('@/locales/ru.json')
const enRtdata = require('@/locales/en-rtdata.json')
const ruRtdata = require('@/locales/ru-rtdata.json')
const enUnits = require('@/locales/en-units.json')
const ruUnits = require('@/locales/ru-units.json')

en = loMerge({}, en, enRtdata, enUnits)
ru = loMerge({}, ru, ruRtdata, ruUnits)

const path = function(link) {
  const _link = util.stripSlashes(link)
  const locale = this.locale
  return `/${locale}/${_link}`
}

const i18n = new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'en',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  // messages: loadLocaleMessages()
  messages: {
    en,
    ru
  }
})

i18n['path'] = path.bind(i18n)

export default i18n
