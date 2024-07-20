<template>
  <div>
    <!-- Img  -->
    <template v-if="imgName">
      <v-img
        :src="require(`@/assets/pic/${imgName}`)"
        class="mu-3 mb-10"
        contain
        height="50"
      />
    </template>

    <div>isStandAlone: {{ isStandAlone }}</div>

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
import { inject } from '@vue/composition-api'

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
  computed: {
    themeName: function() {
      return this.$vuetify.theme.dark ? 'dark' : 'light'
    }
  },
  setup() {
    const isStandAlone = inject('isStandAlone', false)
    console.log('AppPageHeader.isStandAlone:', isStandAlone)

    return {
      isStandAlone
    }
  }
}
</script>

<style lang="sass" scoped>
.page-title
  transform: scaleY(1.2)
</style>
