<template>
  <v-app>
    <!-- App Tool Bar -->
    <Toolbar v-if="!isStandAlone" @onNavLeft="navLeft = !navLeft" />

    <!-- App Left Drawer -->
    <LeftDrawer
      v-if="!isStandAlone"
      :drawer="navLeft"
      :home-path="getHomePath()"
      :menu-items="menuItems"
      :badge-chat="getNewChatMessages"
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
      :copyright="$t('app_footer.copyright')"
      :developer="config.logoTitle"
      :site="config.website"
    />
  </v-app>
</template>

<script>
/* eslint-disable no-unused-vars */
import { ref, reactive, computed, onMounted, watch } from '@vue/composition-api'
import appMenu from '@/api/app/app-menu.json'
import ServiceClient from '@/plugins/service-helpers/service-client.class'
import AuthClient from '@/plugins/auth/auth-client.class'
const pkg = require('@/../package')

import LeftDrawer from '@/components/layout/LeftDrawer'
import Toolbar from '@/components/layout/Toolbar.vue'
import Footer from '@/components/layout/Footer.vue'
import SnackBar from '@/components/layout/SnackBar.vue'

const debug = require('debug')('app:App')
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

  metaInfo() {
    return {
      title: pkg.name,
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content: pkg.description
        }
      ],
      link: [],
      script: []
    }
  },

  setup(props, context) {
    const { $store, $router, $route, $i18n } = context.root

    if (isDebug && context.root) debug('Toolbar.context.route:', $route)

    // Set app
    // context.app = feathersClient

    //-------------------------------------------------------
    // Reactive values
    const isStandAlone = ref(false)
    const navLeft = ref(false)
    const menuItems = reactive(appMenu)

    // Computed getters
    const user = computed(() => $store.state['auth']['user'])
    const config = computed(() => $store.getters.getConfig)
    const snackBar = computed(() => $store.getters.getSnackBar)

    const getNewChatMessages = computed(() => {
      let count = 0
      if (user.value) {
        const srv = new ServiceClient($store)
        count = srv.getNewChatMessages()
      }
      return count
    })

    // Mutations
    const setSnackBar = value => $store.commit('SET_SNACK_BAR', value)
    const showSuccess = value => $store.commit('SHOW_SUCCESS', value)
    const showWarning = value => $store.commit('SHOW_WARNING', value)
    const showError = value => $store.commit('SHOW_ERROR', value)

    // Actions
    const authenticate = payload => $store.dispatch('authenticate', payload)
    const logout = () => $store.dispatch('logout')

    watch(
      () => (user.value ? user.value.active : false),
      userActive => {
        if (isDebug && user.value)
          debug(`watch.user.active: ${userActive} - Changed!`)
        if (user.value && userActive === false) {
          showWarning({
            text: $i18n.t('management.userToInactiveMode'),
            timeout: 10000
          })
          logout()
          $router.push($i18n.path(config.value.homePath))
        }
      },
      { lazy: true }
    )

    watch(
      () => (user.value ? user.value.roleAlias : 'isGuest'),
      roleAlias => {
        if (true && roleAlias)
          debug(`watch.user.roleAlias: "${roleAlias}" - Changed!`)
        if (user.value && roleAlias) checkAccessToRoutePath()
      },
      { lazy: true }
    )

    //----------------------------------------------------
    // Lifecycle Hooks
    onMounted(async () => {
      try {
        const loginResponse = await authenticate()
        if (isDebug && loginResponse)
          debug('authenticate.loginResponse:', loginResponse)
      } catch (error) {
        if (error.name !== 'NotAuthenticated') {
          console.error(
            'Authenticate.error:',
            `name="${error.name}"`,
            `message="${error.message}"`
          )
        }
      }
    })

    //-----------------------------------------------------
    // Methods
    const modelSnackBar = newValue => {
      setSnackBar({ show: newValue })
    }

    const modelNavLeft = newValue => {
      navLeft.value = newValue
    }

    const modelStandAlone = newValue => {
      isStandAlone.value = newValue
    }

    const getHomePath = () => {
      return user.value ? config.value.homePath : 'guest-dashboard'
    }

    const refresh = () => {
      location.reload()
    }
    const checkAccessToRoutePath = () => {
      const authClient = new AuthClient($store)
      // Check auth access for route.path
      if (!authClient.isAccess($route.path)) {
        if (isDebug && $route.path)
          debug(
            `checkAccessToRoutePath: This path "${$route.path}" is not available. Not enough rights.`
          )
        showError({ text: $i18n.t('error.not_enough_rights'), timeout: 10000 })
        $router.push($i18n.path('/user/login'))
      }
      // else {
      //   refresh()
      // }
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
      modelSnackBar,
      getHomePath,
      getNewChatMessages
    }
  }
}
</script>
