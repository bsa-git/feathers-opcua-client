<template>
  <v-navigation-drawer v-model="compDrawer" absolute temporary>
    <v-list-item>
      <v-list-item-avatar>
        <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title>John Leider</v-list-item-title>
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
import { computed } from '@vue/composition-api'

const isDebug = false

export default {
  props: {
    drawer: Boolean,
    menuItems: {
      type: Array,
      default: function() {
        return [{ title: 'Home', icon: 'mdi-home', path: '/' }]
      }
    }
  },

  setup(props, context) {
    // Computed values
    const compDrawer = computed({
      get: () => props.drawer,
      set: newValue => {
        context.emit('onNavLeft', newValue)
      }
    })

    return {
      compDrawer
    }
  }
}
</script>
