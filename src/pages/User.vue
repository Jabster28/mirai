<template>
  <q-page class="items-center justify-evenly">
    <div class="post">
      <div v-if="error" class="error">
        {{ error }}
      </div>

      <div v-if="user.username" class="content">
        <div
          :class="[
            'q-mx-lg',
            'items-center',
            'justify-evenly',
            $q.screen.width > 800 ? 'row' : 'col'
          ]"
        >
          <div class="col-5">
            <q-img v-if="user.image_url" :src="user.image_url" />
            <q-btn
              class="q-ma-lg"
              color="primary"
              clickable
              type="a"
              target="_blank"
              :href="user.url"
            >
              Open in MAL</q-btn
            >
            <q-btn
              v-if="isUser()"
              class="q-ma-lg"
              color="secondary"
              clickable
              tag="a"
              to="/setusr/me"
            >
              Not you?</q-btn
            >
          </div>
          <div class="col-5">
            <h2>{{ user.username }}</h2>

            <h6 class="disabled">{{ user.user_id }}</h6>
            <!-- <p class="text-justify">{{ anime.synopsis }}</p>
            <h5>
              <q-icon name="stars" /> {{ anime.score.toPrecision(3) }} / 10
            </h5>
            <h5><q-icon name="visibility" /> {{ norm(anime.members) }}</h5>
            <h5><q-icon name="star" /> {{ norm(anime.favorites) }}</h5>
            <h5 v-if="anime.rank"># {{ norm(anime.rank) }}</h5> -->
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import axios from 'axios';
import Vue from 'vue';

export default Vue.extend({
  name: 'PageUser',
  data() {
    return {
      user: {
        username: ''
      },
      error: ''
    };
  },
  created() {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchData();
  },
  watch: {
    // call again the method if the route changes
    $route: 'fetchData'
  },
  methods: {
    norm(x: number) {
      if (!x) return;
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    isUser() {
      return this.$q.localStorage.getItem('username') == this.$route.params.id;
    },
    fetchData() {
      this.error = '';
      this.$q.loading.show({
        delay: 400 // ms
      });
      const currentUser = this.$route.params.id;
      if (!navigator.onLine) {
        console.log('checking for cached user data');
        let cache = this.$q.localStorage.getItem('cache');
        if (!cache) {
          this.$q.localStorage.set('cache', {});
          cache = this.$q.localStorage.getItem('cache');
        }
        /* @ts-ignore */
        if (!cache.user) cache.user = {};
        /* @ts-ignore */
        if (cache.user[this.$route.params.id]) {
          if (currentUser != this.$route.params.id) return;

          /* @ts-ignore */
          console.log('found some');
          /* @ts-ignore */

          this.user = cache.user[this.$route.params.id];
          this.$q.loading.hide();
          return;
        } else {
          console.log('none found');
          if (currentUser != this.$route.params.id) return;

          this.$q.notify(
            "This user's data hasn't been cached, so we can't show you anything. Connect to the internet and try again."
          );
          this.$q.loading.hide();
          return;
        }
      }
      // replace `getPost` with your data fetching util / API wrapper
      axios
        .get(`https://api.jikan.moe/v3/user/${this.$route.params.id}`)
        .then(data => {
          this.$q.loading.hide();
          this.user = data.data;
          document.title = `${this.user.username} | Mirai`;
          /* @ts-ignore */
          let cache = this.$q.localStorage.getItem('cache');
          /* @ts-ignore */
          if (!cache) {
            this.$q.localStorage.set('cache', {});
            cache = this.$q.localStorage.getItem('cache');
          }
          /* @ts-ignore */
          if (!cache.user) cache.user = {};
          /* @ts-ignore */
          cache.user[this.$route.params.id] = this.user;
          /* @ts-ignore */
          cache.user[this.$route.params.id].date = new Date();
          if (currentUser != this.$route.params.id) return;

          this.$q.localStorage.set('cache', cache);
        })
        .catch((e: string) => {
          console.log(e);
          this.$q.loading.hide();
          this.error = e;
        });
    }
  }
});
</script>
