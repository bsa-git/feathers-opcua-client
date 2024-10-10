<template>
  <v-navigation-drawer v-model="compDrawer" :dark="$vuetify.theme.dark" :width="320" absolute temporary>
    <v-list-item>
      <v-list-item-avatar>
        <v-img :src="userAvatar()"></v-img>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title>{{ $t('common.hi') }} {{ user ? user.firstName : $t('common.guest') }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense>
      <v-list-item v-for="menuItem in menuItems" :key="menuItem.title" :to="menuItem.path" link>
        <v-list-item-icon>
          <v-icon>{{ menuItem.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ menuItem.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
/* eslint-disable no-unused-vars */
import { ref, computed } from '@vue/composition-api'
import Avatar from '@/plugins/lib/avatar.class'

const debug = require('debug')('app:comp.LeftDrawer')
const isDebug = true

export default {
  props: {
    drawer: Boolean,
    menuItems: {
      type: Array,
      default: function () {
        return [{ title: 'Home', icon: 'mdi-home', path: '/' }]
      }
    }
  },

  setup(props, context) {

    const { $store, $validator, $vuetify, $i18n, $router } = context.root
    // const mini = ref(true)

    // Computed state
    const user = computed(() => $store.state['auth']['user'])
    if(isDebug && user.value) debug('setup.user:', user.value)
    // Computed getters
    const config = computed(() => $store.getters.getConfig)
    const compDrawer = computed({
      get: () => props.drawer,
      set: newValue => {
        context.emit('onNavLeft', newValue)
      }
    })

    //----------------------------------------------------------
    // Methods
    const userAvatar = () => {
      // const avatar = user.value? user.value.avatar : ''
      // return avatar;
      const email = user.value? user.value.email : ''
      const avatar = new Avatar(email);
      if(isDebug && avatar) debug('setup.user.avatar:', avatar)
      return avatar.imageUrl();

    }

    return {
      compDrawer,
      user,
      userAvatar,
      config
    }
  }
}
</script>
