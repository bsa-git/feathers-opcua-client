/* eslint-disable no-unused-vars */
import Vue from 'vue'
import VueRouter from 'vue-router'
import i18n from '@/i18n'
import store from '@/store'
import initI18n from '@/middleware/init-i18n'

// Route components
import Home from '@/views/Home'
import Vuetify from '@/views/Vuetify'
import Login from '@/views/Login'
import Signup from '@/views/Signup'
import Chat from '@/views/Chat'
import Dashboard from '@/views/Dashboard.vue'

Vue.use(VueRouter)

const langTmpl = '/:lang(en|ru)?'

const routes = [
  { path: `${langTmpl}/`, name: 'Home', component: Home },
  { path: `${langTmpl}/user/login`, name: 'Login', component: Login },
  { path: `${langTmpl}/vuetify', name: 'Vuetify`, component: Vuetify },
  { path: `${langTmpl}/user/signup`, name: 'Signup', component: Signup },
  { path: `${langTmpl}/chat`, name: 'Chat', component: Chat },
  { path: `${langTmpl}/dashboard`, name: 'Dashboard', component: Dashboard }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // Init i18n
  const path = initI18n(to, i18n, store)
  
  // Redirecting to a path with a language prefix
  path ? next(path) : next()
})

export default router
