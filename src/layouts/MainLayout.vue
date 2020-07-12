<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar
        :class="
          $q.platform.is.electron && $q.platform.is.mac
            ? ['q-pt-xl', 'q-pb-sm']
            : ''
        "
      >
        <q-btn
          v-if="$q.platform.is.electron"
          flat
          dense
          round
          icon="arrow_back"
          aria-label="Back"
          @click="$router.go(-1)"
        />
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-btn
          v-if="$q.platform.is.electron"
          flat
          dense
          round
          icon="arrow_forward"
          aria-label="Forward"
          @click="$router.go(1)"
        />
        <q-toolbar-title>
          Mirai
        </q-toolbar-title>

        <div>{{ online ? 'ONLINE' : 'OFFLINE, cached results shown.' }}</div>
        <q-btn
          flat
          dense
          round
          :icon="dark ? 'brightness_4' : 'brightness_2'"
          aria-label="Menu"
          @click="toggle"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" behavior="mobile" show-if-above bordered>
      <q-list
        :class="$q.platform.is.electron && $q.platform.is.mac ? 'q-pt-md' : ''"
      >
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
          Manga
        </q-item-label>
        <EssentialLink
          v-for="link in mangaLinks"
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      dark: this.$q.dark.isActive,
      essentialLinks: [
        {
          title: 'Home',
          caption: 'Home',
          icon: 'home',
          link: '/'
        },
        {
          title: 'FAQ',
          caption: 'Frequently asked questions',
          icon: 'help',
          link: '/faq'
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
      mangaLinks: [
        {
          title: 'Search',
          caption: 'Search for a manga',
          icon: 'search',
          link: '/searchmanga'
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
          title: 'Search Users',
          caption: 'Look at other profiles on MAL',
          icon: 'person_search',
          link: '/searchusr'
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
    toggle() {
      this.$q.dark.toggle();
      this.dark = !this.dark;
      this.$q.localStorage.set('theme', this.dark);
    },
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
