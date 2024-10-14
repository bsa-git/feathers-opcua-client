<template>
  <div>
    <!-- Img  -->
    <template v-if="imgName">
      <v-img
        :src="require(`@/assets/img/logo/${imgName}`)"
        class="mu-3 mb-10"
        contain
        height="50"
      />
    </template>

    <!-- Page Title -->
    <template v-if="pageTitle">
      <div
        :class="
          `exotic--${themeName} display-1 mt-3 mb-6 text-center page-title`
        "
      >
        {{ pageTitle }}
      </div>
    </template>
    <v-divider v-if="isDiv" />
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import { computed } from '@vue/composition-api'

export default {
  components: {
    // PageTitle,
    // PageImg
  },

  props: {
    pageTitle: {
      type: String,
      default: ''
    },
    imgName: {
      type: String,
      default: ''
    },
    isDiv: {
      type: Boolean,
      default: false
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
.page-title
  transform: scaleY(1.2)
</style>
