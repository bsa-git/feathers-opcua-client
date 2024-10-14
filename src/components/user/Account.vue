<template>
  <v-container fluid>
    <InputCodeDialog
      :dialog="inputCodeDialog"
      :title-dialog="$t('authManagement.titleVerifySignUp')"
      :label-input="$t('authManagement.verificationCode')"
      :hint-input="$t('authManagement.hintEnterSecurityCode')"
      :validate-type="'numeric'"
      :run-action="verifySignupShort"
      :show-error="showError"
      @onCloseInputDialog="inputCodeDialog = false"
      @onInput="setVerifyCode"
    ></InputCodeDialog>
    <ConfirmDialog
      :dialog="confirmDialog"
      :title-dialog="$t('profile.titleDialog')"
      :text-dialog="$t('profile.textDialog')"
      :run-action="remove"
      @onCloseDialog="confirmDialog = false"
    >
    </ConfirmDialog>
    <v-form @submit.prevent="onSubmit">
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="model.firstName"
            v-validate="'required|max:20'"
            :counter="15"
            :error-messages="errors.collect('firstName')"
            data-vv-name="firstName"
            :label="$t('signup.firstName')"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="model.lastName"
            v-validate="'required|max:20'"
            :counter="20"
            :error-messages="errors.collect('lastName')"
            data-vv-name="lastName"
            :label="$t('signup.lastName')"
          ></v-text-field>
        </v-col>
        <v-col cols="12" :sm="changeIdentity ? 6 : 12">
          <v-text-field
            v-model="model.email"
            v-validate="'required|email'"
            append-icon="mdi-email"
            :error-messages="errors.collect('email')"
            data-vv-name="email"
            :label="$t('login.email')"
            :disabled="isExternalAccount ? true : !changeIdentity"
            :hint="
              isExternalAccount
                ? $t('accounts.emailForExternalAccounts')
                : changeIdentity
                ? $t('profile.hintIdentity')
                : ''
            "
            persistent-hint
          ></v-text-field>
        </v-col>
        <v-col v-if="!isExternalAccount && changeIdentity" cols="12" sm="6">
          <v-text-field
            v-model="model.password"
            v-validate="'required|min:3'"
            append-icon="mdi-lock"
            :error-messages="errors.collect('password')"
            data-vv-name="password"
            :label="$t('login.password')"
            type="password"
            :disabled="!changeIdentity"
            :hint="changeIdentity ? $t('profile.hintPassword') : ''"
            persistent-hint
          ></v-text-field>
        </v-col>
        <v-col v-if="!isExternalAccount && changePassword" cols="12" sm="6">
          <v-text-field
            v-model="model.oldPassword"
            v-validate="'required|min:3'"
            append-icon="mdi-lock"
            :error-messages="errors.collect('oldPassword')"
            data-vv-name="oldPassword"
            :label="$t('profile.oldPassword')"
            type="password"
          ></v-text-field>
        </v-col>
        <v-col v-if="!isExternalAccount && changePassword" cols="12" sm="6">
          <v-text-field
            v-model="model.newPassword"
            v-validate="'required|min:3'"
            append-icon="mdi-lock"
            :error-messages="errors.collect('newPassword')"
            data-vv-name="newPassword"
            :label="$t('profile.newPassword')"
            type="password"
          ></v-text-field>
        </v-col>
        <v-col v-if="!isExternalAccount" cols="12" sm="6">
          <v-checkbox
            v-model="changeIdentity"
            :label="$t('profile.changeIdentity')"
            :disabled="changePassword"
          ></v-checkbox>
        </v-col>
        <v-col v-if="!isExternalAccount" cols="12" sm="6">
          <v-checkbox
            v-model="changePassword"
            :label="$t('profile.changePassword')"
            :disabled="changeIdentity"
          ></v-checkbox>
        </v-col>
      </v-row>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" type="submit" :loading="loadingSubmit">
          {{ $t('profile.save') }}
        </v-btn>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              :loading="loadingRemove"
              color="error"
              class="ml-3"
              v-on="on"
              @click="confirmDialog = true"
            >
              {{ $t('profile.remove') }}
            </v-btn>
          </template>
          <span>{{ $t('profile.removeAccount') }}</span>
        </v-tooltip>
      </v-card-actions>
    </v-form>
  </v-container>
</template>

<script>
/* eslint-disable no-unused-vars */
import { ref, reactive, computed, onBeforeMount } from '@vue/composition-api'
import Auth from '@/plugins/auth/auth-client.class'
import Avatar from '@/plugins/lib/avatar.class'
import ConfirmDialog from '@/components/dialogs/ConfirmDialog'
import InputCodeDialog from '@/components/dialogs/InputDialog'

// import createLogMessage from '~/plugins/service-helpers/create-log-message'

const debug = require('debug')('app:user-profile-account')
const isDebug = false

export default {
  $_veeValidate: {
    validator: 'new'
  },
  components: {
    ConfirmDialog,
    InputCodeDialog
  },
  setup(props, context) {
    const { $store, $validator, $vuetify, $i18n, $router } = context.root

    //-----------------------------------------------------
    // Reactive values
    let confirmDialog = ref(false)
    let inputCodeDialog = ref(false)
    let loadingSubmit = ref(false)
    let loadingRemove = ref(false)
    let changeIdentity = ref(false)
    let changePassword = ref(false)
    let verifyCode = ref('')

    const model = reactive({
      firstName: '',
      lastName: '',
      email: '',
      avatar: '',
      password: '',
      oldPassword: '',
      newPassword: '',
      error: undefined
    })

    // Computed state
    const user = computed(() => $store.state['auth']['user'])
    const idFieldUser = $store.state.users.idField
    const idUserValue = user.value[idFieldUser]
    if (isDebug && user) debug('user.id:', user.value[idFieldUser])

    // Computed getters
    const config = computed(() => $store.getters.getConfig)
    const isExternalAccount = computed(() => $store.getters.isExternalAccount)

    // Mutations
    const showSuccess = value => $store.commit('SHOW_SUCCESS', value)
    const showError = value => $store.commit('SHOW_ERROR', value)
    const showWarning = value => $store.commit('SHOW_WARNING', value)

    // Actions
    const logout = () => $store.dispatch('logout')

    //----------------------------------------------------------
    // Methods
    const initModel = () => {
      if (user.value) {
        model.avatar = user.value.avatar
        model.firstName = user.value.firstName
        model.lastName = user.value.lastName
        model.email = user.value.email
      }
    }

    const onSubmit = async () => {
      dismissError()
      await $validator.validateAll()
      if ($validator.errors.any()) {
        showError('Validation Error!')
      } else {
        if (isAnyChange()) {
          loadingSubmit.value = true
          if (isDebug) debug('onSubmit.formData:', model)
          const saveResponse = await save(model)
          if (saveResponse) {
            if (isDebug && saveResponse)
              debug('onSubmit.saveResponse:', saveResponse)
            if (!isChangeEmail()) {
              showSuccess(`${$i18n.t('profile.successSaveUser')}!`)
            }
            setTimeout(() => {
              loadingSubmit.value = false
            }, 1000)
          }
        }
      }
    }

    const save = async data => {
      let changeResult = null
      let userData = null
      const idFieldUser = $store.state.users.idField
      const { User } = context.root.$FeathersVuex.api
      try {
        if (isChangeUser()) {
          if (isDebug) debug('<<userChange>> Start userChange')
          userData = {
            [idFieldUser]: idUserValue,
            firstName: data.firstName,
            lastName: data.lastName
          }
          if (isDebug && userData) debug('save.userData:', userData)
          const service = new User(userData)
          changeResult = await service.save()
          if (isDebug) debug('userChange.OK')
        }
        if (isChangePassword()) {
          if (isDebug) debug('<<passwordChange>> Start passwordChange')
          changeResult = await Auth.passwordChange(
            data.oldPassword,
            data.newPassword,
            { email: user.value.email }
          )
          if (isDebug) debug('passwordChange.OK')
        }
        if (isChangeEmail()) {
          // Is auth manager
          if (config.value.isAuthManager) {
            if (isDebug) debug('<<identityChange>> Start identityChange')
            changeResult = await Auth.identityChange(
              data.password,
              { email: data.email },
              { email: user.value.email }
            )
            showWarning({
              text: $i18n.t('authManagement.resendVerification'),
              timeout: 10000
            })
            inputCodeDialog = true
            if (isDebug) debug('identityChange.OK')
          } else {
            // Get new avatar
            const avatar = new Avatar(this.model.email)
            // const avatarImage = await avatar.getImage()
            const avatarImage = await avatar.imageUrl()
            userData = {
              [idFieldUser]: user.value[idFieldUser],
              email: data.email,
              avatar: avatarImage
            }
            const user = new User(userData)
            changeResult = await user.save()
            if (isDebug) debug('emailChange.OK')
            showSuccess($i18n.t('authManagement.successfulUserVerification'))
          }
        }
        return changeResult
      } catch (error) {
        if (isDebug) debug('user.save.error:', error)
        loadingSubmit.value = false
        model.error = error
        showError(error.message)
        // Recover user data
        await User.get(user.value[idFieldUser])
        // this.saveLogMessage('ERROR-CLIENT', { error })
      }
    }

    const remove = async () => {
      try {
        loadingRemove.value = true
        const idFieldUser = $store.state.users.idField
        const { User } = context.root.$FeathersVuex.api
        const service = new User({
          [idFieldUser]: user.value[idFieldUser],
          active: false
        })
        await service.save()
        showSuccess(`${$i18n.t('profile.successRemoveUser')}!`)
        await logout()
        setTimeout(() => {
          $router.push($i18n.path(config.value.homePath))
        }, 1000)
      } catch (error) {
        if (isDebug) debug('user.remove.error:', error)
        loadingRemove.value = false
        model.error = error
        showError(error.message)
        // this.saveLogMessage('ERROR-CLIENT', { error })
      }
    }

    const isChangeUser = () => {
      return (
        model.firstName !== user.value.firstName ||
        model.lastName !== user.value.lastName
      )
    }

    const isChangeEmail = () => {
      const changeEmail = model.email !== user.value.email
      return changeIdentity.value ? changeEmail : false
    }

    const isChangePassword = () => {
      return changePassword.value ? !!model.oldPassword : false
    }

    const isAnyChange = () => {
      return isChangeUser() || isChangeEmail() || isChangePassword()
    }

    const dismissError = () => {
      model.error = undefined
    }

    const verifySignupShort = async () => {
      try {
        if (isDebug) debug('<<verifySignUpShort>> Start verifySignUpShort')
        const idFieldUser = $store.state.users.idField
        // Close input dialog
        inputCodeDialog.value = false
        if (isDebug) debug('verifySignUpShort.verifyCode:', verifyCode.value)
        const token = verifyCode.value
        const changeUser = await Auth.verifySignupShort(token, {
          email: user.value.email
        })
        if (changeUser) {
          if (isDebug) debug('verifySignupShort.user:', changeUser)
          if (isDebug) debug('verifySignUpShort.OK')
          showSuccess($i18n.t('authManagement.successfulUserVerification'))
          // Get new avatar
          const avatar = new Avatar(model.email)
          // const avatarImage = await avatar.getImage()
          const avatarImage = await avatar.imageUrl()
          let userData = {
            [idFieldUser]: user.value[idFieldUser],
            avatar: avatarImage
          }
          const { User } = context.root.$FeathersVuex.api
          const service = new User(userData)
          await service.save()
        } else {
          showError({
            text: $i18n.t('authManagement.errorUserVerification'),
            timeout: 10000
          })
          //            this.$redirect(this.config.homePath);
        }
      } catch (error) {
        if (isDebug) debug('verifySignupShort.error:', error)
        model.error = error
        if (error.message === 'User not found.') {
          showError({
            text: $i18n.t('authManagement.msgForErrorUserNotFind'),
            timeout: 10000
          })
        } else if (error.message.includes('Invalid token.')) {
          showError({
            text: $i18n.t('authManagement.msgForErrorInvalidToken'),
            timeout: 10000
          })
        } else {
          showError({ text: error.message, timeout: 10000 })
        }
        // this.saveLogMessage('ERROR-CLIENT', { error })
      }
    }
    const setVerifyCode = val => {
      verifyCode.value = val
    }

    // Init model
    initModel()

    return {
      // React values
      loadingSubmit,
      loadingRemove,
      confirmDialog,
      inputCodeDialog,
      isExternalAccount,
      changeIdentity,
      changePassword,
      model,
      // Computed state
      user,
      // Computed getters
      config,
      // Mutations
      showError,
      // Methods
      onSubmit,
      remove,
      verifySignupShort,
      setVerifyCode
    }
  }
}
</script>
