<template>
  <v-container>
    <v-row class="text-center">
      <!--=== Page Header ===-->
      <v-col cols="12">
        <PageHeader :page-title="description" :img-name="imgName" :is-div="true">
        </PageHeader>
      </v-col>

      <v-col class="mb-4">
        <p class="subheading font-weight-regular">
          For help and collaboration with other Vuetify developers,
          <br />please join our online
          <a href="https://community.vuetifyjs.com" target="_blank">Discord Community</a>
        </p>
      </v-col>

      <v-col class="mb-5" cols="12">
        <h2 class="headline font-weight-bold mb-3">
          What's next?
        </h2>

        <v-row justify="center">
          <a v-for="(next, i) in whatsNext" :key="i" :href="next.href" class="subheading mx-3" target="_blank">
            {{ next.text }}
          </a>
        </v-row>
      </v-col>

      <v-col class="mb-5" cols="12">
        <h2 class="headline font-weight-bold mb-3">
          Important Links
        </h2>

        <v-row justify="center">
          <a v-for="(link, i) in importantLinks" :key="i" :href="link.href" class="subheading mx-3" target="_blank">
            {{ link.text }}
          </a>
        </v-row>
      </v-col>

      <v-col class="mb-5" cols="12">
        <h2 class="headline font-weight-bold mb-3">
          Ecosystem
        </h2>

        <v-row justify="center">
          <a v-for="(eco, i) in ecosystem" :key="i" :href="eco.href" class="subheading mx-3" target="_blank">
            {{ eco.text }}
          </a>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
/* eslint-disable no-unused-vars */
import { ref, reactive } from '@vue/composition-api'
import PageHeader from '@/components/layout/PageHeader.vue'

export default {
  name: 'Vuetify',
  //--------------
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
    const ecosystem = reactive(
      [
        {
          text: 'vuetify-loader',
          href: 'https://github.com/vuetifyjs/vuetify-loader'
        },
        {
          text: 'github',
          href: 'https://github.com/vuetifyjs/vuetify'
        },
        {
          text: 'awesome-vuetify',
          href: 'https://github.com/vuetifyjs/awesome-vuetify'
        }
      ]
    )
    const importantLinks = reactive(
      [
        {
          text: 'Documentation',
          href: 'https://vuetifyjs.com'
        },
        {
          text: 'Chat',
          href: 'https://community.vuetifyjs.com'
        },
        {
          text: 'Made with Vuetify',
          href: 'https://madewithvuejs.com/vuetify'
        },
        {
          text: 'Twitter',
          href: 'https://twitter.com/vuetifyjs'
        },
        {
          text: 'Articles',
          href: 'https://medium.com/vuetify'
        }
      ]
    )
    const whatsNext = reactive(
      [
        {
          text: 'Explore components',
          href: 'https://vuetifyjs.com/components/api-explorer'
        },
        {
          text: 'Select a layout',
          href: 'https://vuetifyjs.com/getting-started/pre-made-layouts'
        },
        {
          text: 'Frequently Asked Questions',
          href:
            'https://vuetifyjs.com/getting-started/frequently-asked-questions'
        }
      ]
    )

    return {
      title,
      description,
      imgName,
      ecosystem,
      importantLinks,
      whatsNext
    }
  }
}
</script>
