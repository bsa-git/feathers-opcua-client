<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import { onMounted, watch } from '@vue/composition-api'

export default {
  name: 'App',
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

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
