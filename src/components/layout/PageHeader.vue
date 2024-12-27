<template>
  <div>
    <!-- Img  -->
    <template v-if="getImgName()">
      <v-img
        :src="require(`@/assets/img/logo/${getImgName()}`)"
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

    //----------------------------------------------------------
    // Methods
    const getImgName = () => {
      let items = props.imgName.split('.')
      if (items[0].endsWith('_')) {
        return `${items[0]}${themeName.value}.${items[1]}`
      } else {
        return props.imgName
      }
    }

    return {
      // Reactive
      themeName,
      // Methods
      getImgName
    }
  }
}
</script>

<style lang="sass" scoped>
.page-title
  transform: scaleY(1.2)
</style>
