<template>
  <div>
    <!-- Img  -->
    <template v-if="imgName">
      <v-img
        :src="require(`@/assets/img/logo/${imgNameForThemeColor}`)"
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
import { ref, computed, watch } from '@vue/composition-api'
import { debug } from 'feathers-hooks-common'

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

    // Reactive values
    const _imgName = getImgName()
    const imgNameForThemeColor = ref(`${_imgName}`)

    // Computed values
    const themeName = computed(() => ($vuetify.theme.dark ? 'dark' : 'light'))

    //-----------------------------------------------------
    watch(
      () => themeName.value,
      val => {
        // imgNameForThemeColor.value = getImgName()
      },
      { lazy: true }
    )

    //----------------------------------------------------------
    // Methods
    const getImgName = () => {
      let items = props.imgName.split('.')
      if (items[0].endsWith('_')) {
        return `${items[0]}${themeName.value}.${items[1]}`
      } else {
        return props.imgName
      }
      // if (themeName.value === 'dark') {
      //   let items = props.imgName.split('.')
      //   imgNameForThemeColor.value = `${items[0]}2.${items[1]}`
      //   debug('imgNameForThemeColor:', imgNameForThemeColor.value)
      // } else {
      //   imgNameForThemeColor.value = props.imgName
      // }
    }

    return {
      themeName,
      imgNameForThemeColor
    }
  }
}
</script>

<style lang="sass" scoped>
.page-title
  transform: scaleY(1.2)
</style>
