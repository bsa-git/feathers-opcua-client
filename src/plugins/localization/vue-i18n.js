import Vue from 'vue'
import VueI18n from 'vue-i18n'

const loMerge = require('lodash/merge')

let en = require('@/plugins/localization/locales/en.json')
let ru = require('@/plugins/localization/locales/ru.json')
const enRtdata = require('@/plugins/localization/locales/en-rtdata.json')
const ruRtdata = require('@/plugins/localization/locales/ru-rtdata.json')
const enUnits = require('@/plugins/localization/locales/en-units.json')
const ruUnits = require('@/plugins/localization/locales/ru-units.json')

en = loMerge({}, en, enRtdata, enUnits)
ru = loMerge({}, ru, ruRtdata, ruUnits)

Vue.use(VueI18n)

let locale = process.env.VUE_APP_I18N_LOCALE
locale = locale ? locale : 'en'
let fallbackLocale = process.env.VUE_APP_I18N_FALLBACK_LOCALE
fallbackLocale = fallbackLocale ? fallbackLocale : 'en'

const vueI18n = new VueI18n({
  locale: locale,
  fallbackLocale: fallbackLocale,
  messages: {
    en,
    ru
  } 
})  

export default vueI18n


/*
export default context => {

  const { $store } = context.root
  const app = context.app
  const config = $store.state.config
  // Set i18n instance on app
  // This way we can use it in middleware and pages asyncData/fetch
  app.i18n = new VueI18n({
    locale: config.locale,
    fallbackLocale: config.fallbackLocale,
    messages: {
      en,
      ru
    }
  })
  
  context.$t = VueI18n.prototype.t.bind(app.i18n)

  app.i18n.path = link => {
    const _link = app.$util.stripSlashes(link)
    if (app.i18n.locale === app.i18n.fallbackLocale) {
      return `/${_link}`
    }
    return `/${app.i18n.locale}/${_link}`
  }
}
  */
