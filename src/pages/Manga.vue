<template>
  <q-page class="items-center justify-evenly">
    <div class="post">
      <div v-if="error" class="error">
        {{ error }}
      </div>

      <div v-if="manga.mal_id" class="content">
        <div
          :class="[
            'q-mx-lg',
            'items-center',
            'justify-evenly',
            $q.screen.width > 800 ? 'row' : 'col'
          ]"
        >
          <div class="col-5">
            <q-img :src="manga.image_url" />
            <q-btn
              rel="noopener"
              class="q-ma-sm"
              color="primary"
              clickable
              type="a"
              target="_blank"
              :href="manga.url"
            >
              Open in MAL</q-btn
            >
          </div>
          <div class="col-5">
            <h2>{{ manga.title }}</h2>

            <h6 class="disabled">{{ manga.title_english }}</h6>
            <p class="text-justify">{{ manga.synopsis }}</p>
            <h5>
              <q-icon name="stars" />
              {{ manga.score ? manga.score.toPrecision(3) : '-' }} / 10
            </h5>
            <h5>
              <q-icon name="visibility" /> {{ norm(manga.members) || '0' }}
            </h5>
            <h5><q-icon name="star" /> {{ norm(manga.favorites) || '0' }}</h5>
            <h5># {{ norm(manga.rank) || '-' }}</h5>
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
  name: 'PageManga',
  data() {
    return {
      player: null,
      manga: {
        title: '',
        mal_id: ''
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

    fetchData() {
      this.error = '';
      this.$q.loading.show({
        delay: 400 // ms
      });
      const currentManga = this.$route.params.id;
      if (!navigator.onLine) {
        console.log('checking for cached manga');
        let cache = this.$q.localStorage.getItem('cache');
        if (!cache) {
          this.$q.localStorage.set('cache', {});
          cache = this.$q.localStorage.getItem('cache');
        }
        /* @ts-ignore */
        if (!cache.manga) cache.manga = {};
        /* @ts-ignore */
        if (cache.manga[this.$route.params.id]) {
          if (currentManga != this.$route.params.id) return;

          /* @ts-ignore */
          console.log('found some');
          /* @ts-ignore */

          this.manga = cache.manga[this.$route.params.id];
          this.$q.loading.hide();
          return;
        } else {
          console.log('none found');
          if (currentManga != this.$route.params.id) return;

          this.$q.notify(
            "This manga hasn't been cached, so we can't show you anything. Connect to the internet and try again."
          );
          this.$q.loading.hide();
          return;
        }
      }
      // replace `getPost` with your data fetching util / API wrapper
      axios
        .get(`https://api.jikan.moe/v3/manga/${this.$route.params.id}`)
        .then(data => {
          this.$q.loading.hide();
          this.manga = data.data;
          document.title = `${this.manga.title} | Mirai`;
          /* @ts-ignore */
          let cache = this.$q.localStorage.getItem('cache');
          /* @ts-ignore */
          if (!cache) {
            this.$q.localStorage.set('cache', {});
            cache = this.$q.localStorage.getItem('cache');
          }
          /* @ts-ignore */
          if (!cache.manga) cache.manga = {};
          /* @ts-ignore */
          cache.manga[this.$route.params.id] = this.manga;
          /* @ts-ignore */
          cache.manga[this.$route.params.id].date = new Date();
          if (currentManga != this.$route.params.id) return;

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
