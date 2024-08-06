<template>
  <v-app-bar app color="primary" dark>
    <div class="d-flex align-center">
      <v-app-bar-nav-icon @click.stop="onNavLeft"></v-app-bar-nav-icon>

      <v-img
        alt="Vuetify Logo"
        class="shrink mr-2"
        contain
        src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
        transition="scale-transition"
        width="40"
      />

      <v-btn to="/vuetify" text>
        <span class="mr-2">About Vuetify</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </div>

    <v-spacer></v-spacer>

    <v-btn to="/" text>
      <span class="mr-2">Go to HOME</span>
      <v-icon>mdi-home</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  
  setup(props, context) {

    // Methods
    const onNavLeft = () => {
      context.emit('onNavLeft')
    }

    return {
      onNavLeft
    }
  }
}
</script>
