<template>
  <main class="dashboard container">
    <div class="row">
      <div class="col-12 col-6-tablet push-3-tablet text-center">
        <h1 class="font-100">Dashboard</h1>
      </div>
    </div>
    <div class="row">
      <div
        class="col-12 col-6-tablet push-3-tablet col-4-desktop push-4-desktop"
      >
        <router-link
          as="button"
          :to="{ name: 'Home' }"
          class="button button-secondary block"
          >Home</router-link
        >
      </div>
    </div>
    <div class="row">
      <span style="color: red;">{{ myRole ? myRole.name : '' }}</span>
    </div>
    <div class="row">
      <ol>
        <li>
          ability.can('create', 'authentication') =
          {{ ability.can('create', 'authentication') }}
        </li>
        <li>
          ability.can('read', 'users') = {{ ability.can('read', 'users') }}
        </li>
        <li>
          ability.can('remove', 'users') = {{ ability.can('remove', 'users') }}
        </li>
      </ol>
    </div>
  </main>
</template>

<script>
/* eslint-disable no-unused-vars */
import {
  ref,
  reactive,
  computed,
  watch,
  onBeforeMount,
  onUnmounted
} from '@vue/composition-api'
import { useAbility } from '@casl/vue'

const debug = require('debug')('app:view.Dashboard')
const isDebug = true

export default {
  name: 'Dashboard',

  setup(props, context) {
    // debug('setup.useAbility:', useAbility)
    // debug('setup.context:', context)

    const { $store, $router } = context.root

    // Computed state
    const user = computed(() => $store.state['auth']['user'])
    const myRole = computed(() => $store.getters.getMyRole)
    const ability = computed(() => $store.state.casl.ability)
    const rules = computed(() => $store.state.casl.rules)

    // if (isDebug && myRole.value) debug('setup.myRole:', myRole.value)

    // watch(
    //   () => myRole.value,
    //   value => {
    //     if (isDebug) debug('watch.rules:', value)
    //   },
    //   { lazy: false }
    // )

    // some code
    // const { can } = useAbility();

    return {
      myRole,
      ability
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
main.dashboard {
  padding-top: 100px;
  padding-bottom: 100px;
}
</style>
