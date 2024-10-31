/* eslint-disable no-unused-vars */
import Vue from 'vue'
import VueRouter from 'vue-router'
import i18n from '@/plugins/vue/i18n'
import store from '@/store'
import initI18n from '@/middleware/init-i18n'
import AuthClient from '@/plugins/auth/auth-client.class'

// Route components
import Home from '@/views/Home'
import Vuetify from '@/views/Vuetify'
import Login from '@/views/user/Login'
import Signup from '@/views/user/Signup'
import Profile from '@/views/user/Profile.vue'
import Chat from '@/views/Chat'
import Dashboard from '@/views/Dashboard.vue'
import GuestDashboard from '@/views/GuestDashboard.vue'

const debug = require('debug')('app:router.index')
const isDebug = true

Vue.use(VueRouter)

// Get string e.g. -> 'en|ru|ua'
const locales = store.state.config.locales.join('|')
const langTmpl = `/:lang(${locales})?`

const routes = [
  { path: `${langTmpl}/`, name: 'Home', component: Home },
  { path: `${langTmpl}/dashboard`, name: 'Dashboard', component: Dashboard },
  {
    path: `${langTmpl}/guest-dashboard`,
    name: 'GuestDashboard',
    component: GuestDashboard
  },
  { path: `${langTmpl}/user/login`, name: 'Login', component: Login },
  { path: `${langTmpl}/user/signup`, name: 'Signup', component: Signup },
  { path: `${langTmpl}/user/profile`, name: 'Profile', component: Profile },
  { path: `${langTmpl}/chat`, name: 'Chat', component: Chat },
  { path: `${langTmpl}/vuetify', name: 'Vuetify`, component: Vuetify }
]

const router = new VueRouter({
  routes
})

// Hook for middleware
router.beforeEach((to, from, next) => {
  // Init i18n
  let path = initI18n(to, i18n, store)
  if (isDebug && to) debug('router.beforeEach.to:', to)
  
  // Create auth
  const auth = new AuthClient(store)
  // Check access to path
  if(auth.isAccess(to)){
    // Redirecting to a path with a language prefix
    path ? next(path) : next()    
  } else {
    const user = store.state['auth']['user']
    store.commit('SHOW_ERROR', `This path "${to.path}" is not available. Not enough rights.`)
    path = user? `/${i18n.locale}/user/login` : `/${i18n.locale}/`
    throw new Error(`This path "${to.path}" is not available. Not enough rights.`)
    // next(path)
  } 
})

export default router
