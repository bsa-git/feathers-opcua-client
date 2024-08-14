import Vue from 'vue'
import VueI18n from 'vue-i18n'

import util from '@/plugins/lib/util'

Vue.use(VueI18n)

function loadLocaleMessages() {
  const locales = require.context(
    './locales',
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  )
  const messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}

const path = function(link) {
  const _link = util.stripSlashes(link)
  const locale = this.locale
  return `/${locale}/${_link}`
}

const i18n = new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'en',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: loadLocaleMessages()
})

i18n['path'] = path.bind(i18n)

export default i18n
