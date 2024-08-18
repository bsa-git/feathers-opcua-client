<template>
  <v-footer color="">
    <span :class="`caption exotic--${themeName} hidden-sm-and-down`">{{
      copyright.toUpperCase()
    }}</span>
    <v-spacer></v-spacer>
    <div class="footer__developer">
      <v-btn :href="site" color="primary" target="_blank" text>{{
        developer
      }}</v-btn>
      <span :class="`caption exotic--${themeName} mr-1`">{{ site }}</span>
      <v-icon color="red" small>mdi-cards-heart</v-icon>
    </div>
  </v-footer>
</template>

<script>
/* eslint-disable no-unused-vars */
import { computed } from '@vue/composition-api'

const isDebug = false

export default {
  props: {
    copyright: {
      type: String,
      default: '© 2024 Sergii Beskorovainyi'
    },
    developer: {
      type: String,
      default: 'BSA Lab.'
    },
    site: {
      type: String,
      default: 'http://bsa-git.github.io'
    }
  },

  setup(props, context) {
    const { $vuetify } = context.root

    // Computed values
    const themeName = computed(() => ($vuetify.theme.dark ? 'dark' : 'light'))

    return {
      themeName
    }
  }
}
</script>

<style lang="sass" scoped>
@import '~vuetify/src/styles/styles.sass'

.footer__developer
  margin-right: 50px
.theme--dark.v-footer
  background-color: map-get($material-dark, 'background')
.theme--light.v-footer
  background-color: map-get($material-light, 'background')
</style>
