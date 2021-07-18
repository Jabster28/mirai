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
      <AnimeCard
        v-for="anime in results"
        :key="anime.mal_id"
        :anime="anime"
        search
      />
    </div>
  </q-page>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { defineComponent, onMounted, watch, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Anime } from '../helpers';
import Vue from 'vue';
import { LocalStorage, Notify } from 'quasar';
import AnimeCard from 'components/AnimeCard.vue';
import axios from 'axios';
export default defineComponent({
  name: 'PageSearch',
  components: { AnimeCard },
  setup() {
    const router = useRouter();
    const route = useRoute();
    let search = ref('');
    let results: Vue.Ref<Anime[]> = ref([]);
    let loading = false;
    let online = false;
    let load = () => {
      loading = true;
    };
    onMounted(function () {
      if (route.params.query && route.params.query != search.value) {
        // @ts-ignore
        search.value = route.params.query;
      }
    });
    watch(search, () => {
      document.title =
        search.value && search.value.trim()
          ? `"${search.value}" | Search Mirai`
          : 'Search Mirai';
      if (!route.params.query || route.params.query != search.value) {
        router
          .replace('/search/' + encodeURIComponent(search.value || ''))
          .catch((e) => console.log(e));
      }
      const currentSearch = search.value.trim();
      loading = true;
      if (!search.value || search.value.trim() == '') {
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
      if (!cache.search) cache.search = {};
      /* @ts-ignore */
      if (cache.search[search.value.trim()]) {
        if (currentSearch != search.value.trim()) return;
        /* @ts-ignore */
        console.log('found some');
        /* @ts-ignore */

        results.value = cache.search[search.value.trim()];
        loading = false;
        if (!navigator.onLine) return;
      } else {
        console.log('none found');
        if (!navigator.onLine) {
          if (currentSearch != search.value.trim()) return;

          Notify.create({
            message:
              "This search hasn't been cached, so we can't show you anything. Connect to the internet and try again.",
          });
          loading = false;
          results.value = [];
          return;
        }
      }
      if (search.value.trim().length < 3) {
        loading = false;
        return;
      }
      axios
        .get(
          `https://api.jikan.moe/v3/search/anime?q=${encodeURIComponent(
            search.value.trim()
          )}&page=1`
        )
        .then((e: { data: { results: Anime[] } }) => {
          /* @ts-ignore */
          let cache = LocalStorage.getItem('cache');
          /* @ts-ignore */
          if (!cache) {
            LocalStorage.set('cache', {});
            cache = LocalStorage.getItem('cache');
          }
          /* @ts-ignore */
          if (!cache.search) cache.search = {};
          e.data.results;
          let x = e.data.results;
          x.forEach((f, i, a) => {
            // @ts-ignore
            a[i] = {
              mal_id: f.mal_id,
              image_url: f.image_url,
              title: f.title,
              type: f.type,
              score: f.score,
              rated: f.rated,
            };
          });
          /* @ts-ignore */
          cache.search[search.value.trim()] = x;
          /* @ts-ignore */
          cache.search[search.value.trim()].date = new Date();
          if (currentSearch.trim() != search.value.trim()) return;

          LocalStorage.set('cache', cache);

          results.value = e.data.results;
          loading = false;
        })
        .catch((e) => console.log(e));
    });
    return {
      search,
      results,
      loading,
      online,
      load,
    };
  },
});
</script>
