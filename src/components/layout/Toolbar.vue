<template>
  <v-app-bar app color="primary" dark>
    <!-- <div class="d-flex align-center"> -->
    <!-- Toggle show NavLeft -->
    <v-app-bar-nav-icon @click.stop="onNavLeft"></v-app-bar-nav-icon>

    <!-- Search web -->
    <v-text-field
      flat
      solo-inverted
      hide-details
      prepend-inner-icon="mdi-search-web"
      :label="$t('app_toolbar.search')"
      class="hidden-sm-and-down"
    ></v-text-field>
    <v-progress-linear
      :active="loading"
      :indeterminate="loading"
      absolute
      bottom
      :color="system.loadingColor"
    ></v-progress-linear>

    <!-- </div> -->

    <v-spacer></v-spacer>

    <!-- Mail to -->
    <v-btn :href="`mailto:${config.email}`">
      {{ $t('app_toolbar.hire_me') }}
    </v-btn>
    <!-- Go to GitHub project -->
    <v-btn icon :href="config.githubProject" target="_blank" title="GitHub">
      <v-icon>fab fa-github</v-icon>
    </v-btn>
    <!-- FullScreen -->
    <v-btn
      v-if="isToggleFullScreen"
      icon
      :title="$t('app_toolbar.normal_size')"
      @click="toggleFullScreen"
    >
      <v-icon>mdi-fullscreen-exit</v-icon>
    </v-btn>
    <v-btn
      v-else
      icon
      :title="$t('app_toolbar.full_size')"
      @click="toggleFullScreen"
    >
      <v-icon>mdi-fullscreen</v-icon>
    </v-btn>
    <!-- User menu -->
    <v-menu>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon
                v-on="on"
                v-text="user ? 'fas fa-user-check' : 'fas fa-user-alt-slash'"
              ></v-icon>
            </template>
            <span>{{
              user ? user.fullName : $t('app_toolbar.not_authorized')
            }}</span>
          </v-tooltip>
        </v-btn>
      </template>
      <!-- Menu list -->
      <app-user-menu-list :user-menu="userMenu"></app-user-menu-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
/* eslint-disable no-unused-vars */
import { ref, reactive, computed, onMounted, watch } from '@vue/composition-api'

import userMenu from '@/api/app/user-menu.json'

export default {
  setup(props, context) {
    const { $store, $router } = context.root

    // Reactive values
    let isToggleFullScreen = ref(false)

    // Computed state
    const user = computed(() => $store.state['auth']['user'])

    // Computed getters
    const config = computed(() => $store.getters.getConfig)
    const system = computed(() => $store.getters.getSystem)
    const loading = computed(() => $store.getters.getLoading)

    // Methods
    const onNavLeft = () => {
      context.emit('onNavLeft')
    }
    const toggleFullScreen = () => {
      let doc = window.document
      let docEl = doc.documentElement

      let requestFullScreen =
        docEl.requestFullscreen ||
        docEl.mozRequestFullScreen ||
        docEl.webkitRequestFullScreen ||
        docEl.msRequestFullscreen
      let cancelFullScreen =
        doc.exitFullscreen ||
        doc.mozCancelFullScreen ||
        doc.webkitExitFullscreen ||
        doc.msExitFullscreen

      if (
        !doc.fullscreenElement &&
        !doc.mozFullScreenElement &&
        !doc.webkitFullscreenElement &&
        !doc.msFullscreenElement
      ) {
        requestFullScreen.call(docEl)
        isToggleFullScreen.value = true
      } else {
        cancelFullScreen.call(doc)
        isToggleFullScreen.value = false
      }
    }

    return {
      // Reactive values
      isToggleFullScreen,
      // Computed state
      user,
      // Computed getters
      config,
      system,
      loading,
      // Methods
      onNavLeft,
      toggleFullScreen
    }
  }
}
</script>
