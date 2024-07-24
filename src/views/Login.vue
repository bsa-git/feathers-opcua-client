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
                  <v-avatar v-if="user && model.avatar" size="120"><img :src="model.avatar" /></v-avatar>
                  <v-icon v-else size="120">fas fa-user-slash</v-icon>
                </div>
                <v-text-field v-model="model.email" v-validate="'required|email'" append-icon="mdi-email"
                  :error-messages="errors.collect('email')" data-vv-name="email" :label="$t('login.email')"
                  :hint="$t('authManagement.hintLoginEmail')" persistent-hint></v-text-field>
                <v-text-field v-model="model.password" v-validate="'required|min:3'" append-icon="mdi-lock"
                  :error-messages="errors.collect('password')" data-vv-name="password" :label="$t('login.password')"
                  type="password"></v-text-field>
              </v-card-text>
              <!-- Form actions -->
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" type="submit">
                  {{ $t('login.title') }}
                </v-btn>
                <v-btn @click="onClear" color="primary"> {{ $t('login.clear') }} </v-btn>
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
import { ref, reactive, onUnmounted } from '@vue/composition-api'
import { mapState, mapGetters } from 'vuex'

const isDebug = false

export default {
  name: 'Login',
  //------------
  $_veeValidate: {
    validator: 'new'
  },
  data() {
    return {
      imgName: 'feathers-logo-wide.png',
      title: this.$t('login.title'),
      description: this.$t('login.description'),
      loadingSubmit: false,
      loadingLogout: false,
    }
  },
  head() {
    return {
      title: this.title,
      meta: [
        { hid: 'description', name: 'description', content: this.description }
      ]
    }
  },
  computed: {
    ...mapGetters({
      config: 'getConfig',
      theme: 'getTheme',
      primaryColor: 'getPrimaryBaseColor'
    }),
    ...mapState('auth', ['user'])
  },
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


    // Reactive values
    const error = ref(undefined)
    const model = reactive({
      email: '',
      password: '',
      avatar: ''
    })

    // Methods
    const onSubmit = async () => {
      if (isDebug) debug('<<--- Start onSubmit --->>');
      dismissError();
      await $validator.validateAll();
      if ($validator.errors.any()) {
        if (isDebug && model.email) debug('onSubmit.Validator.errors:', model.email, model.password);
        // this.showError({ text: this.$t('form.validationError'), timeout: 10000 });
      } else {
        this.loadingSubmit = true;
        const loginResponse = await this.login(this.model.email, this.model.password);
        if (loginResponse && loginResponse.accessToken) {
          if (!model.avatar) {
            model.avatar = this.user.avatar;
          }
          // this.showSuccess(`${this.$t('login.success')}!`);
          // setTimeout(() => {
          //   this.$router.push(this.$i18n.path(this.config.homePath));
          // }, 1000);
        }
      }
    }
    const onClear = () => {
      model.password = ''
      model.email = ''
      $validator.reset()
      dismissError()
    }
    const dismissError = () => {
      error.value = undefined
    }

    return {
      error,
      model,
      onClear
    }
  },
  methods: {}
}
</script>
