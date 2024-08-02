<template>
  <v-app>
    <!-- App Tool Bar -->
    <Toolbar v-if="!isStandAlone" @onNavLeft="navLeft = !navLeft" />

    <!-- App Left Drawer -->
    <LeftDrawer v-if="!isStandAlone" :drawer="navLeft" :items="menuItems" @onNavLeft="modelNavLeft" />

    <!-- App Main -->
    <v-main>
      <router-view @onStandAlone="modelStandAlone" />
    </v-main>

    <!-- Snackbar -->
    <SnackBar :show="snackBar.show" :text="snackBar.text" :color="snackBar.color" :timeout="snackBar.timeout"
      @onShow="modelSnackBar" />

    <!-- App Footer -->
    <Footer v-if="!isStandAlone" :copyright="config.copyright" :developer="config.logoTitle" :site="config.website" />
  </v-app>
</template>

<script>
/* eslint-disable no-unused-vars */
import { ref, reactive, computed, onMounted, watch } from '@vue/composition-api'
import appMenu from './api/app/app-menu.json'
import feathersClient from '@/feathers-client'

import LeftDrawer from './components/layout/LeftDrawer'
import Toolbar from './components/layout/Toolbar.vue'
import Footer from './components/layout/Footer.vue'
import SnackBar from './components/layout/SnackBar.vue'

const isDebug = false

export default {
  name: 'App',
  //------------
  components: {
    LeftDrawer,
    Toolbar,
    Footer,
    SnackBar
  },

  setup(props, context) {
    const { $store, $router } = context.root

    if (isDebug && context) console.log('App.setup.context:', context)
    if (isDebug && props) console.log('App.setup.props:', props)
    if (isDebug && $router) console.log('App.setup.$router:', $router)

    // Set app
    context.app = feathersClient

    //-------------------------------------------------------
    // Reactive values
    const isStandAlone = ref(false)
    const navLeft = ref(false)
    const menuItems = reactive(appMenu)

    // Computed getters
    const config = computed(() => $store.getters.getConfig)
    const snackBar = computed(() => $store.getters.getSnackBar)

    // Mutations
    const setSnackBar = value => $store.commit('SET_SNACK_BAR', value)


    // Redirect to chat page if there's a user, otherwise to login page.
    /*
    watch(
      () => $store.state.auth.user,
      user => {
        const toRouteName = user ? 'Chat' : 'Home'
        $router.replace({ name: toRouteName })
      },
      { lazy: true }
    )
      */

    //----------------------------------------------------
    // Lifecycle Hooks
    onMounted(() => {// Attempt jwt auth when the app mounts.
      $store.dispatch('auth/authenticate').catch(error => {
        if (error.name !== 'NotAuthenticated') {
          console.error(error)
        }
      })
    })

    //-----------------------------------------------------
    // Methods
    const modelSnackBar = newValue => {
      setSnackBar(newValue)
    }

    const modelNavLeft = newValue => {
      navLeft.value = newValue
    }

    const modelStandAlone = newValue => {
      isStandAlone.value = newValue
    }

    return {
      // React values
      isStandAlone,
      navLeft,
      menuItems,
      config,
      snackBar,
      // Methods
      modelNavLeft,
      modelStandAlone,
      modelSnackBar
    }
  }
}
</script>
