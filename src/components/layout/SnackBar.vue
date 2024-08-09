<template>
  <v-snackbar
    v-model="compShow"
    :timeout="timeout"
    :multi-line="multiLine"
    bottom
    right
    :color="color"
  >
    {{ text }}

    <template v-slot:action="{ attrs }">
      <v-btn v-bind="attrs" dark icon @click.native="compShow = false"
        ><v-icon>mdi-close</v-icon></v-btn
      >
    </template>
  </v-snackbar>
</template>

<script>
/* eslint-disable no-unused-vars */
import { computed, watch } from '@vue/composition-api'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: undefined
    },
    timeout: {
      type: Number,
      default: 5000
    },
    multiLine: {
      type: Boolean,
      default: false
    }
  },

  setup(props, context) {
    // Computed values
    const compShow = computed({
      get: () => props.show,
      set: newValue => {
        context.emit('onShow', newValue)
      }
    })

    watch(
      () => props.show,
      show => {
        if (show)
          setTimeout(() => {
            compShow.value = false
          }, props.timeout)
      },
      { lazy: true }
    )

    return {
      compShow
    }
  }
}
</script>
