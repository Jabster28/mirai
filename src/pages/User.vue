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
            <q-select
              v-model="filter"
              :options="options"
              label="Show"
              class="q-my-md"
            />
          </div>
          <div class="col-10">
            <q-table
              title="Anime List"
              :pagination="initialPagination"
              :dense="$q.screen.lt.md"
              :data="animelist"
              @row-click="go"
              :loading="tableLoading"
              :columns="columns"
              row-key="title"
              color="amber"
            />
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
      options: 'All Completed OnHold Watching Dropped PlanToWatch'.split(' '),
      filter: 'All',
      initialPagination: {
        sortBy: 'watching_status',
        descending: false,
        rowsPerPage: 20
      },
      animelist: [],
      watchMap: [
        '-',
        'Watching',
        'Completed',
        'On Hold',
        'Dropped',
        '3',
        'Plan to watch',
        'Dropped'
      ],
      columns: [
        {
          name: 'title',
          label: 'Title',
          field: 'title',
          align: 'left',
          sortable: true
        },
        {
          name: 'type',
          label: 'Type',
          field: 'type',
          align: 'center',
          sortable: true
        },
        {
          name: 'score',
          label: 'Score (out of 10)',
          field: 'score',
          format: (val: number | null) => (val ? val : '-'),
          sortable: true
        },
        {
          name: 'watching_status',
          label: 'Status',
          field: 'watching_status',
          // @ts-ignore
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          format: val => this.watchMap[val],
          sortable: true
        }
      ],
      user: {
        username: ''
      },
      tableLoading: false,
      error: '',
      pageNum: 1,
      cachedAnimeList: [],
      cached: false
    };
  },
  created() {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchData();
  },
  watch: {
    // call again the method if the route changes
    $route: 'fetchData',
    filter() {
      this.tableLoading = true;
      this.again();
    }
  },
  methods: {
    // @ts-ignore
    go(a, b) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      this.$router.push(`/anime/${b.mal_id}`).catch(e => console.log(e));
    },
    again() {
      /* @ts-ignore */
      let cache = this.$q.localStorage.getItem('cache');
      /* @ts-ignore */
      if (!cache) {
        this.$q.localStorage.set('cache', {});
        cache = this.$q.localStorage.getItem('cache');
      }
      if (
        /* @ts-ignore */
        cache.animelist &&
        /* @ts-ignore */
        cache.animelist[this.user.username.toLowerCase() + '/' + this.filter]
      ) {
        /* @ts-ignore */
        this.cached = true;
        /* @ts-ignore */
        this.animelist =
          /* @ts-ignore */
          cache.animelist[this.user.username.toLowerCase() + '/' + this.filter];
      }
      axios
        .get(
          `https://api.jikan.moe/v3/user/${this.$route.params.id}/animelist/${this.filter}?page=${this.pageNum}`
        )
        .then(data => {
          if (this.pageNum == 1 && !this.cached) this.animelist = [];
          if (data.data.anime && data.data.anime.length != 0) {
            this.pageNum++;
            // @ts-ignore
            if (this.cached) {
              // @ts-ignore
              this.cachedAnimeList.push(...data.data.anime);
            } else {
              // @ts-ignore
              this.animelist.push(...data.data.anime);
            }
            // eslint-disable-next-line @typescript-eslint/unbound-method
            const x = this.again;
            setTimeout(x, 2000);
          } else {
            this.pageNum = 1;
            this.tableLoading = false;
            if (this.cached) {
              this.animelist = this.cachedAnimeList;
            }
            this.cached = false;
            /* @ts-ignore */
            let cache = this.$q.localStorage.getItem('cache');
            /* @ts-ignore */
            if (!cache) {
              this.$q.localStorage.set('cache', {});
              cache = this.$q.localStorage.getItem('cache');
            }
            /* @ts-ignore */
            if (!cache.animelist) cache.animelist = {};
            /* @ts-ignore */
            cache.animelist[
              this.user.username.toLowerCase() + '/' + this.filter
            ] = this.animelist;
            /* @ts-ignore */
            cache.animelist[
              this.user.username.toLowerCase() + '/' + this.filter
            ].date = new Date();
            this.$q.localStorage.set('cache', cache);
            this.cachedAnimeList = [];
          }
        })
        .catch(e => console.log(e));
    },
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
          this.again();
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
          this.tableLoading = true;
          this.again();
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
