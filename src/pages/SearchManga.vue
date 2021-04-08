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
          (val) =>
            !val ||
            val.trim().length >= 3 ||
            val.trim() == '' ||
            'Minimum 3 characters.',
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
    <div class="row items-center justify-evenly q-pa-md">
      <MangaCard
        v-for="manga in results"
        :key="manga.mal_id"
        :manga="manga"
        search
      />
    </div>
  </q-page>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { defineComponent, ref, watch, onMounted } from 'vue';
import MangaCard from 'components/MangaCard.vue';
import { useRouter, useRoute } from 'vue-router';
import { Anime } from '../helpers';
import { LocalStorage, Notify } from 'quasar';
import axios from 'axios';
import Vue from 'vue';
export default defineComponent({
  name: 'PageSearchManga',
  components: { MangaCard },

  setup() {
    const router = useRouter();
    const route = useRoute();
    let searchmanga = ref('');
    let results: Vue.Ref<Anime[]> = ref([]);
    let loading = false;
    let online = false;
    let load = () => {
      loading = true;
    };
    watch(searchmanga, () => {
      document.title =
        searchmanga.value && searchmanga.value.trim()
          ? `"${searchmanga.value}" | Search Mirai`
          : 'Search Mirai';
      if (!route.params.query || route.params.query != searchmanga.value) {
        router

          .replace(
            '/searchmanga/' + encodeURIComponent(searchmanga.value || '')
          )
          .catch((e) => console.log(e));
      }
      const currentSearch = searchmanga.value.trim();
      loading = true;
      if (!searchmanga || searchmanga.value.trim() == '') {
        loading = false;
        results.value = [];
        return;
      }
      console.log('checking for cached searches');
      let cache = LocalStorage.getItem('cache');
      if (!cache) {
        LocalStorage.set('cache', {});
        cache = LocalStorage.getItem('cache');
      }
      /* @ts-ignore */
      if (!cache.searchmanga) cache.searchmanga = {};
      /* @ts-ignore */
      if (cache.searchmanga[searchmanga.value.trim()]) {
        if (currentSearch != searchmanga.value.trim()) return;
        /* @ts-ignore */
        console.log('found some');
        /* @ts-ignore */

        results.value = cache.searchmanga[searchmanga.value.trim()];
        loading = false;
        if (!navigator.onLine) return;
      } else {
        console.log('none found');
        if (!navigator.onLine) {
          if (currentSearch != searchmanga.value.trim()) return;

          Notify.create({
            message:
              "This search hasn't been cached, so we can't show you anything. Connect to the internet and try again.",
          });
          loading = false;
          results.value = [];
          return;
        }
      }
      if (searchmanga.value.trim().length < 3) {
        loading = false;
        return;
      }
      axios
        .get(
          `https://api.jikan.moe/v3/search/manga?q=${encodeURIComponent(
            searchmanga.value.trim()
          )}&page=1`
        )
        .then((e) => {
          /* @ts-ignore */
          let cache = LocalStorage.getItem('cache');
          /* @ts-ignore */
          if (!cache) {
            LocalStorage.set('cache', {});
            cache = LocalStorage.getItem('cache');
          }
          /* @ts-ignore */
          if (!cache.searchmanga) cache.searchmanga = {};
          /* @ts-ignore */
          cache.searchmanga[searchmanga.value.trim()] = e.data.results;
          /* @ts-ignore */
          cache.searchmanga[searchmanga.value.trim()].date = new Date();
          if (currentSearch.trim() != searchmanga.value.trim()) return;

          LocalStorage.set('cache', cache);

          results.value = e.data.results;
          loading = false;
        })
        .catch((e) => console.log(e));
    });
    onMounted(() => {
      if (route.params.query && route.params.query != searchmanga.value) {
        // @ts-ignore
        searchmanga.value = route.params.query;
      }
    });
    return {
      searchmanga,
      results,
      loading,
      online,
      load,
    };
  },
});
</script>
