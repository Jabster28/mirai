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
            'q-mx-lg',
            'items-center',
            'justify-evenly',
            'q-my-md',
            $q.screen.gt.sm ? 'row' : 'col',
          ]"
        >
          <q-card flat class="col-3 q-ma-md">
            <q-card-section>
              <q-img v-if="user.image_url" :src="user.image_url" />
              <q-card-actions class="justify-around">
                <q-btn
                  class="q-ma-sm"
                  color="primary"
                  clickable
                  round
                  style="background: #2e51a2"
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
                  tag="a"
                  to="/login?f=y"
                >
                  Not you?</q-btn
                >
              </q-card-actions>
            </q-card-section>
          </q-card>
          <div class="col-6">
            <h2>{{ user.username }}</h2>

            <h6 class="disabled">
              {{ norm(user.anime_stats.episodes_watched) }} episodes watched,
              {{ norm(user.anime_stats.days_watched) }}
              days wasted.
            </h6>
            <q-select
              v-model="filter"
              :options="options"
              label="Show"
              class="q-my-md"
            />
          </div>
          <br />
          <div class="row">
            <q-table
              title="Anime List"
              :pagination="initialPagination"
              dense
              no-data-label="I didn't find anything for you"
              :rows="
                animelist.filter((e) =>
                  filter == 'All'
                    ? e
                    : watchMap[e.watching_status]
                        .split(' ')
                        .join('')
                        .toLowerCase() == filter.toLowerCase()
                    ? e
                    : undefined
                )
              "
              @row-click="go"
              :loading="tableLoading"
              :columns="columns"
              row-key="title"
              color="amber"
            >
              <template v-slot:no-data="{ icon, message, filter }">
                <div class="full-width row flex-center text-accent q-gutter-sm">
                  <q-icon size="2em" name="sentiment_dissatisfied" />
                  <span> Well this is sad... {{ message }} </span>
                  <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
                </div> </template
            ></q-table>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import axios from 'axios';
import { LocalStorage, Loading, Notify, Cookies } from 'quasar';
import { User, Anime } from '../helpers';
import { defineComponent, onMounted, ref } from 'vue';
import Vue from 'vue';
import { useRouter, useRoute } from 'vue-router';
export default defineComponent({
  name: 'PageUser',
  setup() {
    const router = useRouter();
    const route = useRoute();

    let options = 'All Completed OnHold Watching Dropped PlanToWatch'.split(
      ' '
    );
    let filter = ref('All');
    let initialPagination = {
      sortBy: 'watching_status',
      descending: false,
      rowsPerPage: 5,
    };
    let animelist: Vue.Ref<Anime[]> = ref([]);
    let watchMap = [
      '-',
      'Watching',
      'Completed',
      'On Hold',
      'Dropped',
      '3',
      'Plan to watch',
      'Dropped',
    ];
    let columns = [
      {
        name: 'title',
        label: 'Title',
        field: 'title',
        align: 'left',
        sortable: true,
      },
      {
        name: 'type',
        label: 'Type',
        field: 'type',
        align: 'center',
        sortable: true,
      },
      {
        name: 'score',
        label: 'Score (out of 10)',
        field: 'score',
        format: (val: number | null) => (val ? val : '-'),
        sortable: true,
      },
      {
        name: 'watching_status',
        label: 'Status',
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
      anime_stats: {
        days_watched: 0,
        episodes_watched: 0,
      },
    });
    let tableLoading = ref(false);
    let error = ref('');
    let pageNum = 1;
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
          `https://api.jikan.moe/v3/user/${route.params.id}/animelist/${filter.value}?page=${pageNum}`
        )
        .then((data) => {
          if (pageNum == 1 && !cached) animelist.value = [];
          if (data.data.anime && data.data.anime.length != 0) {
            pageNum++;
            // @ts-ignore
            if (cached) {
              // @ts-ignore
              cachedAnimeList.push(...data.data.anime);
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
            /* @ts-ignore */
            cache.animelist[
              user.value.username.toLowerCase() + '/' + filter.value
            ] = animelist.value;
            /* @ts-ignore */
            cache.animelist[
              user.value.username.toLowerCase() + '/' + filter.value
            ].date = new Date();
            LocalStorage.set('cache', cache);
            cachedAnimeList = [];
          }
        })
        .catch((e) => console.log(e));
    };
    let norm = (x: number) => {
      if (!x) return;
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
    let isUser = () => {
      // @ts-ignore
      return Cookies.get('mal_auth').name == route.params.id;
    };
    let fetchData = () => {
      error.value = '';
      Loading.show({
        delay: 400, // ms
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
          document.title = `${user.value.username} | Mirai`;
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
          cache.user[route.params.id] = user;
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
    return {
      options,
      filter,
      initialPagination,
      animelist,
      watchMap,
      columns,
      user,
      tableLoading,
      error,
      pageNum,
      cachedAnimeList,
      cached,
      go,
      again,
      norm,
      isUser,
      fetchData,
    };
  },
});
</script>
