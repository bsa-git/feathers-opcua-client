<template>
  <v-container fluid fill-height>
    <div id="half-page" :style="`background-color: ${primaryColor}`"></div>
    <div class="main-content">
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card :dark="theme.dark">
            <!-- Form title -->
            <v-card-title>
              <v-icon class="mr-3">mdi-account-circle</v-icon>
              <span class="headline">{{ currentTitle(step) }}</span>
              <v-spacer></v-spacer>
              <v-btn icon @click="close">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on">mdi-close</v-icon>
                  </template>
                  <span>{{ $t('management.close') }}</span>
                </v-tooltip>
              </v-btn>
            </v-card-title>
            <!-- User avatar -->
            <v-card-title>
              <div class="layout column align-center">
                <v-avatar size="120"><img :src="model.avatar"/></v-avatar>
              </div>
            </v-card-title>
            <v-window v-model="step">
              <!-- Account Form -->
              <v-window-item :value="0">
                <v-card-text>
                  <AccountForm></AccountForm>
                </v-card-text>
              </v-window-item>
              <!-- Personal Form -->
              <v-window-item :value="1">
                <v-card-text>
                  <PersonalForm></PersonalForm>
                </v-card-text>
              </v-window-item>
              <!-- Address Form -->
              <v-window-item :value="2">
                <v-card-text>
                  <AddressForm></AddressForm>
                </v-card-text>
              </v-window-item>
              <!-- Job Form -->
              <v-window-item :value="3">
                <v-card-text>
                  <JobForm></JobForm>
                </v-card-text>
              </v-window-item>
            </v-window>

            <v-divider></v-divider>

            <v-card-actions class="justify-space-between">
              <v-btn :disabled="step === 0" depressed icon @click="prev">
                <v-icon large>mdi-menu-left</v-icon>
              </v-btn>

              <!--<v-spacer></v-spacer>-->
              <v-item-group v-model="step" class="text-xs-center" mandatory>
                <v-item v-for="n in steps" :key="`btn-${n}`">
                  <v-btn
                    slot-scope="{ active, toggle }"
                    :input-value="active"
                    icon
                    @click="toggle"
                  >
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon v-on="on">mdi-panorama-fisheye</v-icon>
                      </template>
                      <span>{{ currentTitle(n - 1) }}</span>
                    </v-tooltip>
                  </v-btn>
                </v-item>
              </v-item-group>

              <v-btn
                :disabled="step === steps - 1"
                depressed
                icon
                @click="next"
              >
                <v-icon large>mdi-menu-right</v-icon>
              </v-btn>
            </v-card-actions>
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
import AccountForm from '@/components/user/Account'
import PersonalForm from '@/components/user/Personal'
import AddressForm from '@/components/user/Address'
import JobForm from '@/components/user/Job'

const debug = require('debug')('app:user-profile')
const isDebug = false

export default {
  components: {
    AccountForm,
    PersonalForm,
    AddressForm,
    JobForm
  },
  data() {
    return {
      step: 0,
      steps: 4,
      model: {
        avatar: ''
      }
    }
  },
  metaInfo() {
    return {
      title: this.$t('profile.title'),
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content: this.$t('profile.description')
        }
      ]
    }
  },
  setup(props, context) {
    const { $store, $i18n, $router, $redirect } = context.root

    if (true && context) debug('setup.context.$redirect:', $redirect)
    //-----------------------------------------------------
    // Reactive values
    let step = ref(0)
    let steps = ref(4)
    const model = reactive({
      avatar: ''
    })

    // Computed state
    const user = computed(() => $store.state['auth']['user'])

    // Computed getters
    const config = computed(() => $store.getters.getConfig)
    const theme = computed(() => $store.getters.getTheme)
    const primaryColor = computed(() => $store.getters.getPrimaryBaseColor)

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
      }
    }
    const next = () => {
      step = step + 1
    }
    const prev = () => {
      step = step - 1
    }
    const close = () => {
      const path = $i18n.path(config.value.homePath)
      $redirect(path)
    }
    const currentTitle = step => {
      switch (step) {
        case 0:
          return $i18n.t('profile.userAccount')
        case 1:
          return $i18n.t('profile.userPersonalData')
        case 2:
          return $i18n.t('profile.userAddress')
        case 3:
          return $i18n.t('profile.userJob')
        default:
          return 'Account created'
      }
    }

    return {
      // React values
      step,
      steps,
      model,
      // Computed state
      user,
      // Computed getters
      config,
      theme,
      primaryColor,
      // Methods
      next,
      prev,
      close,
      currentTitle
    }
  }
}
</script>
