<template>
  <v-container fluid fill-height>
    <div id="user-pages" :style="`background-color: ${primaryColor}`"></div>
    <div class="main-content">
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card :dark="theme.dark">
            <!-- Form title -->
            <v-card-title>
              <v-icon class="mr-3">mdi-login</v-icon>
              <span class="headline">{{ $t('user_menu.login') }}</span>
              <v-spacer></v-spacer>
              <router-link :to="config.homePath" class="close-icon">
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
import Http from '@/plugins/lib/http.client.class'
import fakeData from '@/seeds/fake-data.json'

const isDebug = false

export default {
  name: 'Login',
  //------------
  $_veeValidate: {
    validator: 'new'
  },
  components: {},
  head() {
    return {
      title: this.title,
      meta: [
        { hid: 'description', name: 'description', content: this.description }
      ]
    }
  },

  setup(props, context) {
    const { $store, $validator, $vuetify, $i18n, $router } = context.root
    if (isDebug && context) console.log('Login.context:', $i18n)

    //-----------------------------------------------------
    // Reactive values
    const title = ref($i18n.t('login.title'))
    const description = ref($i18n.t('login.description'))
    let loadingSubmit = ref(false)
    let loadingLogout = ref(false)
    const model = reactive({
      email: '',
      password: '',
      avatar: '',
      error: undefined
    })

    // Computed state
    // const auth = computed(() => $store.state['auth'])
    const user = computed(() => $store.state['auth']['user'])

    // Computed getters
    const config = computed(() => $store.getters.getConfig)
    const theme = computed(() => $store.getters.getTheme)
    const primaryColor = computed(() => $store.getters.getPrimaryBaseColor)

    // Mutations
    // const clearError = () => $store.commit('auth.clearAuthenticateError')
    const showSuccess = value => $store.commit('SHOW_SUCCESS', value)
    const showError = value => $store.commit('SHOW_ERROR', value)
    // const showWarning = value => $store.commit('SHOW_WARNING', value)
    // const setSnackBar = value => $store.commit('SET_SNACK_BAR', value)

    // Actions
    const authenticate = payload => $store.dispatch('authenticate', payload)
    const logout = () => $store.dispatch('logout')

    //----------------------------------------------------------
    // Emit onStandAlone -> true
    context.emit('onStandAlone', true)

    // Lifecycle Hooks
    onBeforeMount(() => {
      if (user.value) {
        // Login form should be open for non-logged users
        logout()
      }
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
      const http = new Http()
      let userEmail = http.getParams('email')
      userEmail = userEmail ? Http.urlDecode(userEmail) : ''
      const fakeUser = fakeData.users[0]
      const fakeEmail = isDev ? fakeUser.email : ''
      const fakePassword = isDev
        ? fakeUser.email.slice(0, fakeUser.email.indexOf('@'))
        : ''
      model.email = userEmail ? userEmail : fakeEmail
      model.password = userEmail ? '' : fakePassword
    }

    const onSubmit = async () => {
      if (isDebug) console.log('<<--- Start onSubmit --->>')
      dismissError()
      await $validator.validateAll()
      if ($validator.errors.any()) {
        if (isDebug && model.email)
          console.log('onSubmit.Validator.errors:', model.email, model.password)
        showError({ text: $i18n.t('form.validationError'), timeout: 10000 })
      } else {
        loadingSubmit.value = true
        const loginResponse = await login(model.email, model.password)
        if (loginResponse && loginResponse.accessToken) {
          if (!model.avatar) {
            if(true && user.value.avatar) console.log('Login.onSubmit.avatar:', user.value.avatar)
            model.avatar = user.value.avatar
          }
          showSuccess(`${$i18n.t('login.success')}!`)
          setTimeout(() => {
            $router.push($i18n.path(config.value.homePath))
          }, 1000)
        }
      }
    }

    const login = async (email, password) => {
      try {
        if (isDebug && email)
          console.log('<<--- Login --->> Start authenticate:', email, password)
        const loginResponse = await authenticate({
          strategy: 'local',
          email,
          password
        })
        if (isDebug && loginResponse)
          console.log('authenticate.loginResponse:', loginResponse)
        return loginResponse
      } catch (error) {
        if (true && error) console.log('authenticate.error:', error.message)
        loadingSubmit.value = false
        model.error = error
        if (error.message === "User's email is not yet verified.") {
          showError({
            text: $i18n.t('authManagement.msgForErrorEmailNotYetVerified'),
            timeout: 10000
          })
        } else if (
          error.message ===
          "'user' record in the database is missing a 'password'"
        ) {
          showError({
            text: $i18n.t('login.errAuthenticatedMissingPassword'),
            timeout: 10000
          })
        } else {
          showError({ text: error.message, timeout: 10000 })
        }
        // this.saveLogMessage('ERROR-CLIENT', { error });
      }
    }
    const btnClick = async () => {
      if (user.value) {
        loadingLogout.value = true
        showSuccess(`${$i18n.t('login.successLogout')}!`)
        setTimeout(async () => {
          await logout()
          const homePath = config.value.homePath
          $router.push($i18n.path(homePath))
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
      title,
      description,
      loadingSubmit,
      loadingLogout,
      model,
      // Computed state
      // snackBar,
      // auth,
      user,
      // Computed getters
      config,
      theme,
      primaryColor,
      // Methods
      onSubmit,
      btnClick
    }
  }
}
</script>
