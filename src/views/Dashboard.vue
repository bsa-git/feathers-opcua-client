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
        <!-- <button v-if="can('manage', 'all')">Create Post</button> -->
      </div>
    </div>
  </main>
</template>

<script>
/* eslint-disable no-unused-vars */
import { useAbility } from '@casl/vue';
const debug = require('debug')('app:view.Dashboard')
const isDebug = false
export default {
  name: 'Dashboard',

  setup(props, context) {

    // debug('setup.useAbility:', useAbility)
    // debug('setup.context:', context)

    const { $store, $router } = context.root

    // some code
    // const { can } = useAbility();

    return {
      // other props
      // can
    };
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
