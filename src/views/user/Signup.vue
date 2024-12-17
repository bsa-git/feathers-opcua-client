<template>
  <v-container fluid fill-height>
    <div id="half-page" :style="`background-color: ${primaryColor}`"></div>
    <div class="main-content">
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card :dark="theme.dark">
            <!-- Form title -->
            <v-card-title>
              <v-icon class="mr-3">mdi-account-plus</v-icon>
              <span class="headline">{{ $t('user_menu.signup') }}</span>
              <v-spacer></v-spacer>
              <router-link :to="$i18n.path(homePath)" class="close-icon">
                <v-icon>mdi-close</v-icon>
              </router-link>
            </v-card-title>
            <!-- Form content -->
            <v-form @submit.prevent="onSubmit">
              <v-card-text>
                <div class="text-center">
                  <v-avatar v-if="user" size="120"
                    ><img :src="model.avatar"
                  /></v-avatar>
                  <v-icon v-else size="120">mdi-account-plus</v-icon>
                </div>
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
                  <v-col cols="12">
                    <v-text-field
                      v-model="model.email"
                      v-validate="'required|email'"
                      append-icon="mdi-email"
                      :error-messages="errors.collect('email')"
                      data-vv-name="email"
                      :label="$t('login.email')"
                      :hint="$t('authManagement.hintSingUpEmail')"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      ref="confirmation"
                      v-model="model.password"
                      v-validate="'required|min:3'"
                      append-icon="mdi-lock"
                      :error-messages="errors.collect('password')"
                      data-vv-name="password"
                      :label="$t('login.password')"
                      type="password"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="model.passwordConfirmation"
                      v-validate="'required|confirmed:confirmation'"
                      append-icon="mdi-lock"
                      :error-messages="errors.collect('passwordConfirmation')"
                      data-vv-name="passwordConfirmation"
                      :label="$t('signup.passwordConfirmation')"
                      type="password"
                    ></v-text-field>
                  </v-col>
                </v-row>
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
                  {{ $t('signup.title') }}
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
import Avatar from '@/plugins/lib/avatar.class'
import {
  ref,
  reactive,
  computed,
  onBeforeMount,
  onUnmounted
} from '@vue/composition-api'

const debug = require('debug')('app:page.user-signup')
const isDebug = false

export default {
  $_veeValidate: {
    validator: 'new'
  },
  components: {},
  metaInfo() {
    return {
      title: this.$t('signup.title'),
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content: this.$t('signup.description')
        }
      ]
    }
  },
  setup(props, context) {
    const { $store, $validator, $vuetify, $i18n, $router } = context.root
    const { User } = context.root.$FeathersVuex.api

    if (isDebug && context) debug('setup.context.$i18n:', $i18n)
    if (isDebug && context) debug('setup.context.User:', User)

    //-----------------------------------------------------
    // Reactive values
    let loadingSubmit = ref(false)
    let loadingLogout = ref(false)
    const model = reactive({
      firstName: '',
      lastName: '',
      email: '',
      active: true,
      avatar: '',
      password: '',
      passwordConfirmation: '',
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
      if (user.value) {
        model.avatar = user.value.avatar
        model.firstName = user.value.firstName
        model.lastName = user.value.lastName
        model.email = user.value.email
        model.active = user.value.active
      }
    }

    const onSubmit = async () => {
      if (isDebug) debug('<<onSubmit>> Start onSubmit')
      dismissError()
      await $validator.validateAll()
      if ($validator.errors.any()) {
        showError({ text: 'Validation Error!', timeout: 10000 })
      } else {
        loadingSubmit.value = true
        const signupResponse = await save(model)
        if (signupResponse) {
          if (isDebug) debug('signupResponse:', signupResponse)
          const loginResponse = await login(model.email, model.password)
          if (loginResponse && loginResponse.accessToken) {
            if (isDebug) debug('loginResponse:', loginResponse)
            setTimeout(() => {
              showSuccess(`${$i18n.t('signup.successSignUpAndLogin')}!`)
              $router.push($i18n.path(homePath))
            }, 1000)
          }
        }
      }
    }
    const save = async data => {
      try {
        if (isDebug) debug('<<save>> Start save')
        if (!data.avatar) {
          const avatar = new Avatar(data.email)
          // data.avatar = await avatar.getImage()
          data.avatar = await avatar.imageUrl()
        }
        const user = new User({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          active: data.active,
          avatar: data.avatar,
          password: data.password
        })
        return await user.save()
      } catch (error) {
        if (isDebug) debug('user.save.error:', error)
        loadingSubmit.value = false
        model.error = error
        showError({ text: error.message, timeout: 10000 })
      }
    }

    const login = async (email, password) => {
      try {
        if (isDebug) debug('<<login>> Start login')
        return await authenticate({ strategy: 'local', email, password })
      } catch (error) {
        if (isDebug) debug('authenticate.error:', error)
        loadingSubmit.value = false
        model.error = error
        showError({ text: error.message, timeout: 10000 })
      }
    }

    const btnClick = () => {
      if (user.value) {
        loadingLogout.value = true
        showSuccess(`${$i18n.t('login.successLogout')}!`)
        setTimeout(() => {
          logout()
          $router.push($i18n.path(homePath))
        }, 1000)
      } else {
        onClear()
      }
    }

    const onClear = () => {
      model.firstName = ''
      model.lastName = ''
      model.email = ''
      model.password = ''
      model.passwordConfirmation = ''
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
      homePath,
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
