<template>
  <v-navigation-drawer
    v-model="compDrawer"
    :mini-variant.sync="mini"
    :dark="$vuetify.theme.dark"
    :width="320"
    :fixed="false"
    :clipped="false"
    app
  >
    <!-- Logo -->
    <v-toolbar class="" color="primary darken-1" dark>
      <v-avatar v-if="isAvatar" size="36px">
        <img :src="logoImage" />
      </v-avatar>
      <v-icon v-else>{{ logoImage }}</v-icon>
      <v-toolbar-title class="headline ml-0 pl-3">
        <span class="font-weight-black font-italic">{{ logoTitle }}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        v-if="$vuetify.breakpoint.name === 'xs'"
        icon
        class="mr-3"
        :title="$t('common.close')"
        @click.stop="compDrawer = false"
      >
        <v-icon>mdi-close-thick</v-icon>
      </v-btn>
      <v-btn
        v-else
        icon
        :to="$i18n.path(homePath)"
        class="mr-3"
        :title="$t('app_menu.home')"
      >
        <v-icon>mdi-home</v-icon>
      </v-btn>
    </v-toolbar>
    <v-list dense expand>
      <template v-for="(item, indexItem) in filterAppMenu">
        <!--group with subitems-->
        <v-list-group
          v-if="item.items && !item.inactive"
          :key="item.name"
          :group="item.group"
          :prepend-icon="item.icon"
          no-action="no-action"
        >
          <v-list-item slot="activator" ripple="ripple">
            <v-badge
              v-if="item.badge"
              :current-item-name="(currentItemName = item.name)"
              :content="getBadgeValue"
              :value="!!getBadgeValue"
              color="red"
              inline
            >
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-badge>
            <v-list-item-content v-else>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <template v-for="(subItem, indexSubItem) in item.items">
            <!--sub group-->
            <v-list-group
              v-if="subItem.children"
              :key="subItem.name"
              :group="subItem.group"
              sub-group="sub-group"
            >
              <v-list-item slot="activator" ripple="ripple">
                <v-list-item-content>
                  <v-list-item-title>{{ subItem.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                v-for="child in subItem.children"
                :key="child.name"
                :to="$i18n.path(child.to)"
                ripple="ripple"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ child.title }}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action v-if="child.icon">
                  <v-icon v-text="child.icon"></v-icon>
                </v-list-item-action>
              </v-list-item>
            </v-list-group>
            <!--child item-->
            <v-list-item
              v-else-if="!subItem.inactive"
              :key="subItem.name + indexSubItem"
              :to="$i18n.path(subItem.to)"
              :disabled="subItem.disabled"
              :target="subItem.target"
              ripple="ripple"
            >
              <v-list-item-content>
                <v-list-item-title
                  ><span>{{ subItem.title }}</span></v-list-item-title
                >
              </v-list-item-content>
              <v-list-item-action v-if="subItem.icon">
                <v-icon v-text="subItem.icon"></v-icon>
              </v-list-item-action>
            </v-list-item>
          </template>
        </v-list-group>
        <v-subheader
          v-else-if="item.header && !item.inactive"
          :key="'subheader' + indexItem"
        >
          {{ item.header }}
        </v-subheader>
        <v-divider
          v-else-if="item.divider && !item.inactive"
          :key="'divider' + indexItem"
        ></v-divider>
        <div v-else-if="item.inactive" :key="'item.inactive' + indexItem"></div>
        <!--top-level link-->
        <v-list-item
          v-else
          :key="item.name + indexItem"
          :to="$i18n.path(item.to)"
          ripple="ripple"
          :disabled="item.disabled"
          :target="item.target"
          rel="noopener"
        >
          <v-list-item-action v-if="item.icon">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-badge
            v-if="item.badge"
            :current-item-name="(currentItemName = item.name)"
            :content="getBadgeValue"
            :value="!!getBadgeValue"
            color="red"
            inline
          >
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-badge>
          <v-list-item-content v-else>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action v-if="item.subAction">
            <v-icon class="success--text">{{ item.subAction }}</v-icon>
          </v-list-item-action>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
/* eslint-disable no-unused-vars */
import AuthClient from '@/plugins/auth/auth-client.class'
export default {
  props: {
    isIcon: Boolean,
    isAvatar: Boolean,
    logoTitle: {
      type: String,
      default: 'logoTitle'
    },
    logoImage: {
      type: String,
      default: 'logoImage'
    },
    homePath: {
      type: String,
      default: 'home'
    },
    locale: {
      type: String,
      default: 'en'
    },
    appMenu: {
      type: Array,
      default: function() {
        return [{ title: 'Home', icon: 'mdi-home', path: '/' }]
      }
    },
    user: {
      type: Object,
      default: null
    },
    drawer: Boolean,
    badgeChat: {
      type: Number,
      default: 0
    }
  },
  data: function() {
    return {
      currentItemName: '',
      mini: false,
      scrollSettings: {
        maxScrollbarLength: 160
      }
    }
  },
  computed: {
    compDrawer: {
      // Getter:
      get: function() {
        return this.drawer
      },
      // Setter:
      set: function(newValue) {
        this.$emit('onNavLeft', newValue)
      }
    },
    filterAppMenu() {
      // Create auth
      const auth = new AuthClient(this.$store)
      // Filter, update and sort menu
      const menu = auth.filterMenu().map(item => {
        if (item.header) {
          item.header = this.$t(`app_menu.${item.alias}`)
        }
        if (item.title) {
          item.title = this.$t(`app_menu.${item.alias}`)
        }
        if (item.items) {
          item.items.forEach(i => {
            if (i.children) {
              i.children.forEach(child => {
                child.title = this.$t(`app_menu.${child.alias}`)
              })
            }
            i.title = this.$t(`app_menu.${i.alias}`)
          })
        }
        return item
      })
      return this.sortAppMenu(menu)
    },
    getBadgeValue() {
      let result = false
      if (this.currentItemName === 'chat') {
        result = this.badgeChat
      }
      return result
    }
  },
  methods: {
    sortAppMenu: function(menu) {
      const self = this
      // reorder menu
      menu.forEach(item => {
        if (item.items) {
          item.items.forEach(i => {
            if (i.children) {
              self.$util.sortByStringField(i.children, 'title')
            }
          })
          self.$util.sortByStringField(item.items, 'title')
        }
      })
      return menu
    }
  }
}
</script>

<style lang="sass">

#appDrawer
  overflow: hidden
  .drawer-menu--scroll
    height: calc(100vh - 48px)
    overflow: auto
</style>
