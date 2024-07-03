<template>
  <main class="dashboard container">
    <div class="row">
      <div class="col-12 col-6-tablet push-3-tablet text-center">
        <h1 class="font-100">Dashboard</h1>
      </div>
    </div>
    <div class="row">
      <div
        class="col-12 col-6-tablet push-3-tablet col-4-desktop push-4-desktop"
      >
        <router-link
          as="button"
          :to="{ name: 'Home' }"
          class="button button-secondary block"
          >Home</router-link
        >
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'Dashboard'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
main.dashboard {
  padding-top: 100px;
  padding-bottom: 100px;
}
</style>
