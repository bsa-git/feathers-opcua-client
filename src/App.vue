<template>
  <v-app>
    <!-- App Tool Bar -->
    <AppToolbar v-if="!isStandAlone" @onNavLeft="navLeft = !navLeft" />

    <!-- App Left Drawer -->
    <AppLeftDrawer :drawer="navLeft" :items="items" @onNavLeft="modelNavLeft" />

    <!-- App Main -->
    <v-main>
      <router-view @onStandAlone="modelStandAlone" />
    </v-main>

    <!-- App Footer -->
    <AppFooter
      :copyright="config.copyright"
      :developer="config.logoTitle"
      :site="config.website"
    />
  </v-app>
</template>

<script>
/* eslint-disable no-unused-vars */
import { ref, onMounted, watch } from '@vue/composition-api'
import { mapGetters } from 'vuex'
import appMenu from './api/app/app-menu.json'
import feathersClient from '@/feathers-client'

import AppLeftDrawer from './components/app/layout/AppLeftDrawer'
import AppToolbar from './components/app/layout/AppToolbar.vue'
import AppFooter from './components/app/layout/AppFooter.vue'
// import { tr } from 'date-fns/locale'

const isDebug = false

export default {
  name: 'App',
  //------------
  components: {
    AppLeftDrawer,
    AppToolbar,
    AppFooter
  },

  data() {
    return {
      navLeft: false,
      items: appMenu
    }
  },

  computed: {
    ...mapGetters({
      config: 'getConfig'
    })
  },

  methods: {
    modelNavLeft: function(newValue) {
      this.navLeft = newValue
    },
    modelStandAlone: function(newValue) {
      this.isStandAlone = newValue
      console.log('isStandAlone:', this.isStandAlone)
    }
  },

  setup(props, context) {
    const { $store, $router } = context.root

    if (isDebug && context) console.log('App.setup.context:', context)
    if (isDebug && props) console.log('App.setup.props:', props)
    if (isDebug && $router) console.log('App.setup.$router:', $router)

    // let isStandAlone = ref('')
    // isStandAlone = true //standAlons.includes($router.currentRoute.name)
    const isStandAlone = ref(false)

    // console.log('App.isStandAlone:', isStandAlone)

    // Set app
    // context.app = feathersClient

    // Redirect to chat page if there's a user, otherwise to login page.
    watch(
      () => $store.state.auth.user,
      user => {
        const toRouteName = user ? 'Chat' : 'Home'
        $router.replace({ name: toRouteName })
      },
      { lazy: true }
    )

    // $router.push({ name: 'Dashboard' })
    // Attempt jwt auth when the app mounts.
    onMounted(() => {
      $store.dispatch('auth/authenticate').catch(error => {
        if (error.name !== 'NotAuthenticated') {
          console.error(error)
        }
      })
    })

    return { isStandAlone }
  }
}
</script>
