const path = require('path')
const Dotenv = require('dotenv-webpack')
let locale = process.env.VUE_APP_I18N_LOCALE
locale = locale ? locale : 'en'
let fallbackLocale = process.env.VUE_APP_I18N_FALLBACK_LOCALE
fallbackLocale = fallbackLocale ? fallbackLocale : 'en'
module.exports = {
  transpileDependencies: ['feathers-vuex', 'vuetify'],
  configureWebpack: {
    devtool: 'eval-source-map', // eval-source-map source-map
    plugins: [
      new Dotenv({
        path: './.env', // Path to .env file (this is the default)
        systemvars: true // It makes it possible to work in production mode on Heroku hosting
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src') // @ -> /src
        // '@components': path.resolve(__dirname, 'src/components'), // @components -> /src/components
        // You can add other aliases here.
      }
    }
  },

  pluginOptions: {
    i18n: {
      locale,
      fallbackLocale,
      localeDir: 'locales',
      enableInSFC: false,
      enableBridge: false
    }
  }
}
