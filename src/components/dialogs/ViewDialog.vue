<template>
  <v-row justify="center">
    <v-dialog v-model="showDialog" :max-width="maxWidth" scrollable>
      <v-card color="secondary" :dark="theme.dark">
        <!-- Toolbar -->
        <v-toolbar color="primary" elevation="0" dense dark>
          <v-icon v-if="headerIcon" class="mr-3">{{ headerIcon }}</v-icon>
          <v-app-bar-nav-icon v-else></v-app-bar-nav-icon>
          <v-toolbar-title>{{ headerTitle }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="showDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <!-- Card content -->
        <slot name="card-content"></slot>
        <!-- Text content -->
        <v-card-text v-if="isTextContent">
          <slot name="text-content"></slot>
          <v-list three-line color="secondary" :dark="theme.dark">
            <slot name="list-content"></slot>
          </v-list>
        </v-card-text>
        <!-- Actions -->
        <v-card-actions class="primary">
          <v-btn class="mx-auto" small dark text @click="showDialog = false">{{
            actionText
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
/* eslint-disable no-unused-vars */
import { computed } from '@vue/composition-api'

export default {
  props: {
    dialog: Boolean,
    headerIcon: {
      type: String,
      default: ''
    },
    headerTitle: {
      type: String,
      default: ''
    },
    actionText: {
      type: String,
      default: 'Close'
    },
    maxWidth: {
      type: Number,
      default: 400
    },
    isTextContent: {
      type: Boolean,
      default: true
    }
  },
  setup(props, context) {
    const { $store, $validator, $vuetify, $i18n, $router } = context.root
    // Computed getters
    const theme = computed(() => $store.getters.getTheme)
    const showDialog = computed({
      get: () => props.dialog,
      set: newValue => {
        context.emit('onClose', newValue)
      }
    })

    return {
      // Computed getters
      theme,
      showDialog
    }
  }
}
</script>
