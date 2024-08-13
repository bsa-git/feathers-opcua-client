export default function(to, i18n, store) {
  let path = ''
  //--------------------------------
  const defaultLocale = i18n.fallbackLocale
  const lang = to.params.lang || defaultLocale
  if (store.state.config.locales.indexOf(lang) < 0) {
    throw new Error('Such a locale does not exist in the application')
  }
  // Setting the current language in i18n
  if (i18n.locale !== lang) {
    // Set lang locale
    i18n.locale = lang
    // Set store locale
    store.commit('SET_LANG', lang)
  }

  if (!to.params.lang) path = `/${lang}${to.path}`
  return path
}
