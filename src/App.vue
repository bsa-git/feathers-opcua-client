<template>
  <v-app>
    <!-- App Tool Bar -->
    <AppToolbar @onNavLeft="navLeft = !navLeft" />

    <!-- App Left Drawer -->
    <AppLeftDrawer :drawer="navLeft" :items="items" @onNavLeft="modelNavLeft" />

    <!-- App Main -->
    <v-main>
      <router-view />
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
import { onMounted, watch } from '@vue/composition-api'
import { mapGetters } from 'vuex'
import appMenu from './api/app/app-menu.json'

import AppLeftDrawer from './components/app/layout/AppLeftDrawer'
import AppToolbar from './components/app/layout/AppToolbar.vue'
import AppFooter from './components/app/layout/AppFooter.vue'

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
