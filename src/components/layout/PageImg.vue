<template>
  <v-img
    :src="require(`@/assets/pic/${imgName}`)"
    class="my-3"
    contain
    height="50"
  />
</template>

<script>
export default {
  props: {
    imgName: {
      type: String,
      default: ''
    }
  }
}
</script>
