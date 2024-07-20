<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <!--=== Page Header ===-->
        <AppPageHeader
          :page-title="description"
          :img-name="imgName"
        ></AppPageHeader>
      </v-col>
      <v-col cols="8" class="">
        <v-sheet rounded="xl" class="pa-12" color="grey lighten-3">
          <!-- <v-sheet
            rounded="xl"
            class="mx-auto py-10"
            elevation="3"
            height="50%"
            width="80%"
          > -->
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
                <div v-if="!user">
                  <v-icon>mdi-security</v-icon>
                  <a href="#">{{ $t('authManagement.forgotYourPassword') }}</a>
                </div>
              </v-card-text>
              <!-- Form actions -->
              <v-card-actions>
                <v-btn href="/auth/google" icon :disabled="!!user">
                  <v-icon color="red">fab fa-google fa-lg</v-icon>
                </v-btn>
                <v-btn href="/auth/github" icon :disabled="!!user">
                  <v-icon color="light-blue">fab fa-github fa-lg</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  type="submit"
                  :loading="loadingSubmit"
                  :disabled="!!user"
                >
                  {{ $t('login.title') }}
                </v-btn>
                <v-btn :loading="loadingLogout">
                  {{ !!user ? $t('login.logout') : $t('login.clear') }}
                </v-btn>
                <v-btn @click.stop="updateStandAlone">
                  <span class="mr-2">StandAlone: {{ isStandAlone }}</span>
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
          <!-- </v-sheet> -->
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
/* eslint-disable no-unused-vars */
import { ref, provide, onUnmounted } from '@vue/composition-api'
import { mapState, mapGetters } from 'vuex'
import AppPageHeader from '@/components/app/layout/AppPageHeader.vue'

export default {
  name: 'Login',
  //------------
  $_veeValidate: {
    validator: 'new'
  },
  components: {
    AppPageHeader
  },
  data() {
    return {
      imgName: 'feathers-logo-wide.png',
      title: this.$t('login.title'),
      description: this.$t('login.description'),
      saveLogMessage: null,
      loadingSubmit: false,
      loadingLogout: false,
      confirmDialog: false,
      inputCodeDialog: false,
      inputEmailDialog: false,
      verifyCode: '',
      error: undefined,
      model: {
        email: '',
        password: '',
        avatar: ''
      }
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
      theme: 'getTheme'
    }),
    ...mapState('auth', ['user'])
  },
  setup(props, context) {
    let isStandAlone = ref(true)
    provide('isStandAlone', isStandAlone)
    // isStandAlone = true
    context.emit('onStandAlone', isStandAlone)

    console.log('Login.isStandAlone:', isStandAlone)

    onUnmounted(() => {
      context.emit('onStandAlone', false)
    })

    return {
      isStandAlone
    }
  },
  methods: {
    updateStandAlone() {
      this.isStandAlone = !this.isStandAlone
      this.$emit('onStandAlone', this.isStandAlone)
    }
  }
}
</script>
