<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="320">
      <v-card color="secondary" :dark="theme.dark">
        <v-card-title class="title">{{ titleDialog }}</v-card-title>
        <v-form @submit.prevent="onSubmit">
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    v-if="validateType === 'numeric'"
                    v-model="model.inputValue"
                    v-validate="'required|numeric'"
                    :error-messages="errors.collect('inputValue')"
                    data-vv-name="inputValue"
                    :label="labelInput"
                    :hint="hintInput"
                    persistent-hint
                  ></v-text-field>
                  <v-text-field
                    v-else-if="validateType === 'alpha_num'"
                    v-model="model.inputValue"
                    v-validate="'required|alpha_num'"
                    :error-messages="errors.collect('inputValue')"
                    data-vv-name="inputValue"
                    :label="labelInput"
                    :hint="hintInput"
                    persistent-hint
                  ></v-text-field>
                  <v-text-field
                    v-else-if="validateType === 'email'"
                    v-model="model.inputValue"
                    v-validate="'required|email'"
                    :error-messages="errors.collect('inputValue')"
                    data-vv-name="inputValue"
                    :label="labelInput"
                    :hint="hintInput"
                    persistent-hint
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text type="submit" color="primary">{{
              $t('common.enter')
            }}</v-btn>
            <v-btn text @click="$emit('onCloseInputDialog')">{{
              $t('common.close')
            }}</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
/* eslint-disable no-unused-vars */
import {
  ref,
  reactive,
  computed,
  onBeforeMount,
  watch
} from '@vue/composition-api'

export default {
  $_veeValidate: {
    validator: 'new'
  },
  props: {
    dialog: Boolean,
    runAction: {
      type: Function,
      default: () => {}
    },
    showError: {
      type: Function,
      default: () => {}
    },
    titleDialog: {
      type: String,
      default: ''
    },
    validateType: {
      type: String,
      default: ''
    },
    labelInput: {
      type: String,
      default: ''
    },
    hintInput: {
      type: String,
      default: ''
    }
  },
  setup(props, context) {
    const { $store, $validator, $vuetify, $i18n, $router } = context.root

    // Reactive values
    const model = reactive({
      inputValue: ''
    })

    // Computed getters
    const theme = computed(() => $store.getters.getTheme)

    // Mutations
    const showError = value => $store.commit('SHOW_ERROR', value)

    // Watch
    watch(
      () => model.inputValue,
      val => context.emit('onInput', val),
      { lazy: true }
    )

    // Methods
    const onSubmit = async () => {
      await $validator.validateAll()
      if ($validator.errors.any()) {
        showError('Validation Error!')
      } else {
        props.runAction()
      }
    }

    return {
      // React values
      model,
      // Computed getters
      theme,
      // Methods
      onSubmit
    }
  }
}
</script>
