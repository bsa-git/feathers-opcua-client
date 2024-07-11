<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
          :src="require('../assets/pic/feathers-logo-wide.png')"
          class="my-3"
          contain
          height="50"
        />
        <h1 class="display-2  my-3">
          Home
        </h1>
      </v-col>

      <v-col cols="12">
        <v-sheet class="pa-12" color="grey lighten-3">
          <div></div>
          <v-sheet class="mx-auto py-10" elevation="3" height="50%" width="80%">
            <v-btn width="50%" color="primary" x-large class="ma-3" to="/login"
              >Login</v-btn
            >

            <div></div>

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

  <!-- <main class="home container">
    <div class="row">
      <div class="col-12 col-8-tablet push-2-tablet text-center">
        <img
          class="logo center-item"
          src="http://feathersjs.com/img/feathers-logo-wide.png"
          alt="Feathers Logo"
        />
        <h3 class="title">Chat</h3>
      </div>
    </div>

    <div class="row">
      <div class="col-12 push-4-tablet col-4-tablet">
        <div class="row">
          <div class="col-12">
            <router-link
              as="a"
              :to="{ name: 'Login' }"
              class="button button-primary block login"
              >Login</router-link
            >
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <router-link
              as="a"
              :to="{ name: 'Signup' }"
              class="button button-primary block signup"
              >Signup</router-link
            >
          </div>
        </div>

        <router-link
          as="button"
          :to="{ name: 'Dashboard' }"
          class="button button-secondary block"
          >Dashboard</router-link
        >
      </div>
    </div>
  </main> -->
</template>

<script>
export default {
  name: 'Home'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!-- <style scoped>
main.home {
  padding-top: 100px;
  padding-bottom: 100px;
}

main.home img.logo {
  width: 100%;
  max-width: 400px;
}

main.home h3.title {
  color: #969696;
  font-weight: 100;
  text-transform: uppercase;
  margin-bottom: 40px;
}

main.home .button.login,
main.home .button.signup {
  padding-top: 1.2em;
  padding-bottom: 1.2em;
}

main.home .button.login {
  background: none;
  border: 2px solid #cfcfcf;
  color: #999;
}

main.home .button.login:hover,
main.home .button.login:focus {
  background: none;
  border: 2px solid #31d8a0;
  color: #31d8a0;
}
</style> -->
