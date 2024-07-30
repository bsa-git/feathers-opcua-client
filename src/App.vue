<template>
  <v-app>
    <!-- App Tool Bar -->
    <Toolbar v-if="!isStandAlone" @onNavLeft="navLeft = !navLeft" />

    <!-- App Left Drawer -->
    <LeftDrawer
      v-if="!isStandAlone"
      :drawer="navLeft"
      :items="items"
      @onNavLeft="modelNavLeft"
    />

    <!-- App Main -->
    <v-main>
      <router-view @onStandAlone="modelStandAlone" />
    </v-main>

    <!-- Snackbar -->
    <SnackBar
      :show="snackBar.show"
      :text="snackBar.text"
      :color="snackBar.color"
      :timeout="snackBar.timeout"
      @onShow="modelSnackBar"
    />

    <!-- App Footer -->
    <Footer
      v-if="!isStandAlone"
      :copyright="config.copyright"
      :developer="config.logoTitle"
      :site="config.website"
    />
  </v-app>
</template>

<script>
/* eslint-disable no-unused-vars */
import { ref, computed, onMounted, watch } from '@vue/composition-api'
import { mapGetters } from 'vuex'
import appMenu from './api/app/app-menu.json'
import feathersClient from '@/feathers-client'

import LeftDrawer from './components/layout/LeftDrawer'
import Toolbar from './components/layout/Toolbar.vue'
import Footer from './components/layout/Footer.vue'
import SnackBar from './components/layout/SnackBar.vue'
// import { tr } from 'date-fns/locale'

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
    }
  },

  setup(props, context) {
    const { $store, $router } = context.root

    if (isDebug && context) console.log('App.setup.context:', context)
    if (isDebug && props) console.log('App.setup.props:', props)
    if (isDebug && $router) console.log('App.setup.$router:', $router)

    // Reactive values
    const isStandAlone = ref(false)
    // Computed getters
    const snackBar = computed(() => $store.getters.getSnackBar)
    // Mutations
    const setSnackBar = value => $store.commit('SET_SNACK_BAR', value)

    // Set app
    context.app = feathersClient

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

    // $router.push({ name: 'Dashboard' })
    // Attempt jwt auth when the app mounts.
    onMounted(() => {
      $store.dispatch('auth/authenticate').catch(error => {
        if (error.name !== 'NotAuthenticated') {
          console.error(error)
        }
      })
    })

    // Methods
    const modelSnackBar = newValue => {
      setSnackBar(newValue)
    }

    return {
      isStandAlone,
      snackBar,
      modelSnackBar
    }
  }
}
</script>
