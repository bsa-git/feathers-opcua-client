<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <!--=== Page Header ===-->
        <PageHeader
          :page-title="$t('app_menu.home')"
          :img-name="imgName"
        ></PageHeader>
      </v-col>

      <v-col cols="12">
        <v-sheet rounded="xl" class="pa-12" color="grey lighten-3">
          <v-sheet
            rounded="xl"
            class="mx-auto py-10"
            elevation="3"
            height="50%"
            width="80%"
          >
            <v-btn
              v-if="user"
              width="50%"
              color="primary"
              x-large
              class="ma-3"
              @click="onLogout"
            >
              {{ $t('login.logout') }}
              <v-icon size="22" right> {{ 'mdi-logout' }} </v-icon>
            </v-btn>
            <v-btn
              v-else
              width="50%"
              color="primary"
              x-large
              class="ma-3"
              to="/user/login"
            >
              {{ $t('login.title') }}
              <v-icon size="22" right> {{ 'mdi-login' }} </v-icon>
            </v-btn>
            <v-btn
              width="50%"
              color="secondary"
              x-large
              class="ma-3"
              to="/user/signup"
            >
              {{ user ? $t('profile.title') : $t('signup.title') }}
              <v-icon size="22" right>
                {{ user ? 'mdi-account-circle' : 'mdi-account-plus' }}
              </v-icon>
            </v-btn>
            <div></div>
          </v-sheet>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
/* eslint-disable no-unused-vars */
import { ref, computed } from '@vue/composition-api'
import PageHeader from '@/components/layout/PageHeader.vue'

const debug = require('debug')('app:Home')
const isDebug = false

export default {
  name: 'Home',
  //----------
  components: {
    PageHeader
  },
  metaInfo() {
    return {
      title: this.$t('app_menu.home'),
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content: this.$t('app_menu.home')
        }
      ]
    }
  },
  setup(props, context) {
    const { $i18n, $store, $router, $route } = context.root

    //-------------------------------------------------------
    // Reactive values
    const imgName = ref('feathers-logo-wide.png')

    // Computed state
    const user = computed(() => $store.state['auth']['user'])
    const config = computed(() => $store.getters.getConfig)
    const homePath = computed(() => (user.value ? config.value.homePath : '/guest-dashboard'))
    
    // Mutations
    const showSuccess = value => $store.commit('SHOW_SUCCESS', value)

    // Actions
    const logout = () => $store.dispatch('logout')

    //----------------------------------------------------------
    // Methods
    const onLogout = async () => {
      if (user.value) {
        await logout()
        showSuccess(`${$i18n.t('login.successLogout')}!`)
        setTimeout(async () => {
          const path = $i18n.path(homePath.value)
          if (path !== $route.fullPath) {
            $router.push(path)
          }
        }, 1000)
      }
    }

    return {
      //React values
      imgName,
      //Computed state
      user,
      //Methods
      onLogout
    }
  }
}
</script>
