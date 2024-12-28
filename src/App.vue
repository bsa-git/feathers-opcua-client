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

    <!-- Right Drawer -->
    <RightDrawer ref="rightDrawer"></RightDrawer>

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
import syncStore from '@/plugins/lib/sync-store'
const pkg = require('@/../package')

import LeftDrawer from '@/components/layout/LeftDrawer'
import RightDrawer from '@/components/layout/RightDrawer'
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
    RightDrawer,
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
    const { $store, $router, $route, $i18n, $refs } = context.root

    if (isDebug && context.root) debug('Toolbar.context.route:', $route)

    let lastRoleAlias = ''

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

    // We are waiting for the user active change event
    watch(
      () => (user.value ? user.value.active : false),
      async userActive => {
        if (isDebug && user.value)
          debug(`watch.user.active: ${userActive} - Changed!`)
        if (user.value && userActive === false) {
          showWarning({
            text: $i18n.t('management.userToInactiveMode'),
            timeout: 10000
          })
          await logout()
          $router.push($i18n.path('/'))
        }
      },
      { lazy: true }
    )

    // We are waiting for the user role change event
    watch(
      () => (user.value ? user.value.roleAlias : 'isGuest'),
      async roleAlias => {
        if (!lastRoleAlias) lastRoleAlias = roleAlias
        if (isDebug && roleAlias)
          debug(
            `watch.user.roleAlias: "${roleAlias}" - Changed! lastRoleAlias: ${lastRoleAlias}`
          )
        if (user.value && lastRoleAlias && lastRoleAlias !== roleAlias) {
          showWarning({
            text: $i18n.t('management.userToChangeRole'),
            timeout: 10000
          })
          await logout()
          lastRoleAlias = ''
          if (isDebug && roleAlias)
            debug(`watch.user.roleAliasChanged: "${roleAlias}" - Changed!`)
          $router.push($i18n.path('/'))
        }
      },
      { lazy: true }
    )

    //----------------------------------------------------
    // Lifecycle Hooks
    onMounted(async () => {
      try {
        syncStore.initVuetify(context.root)
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
      return user.value ? config.value.homePath : '/'
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
