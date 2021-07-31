<template>
  <q-page class="items-center justify-evenly">
    <div class="post">
      <div v-if="error" class="row error justify-evenly">
        <div class="col-8">
          <h1>?</h1>
          <h5>Something went wrong, try again later.</h5>
        </div>
      </div>

      <div v-if="user.username" class="content">
        <div
          :class="[
            'q-mx-xl',
            'items-top',
            'justify-evenly',
            'q-my-md',
            $q.screen.width > 700 ? 'row' : 'col',
          ]"
        >
          <div class="col-4">
            <h2>{{ user.username }}</h2>
            <q-card flat class="q-ma-md">
              <q-card-section>
                <q-img v-if="user.image_url" :src="user.image_url" />
                <q-card-actions class="justify-around">
                  <q-btn
                    class="q-ma-sm"
                    style="background: #2e51a2"
                    clickable
                    round
                    icon="img:mal.png"
                    type="a"
                    target="_blank"
                    :href="user.url"
                  />
                  <q-btn
                    v-if="isUser()"
                    class="q-ma-sm"
                    color="secondary"
                    clickable
                    push
                    tag="a"
                    to="/login?f=y"
                  >
                    Not you?</q-btn
                  >
                </q-card-actions>
              </q-card-section>
            </q-card>
            <h6 class="text-grey">
              {{ norm(user.anime_stats.episodes_watched) }} episodes watched,
              {{ norm(user.anime_stats.days_watched) }}
              days wasted.
            </h6>
            <div v-if="user.about && user.about.trim() != ''">
              <p>user description:</p>
              <q-card class="q-pa-sm q-ma-md">
                <div v-html="user.about.trim()" />
              </q-card>
            </div>

            <!-- <div class="col-6">
            <h2>{{ user.username }}</h2>
            <h6 class="text-grey">
              {{ norm(user.anime_stats.episodes_watched) }} episodes watched,
              {{ norm(user.anime_stats.days_watched) }}
              days wasted.
            </h6>
            <div class="col-12" v-if="user.about.trim() != ''">
              <p>User Description:</p>
              <q-card class="q-pa-sm q-ma-md bg-grey-3">
                <div v-html="user.about.trim()" />
              </q-card>
            </div>
            <q-select
              v-model="filter"
              :options="options"
              label="Show"
              class="q-my-md"
            />
          </div> -->
            <br />
          </div>
          <div class="col-8">
            <q-select
              v-model="filter"
              :options="options"
              label="show"
              class="q-ma-md"
            />
            <q-table
              title="anime list"
              :pagination="initialPagination"
              dense
              :filter="searchFilter"
              :no-data-label="nodata"
              :rows="
                animelist.reduce((a, e) => {
                  if (
                    filter != 'all' &&
                    watchMap[e.watching_status]
                      .split(' ')
                      .join('')
                      .toLowerCase() != filter.replace(/ /g, '').toLowerCase()
                  ) {
                    return a;
                  }
                  a.push({ ...e, name: e.title });
                  return a;
                }, [])
              "
              :loading="tableLoading"
              :columns="columns"
              row-key="name"
              color="accent"
            >
              <template v-slot:body-cell-name="props">
                <q-td :props="props">
                  <q-btn
                    class="q-ma-none q-py-none"
                    flat
                    dense
                    type="a"
                    :to="`/anime/${props.row.mal_id}`"
                    aria-label="Open"
                  >
                    <div>
                      {{ props.value }}
                    </div>
                  </q-btn>
                  <div>
                    {{ props.row.details }}
                  </div>
                </q-td>
              </template>
              <template v-slot:top-right>
                <q-input
                  borderless
                  dense
                  debounce="50"
                  v-model="searchFilter"
                  placeholder="search"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </template>
            </q-table>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import axios from 'axios';
import { LocalStorage, Loading, Notify, Cookies, Screen } from 'quasar';
import { User, Anime } from '../helpers';
import { defineComponent, onMounted, ref, watch } from 'vue';
import Vue from 'vue';
import { useRouter, useRoute } from 'vue-router';

Screen.setSizes({ sm: 200 });
const truncateString = (string = '', maxLength = 50) =>
  string.length > maxLength ? `${string.substring(0, maxLength)}…` : string;
export default defineComponent({
  name: 'PageUser',
  setup() {
    const router = useRouter();
    const route = useRoute();

    let options = 'all,completed,on hold,watching,dropped,plan to watch'.split(
      ','
    );
    let filter = ref('all');
    let initialPagination = {
      sortBy: 'watching_status',
      descending: false,
      rowsPerPage: 50,
    };
    let animelist: Vue.Ref<Anime[]> = ref([]);
    let watchMap = [
      '-',
      'watching',
      'completed',
      'on hold',
      'dropped',
      '3',
      'plan to watch',
      'dropped',
    ];
    let columns = [
      {
        name: 'name',
        label: 'title',
        field: 'name',
        align: 'left',
        sortable: true,
      },
      {
        name: 'type',
        label: 'type',
        field: 'type',
        align: 'center',
        sortable: true,
      },
      {
        name: 'score',
        label: 'score (out of 10)',
        field: 'score',
        format: (val: number | null) => (val ? val : '-'),
        sortable: true,
      },
      {
        name: 'watching_status',
        label: 'status',
        field: 'watching_status',
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        format: (val) => watchMap[val],
        sortable: true,
      },
    ];
    let user: Vue.Ref<User> = ref({
      username: '',
      url: '',
      about: '',
      anime_stats: {
        days_watched: 0,
        episodes_watched: 0,
      },
    });
    let tableLoading = ref(false);
    let error = ref('');
    let pageNum = 1;
    let nodata = ref('');
    let searchFilter = ref('');
    let cachedAnimeList: Anime[] = [];
    let cached = false;
    let go = (_: unknown, b: Anime) => {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      router.push(`/anime/${b.mal_id}`).catch((e) => console.log(e));
    };
    let again = () => {
      /* @ts-ignore */
      let cache = LocalStorage.getItem('cache');
      /* @ts-ignore */
      if (!cache) {
        LocalStorage.set('cache', {});
        cache = LocalStorage.getItem('cache');
      }
      if (
        /* @ts-ignore */
        cache.animelist &&
        /* @ts-ignore */
        cache.animelist[user.value.username.toLowerCase() + '/' + filter.value]
      ) {
        /* @ts-ignore */
        cached = true;
        /* @ts-ignore */
        animelist.value =
          /* @ts-ignore */
          cache.animelist[
            user.value.username.toLowerCase() + '/' + filter.value
          ];
      }
      axios
        .get(
          `https://api.jikan.moe/v3/user/${route.params.id}/animelist/all?page=${pageNum}`
        )
        .then((data: { data: { anime: Anime[] } }) => {
          if (pageNum == 1 && !cached) animelist.value = [];
          if (data.data.anime && data.data.anime.length != 0) {
            pageNum++;
            // @ts-ignore
            if (cached) {
              // @ts-ignore
              cachedAnimeList.push(
                ...data.data.anime.map((e) => {
                  return {
                    ...e,
                  };
                })
              );
            } else {
              // @ts-ignore
              animelist.value.push(...data.data.anime);
            }
            // eslint-disable-next-line @typescript-eslint/unbound-method
            const x = again;
            setTimeout(x, 600);
          } else {
            pageNum = 1;
            tableLoading.value = false;
            if (cached) {
              animelist.value = cachedAnimeList;
            }
            cached = false;
            /* @ts-ignore */
            let cache = LocalStorage.getItem('cache');
            /* @ts-ignore */
            if (!cache) {
              LocalStorage.set('cache', {});
              cache = LocalStorage.getItem('cache');
            }
            /* @ts-ignore */
            if (!cache.animelist) cache.animelist = {};
            let x = animelist.value;
            x.forEach((e, i, a) => {
              // @ts-ignore
              a[i] = {
                title: e.title,
                name: e.title,
                title_english: e.title_english,
                mal_id: e.mal_id,
                type: e.type,
                score: e.score,
                watching_status: e.watching_status,
              };
            });
            /* @ts-ignore */
            cache.animelist[
              user.value.username.toLowerCase() + '/' + filter.value
            ] = x;
            /* @ts-ignore */
            cache.animelist[
              user.value.username.toLowerCase() + '/' + filter.value
            ].date = new Date();
            LocalStorage.set('cache', cache);
            cachedAnimeList = [];
          }
        })
        .catch((e) => {
          console.log(e);
          tableLoading.value = false;
        });
    };
    let norm = (x: number) => {
      if (!x) return;
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
    let isUser = () => {
      // @ts-ignore
      return (
        // @ts-ignore
        Cookies.get('mal_auth') &&
        // @ts-ignore
        Cookies.get('mal_auth').name &&
        // @ts-ignore
        Cookies.get('mal_auth').name == route.params.id
      );
    };
    let nodataref = () => {
      nodata.value =
        [
          'Nothing but tumbleweeds...',
          'Nothing to see here, folks!',
          "Guess they don't watch that much anime...",
          '*cricket noises*',
        ].find((_, i, ar) => Math.random() < 1 / (ar.length - i)) || '';
    };
    let fetchData = () => {
      error.value = '';
      Loading.show({
        delay: 200, // ms
      });
      const currentUser = route.params.id;
      if (!navigator.onLine) {
        console.log('checking for cached user data');
        let cache = LocalStorage.getItem('cache');
        if (!cache) {
          LocalStorage.set('cache', {});
          cache = LocalStorage.getItem('cache');
        }
        /* @ts-ignore */
        if (!cache.user) cache.user = {};
        /* @ts-ignore */
        if (cache.user[route.params.id]) {
          if (currentUser != route.params.id) return;

          /* @ts-ignore */
          console.log('found some');
          /* @ts-ignore */

          user.value = cache.user[route.params.id];
          Loading.hide();
          again();
          return;
        } else {
          console.log('none found');
          if (currentUser != route.params.id) return;

          Notify.create({
            message:
              "This user's data hasn't been cached, so we can't show you anything. Connect to the internet and try again.",
          });
          Loading.hide();
          return;
        }
      }
      // replace `getPost` with your data fetching util / API wrapper
      axios
        .get(`https://api.jikan.moe/v3/user/${route.params.id}`)
        .then((data) => {
          Loading.hide();
          user.value = data.data;
          document.title = `${user.value.username} | mirai`;
          /* @ts-ignore */
          let cache = LocalStorage.getItem('cache');
          /* @ts-ignore */
          if (!cache) {
            LocalStorage.set('cache', {});
            cache = LocalStorage.getItem('cache');
          }
          /* @ts-ignore */
          if (!cache.user) cache.user = {};
          /* @ts-ignore */
          cache.user[route.params.id] = { ...user.value, favorites: {} };
          /* @ts-ignore */
          cache.user[route.params.id].date = new Date();
          if (currentUser != route.params.id) return;

          LocalStorage.set('cache', cache);
          tableLoading.value = true;
          again();
        })
        .catch((e: string) => {
          console.log(e);
          Loading.hide();
          error.value = e;
        });
    };
    onMounted(fetchData);
    watch(filter, () => {
      nodataref();
      searchFilter.value = '';
    });
    watch(searchFilter, nodataref);
    return {
      options,
      filter,
      initialPagination,
      animelist,
      watchMap,
      columns,
      user,
      nodata,
      nodataref,
      tableLoading,
      error,
      pageNum,
      cachedAnimeList,
      cached,
      go,
      again,
      searchFilter,
      norm,
      isUser,
      fetchData,
    };
  },
});
</script>
