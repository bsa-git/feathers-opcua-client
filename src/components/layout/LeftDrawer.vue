<template>
  <v-navigation-drawer
    v-model="compDrawer"
    :dark="$vuetify.theme.dark"
    :width="320"
    absolute
    temporary
  >
    <v-list-item>
      <v-list-item-avatar>
        <v-img :src="userAvatar()"></v-img>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title>
          {{ $t('common.hi') }} {{ user ? user.firstName : $t('common.guest') }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ user ? user.email : '' }}
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
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
          @click.stop="compDrawer = false"
        >
          <v-icon>mdi-home</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>

    <v-divider></v-divider>

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
import { ref, computed } from '@vue/composition-api'
import Avatar from '@/plugins/lib/avatar.class'
import AuthClient from '@/plugins/auth/auth-client.class'
import util from '@/plugins/lib/util'

const debug = require('debug')('app:comp.LeftDrawer')
const isDebug = false

export default {
  props: {
    drawer: Boolean,
    homePath: {
      type: String,
      default: 'home'
    },
    menuItems: {
      type: Array,
      default: function() {
        return [{ title: 'Home', icon: 'mdi-home', path: '/' }]
      }
    },
    badgeChat: {
      type: Number,
      default: 0
    }
  },

  setup(props, context) {
    const { $store, $validator, $vuetify, $i18n, $router } = context.root

    const currentItemName = ref('')

    // Computed state
    const user = computed(() => $store.state['auth']['user'])
    if (isDebug && user.value) debug('setup.user:', user.value)
    // Computed getters
    const config = computed(() => $store.getters.getConfig)
    const compDrawer = computed({
      get: () => props.drawer,
      set: newValue => {
        context.emit('onNavLeft', newValue)
      }
    })

    const filterAppMenu = computed(() => {
      // Create auth
      const auth = new AuthClient($store)
      // Filter, update and sort menu
      const menu = auth.filterMenu().map(item => {
        if (item.header) {
          item.header = $i18n.t(`app_menu.${item.alias}`)
        }
        if (item.title) {
          item.title = $i18n.t(`app_menu.${item.alias}`)
        }
        if (item.items) {
          item.items.forEach(i => {
            if (i.children) {
              i.children.forEach(child => {
                child.title = $i18n.t(`app_menu.${child.alias}`)
              })
            }
            i.title = $i18n.t(`app_menu.${i.alias}`)
          })
        }
        return item
      })
      return sortAppMenu(menu)
    })

    const getBadgeValue = computed(() => {
      let result = false
      if (currentItemName.value === 'chat') {
        result = props.badgeChat
      }
      return result
    })

    //----------------------------------------------------------
    // Methods
    const sortAppMenu = menu => {
      // reorder menu
      menu.forEach(item => {
        if (item.items) {
          item.items.forEach(i => {
            if (i.children) {
              util.sortByStringField(i.children, 'title')
            }
          })
          util.sortByStringField(item.items, 'title')
        }
      })
      return menu
    }

    const userAvatar = () => {
      let imageUrl = ''
      if (user.value && user.value.avatar) {
        imageUrl = user.value.avatar
        if (isDebug && imageUrl) debug('setup.user.avatar:', imageUrl)
      } else {
        const email = user.value ? user.value.email : ''
        const avatar = new Avatar(email)
        imageUrl = avatar.imageUrl()
        if (isDebug && imageUrl) debug('setup.avatar.url:', imageUrl)
      }
      return imageUrl
    }

    return {
      // React values
      currentItemName,
      compDrawer,
      user,
      config,
      // Methods
      userAvatar,
      filterAppMenu,
      getBadgeValue
    }
  }
}
</script>
