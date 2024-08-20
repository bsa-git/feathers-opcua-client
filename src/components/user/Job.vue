<template>
  <v-container fluid>
    <v-form @submit.prevent="onSubmit">
      <!--<v-container grid-list-md>-->
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field :counter="20" v-validate="'max:20'" :error-messages="errors.collect('jobCompanyName')"
            data-vv-name="jobCompanyName" v-model="model.jobCompanyName"
            :label="$t('profile.jobCompanyName')"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field :counter="35" v-validate="'max:35'" :error-messages="errors.collect('jobTitle')"
            data-vv-name="jobTitle" v-model="model.jobTitle" :label="$t('profile.jobTitle')"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field :counter="15" v-validate="'max:15'" :error-messages="errors.collect('jobType')"
            data-vv-name="jobType" v-model="model.jobType" :label="$t('profile.jobType')"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field :counter="15" v-validate="{ regex: $util.getRegex('phone') }"
            :error-messages="errors.collect('jobPhone')" data-vv-name="jobPhone" v-model="model.jobPhone"
            :label="$t('profile.jobPhone')"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field v-validate="'email'" :error-messages="errors.collect('jobEmail')" data-vv-name="jobEmail"
            v-model="model.jobEmail" :label="$t('profile.jobEmail')"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field v-validate="'url'" :error-messages="errors.collect('jobWebSite')" data-vv-name="jobWebSite"
            v-model="model.jobWebSite" :label="$t('profile.jobWebSite')"></v-text-field>
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

const debug = require('debug')('app:comp.user-profile-address');
const isDebug = false;

export default {
  layout: 'user',
  $_veeValidate: {
    validator: 'new'
  },
  setup(props, context) {
    const { $store, $validator, $vuetify, $i18n, $router } = context.root

    if (isDebug && context) debug('setup.context.$i18n:', $i18n)
    if (isDebug && context) debug('setup.context.User:', User)

    //-----------------------------------------------------
    // Reactive values
    let loadingSubmit = ref(false)
    const model = reactive({
      jobCompanyName: '',
      jobTitle: '',
      jobType: '',
      jobPhone: '',
      jobWebSite: '',
      jobEmail: '',
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
        model.jobCompanyName = user.value.profile.jobCompanyName;
        model.jobTitle = user.value.profile.jobTitle;
        model.jobType = user.value.profile.jobType;
        model.jobPhone = user.value.profile.jobPhone;
        model.jobWebSite = user.value.profile.jobWebSite;
        model.jobEmail = user.value.profile.jobEmail;
      }
    }
    const onSubmit = async () => {
      dismissError();
      await $validator.validateAll();
      if ($validator.errors.any()) {
        showError('Validation Error!');
      } else {
        loadingSubmit.value = true;
        if (isDebug) debug('onSubmit.formData:', this.model);
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
      model.jobCompanyName = '';
      model.jobTitle = '';
      model.jobType = '';
      model.jobPhone = '';
      model.jobWebSite = '';
      model.jobEmail = '';
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
          jobCompanyName: data.jobCompanyName,
          jobTitle: data.jobTitle,
          jobType: data.jobType,
          jobPhone: data.jobPhone,
          jobWebSite: data.jobWebSite,
          jobEmail: data.jobEmail,
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
