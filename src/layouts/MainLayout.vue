<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar
        :class="
          $q.platform.is.electron && $q.platform.is.mac && !fs
            ? ['q-pt-lg', 'q-pb-sm']
            : ''
        "
      >
        <q-btn
          v-if="$q.platform.is.electron || fs"
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
          v-if="$q.platform.is.electron || fs"
          flat
          dense
          round
          icon="arrow_forward"
          aria-label="Forward"
          @click="$router.go(1)"
        />
        <q-toolbar-title> Mirai </q-toolbar-title>

        <div v-if="!online">OFFLINE, cached results shown.</div>
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
        :class="
          $q.platform.is.electron && $q.platform.is.mac && !fs ? 'q-pt-md' : ''
        "
      >
        <q-item-label header class="text-grey-8"> Main </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
        <q-item-label header class="text-grey-8"> Anime </q-item-label>
        <EssentialLink
          v-for="link in animeLinks"
          :key="link.title"
          v-bind="link"
        />
        <q-item-label header class="text-grey-8"> Manga </q-item-label>
        <EssentialLink
          v-for="link in mangaLinks"
          :key="link.title"
          v-bind="link"
        />
        <q-item-label header class="text-grey-8"> Users </q-item-label>
        <EssentialLink
          v-for="link in userLinks"
          :key="link.title"
          v-bind="link"
        />
        <q-item-label header class="text-grey-8"> External Links </q-item-label>
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
    EssentialLink,
  },

  data() {
    return {
      fs: false,
      online: navigator.onLine,
      leftDrawerOpen: false,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      dark: this.$q.dark.isActive,
      essentialLinks: [
        {
          title: 'Home',
          caption: 'Home',
          icon: 'home',
          link: '/',
        },
        {
          title: 'FAQ',
          caption: 'Frequently asked questions',
          icon: 'help',
          link: '/faq',
        },
      ],
      animeLinks: [
        {
          title: 'Search',
          caption: 'Search for an anime',
          icon: 'search',
          link: '/search',
        },
      ],
      mangaLinks: [
        {
          title: 'Search Manga',
          caption: 'Search for a manga',
          icon: 'search',
          link: '/searchmanga',
        },
      ],
      userLinks: [
        {
          title: 'Me',
          caption: 'Open your MAL page',
          icon: 'person',
          link: '/me',
        },
        {
          title: 'Search Users',
          caption: 'Look at other profiles on MAL',
          icon: 'person_search',
          link: '/searchusr',
        },
        this.$q.cookies.get('mal_auth')
          ? {
              title: 'Log out',
              caption: 'Sign out of your MAL account.',
              icon: 'power_settings_new', // material doesn't have a proper logout icon for some reason
              link: '/logout',
            }
          : {
              title: 'Login',
              caption: 'Sign in with your MAL account',
              icon: 'login',
              link: '/login',
            },
      ],
      links: [
        {
          title: 'GitHub repo',
          caption: 'Source code for this application',
          icon: 'code',
          link: 'https://github.com/Jabster28/mirai',
        },
        {
          title: 'Changelog',
          caption: 'Look at new features and bugfixes',
          icon: 'assignment',
          link: 'https://github.com/Jabster28/mirai/blob/master/CHANGELOG.md',
        },
        {
          title: 'Incidents',
          caption: 'List of problems/downtimes Mirai has had.',
          icon: 'warning',
          link: 'https://github.com/Jabster28/mirai/blob/master/INCIDENTS.md',
        },
      ],
    };
  },
  created() {
    const incident = () => {
      this.$q.notify({
        message: 'Mirai is currently undergoing some issues.',
        icon: 'warning',
        color: 'primary',
        timeout: 30000,
        actions: [
          {
            label: 'Learn More',
            color: 'white',
            handler: () => {
              window.location.href =
                'https://github.com/Jabster28/mirai/blob/master/INCIDENTS.md';
            },
          },
        ],
      });
    };
    // i'll comment this line when things are working as intended
    incident();
  },
  mounted() {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    window.addEventListener('online', this.checkConn);
    window.addEventListener('offline', this.checkConn);
    window.addEventListener('resize', this.checkFs);
    window.swupdate = () => {
      this.$q.notify({
        message: 'Update installed! Please refresh.',
        icon: 'cloud_download',
        color: 'accent',
        timeout: 10000,
        actions: [
          {
            label: 'Refresh Now',
            color: 'white',
            handler: () => location.reload(true),
          },
        ],
      });
    };
    this.checkFs();
  },
  beforeDestroy() {
    window.removeEventListener('online', this.checkConn);
    window.removeEventListener('offline', this.checkConn);
    window.removeEventListener('resize', this.checkFs);
  },
  watch: {
    $route() {
      this.$q.loading.setDefaults({
        message: [
          // some normal ones i thought of
          'Loading...',
          'Spinning up the hamster wheel...',
          'Engaging the flux capacitor...',
          'The other load screen is quicker. Try that one next time.',
          'The elves are running slowly today...',
          'Wow, your internet is slow. I feel sorry for you.',
          'Overclocking the particle accelerator...',
          'You know, you could be doing something more productive right now.',
          'Loading, Press Alt+F4 for a quick IQ test while you wait.',
          // website tips
          "TIP: If you're on a modern browser, you can access this website offline!",
          "TIP: You can see your friends' most favourited anime by typing their name into the user box and sorting by ratings.",
          // more dumb ones
          '"Are we there yet?"',
          'INSERT COIN',
          "I know the data's around here somewhere...",
          'Searching for brain cells...',
          'Waiting for your friend to press start...',
          // stupid facts i stole off the internet, might be fake idk and idrc
          'The official pronunciation for a PNG file is "ping"',
          'The average American spends about 2.5 days a year looking for lost items.',
          'No number from 1 to 999 includes the letter "a" in its word form.',
          'Golf balls tend to have 336 "dimples."',
          "If you plug your nose, you can't tell the difference between an apple, a potato, and an onion.",
          'The opposite sides of a 6-sided dice will always add to seven.',
          'EDM and dubstep can scare off mosquitos.',
          'A cubic inch of human bone can bear the weight of five standard pickup trucks.',
          'The little dot above a lowercase "i" and "j" is called a tittle.',
          'Pogonophobia is the fear of beards.',
          'The average adult spends more time on the toilet than they do exercising.',
          'Your fingernails grow faster on your dominant hand.',
          'Apple seeds contain cyanide.',
          // more dumb ones
          'TypeError: UserPatience is not defined.',
          'UncaughtPromiseRejection: Loading is taking too long.',
          'Wow, you look great today!',
          "I have three tests today, and instead of praciticing for them, I'm here writing loading screens.",
          "Writing these messages isn't easy, you know",
          'Come on, at least one of these are funny!',
        ].find((_, i, ar) => Math.random() < 1 / (ar.length - i)),
      });
    },
    online() {
      if (this.online) {
        // @ts-ignore
        this.$q.notify({
          message: 'Back online',
          icon: 'signal_wifi_4_bar',
          color: 'green',
        });
      } else {
        // @ts-ignore
        this.$q.notify({
          message: 'Offline, only cached results shown',
          icon: 'signal_wifi_off',
        });
      }
    },
  },
  methods: {
    checkFs() {
      this.fs = window.innerHeight == screen.height;
      if (
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone ||
        document.referrer.includes('android-app://')
      ) {
        this.fs = true;
      }
    },
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
    },
  },
};
</script>
