<template>
  <v-container fluid>
    <v-form @submit.prevent="onSubmit">
      <!--<v-container grid-list-md>-->
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="model.personalPhone"
            v-validate="{ regex: $util.getRegex('phone') }"
            :counter="20"
            :error-messages="errors.collect('personalPhone')"
            data-vv-name="personalPhone"
            :label="$t('profile.personalPhone')"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="model.personalWebSite"
            v-validate="'url'"
            :error-messages="errors.collect('personalWebSite')"
            data-vv-name="personalWebSite"
            :label="$t('profile.personalWebSite')"
          ></v-text-field>
        </v-col>
      </v-row>
      <!--</v-container>-->
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" type="submit" :loading="loadingSubmit">
          {{ $t('profile.save') }}
        </v-btn>
        <v-btn class="ml-3" @click="onClear">
          {{ $t('login.clear') }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-container>
</template>

<script>
/* eslint-disable no-unused-vars */
import { ref, reactive, computed, onBeforeMount } from '@vue/composition-api'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

const debug = require('debug')('app:user-profile-personal')
const isDebug = false

export default {
  layout: 'user',
  $_veeValidate: {
    validator: 'new'
  },
  setup(props, context) {
    const { $store, $validator, $vuetify, $i18n, $router } = context.root
    const { User } = context.root.$FeathersVuex.api

    if (isDebug && context) debug('setup.context.$i18n:', $i18n)
    if (isDebug && context) debug('setup.context.User:', User)

    //-----------------------------------------------------
    // Reactive values
    let loadingSubmit = ref(false)
    const model = reactive({
      ersonalPhone: '',
      personalWebSite: '',
      error: undefined
    })

    // Computed state
    const user = computed(() => $store.state['auth']['user'])

    // Computed getters
    const config = computed(() => $store.getters.getConfig)

    // Mutations
    const showSuccess = value => $store.commit('SHOW_SUCCESS', value)
    const showError = value => $store.commit('SHOW_ERROR', value)

    //-------------------------------------------------------------
    // Lifecycle Hooks
    onBeforeMount(() => {
      initModel()
    })

    //----------------------------------------------------------
    // Methods
    const initModel = () => {
      if (user.value) {
        model.personalPhone = user.value.profile.personalPhone
        model.personalWebSite = user.value.profile.personalWebSite
      }
    }
    const onSubmit = async () => {
      dismissError()
      await $validator.validateAll()
      if ($validator.errors.any()) {
        showError('Validation Error!')
      } else {
        loadingSubmit.value = true
        if (isDebug) debug('onSubmit.formData:', model)
        const profileResponse = await save(model)
        if (profileResponse) {
          if (isDebug) debug('onSubmit.profileResponse:', profileResponse)
          showSuccess(`${$i18n.t('profile.successSaveUser')}!`)
          setTimeout(() => {
            loadingSubmit.value = false
          }, 1000)
        }
      }
    }
    const onClear = () => {
      model.personalPhone = ''
      model.personalWebSite = ''
      $validator.reset()
      dismissError()
    }
    const dismissError = () => {
      model.error = undefined
    }

    const save = async data => {
      const idFieldUserProfile = $store.state['user-profiles'].idField
      const { UserProfile } = context.root.$FeathersVuex.api
      try {
        let profileData = {
          [idFieldUserProfile]: user.value.profile.id,
          personalPhone: data.personalPhone,
          personalWebSite: data.personalWebSite
        }
        const userProfile = new UserProfile(profileData)
        return await userProfile.save()
      } catch (error) {
        if (isDebug) debug('userProfile.save.error:', error)
        loadingSubmit.value = false
        model.error = error
        showError(error.message)
        // Recover user profile data
        await UserProfile.get(user.value.profile.id)
      }
    }

    return {
      // React values
      loadingSubmit,
      model,
      // Computed state
      user,
      // Computed getters
      config,
      // Methods
      onSubmit,
      onClear
    }
  }
}
</script>
