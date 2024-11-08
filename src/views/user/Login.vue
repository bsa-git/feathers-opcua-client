<template>
  <v-container fluid fill-height>
    <div id="half-page" :style="`background-color: ${primaryColor}`"></div>
    <div class="main-content">
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card :dark="theme.dark">
            <!-- Form title -->
            <v-card-title>
              <v-icon class="mr-3">mdi-login</v-icon>
              <span class="headline">{{ $t('user_menu.login') }}</span>
              <v-spacer></v-spacer>
              <router-link :to="homePath" class="close-icon">
                <v-icon>mdi-close</v-icon>
              </router-link>
            </v-card-title>
            <!-- Form content -->
            <v-form @submit.prevent="onSubmit">
              <v-card-text>
                <div class="text-center">
                  <v-avatar v-if="user && model.avatar" size="120"
                    ><img :src="model.avatar"
                  /></v-avatar>
                  <v-icon v-else size="120">fas fa-user-slash</v-icon>
                </div>
                <v-text-field
                  v-model="model.email"
                  v-validate="'required|email'"
                  append-icon="mdi-email"
                  :error-messages="errors.collect('email')"
                  data-vv-name="email"
                  :label="$t('login.email')"
                  :hint="$t('authManagement.hintLoginEmail')"
                  persistent-hint
                ></v-text-field>
                <v-text-field
                  v-model="model.password"
                  v-validate="'required|min:3'"
                  append-icon="mdi-lock"
                  :error-messages="errors.collect('password')"
                  data-vv-name="password"
                  :label="$t('login.password')"
                  type="password"
                ></v-text-field>
              </v-card-text>
              <!-- Form actions -->
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  type="submit"
                  :loading="loadingSubmit"
                  :disabled="!!user"
                >
                  {{ $t('login.title') }}
                </v-btn>
                <v-btn :loading="loadingLogout" @click="btnClick">
                  {{ !!user ? $t('login.logout') : $t('login.clear') }}
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
/* eslint-disable no-unused-vars */
import {
  ref,
  reactive,
  computed,
  onBeforeMount,
  onUnmounted
} from '@vue/composition-api'
import fakeData from '@/seeds/fake-data.json'

// import { AbilityBuilder, Ability } from '@casl/ability'

const debug = require('debug')('app:Login')
const isDebug = false

export default {
  name: 'Login',
  //------------
  $_veeValidate: {
    validator: 'new'
  },
  components: {},
  metaInfo() {
    return {
      title: this.$t('login.title'),
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content: this.$t('login.title')
        }
      ]
    }
  },

  setup(props, context) {
    const { $store, $validator, $vuetify, $i18n, $router } = context.root
    if (isDebug && context) debug('setup.context.$i18n:', $i18n)

    //-----------------------------------------------------
    // Reactive values
    let loadingSubmit = ref(false)
    let loadingLogout = ref(false)
    const model = reactive({
      email: '',
      password: '',
      avatar: '',
      error: undefined
    })

    // Computed state
    const user = computed(() => $store.state['auth']['user'])

    // Computed getters
    const config = computed(() => $store.getters.getConfig)
    const homePath = computed(() => (user.value ? config.value.homePath : '/'))
    const theme = computed(() => $store.getters.getTheme)
    const primaryColor = computed(() => $store.getters.getPrimaryBaseColor)

    // Mutations
    const showSuccess = value => $store.commit('SHOW_SUCCESS', value)
    const showError = value => $store.commit('SHOW_ERROR', value)

    // Actions
    const authenticate = payload => $store.dispatch('authenticate', payload)
    const logout = () => $store.dispatch('logout')

    //----------------------------------------------------------
    // Emit onStandAlone -> true
    context.emit('onStandAlone', true)

    // Lifecycle Hooks
    onBeforeMount(() => {
      initModel()
    })
    onUnmounted(() => {
      // Emit onStandAlone -> false
      context.emit('onStandAlone', false)
    })

    //----------------------------------------------------------
    // Methods
    const initModel = () => {
      const isDev = config.value.nodeEnv === 'development'
      if (isDev) {
        if (user.value) {
          model.avatar = user.value.avatar
          model.email = user.value.email
          model.password = ''
        } else {
          const fakeUser = fakeData.users[0]
          model.email = fakeUser.email
          model.password = fakeUser.email.slice(0, fakeUser.email.indexOf('@'))
        }
      }
    }

    const onSubmit = async () => {
      if (isDebug) debug('<<--- Start onSubmit --->>')
      dismissError()
      await $validator.validateAll()
      if ($validator.errors.any()) {
        if (isDebug && model.email)
          debug('onSubmit.Validator.errors:', model.email, model.password)
        showError({ text: $i18n.t('form.validationError'), timeout: 10000 })
      } else {
        loadingSubmit.value = true
        const loginResponse = await login(model.email, model.password)
        if (loginResponse && loginResponse.accessToken) {
          showSuccess(`${$i18n.t('login.success')}!`)
          if (!model.avatar) {
            if (isDebug && user.value.avatar)
              debug('Login.onSubmit.avatar:', user.value.avatar)
            model.avatar = user.value.avatar
          }
          setTimeout(() => {
            loadingSubmit.value = false
            $router.push($i18n.path(homePath.value))
          }, 1000)
        }
      }
    }

    const login = async (email, password) => {
      try {
        if (isDebug && email)
          debug('<<--- Login --->> Start authenticate:', email, password)
        const loginResponse = await authenticate({
          strategy: 'local',
          email,
          password
        })
        if (isDebug && loginResponse)
          debug('authenticate.loginResponse:', loginResponse)
        return loginResponse
      } catch (error) {
        if (isDebug && error) debug('authenticate.error:', error.message)
        loadingSubmit.value = false
        model.error = error
        const timeout = 10000
        if (error.message === "User's email is not yet verified.") {
          showError({
            text: $i18n.t('authManagement.msgForErrorEmailNotYetVerified'),
            timeout
          })
        } else if (
          error.message ===
          "'user' record in the database is missing a 'password'"
        ) {
          showError({
            text: $i18n.t('login.errAuthenticatedMissingPassword'),
            timeout
          })
        } else {
          showError({ text: error.message, timeout })
        }
      }
    }
    const btnClick = async () => {
      if (user.value) {
        loadingLogout.value = true
        await logout()
        showSuccess(`${$i18n.t('login.successLogout')}!`)
        setTimeout(async () => {
          loadingLogout.value = false
          $router.push($i18n.path(homePath.value))
        }, 1000)
      } else {
        onClear()
      }
    }
    const onClear = () => {
      model.password = ''
      model.email = ''
      $validator.reset()
      dismissError()
    }
    const dismissError = () => {
      model.error = undefined
    }

    return {
      // React values
      loadingSubmit,
      loadingLogout,
      model,
      // Computed state
      user,
      // Computed getters
      config,
      homePath,
      theme,
      primaryColor,
      // Methods
      onSubmit,
      btnClick
    }
  }
}
</script>
