const Dotenv = require('dotenv-webpack')
module.exports = {
  transpileDependencies: ['feathers-vuex'],
  configureWebpack: {
    plugins: [
      new Dotenv({
        path: './.env', // Path to .env file (this is the default)
        systemvars: true // It makes it possible to work in production mode on Heroku hosting
      })
    ]
  }
}
