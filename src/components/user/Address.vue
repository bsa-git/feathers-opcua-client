<template>
  <v-container fluid>
    <v-form @submit.prevent="onSubmit">
      <!--<v-container grid-list-md>-->
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field :counter="15" v-validate="'max:15'" :error-messages="errors.collect('addressSuite')"
            data-vv-name="addressSuite" v-model="model.addressSuite" :label="$t('profile.addressSuite')"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field :counter="25" v-validate="'max:25'" :error-messages="errors.collect('addressStreet')"
            data-vv-name="addressStreet" v-model="model.addressStreet"
            :label="$t('profile.addressStreet')"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field :counter="25" v-validate="'max:25'" :error-messages="errors.collect('addressCity')"
            data-vv-name="addressCity" v-model="model.addressCity" :label="$t('profile.addressCity')"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field :counter="15" v-validate="{ regex: $util.getRegex('zip_code') }"
            :error-messages="errors.collect('addressZipCode')" data-vv-name="addressZipCode"
            v-model="model.addressZipCode" :label="$t('profile.addressZipCode')"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field :counter="15" v-validate="'max:15'" :error-messages="errors.collect('addressState')"
            data-vv-name="addressState" v-model="model.addressState" :label="$t('profile.addressState')"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field :counter="5" v-validate="'max:5'" :error-messages="errors.collect('addressStateAbbr')"
            data-vv-name="addressStateAbbr" v-model="model.addressStateAbbr"
            :label="$t('profile.addressStateAbbr')"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field :counter="25" v-validate="'max:25'" :error-messages="errors.collect('addressCountry')"
            data-vv-name="addressCountry" v-model="model.addressCountry"
            :label="$t('profile.addressCountry')"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field :counter="5" v-validate="'max:5'" :error-messages="errors.collect('addressCountryCode')"
            data-vv-name="addressCountryCode" v-model="model.addressCountryCode"
            :label="$t('profile.addressCountryCode')"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field :counter="10" v-validate="{ regex: $util.getRegex('lat') }"
            :error-messages="errors.collect('addressLatitude')" data-vv-name="addressLatitude"
            v-model="model.addressLatitude" :label="$t('profile.addressLatitude')"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field :counter="10" v-validate="{ regex: $util.getRegex('long') }"
            :error-messages="errors.collect('addressLongitude')" data-vv-name="addressLongitude"
            v-model="model.addressLongitude" :label="$t('profile.addressLongitude')"></v-text-field>
        </v-col>
      </v-row>
      <!--</v-container>-->
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" type="submit" :loading="loadingSubmit">
          {{ $t('profile.save') }}
        </v-btn>
        <v-btn @click="onClear" class="ml-3">
          {{ $t('login.clear') }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-container>
</template>

<script>
/* eslint-disable no-unused-vars */
import {
  ref,
  reactive,
  computed,
  onBeforeMount,
} from '@vue/composition-api'

const debug = require('debug')('app:user-profile-address');
const isDebug = false;

export default {
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
        model.addressSuite = user.value.profile.addressSuite;
        model.addressStreet = user.value.profile.addressStreet;
        model.addressCity = user.value.profile.addressCity;
        model.addressState = user.value.profile.addressState;
        model.addressStateAbbr = user.value.profile.addressStateAbbr;
        model.addressCountry = user.value.profile.addressCountry;
        model.addressCountryCode = user.value.profile.addressCountryCode;
        model.addressZipCode = user.value.profile.addressZipCode;
        model.addressLatitude = user.value.profile.addressLatitude;
        model.addressLongitude = user.value.profile.addressLongitude;
      }
    }

    const onSubmit = async () => {
      dismissError();
      await this.$validator.validateAll();
      if ($validator.errors.any()) {
        showError('Validation Error!');
      } else {
        loadingSubmit.value = true;
        if (isDebug) debug('onSubmit.formData:', model);
        const profileResponse = await save(model);
        if (profileResponse) {
          if (isDebug) debug('onSubmit.profileResponse:', profileResponse);
          showSuccess(`${$i18n.t('profile.successSaveUser')}!`);
          setTimeout(() => {
            loadingSubmit.value = false;
          }, 1000);
        }
      }
    }
    const onClear = () => {
      model.addressSuite = '';
      model.addressStreet = '';
      model.addressCity = '';
      model.addressState = '';
      model.addressStateAbbr = '';
      model.addressCountry = '';
      model.addressCountryCode = '';
      model.addressZipCode = '';
      model.addressLatitude = '';
      model.addressLongitude = '';
      $validator.reset();
      dismissError();
    }
    const dismissError = () => {
      model.error = undefined;
    }

    const save = async (data) => {
      const idFieldUserProfile = $store.state['user-profiles'].idField;
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
          addressLongitude: data.addressLongitude,
        };
        const userProfile = new UserProfile(profileData);
        return await userProfile.save();
      } catch (error) {
        if (isDebug) debug('userProfile.save.error:', error);
        loadingSubmit.value = false;
        model.error = error;
        showError(error.message);
        // Recover user profile data
        await UserProfile.get(user.value.profile.id);
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
  },
};
</script>
