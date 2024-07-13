<template>
  <div>
    <!-- Img  -->
    <PageImg :img-name="imgName" />
    <!-- Page Title -->
    <PageTitle v-if="pageTitle" class="mt-10" :page-title="pageTitle" />
  </div>
</template>

<script>
import PageTitle from '@/components/layout/PageTitle'
import PageImg from '@/components/layout/PageImg'

// /api/app/app-menu   /components/layout/PageTitle
export default {
  components: {
    PageTitle,
    PageImg
  },

  props: {
    pageTitle: {
      type: String,
      default: ''
    },
    imgName: {
      type: String,
      default: ''
    }
  }
}
</script>
