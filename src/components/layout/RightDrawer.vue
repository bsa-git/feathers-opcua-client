<template>
  <div>
    <v-btn
      small
      fab
      dark
      fixed
      class="setting-fab"
      color="red"
      @click="openThemeSettings"
    >
      <v-icon>mdi-cog</v-icon>
    </v-btn>
    <v-navigation-drawer
      v-model="rightDrawer"
      temporary
      right
      hide-overlay
      fixed
      :dark="$vuetify.theme.dark"
      app
    >
      <ThemeSettings
        ref="themeSettings"
        :color-options="colorOptions"
      ></ThemeSettings>
    </v-navigation-drawer>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import { ref, reactive } from '@vue/composition-api'
import themeColorOptions from '@/api/app/theme-color-options.json'
import ThemeSettings from '@/components/layout/ThemeSettings'

const debug = require('debug')('app:RightDrawer')
const isDebug = false

export default {
  components: {
    ThemeSettings
  },

  setup(props, context) {
    const { $vuetify } = context.root

    if (isDebug && context.root)
      debug('RightDrawer.context.root:', context.root)

    // Reactive values
    const rightDrawer = ref(false)
    const colorOptions = reactive(themeColorOptions)

    //-----------------------------------------------------
    // Methods
    const openThemeSettings = () => {
      $vuetify.goTo(0)
      rightDrawer.value = !rightDrawer.value
    }

    return {
      // React values
      rightDrawer,
      colorOptions,
      // Methods
      openThemeSettings
    }
  }
}
</script>

<style lang="sass" scoped>
.setting-fab
  top: 50% !important
  right: 0
  border-radius: 0
</style>
