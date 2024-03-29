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
        <q-toolbar-title>
          <q-icon name="img:icons/safari-pinned-tab.svg" />
        </q-toolbar-title>

        <div v-if="!online">offline, cached results shown.</div>
        <q-btn
          flat
          dense
          round
          :icon="['light_mode', 'dark_mode', 'brightness_4'][theme]"
          aria-label="Menu"
          @click="shift"
        >
          <q-tooltip>{{ ['Light', 'Dark', 'System'][theme] }}</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" behavior="mobile" show-if-above bordered>
      <q-list
        :class="
          $q.platform.is.electron && $q.platform.is.mac && !fs ? 'q-pt-md' : ''
        "
      >
        <q-item-label header class="text-grey-8"> mirai </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
        <q-item-label header class="text-grey-8"> anime </q-item-label>
        <EssentialLink
          v-for="link in animeLinks"
          :key="link.title"
          v-bind="link"
        />
        <q-item-label header class="text-grey-8"> manga </q-item-label>
        <EssentialLink
          v-for="link in mangaLinks"
          :key="link.title"
          v-bind="link"
        />
        <q-item-label header class="text-grey-8"> users </q-item-label>
        <EssentialLink
          v-for="link in userLinks"
          :key="link.title"
          v-bind="link"
        />
        <q-item-label header class="text-grey-8"> external links </q-item-label>
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
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      theme: Number.isNaN(this.$q.localStorage.getItem('theme') + 1)
        ? 2
        : this.$q.localStorage.getItem('theme'),
      essentialLinks: [
        {
          title: 'home',
          caption: 'welcome to mirai',
          icon: 'home',
          link: '/',
        },
        {
          title: 'FAQ',
          caption: 'frequently asked questions',
          icon: 'help',
          link: '/faq',
        },
      ],
      animeLinks: [
        {
          title: 'search',
          caption: 'search for an anime',
          icon: 'search',
          link: '/search',
        },
      ],
      mangaLinks: [
        {
          title: 'search manga',
          caption: 'search for a manga',
          icon: 'search',
          link: '/searchmanga',
        },
      ],
      userLinks: [
        {
          title: 'me',
          caption: 'open your MAL page',
          icon: 'person',
          link: '/me',
        },
        {
          title: 'search users',
          caption: 'look at other profiles on MAL',
          icon: 'person_search',
          link: '/searchusr',
        },
        this.$q.cookies.get('mal_auth')
          ? {
              title: 'log out',
              caption: 'sign out of your MAL account.',
              icon: 'power_settings_new', // material doesn't have a proper logout icon for some reason
              link: '/logout',
            }
          : {
              title: 'login',
              caption: 'sign in with your MAL account',
              icon: 'login',
              link: '/login',
            },
      ],
      links: [
        {
          title: 'GitHub repo',
          caption: 'source code for this application',
          icon: 'code',
          link: 'https://github.com/Jabster28/mirai',
        },
        {
          title: 'changelog',
          caption: 'look at new features and bugfixes',
          icon: 'assignment',
          link: 'https://github.com/Jabster28/mirai/blob/master/CHANGELOG.md',
        },
        {
          title: 'incidents',
          caption: 'list of problems/downtimes Mirai has had.',
          icon: 'warning',
          link: 'https://github.com/Jabster28/mirai/blob/master/INCIDENTS.md',
        },
      ],
    };
  },
  created() {
    const incident = () => {
      this.$q.notify({
        message: 'mirai is currently undergoing some issues.',
        icon: 'warning',
        color: 'warning',
        progress: true,
        timeout: 5000,
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
    // incident();
  },
  mounted() {
    // TODO: allow for 'auto' as one of the modes to cycle through
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    window.addEventListener('online', this.checkConn);
    window.addEventListener('offline', this.checkConn);
    window.addEventListener('resize', this.checkFs);
    window.swupdate = () => {
      this.$q.notify({
        message: 'update installed! please refresh.',
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
    if (!Number.isInteger(this.$q.localStorage.getItem('theme'))) {
      this.$q.localStorage.set('theme', 1);
      this.theme = 1;
      // if all else fails, return to the dark side.
      // better to have a dark UI when you want it
      // light, rather than burning someone's retinas :)
    }
    this.$q.dark.set([false, true, 'auto'][this.theme]);

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
          'Turning back time...',
          'Finding Waldo...',
          // website tips
          "TIP: If you're on a modern browser, you can access this website offline!",
          "TIP: You can see your friends' favourite anime by heading to their user page and pressing 'Score'.",
          'TIP: You can hold ctrl (or cmd on macOS) to open links in a new tab.',
          'TIP: We have android releases too! Check our GitHub page.',
          'TIP: You can click on the name of a reviewer to go to their profile.',
          'TIP: You can switch between light/dark mode by pressing the icon in the top-right.',
          'TIP: Almost every page on mirai has a button to take you to the corresponding MAL page.',
          'TIP: If you log in, you can see and edit animes/mangas in your list.',
          'TIP: Having problems? Create an issue on our GitHub page!',
          // more dumb ones
          '"Are we there yet?"',
          'INSERT COIN',
          "I know the data's around here somewhere...",
          'Searching for brain cells...',
          'Waiting for your friend to press start...',
          '"Controller 4 has disconnected. Please reconnect and press A."',
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
          'Did you do something with your hair?',
          'Uhh, meow?',
          "If you have the time to read this while it's loading, either your internet isn't good or something's broken.",
          "Lovely weather we're having, eh?",
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
    shift() {
      this.theme += 1;
      this.theme = this.theme % 3;
      this.$q.localStorage.set('theme', this.theme);
      this.$q.dark.set([false, true, 'auto'][this.theme]);
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
