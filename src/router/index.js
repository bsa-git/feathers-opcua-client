import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import Vuetify from '../views/Vuetify'
import Login from '../views/Login'
import Signup from '../views/Signup'
import Chat from '../views/Chat'
import Dashboard from '../views/Dashboard.vue'

Vue.use(VueRouter)

const routes = [
  { path: '', name: 'Home', component: Home },
  { path: '/vuetify', name: 'Vuetify', component: Vuetify },
  { path: '/login', name: 'Login', component: Login },
  { path: '/signup', name: 'Signup', component: Signup },
  { path: '/chat', name: 'Chat', component: Chat },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard }
]

const router = new VueRouter({
  routes
})

export default router
