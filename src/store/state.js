import util from '../plugins/lib/util'

/**
 * Get locales
 * @param envLocales
 * @return {Array}
 */
const locales = envLocales => {
  return util
    .stripSpecific(envLocales, ';')
    .split(';')
    .map(item => item.trim())
}

const state = () => ({
  config: {
    //--- LOCALES ---//
    locales: locales(process.env.LOCALES),
    locale: (process.env.LOCALE || 'en').trim()
  }
})
export default state
