import Vue from 'vue'
import VeeValidate from 'vee-validate'
import ru from 'vee-validate/dist/locale/ru'
import en from 'vee-validate/dist/locale/en'

// Add dictionary
const dictionary = {
  ru: { messages: ru.messages, attributes: ru.attributes },
  en: { messages: en.messages, attributes: en.attributes }
}

let locale = process.env.VUE_APP_I18N_LOCALE
locale = locale ? locale : 'en'

const config = {
  aria: true,
  classNames: {},
  classes: false,
  delay: 0,
  dictionary: dictionary,
  errorBagName: 'errors', // change if property conflicts
  events: 'input|blur',
  fieldsBagName: 'fields',
  i18n: null, // the vue-i18n plugin instance
  i18nRootKey: 'validations', // the nested key under which the validation messages will be located
  inject: true,
  locale,
  validity: false
}

// export default ({ app }) => {
//   config.i18n = app.i18n
//   config.locale = app.i18n.locale
//   Vue.use(VeeValidate, config)
// }

const veeValidate = i18n => {
  config.i18n = i18n
  config.locale = i18n.locale
  Vue.use(VeeValidate, config)
}
export default veeValidate
