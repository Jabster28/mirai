<template>
  <q-page class="row items-center justify-evenly">
    <div class="row col-12 items-center justify-evenly">
      <q-input
        :class="['q-my-xl', $q.screen.width > 400 ? 'col-8' : 'col-10']"
        v-model="search"
        debounce="300"
        filled
        label="Enter an anime..."
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
      <AnimeCard v-for="anime in results" :key="anime.mal_id" :anime="anime" />
    </div>
  </q-page>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import Vue from 'vue';
import AnimeCard from 'components/AnimeCard.vue';
import axios from 'axios';
export default Vue.extend({
  name: 'PageSearch',
  components: { AnimeCard },
  mounted() {
    document.title = this.search ? `${this.search} | Mirai` : 'Search Mirai';
    if (this.$route.params.query && this.$route.params.query != this.search) {
      this.search = this.$route.params.query;
    }
  },
  watch: {
    search() {
      document.title = this.search ? `${this.search} | Mirai` : 'Search Mirai';
      if (
        !this.$route.params.query ||
        this.$route.params.query != this.search
      ) {
        this.$router.replace(
          '/search/' + encodeURIComponent(this.search || '')
        );
      }
      const currentSearch = this.search;
      this.loading = true;
      if (!this.search || this.search.trim() == '') {
        this.loading = false;
        this.results = [];
      }
      console.log('checking for cached searches');
      let cache = this.$q.localStorage.getItem('cache');
      if (!cache) {
        this.$q.localStorage.set('cache', {});
        cache = this.$q.localStorage.getItem('cache');
      }
      /* @ts-ignore */
      if (!cache.search) cache.search = {};
      /* @ts-ignore */
      if (cache.search[this.search]) {
        if (currentSearch != this.search) return;

        /* @ts-ignore */
        console.log('found some');
        /* @ts-ignore */

        this.results = cache.search[this.search];
        this.loading = false;
        return;
      } else {
        console.log('none found');
        if (!navigator.onLine) {
          if (currentSearch != this.search) return;

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
          `https://api.jikan.moe/v3/search/anime?q=${encodeURIComponent(
            this.search.trim()
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
          if (!cache.search) cache.search = {};
          /* @ts-ignore */
          cache.search[this.search] = e.data.results;
          /* @ts-ignore */
          cache.search[this.search].date = new Date();
          if (currentSearch != this.search) return;

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
      search: '',
      results: [],
      loading: false,
      online: false
    };
  }
});
</script>
