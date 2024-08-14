<template>
  <v-list :color="theme.dark ? 'secondary' : ''" :dark="theme.dark">
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
  </v-list>
</template>

<script>
/* eslint-disable no-unused-vars */
import { computed } from '@vue/composition-api'

const debug = require('debug')('app:comp.UserMenuList')
const isDebug = false

export default {
  props: {
    userMenu: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  setup(props, context) {
    const { $store, $router, $route, $i18n } = context.root

    if (isDebug && context.root) debug('UserMenuList.context:', context.root)
    if (isDebug && props.userMenu)
      debug('UserMenuList.filterUserMenu:', props.userMenu)

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
            return isAuth.value
          case 'signup':
          case 'login':
            return !isAuth.value
          default:
            return true
        }
      })
      if (isDebug && filterArr.length)
        debug('UserMenuList.filterUserMenu:', filterArr)
      return filterArr
    })

    // Mutations
    const showSuccess = value => $store.commit('SHOW_SUCCESS', value)
    // const showError = value => $store.commit('SHOW_ERROR', value)

    // Actions
    const logout = () => $store.dispatch('logout')

    // Methods
    const itemClick = async type => {
      switch (type) {
        case 'en':
        case 'ru': {
          let path = ''
          const defaultLocale = $i18n.fallbackLocale
          const lang = $route.params.lang || defaultLocale
          if (!$route.params.lang) {
            path = `/${lang}${$route.path}`
          } else {
            path = $route.fullPath
          }
          if (lang !== type) {
            path = $route.fullPath.replace(`/${lang}/`, `/${type}/`)
          }
          if (isDebug && path) debug('itemClick.path:', path)
          $router.push(path)
          break
        }
        case 'logout': {
          let path = ''
          await logout()
          showSuccess(`${$i18n.t('login.successLogout')}!`)
          path = $i18n.path(config.value.homePath)
          if(path !== $route.fullPath){
            $router.push(path)
          }
          break
        }
        default:
      }
    }

    return {
      // Computed methods
      filterUserMenu,
      // Computed getters
      config,
      theme,
      // Methods
      itemClick
    }
  }
}
</script>
