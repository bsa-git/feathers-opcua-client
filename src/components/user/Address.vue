<template>
  <v-container fluid>
    <v-form @submit.prevent="onSubmit">
      <!--<v-container grid-list-md>-->
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="model.addressSuite"
            v-validate="'max:15'"
            :counter="15"
            :error-messages="errors.collect('addressSuite')"
            data-vv-name="addressSuite"
            :label="$t('profile.addressSuite')"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="model.addressStreet"
            v-validate="'max:25'"
            :counter="25"
            :error-messages="errors.collect('addressStreet')"
            data-vv-name="addressStreet"
            :label="$t('profile.addressStreet')"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="model.addressCity"
            v-validate="'max:25'"
            :counter="25"
            :error-messages="errors.collect('addressCity')"
            data-vv-name="addressCity"
            :label="$t('profile.addressCity')"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="model.addressZipCode"
            v-validate="{ regex: getRegex('zip_code') }"
            :counter="15"
            :error-messages="errors.collect('addressZipCode')"
            data-vv-name="addressZipCode"
            :label="$t('profile.addressZipCode')"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="model.addressState"
            v-validate="'max:15'"
            :counter="15"
            :error-messages="errors.collect('addressState')"
            data-vv-name="addressState"
            :label="$t('profile.addressState')"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="model.addressStateAbbr"
            v-validate="'max:5'"
            :counter="5"
            :error-messages="errors.collect('addressStateAbbr')"
            data-vv-name="addressStateAbbr"
            :label="$t('profile.addressStateAbbr')"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="model.addressCountry"
            v-validate="'max:25'"
            :counter="25"
            :error-messages="errors.collect('addressCountry')"
            data-vv-name="addressCountry"
            :label="$t('profile.addressCountry')"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="model.addressCountryCode"
            v-validate="'max:5'"
            :counter="5"
            :error-messages="errors.collect('addressCountryCode')"
            data-vv-name="addressCountryCode"
            :label="$t('profile.addressCountryCode')"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="model.addressLatitude"
            v-validate="{ regex: getRegex('lat') }"
            :counter="10"
            :error-messages="errors.collect('addressLatitude')"
            data-vv-name="addressLatitude"
            :label="$t('profile.addressLatitude')"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="model.addressLongitude"
            v-validate="{ regex: getRegex('long') }"
            :counter="10"
            :error-messages="errors.collect('addressLongitude')"
            data-vv-name="addressLongitude"
            :label="$t('profile.addressLongitude')"
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
import { getRegex } from '@/plugins/lib/util'

const debug = require('debug')('app:user-profile-address')// getRegex
const isDebug = false

export default {
  $_veeValidate: {
    validator: 'new'
  },
  setup(props, context) {
    const { $store, $validator, $vuetify, $i18n, $router } = context.root

    if (isDebug && context) debug('setup.context.$i18n:', $i18n)

    //-----------------------------------------------------
    // Reactive values
    let loadingSubmit = ref(false)
    const model = reactive({
      addressSuite: '',
      addressStreet: '',
      addressCity: '',
      addressState: '',
      addressStateAbbr: '',
      addressCountry: '',
      addressCountryCode: '',
      addressZipCode: '',
      addressLatitude: '',
      addressLongitude: '',
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
        model.addressSuite = user.value.profile.addressSuite
        model.addressStreet = user.value.profile.addressStreet
        model.addressCity = user.value.profile.addressCity
        model.addressState = user.value.profile.addressState
        model.addressStateAbbr = user.value.profile.addressStateAbbr
        model.addressCountry = user.value.profile.addressCountry
        model.addressCountryCode = user.value.profile.addressCountryCode
        model.addressZipCode = user.value.profile.addressZipCode
        model.addressLatitude = user.value.profile.addressLatitude
        model.addressLongitude = user.value.profile.addressLongitude
      }
    }

    const onSubmit = async () => {
      dismissError()
      await this.$validator.validateAll()
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
      model.addressSuite = ''
      model.addressStreet = ''
      model.addressCity = ''
      model.addressState = ''
      model.addressStateAbbr = ''
      model.addressCountry = ''
      model.addressCountryCode = ''
      model.addressZipCode = ''
      model.addressLatitude = ''
      model.addressLongitude = ''
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
          addressSuite: data.addressSuite,
          addressStreet: data.addressStreet,
          addressCity: data.addressCity,
          addressState: data.addressState,
          addressStateAbbr: data.addressStateAbbr,
          addressCountry: data.addressCountry,
          addressCountryCode: data.addressCountryCode,
          addressZipCode: data.addressZipCode,
          addressLatitude: data.addressLatitude,
          addressLongitude: data.addressLongitude
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
      onClear,
      getRegex
    }
  }
}
</script>
