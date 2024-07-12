<template>
  <v-app>
    <!-- Tool Bar -->
    <AppToolbar @onNavLeft="navLeft = !navLeft"></AppToolbar>

    <!-- Left Drawer -->
    <AppLeftDrawer :drawer="navLeft" :items="items" @onNavLeft="modelNavLeft">
    </AppLeftDrawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
/* eslint-disable no-unused-vars */
import { onMounted, watch } from '@vue/composition-api'
import appMenu from './api/app/app-menu.json'

import AppLeftDrawer from './components/app/layout/AppLeftDrawer'
import AppToolbar from './components/app/layout/AppToolbar.vue'

export default {
  name: 'App',
  //------------
  components: {
    AppLeftDrawer,
    AppToolbar
  },

  data() {
    return {
      navLeft: false,
      items: appMenu
    }
  },

  methods: {
    modelNavLeft: function(newValue) {
      this.navLeft = newValue
    }
  },

  setup(props, context) {
    const { $store, $router } = context.root

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

    return {}
  }
}
</script>
