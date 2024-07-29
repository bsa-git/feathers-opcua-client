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
                <v-btn color="primary" type="submit">
                  {{ $t('login.title') }}
                </v-btn>
                <v-btn color="primary" @click="onClear">
                  {{ $t('login.clear') }}
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <!-- Snackbar -->
    <SnackBar
      :show="snackBar.show"
      :text="snackBar.text"
      :color="snackBar.color"
      :timeout="snackBar.timeout"
      @onShow="modelSnackBar"
    />
  </v-container>
</template>

<script>
/* eslint-disable no-unused-vars */
import { ref, reactive, computed, onUnmounted } from '@vue/composition-api'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

import SnackBar from '@/components/layout/Snackbar'

const debug = require('debug')('app:user.login')

const isDebug = false

export default {
  name: 'Login',
  //------------
  $_veeValidate: {
    validator: 'new'
  },
  components: {
    SnackBar
  },
  // data() {
  //   return {
  //     title: this.$t('login.title'),
  //     description: this.$t('login.description'),
  //     loadingSubmit: false,
  //     loadingLogout: false,
  //   }
  // },
  head() {
    return {
      title: this.title,
      meta: [
        { hid: 'description', name: 'description', content: this.description }
      ]
    }
  },
  // computed: {
  //   ...mapGetters({
  //     config: 'getConfig',
  //     theme: 'getTheme',
  //     primaryColor: 'getPrimaryBaseColor'
  //   }),
  //   ...mapState('auth', ['user'])
  // },
  setup(props, context) {
    const { $store, $validator, $vuetify, $i18n } = context.root
    console.log('Login.context:', context)

    // Emit onStandAlone -> true
    context.emit('onStandAlone', true)

    // Lifecycle Hooks
    onUnmounted(() => {
      // Emit onStandAlone -> false
      context.emit('onStandAlone', false)
    })

    //-----------------------------------------------------
    // Reactive values
    const title = ref($i18n.t('login.title'))
    const description = ref($i18n.t('login.description'))
    // const loadingSubmit = ref(false)
    // const loadingLogout = ref(false)
    // const error = ref(undefined)
    const model = reactive({
      email: '',
      password: '',
      avatar: ''
    })

    // Computed state
    const auth = computed(() => $store.state['auth'])
    const user = computed(() => $store.state['auth']['user'])

    // Computed getters
    const config = computed(() => $store.getters.getConfig)
    const theme = computed(() => $store.getters.getTheme)
    const primaryColor = computed(() => $store.getters.getPrimaryBaseColor)
    const snackBar = computed(() => $store.getters.getSnackBar)
    // snackBar: 'getSnackBar'

    // Mutations
    // const clearError = () => $store.commit('auth.clearAuthenticateError')
    const showSuccess = value => $store.commit('SHOW_SUCCESS', value)
    const showError = value => $store.commit('SHOW_ERROR', value)
    const showWarning = value => $store.commit('SHOW_WARNING', value)
    const setSnackBar = value => $store.commit('SET_SNACK_BAR', value)

    // Actions
    const authenticate = payload => $store.dispatch('authenticate', payload)
    const logout = () => $store.dispatch('logout')

    //----------------------------------------------------------
    // Methods
    const modelSnackBar = newValue => {
      setSnackBar(newValue)
    }
    const onSubmit = async () => {
      if (isDebug) debug('<<--- Start onSubmit --->>')
      // dismissError()
      await $validator.validateAll()
      if ($validator.errors.any()) {
        if (isDebug && model.email)
          debug('onSubmit.Validator.errors:', model.email, model.password)
        showError({ text: $i18n.t('form.validationError'), timeout: 10000 })
      } else {
        // loadingSubmit = true;
        const loginResponse = await login(model.email, model.password)
        if (loginResponse && loginResponse.accessToken) {
          if (!model.avatar) {
            model.avatar = user.value.avatar
          }
          showSuccess(`${$i18n.t('login.success')}!`)
          // setTimeout(() => {
          //   this.$router.push(this.$i18n.path(this.config.homePath));
          // }, 1000);
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
        if (true && loginResponse)
          debug('authenticate.loginResponse:', loginResponse)
        return loginResponse
      } catch (error) {
        if (true && error) debug('authenticate.error:', error.message)
        // this.loadingSubmit = false;
        // this.error = error;
        if (error.message === "User's email is not yet verified.") {
          showError({
            text: $i18n.t('authManagement.msgForErrorEmailNotYetVerified'),
            timeout: 10000
          })
          // Open resendVerifySignup confirm dialog
          this.confirmDialog = true
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
    const onClear = () => {
      model.password = ''
      model.email = ''
      $validator.reset()
      // dismissError()
    }
    // const dismissError = () => {
    //   error.value = undefined
    // }

    return {
      // React values
      title,
      description,
      // loadingSubmit,
      // loadingLogout,
      // error,
      model,
      // Computed state
      snackBar,
      // auth,
      user,
      // Computed getters
      config,
      theme,
      primaryColor,
      // Methods
      modelSnackBar,
      onSubmit,
      onClear
    }
  }
  // methods: {
  //   ...mapMutations('auth', {
  //     clearError: 'clearAuthenticateError'
  //   }),
  //   ...mapMutations({
  //     // showSuccess: 'SHOW_SUCCESS',
  //     // showError: 'SHOW_ERROR',
  //     // showWarning: 'SHOW_WARNING'
  //   }),
  //   ...mapActions(['authenticate', 'logout'])
  // }
}
</script>
