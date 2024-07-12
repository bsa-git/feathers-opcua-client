<template>
  <div>
    <!-- Img  -->
    <v-img
      :src="require('@/assets/pic/feathers-logo-wide.png')"
      class="my-3"
      contain
      height="50"
    />
    <!-- Page Title -->
    <AppPageTitle
      v-if="pageTitle"
      class="mt-10"
      :page-title="pageTitle"
    ></AppPageTitle>
  </div>
</template>

<script>
import AppPageTitle from '@/components/layout/PageTitle'

// /api/app/app-menu   /components/layout/PageTitle
export default {
  components: {
    AppPageTitle
  },

  props: {
    pageTitle: {
      type: String,
      default: ''
    }
  }
}
</script>
