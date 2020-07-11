<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Mirai
        </q-toolbar-title>

        <div>{{ online ? 'ONLINE' : 'OFFLINE, cached results shown.' }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" behavior="mobile" show-if-above bordered>
      <q-list>
        <q-item-label header class="text-grey-8">
          Main
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
        <q-item-label header class="text-grey-8">
          Anime
        </q-item-label>
        <EssentialLink
          v-for="link in animeLinks"
          :key="link.title"
          v-bind="link"
        />
        <q-item-label header class="text-grey-8">
          Users
        </q-item-label>
        <EssentialLink
          v-for="link in userLinks"
          :key="link.title"
          v-bind="link"
        />
        <q-item-label header class="text-grey-8">
          Links
        </q-item-label>
        <EssentialLink
          v-for="link in links"
          :key="link.title"
          v-bind="link"
          external
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <transition
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
        appear
        :duration="500"
      >
        <router-view />
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script>
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import EssentialLink from 'components/EssentialLink.vue';

export default {
  name: 'MainLayout',
  components: {
    EssentialLink
  },
  data() {
    return {
      online: navigator.onLine,
      leftDrawerOpen: false,
      essentialLinks: [
        {
          title: 'Home',
          caption: 'Home',
          icon: 'home',
          link: '/'
        }
      ],
      animeLinks: [
        {
          title: 'Search',
          caption: 'Search for an anime',
          icon: 'search',
          link: '/search'
        }
      ],
      userLinks: [
        {
          title: 'Me',
          caption: 'Open your MAL page',
          icon: 'person',
          link: '/me'
        },
        {
          title: 'Set Username',
          caption: 'Allows you to see favourited anime etc.',
          icon: 'settings',
          link: '/setusr'
        }
      ],
      links: [
        {
          title: 'GitHub repo',
          caption: 'Source code for this application',
          icon: 'code',
          link: 'https://github.com/Jabster28/mirai'
        }
      ]
    };
  },
  mounted() {
    window.addEventListener('online', this.checkConn);
    window.addEventListener('offline', this.checkConn);
  },
  watch: {
    online() {
      if (this.online) {
        // @ts-ignore
        this.$q.notify({
          message: 'Back online',
          icon: 'signal_wifi_4_bar',
          color: 'green'
        });
      } else {
        // @ts-ignore
        this.$q.notify({
          message: 'Offline, only cached results shown',
          icon: 'signal_wifi_off'
        });
      }
    }
  },
  methods: {
    checkConn() {
      if (navigator.onLine) {
        this.online = true;
      } else {
        this.online = false;
      }
    }
  }
};
</script>
