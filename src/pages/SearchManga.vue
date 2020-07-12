<template>
  <q-page class="row items-center justify-evenly">
    <div class="row col-12 items-center justify-evenly">
      <q-input
        :class="['q-my-xl', $q.screen.width > 400 ? 'col-8' : 'col-10']"
        v-model="searchmanga"
        debounce="300"
        filled
        label="Enter a manga..."
        :rules="[
          val =>
            !val ||
            val.trim().length >= 3 ||
            val.trim() == '' ||
            'Minimum 3 characters.'
        ]"
        @keypress="load"
        :loading="loading"
        clearable
        autofocus
        type="search"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <q-space />
    <div class="row items-center justify-evenly">
      <MangaCard v-for="manga in results" :key="manga.mal_id" :manga="manga" />
    </div>
  </q-page>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import Vue from 'vue';
import MangaCard from 'components/MangaCard.vue';
import axios from 'axios';
export default Vue.extend({
  name: 'PageSearchManga',
  components: { MangaCard },
  mounted() {
    if (
      this.$route.params.query &&
      this.$route.params.query != this.searchmanga
    ) {
      this.searchmanga = this.$route.params.query;
    }
  },
  watch: {
    searchmanga() {
      document.title =
        this.searchmanga && this.searchmanga.trim()
          ? `"${this.searchmanga}" | Search Mirai`
          : 'Search Mirai';
      if (
        !this.$route.params.query ||
        this.$route.params.query != this.searchmanga
      ) {
        this.$router
          .replace('/searchmanga/' + encodeURIComponent(this.searchmanga || ''))
          .catch(e => console.log(e));
      }
      const currentSearch = this.searchmanga.trim();
      this.loading = true;
      if (!this.searchmanga || this.searchmanga.trim() == '') {
        this.loading = false;
        this.results = [];
        return;
      }
      console.log('checking for cached searches');
      let cache = this.$q.localStorage.getItem('cache');
      if (!cache) {
        this.$q.localStorage.set('cache', {});
        cache = this.$q.localStorage.getItem('cache');
      }
      /* @ts-ignore */
      if (!cache.searchmanga) cache.searchmanga = {};
      /* @ts-ignore */
      if (cache.searchmanga[this.searchmanga.trim()]) {
        if (currentSearch != this.searchmanga.trim()) return;
        /* @ts-ignore */
        console.log('found some');
        /* @ts-ignore */

        this.results = cache.searchmanga[this.searchmanga.trim()];
        this.loading = false;
        if (!navigator.onLine) return;
      } else {
        console.log('none found');
        if (!navigator.onLine) {
          if (currentSearch != this.searchmanga.trim()) return;

          this.$q.notify(
            "This search hasn't been cached, so we can't show you anything. Connect to the internet and try again."
          );
          this.loading = false;
          this.results = [];
          return;
        }
      }
      axios
        .get(
          `https://api.jikan.moe/v3/search/manga?q=${encodeURIComponent(
            this.searchmanga.trim()
          )}&page=1`
        )
        .then(e => {
          /* @ts-ignore */
          let cache = this.$q.localStorage.getItem('cache');
          /* @ts-ignore */
          if (!cache) {
            this.$q.localStorage.set('cache', {});
            cache = this.$q.localStorage.getItem('cache');
          }
          /* @ts-ignore */
          if (!cache.searchmanga) cache.searchmanga = {};
          /* @ts-ignore */
          cache.searchmanga[this.searchmanga.trim()] = e.data.results;
          /* @ts-ignore */
          cache.searchmanga[this.searchmanga.trim()].date = new Date();
          if (currentSearch.trim() != this.searchmanga.trim()) return;

          this.$q.localStorage.set('cache', cache);

          this.results = e.data.results;
          this.loading = false;
        })
        .catch(e => console.log(e));
    }
  },
  methods: {
    load() {
      this.loading = true;
    }
  },
  data() {
    return {
      searchmanga: '',
      results: [],
      loading: false,
      online: false
    };
  }
});
</script>
