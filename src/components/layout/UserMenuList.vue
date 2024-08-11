<template>
  <div>12345</div>
  <!-- <v-list :color="theme.dark ? 'secondary' : ''" :dark="theme.dark"> -->
  <!-- <v-list >  
    <template v-for="(item, index) in filterUserMenu">
      <v-subheader v-if="item.header" :key="index">{{
        $t(`user_menu.${item.name}`)
      }}</v-subheader>
      <v-divider v-else-if="item.divider" :key="item.name + index"></v-divider>
      <v-list-item
        v-else
        :key="item.name"
        :to="item.to ? $i18n.path(item.to) : null"
        :href="item.href"
        ripple="ripple"
        :disabled="item.disabled || config.locale === item.click"
        :color="item.disabled || config.locale === item.click ? 'grey' : ''"
        :target="item.target"
        rel="noopener"
        @click="item.click ? itemClick(item.click) : null"
      >
        <v-list-item-action v-if="item.icon">
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{
            $t(`user_menu.${item.name}`)
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
</v-list> -->
</template>

<script>
/* eslint-disable no-unused-vars */
import { ref, reactive, computed, onMounted, watch } from '@vue/composition-api'
import { useRoute } from 'vue-router'

// import { mapGetters, mapMutations, mapActions } from 'vuex'
const debug = require('debug')('app:comp.AppUserMenuList')
const isDebug = true

export default {
  props: {
    userMenu: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  // computed: {
  // filterUserMenu() {
  //   return this.userMenu.filter(item => {
  //     switch (item.name) {
  //       case 'profile':
  //       case 'logout':
  //         return this.isAuth
  //       // break
  //       case 'signup':
  //       case 'login':
  //         return !this.isAuth
  //       // break
  //       default:
  //         return true
  //     }
  //   })
  // },
  // ...mapGetters({
  //   config: 'getConfig',
  //   theme: 'getTheme',
  //   isAuth: 'isAuth'
  // })
  // },
  // methods: {
  // async itemClick(type) {
  //   switch (type) {
  //     case 'en':
  //     case 'ru': {
  //       const path1 = '/' + type + this.$route.fullPath
  //       const path2 =
  //         '/' + type + this.$route.fullPath.replace(/^\/[^/]+/, '')
  //       const path =
  //         this.$i18n.fallbackLocale === this.config.locale ? path1 : path2
  //       this.$router.push(path)
  //       break
  //     }
  //     case 'logout': {
  //       await this.logout()
  //       this.showSuccess(`${this.$t('login.successLogout')}!`)
  //       this.$router.push(this.$i18n.path(this.config.homePath))
  //       break
  //     }
  //     default:
  //   }
  // },
  // ...mapMutations({
  //   showSuccess: 'SHOW_SUCCESS'
  // }),
  // ...mapActions(['logout'])
  // },
  setup(props, context) {
    const { $store, $router, $i18n } = context.root
    const route = useRoute()

    // if(isDebug && props.userMenu) debug('UserMenuList.filterUserMenu:', props.userMenu)
    if (isDebug) debug('UserMenuList.filterUserMenu:', props.userMenu)

    // Computed getters
    const config = computed(() => $store.getters.getConfig)
    const theme = computed(() => $store.getters.getTheme)
    const isAuth = computed(() => $store.getters.isAuth)

    // Computed methods
    const filterUserMenu = computed(() => {
      const filterArr = props.userMenu.filter(item => {
        switch (item.name) {
          case 'profile':
          case 'logout':
            return isAuth
          case 'signup':
          case 'login':
            return !isAuth
          default:
            return true
        }
      })
      if (isDebug) debug('UserMenuList.filterUserMenu:', filterArr)
      return filterArr
    })

    // Mutations
    const showSuccess = value => $store.commit('SHOW_SUCCESS', value)
    // const showError = value => $store.commit('SHOW_ERROR', value)

    // Actions
    // const authenticate = payload => $store.dispatch('authenticate', payload)
    const logout = () => $store.dispatch('logout')

    // Methods
    const itemClick = async type => {
      switch (type) {
        case 'en':
        case 'ru': {
          const path1 = '/' + type + route.path
          const path2 = '/' + type + route.path.replace(/^\/[^/]+/, '')
          const path = $i18n.fallbackLocale === config.locale ? path1 : path2
          $router.push(path)
          break
        }
        case 'logout': {
          await logout()
          showSuccess(`${$i18n.t('login.successLogout')}!`)
          $router.push($i18n.path(config.homePath))
          break
        }
        default:
      }
    }

    return {
      // Reactive values

      // Computed methods
      filterUserMenu,
      // Computed getters
      config,
      theme,
      // isAuth,
      // Methods
      itemClick
    }
  }
}
</script>
