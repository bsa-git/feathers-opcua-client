<template>
  <div id="themeSetting">
    <v-toolbar color="primary darken-1" dark>
      <v-toolbar-title>
        {{ $t('theme_settings.settings') }}
      </v-toolbar-title>
    </v-toolbar>
    <v-container>
      <v-subheader class="px-1 my-2">
        {{ $t('theme_settings.color_option') }}
      </v-subheader>
      <v-row>
        <v-col
          v-for="(option, index) in colorOptions"
          :key="index"
          cols="6"
          class="color-option "
        >
          <!-- Color box -->
          <label class="color-option--label ">
            <input
              v-model="themeColor"
              type="radio"
              name="color"
              :value="option.key"
            />
            <span class="color-option--item bg">
              <span class="overlay">
                <v-icon color="white">mdi-check</v-icon>
              </span>
              <span
                class="color-option--item--header sideNav"
                :class="option.value.sideNav"
              ></span>
              <span
                class="color-option--item--header mainNav"
                :class="option.value.mainNav"
              ></span>
              <span class="sideMenu" :class="option.value.sideMenu"></span>
            </span>
          </label>
        </v-col>
      </v-row>
      <div class="theme-options">
        <v-subheader class="px-1 my-2">
          {{ $t('theme_settings.sidebar_option') }}
        </v-subheader>
        <v-divider></v-divider>
        <div class="my-3">
          <v-btn-toggle v-model="sideBarOption">
            <v-btn value="dark">
              {{ $t('theme_settings.dark') }}
            </v-btn>
            <v-btn value="light">
              {{ $t('theme_settings.light') }}
            </v-btn>
          </v-btn-toggle>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import { ref, computed, watch } from '@vue/composition-api'

const debug = require('debug')('app:ThemeSettings')
const isDebug = false

export default {
  props: {
    colorOptions: {
      type: Array,
      default: function() {
        return [{}]
      }
    }
  },

  setup(props, context) {
    const { $vuetify, $store } = context.root

    // Reactive values
    const changedColor = ref(false)
    const changedDark = ref(false)
    const themeColor = ref('indigo')
    const defaultColor = ref('indigo')
    const sideBarOption = ref('light')

    // Computed getters
    const theme = computed(() => $store.getters.getTheme)
    const primaryColor = computed(() => $store.getters.getPrimaryBaseColor)

    // Mutations
    const setThemePrimary = value => $store.commit('SET_THEME_PRIMARY', value)
    const setThemeDark = value => $store.commit('SET_THEME_DARK', value)

    //-----------------------------------------------------
    watch(
      () => themeColor.value,
      val => {
        themeColorHandler(val)
      },
      { lazy: true }
    )

    watch(
      () => sideBarOption.value,
      val => {
        sideBarOptionHandler(val)
        themeColorHandler(themeColor.value)
      },
      { lazy: true }
    )

    // Methods
    const themeColorHandler = val => {
      if (isDebug && val) debug('themeColorHandler.val:', val)
      // if (changedColor.value) {
        setThemePrimary(val)
        $vuetify.theme.themes.dark.primary = primaryColor.value
        $vuetify.theme.themes.light.primary = primaryColor.value
      // } else {
      //   changedColor.value = true
      //   if (theme.value.primary !== val) {
      //     themeColor.value = theme.value.primary
      //   }
      // }
    }

    const sideBarOptionHandler = val => {
      if (isDebug && val) debug('sideBarOptionHandler.val:', val)
      const isDark = val === 'dark'
      const isLight = val === 'light'

      // if ((isDark || isLight) && changedDark.value) {
        $vuetify.theme.dark = isDark
        setThemeDark(isDark)
      // }
      // First setup cycle of the theme.dark
      // The initial value is taken from store.
      // if (!changedDark.value) {
      //   changedDark.value = true
      //   if (theme.value.dark !== isDark) {
      //     sideBarOption.value = theme.value.dark ? 'dark' : 'light'
      //   }
      // }
    }

    const updateThemeColor = () => {
      themeColorHandler(defaultColor.value)
      themeColorHandler(themeColor.value)
    }

    return {
      // React values
      themeColor,
      sideBarOption,
      // Methods
      updateThemeColor
    }
  }
}
</script>

<style lang="sass" scoped>
.color-option
  &--label
    position: relative
    display: block
    cursor: pointer
    & input[type="radio"]
      display: none
      & + span
        position: relative
        & > .overlay
          display: none
          position: absolute
          top: 0
          bottom: 0
          right: 0
          left: 0
          width: 100%
          height: 100%
          background-color: rgba(0, 0, 0, .3)
          text-align: center
          line-height: 30px
          color: #fff
      &:checked + span > .overlay
        display: block
    & .bg
      background-color: #f1f1f1
  &--item
    overflow: hidden
    display: block
    box-shadow: 0 0 2px rgba(0, 0, 0, .1)
    border: 1px solid lightgray
    &--header
      height: 10px
    & > span
      display: block
      float: left
      width: 50%
      height: 20px
</style>
