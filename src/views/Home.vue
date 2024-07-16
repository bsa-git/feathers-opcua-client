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

      <v-col cols="12">
        <v-sheet rounded="xl" class="pa-12" color="grey lighten-3">
          <v-sheet
            rounded="xl"
            class="mx-auto py-10"
            elevation="3"
            height="50%"
            width="80%"
          >
            <v-btn width="50%" color="primary" x-large class="ma-3" to="/login">
              Login
            </v-btn>
            <v-btn
              width="50%"
              color="secondary"
              x-large
              class="ma-3"
              to="/signup"
              >Signup</v-btn
            >
            <div></div>
          </v-sheet>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AppPageHeader from '@/components/app/layout/AppPageHeader.vue'

export default {
  name: 'Home',
  //----------

  components: {
    AppPageHeader
  },
  data() {
    return {
      title: 'Home',
      description: 'Home',
      imgName: 'feathers-logo-wide.png'
    }
  },
  head() {
    return {
      title: this.title,
      meta: [
        { hid: 'description', name: 'description', content: this.description }
      ]
    }
  }
}
</script>
