<template>
  <q-page class="items-center justify-evenly" :key="this.$route.params.id">
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
            $q.screen.gt.sm ? 'row' : 'col',
          ]"
        >
          <div class="col q-ma-xl">
            <q-card>
              <q-card-section horizontal>
                <q-img :src="manga.image_url" />
                <q-card-actions>
                  <q-btn
                    rel="noopener"
                    class="q-ma-sm"
                    style="background: #2e51a2"
                    clickable
                    round
                    type="a"
                    icon="img:mal.png"
                    target="_blank"
                    :href="manga.url"
                  />
                </q-card-actions>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-7">
            <h2>{{ manga.title }}</h2>

            <h6 class="disabled">{{ manga.title_english }}</h6>
            <p class="text-justify">{{ manga.synopsis }}</p>
            <q-card class="q-pa-md q-my-lg">
              <h5>
                <q-icon name="stars" />
                {{ manga.score ? manga.score.toPrecision(3) : '-' }} / 10 |
                <q-icon name="visibility" /> {{ norm(manga.members) || '0' }}

                |
                <q-icon name="star" /> {{ norm(manga.favorites) || '0' }}

                | # {{ norm(manga.rank) || '-' }}
              </h5>
              <div v-if="$q.cookies.get('mal_auth')">
                <q-select
                  v-model="status"
                  :options="options"
                  label="Status"
                  class="q-my-md"
                />
                <q-badge color="secondary">
                  Score: {{ score == 0 ? '-' : score }}
                </q-badge>
                <q-slider v-model="score" label :min="0" :max="10" />
                <q-btn
                  label="Update"
                  :loading="loading"
                  @click="submit"
                  class="q-ma-sm"
                  :disabled="loading || disabled"
                  color="primary"
                />
                <q-btn
                  label="Remove"
                  :loading="loading"
                  @click="remove"
                  class="q-ma-sm"
                  :disabled="loading || removed"
                  color="secondary"
                />
              </div>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import axios from 'axios';
import qs from 'qs';
import { getCache } from '../helpers';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageManga',
  data() {
    return {
      removed: false,
      map: {
        'On Hold': 'on_hold',
        Completed: 'completed',
        Reading: 'reading',
        Dropped: 'dropped',
        'Plan to Read': 'plan_to_read',
      },
      disabled: true,
      loading: false,
      revmap: {},
      options: ['On Hold', 'Completed', 'Reading', 'Dropped', 'Plan to Read'],
      status: null,
      oldstatus: null,
      player: null,
      score: null,
      oldscore: null,
      manga: {
        title: '',
        mal_id: '',
        image_url: '',
        url: '',
        trailer_url: '',
        title_english: '',
        synopsis: '',
        score: 0,
        members: 0,
        favorites: 0,
        rank: 0,
      },
      error: '',
    };
  },
  created() {
    ['on_hold', 'completed', 'reading', 'dropped', 'plan_to_read'].forEach(
      (key, i) =>
        // @ts-ignore
        (this.revmap[key] = [
          'On Hold',
          'Completed',
          'Reading',
          'Dropped',
          'Plan to Read',
        ][i])
    );
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchData();
  },
  watch: {
    // call again the method if the route changes
    $route: 'fetchData',
    score() {
      if (this.oldstatus == this.status && this.oldscore == this.score) {
        this.disabled = true;
      } else {
        this.disabled = false;
      }
    },
    status() {
      if (this.oldstatus == this.status && this.oldscore == this.score) {
        this.disabled = true;
      } else {
        this.disabled = false;
      }
    },
  },
  methods: {
    remove() {
      this.loading = true;
      axios
        .delete(
          `https://mirai-api.glitch.me/manga?id=${this.$route.params.id}&code=${
            // @ts-ignore
            this.$q.cookies.get('mal_auth').code
          }`
        )
        .then(() => {
          this.loading = false;
          this.removed = true;
          this.oldstatus = null;
          this.oldscore = null;
          this.status = null;
          this.score = null;
          //
        })
        .catch((e) => console.log(e));
    },
    submit() {
      this.loading = true;
      this.removed = false;
      axios
        .post(
          `https://mirai-api.glitch.me/manga?id=${this.$route.params.id}&code=${
            // @ts-ignore
            this.$q.cookies.get('mal_auth').code
          }`,
          {
            // @ts-ignore
            status: this.map[this.status],
            score: this.score,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        .then((e) => {
          this.loading = false;
          console.log(e);
          this.loading = false;
        })
        .catch((e) => {
          console.log(e);
          this.loading = false;
        });
    },
    norm(x: number) {
      if (!x) return;
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    fetchData() {
      this.error = '';
      this.$q.loading.show({
        delay: 400, // ms
      });
      const currentManga = this.$route.params.id;
      if (!navigator.onLine) {
        getCache(
          'manga',
          this.$q.localStorage,
          currentManga,
          () => this.$route.params.id,
          (x: string) => {
            this.$q.notify(x);
          },
          () => {
            this.$q.loading.hide();
          }
        );
        // @ts-ignore
        this.manga =
          this.$q.localStorage.getItem('cache').manga[this.$route.params.id];
      }
      // replace `getPost` with your data fetching util / API wrapper
      axios
        .get(`https://api.jikan.moe/v3/manga/${this.$route.params.id}`)
        .then((data) => {
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
          axios
            .get(
              'https://mirai-api.glitch.me/manga?' +
                qs.stringify({
                  // @ts-ignore
                  code: this.$q.cookies.get('mal_auth').code,
                  id: this.$route.params.id,
                })
            )
            .then((e) => {
              this.loading = false;
              if (!e.data.my_list_status) {
                this.removed = true;
                this.loading = false;
                this.oldstatus = null;
                this.oldscore = null;
                this.status = null;
                this.score = null;
                return;
              }
              // @ts-ignore
              this.oldstatus = this.revmap[e.data.my_list_status.status];
              this.oldscore = e.data.my_list_status.score;
              // @ts-ignore
              this.status = this.revmap[e.data.my_list_status.status];
              this.score = e.data.my_list_status.score;
            })
            .catch((e: string) => {
              this.error = e;
            });
        })
        .catch((e: string) => {
          console.log(e);
          this.$q.loading.hide();
        });
    },
  },
});
</script>
