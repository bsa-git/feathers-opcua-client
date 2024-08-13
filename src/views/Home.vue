<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <!--=== Page Header ===-->
        <PageHeader :page-title="description" :img-name="imgName"></PageHeader>
      </v-col>

      <v-col cols="12">
        <v-sheet rounded="xl" class="pa-12" color="grey lighten-3">
          <v-sheet
            rounded="xl"
            class="mx-auto py-10"
            elevation="3"
            height="50%"
            width="80%"
          >
            <v-btn
              width="50%"
              color="primary"
              x-large
              class="ma-3"
              to="/user/login"
            >
              {{ $t('login.title') }}
            </v-btn>
            <v-btn
              width="50%"
              color="secondary"
              x-large
              class="ma-3"
              to="/user/signup"
              >{{ $t('signup.title') }}</v-btn
            >
            <div></div>
          </v-sheet>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
/* eslint-disable no-unused-vars */
import { ref } from '@vue/composition-api'
import PageHeader from '@/components/layout/PageHeader.vue'

export default {
  name: 'Home',
  //----------
  components: {
    PageHeader
  },
  head() {
    return {
      title: this.title,
      meta: [
        { hid: 'description', name: 'description', content: this.description }
      ]
    }
  },
  setup(props, context) {
    const { $i18n } = context.root

    //-------------------------------------------------------
    // Reactive values
    const title = ref($i18n.t('app_menu.home'))
    const description = ref($i18n.t('app_menu.home'))
    const imgName = ref('feathers-logo-wide.png')

    return {
      title,
      description,
      imgName
    }
  }
}
</script>
