/* eslint-disable no-unused-vars */
import Vue from 'vue'
import VueRouter from 'vue-router'
import i18n from '@/plugins/vue/i18n'
import store from '@/store'
import initI18n from '@/middleware/init-i18n'

// Route components
import Home from '@/views/Home'
import Vuetify from '@/views/Vuetify'
import Login from '@/views/user/Login'
import Signup from '@/views/user/Signup'
import Profile from '@/views/user/Profile.vue'
import Chat from '@/views/Chat'
import Dashboard from '@/views/Dashboard.vue'

const debug = require('debug')('app:router.index')
const isDebug = false

Vue.use(VueRouter)

// Get string e.g. -> 'en|ru|ua'
const locales = store.state.config.locales.join('|')
const langTmpl = `/:lang(${locales})?`

const routes = [
  // { path: `${langTmpl}/`, name: 'Home', component: Home },
  { path: `${langTmpl}/home`, name: 'Home', component: Home },
  { path: `${langTmpl}/user/login`, name: 'Login', component: Login },
  { path: `${langTmpl}/user/signup`, name: 'Signup', component: Signup },
  { path: `${langTmpl}/user/profile`, name: 'Profile', component: Profile },
  { path: `${langTmpl}/chat`, name: 'Chat', component: Chat },
  { path: `${langTmpl}/dashboard`, name: 'Dashboard', component: Dashboard },
  { path: `${langTmpl}/vuetify', name: 'Vuetify`, component: Vuetify }
]

const router = new VueRouter({
  routes
})

// Hook for middleware
router.beforeEach((to, from, next) => {
  // Init i18n
  const path = initI18n(to, i18n, store)

  if (isDebug && to.path)
    debug('router.beforeEach.path:', from.path, ',', to.path)

  // Redirecting to a path with a language prefix
  path ? next(path) : next()
})

export default router
