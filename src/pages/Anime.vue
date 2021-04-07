<template>
  <q-page class="items-center justify-evenly" :key="this.$route.params.id">
    <div class="post">
      <div v-if="error" class="error">
        {{ error }}
      </div>

      <div v-if="anime.mal_id" class="content">
        <div
          :class="[
            'q-mx-lg',
            'items-center',
            'justify-evenly',
            $q.screen.width > 800 ? 'row' : 'col'
          ]"
        >
          <div class="q-ma-xl col">
            <div class="q-ma-xl">
              <div
                id="player"
                data-plyr-provider="youtube"
                class="q-ma-lg"
                :data-plyr-embed-id="anime.trailer_url"
              ></div>
            </div>
            <q-card>
              <q-card-section horizontal>
                <q-img :src="anime.image_url" />
                <q-card-actions vertical class="justify-around">
                  <q-btn
                    rel="noopener"
                    class="q-ma-sm"
                    color="deep-orange"
                    clickable
                    @click="checkNotif"
                    type="a"
                    round
                    target="_blank"
                    icon="play_arrow"
                    :href="
                      `https://www25.gogoanimes.tv/search.html?keyword=${encodeURIComponent(
                        anime.title
                      )}`
                    "
                  />
                  <q-btn
                    rel="noopener"
                    class="q-ma-sm"
                    style="background: #2e51a2"
                    clickable
                    round
                    icon="img:mal.png"
                    type="a"
                    target="_blank"
                    :href="anime.url"
                  />
                  <q-btn
                    v-if="anime.trailer_url"
                    rel="noopener"
                    class="q-ma-sm"
                    round
                    color="red"
                    target="_blank"
                    clickable
                    type="a"
                    icon="theaters"
                    :href="anime.trailer_url"
                  />
                </q-card-actions>
              </q-card-section>
            </q-card>
            <div class="col-1 justify-around items-center"></div>
          </div>
          <div class="col-7 q-mx-lg">
            <div
              v-if="anime.title_english && anime.title_english != anime.title"
            >
              <h2>{{ anime.title_english }}</h2>

              <h6 class="disabled">{{ anime.title }}</h6>
            </div>

            <h2 v-else>{{ anime.title }}</h2>
            <p class="text-justify">{{ anime.synopsis }}</p>
            <q-card class="q-pa-md q-my-lg">
              <h5>
                <q-icon name="stars" />
                {{ anime.score ? anime.score.toPrecision(3) : '-' }} / 10 |
                <q-icon name="visibility" /> {{ norm(anime.members) || '0' }}

                |
                <q-icon name="star" /> {{ norm(anime.favorites) || '0' }}

                | # {{ norm(anime.rank) || '-' }}
              </h5>
              <div
                v-if="
                  $q.cookies.get('mal_auth') &&
                    this.$parent.$parent.$parent.online
                "
              >
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
          <div v-if="anime.trailer_url" class="col-3">
            <div
              id="player"
              data-plyr-provider="youtube"
              class="q-ma-lg"
              :data-plyr-embed-id="anime.trailer_url"
            ></div>
          </div>
          <div v-if="sugg.length > 0" class="col-10">
            <h3 disabled>More like this</h3>
            <q-scroll-area
              horizontal
              :visible="false"
              class="q-px-md"
              style="height: 400px;"
            >
              <div class="row no-wrap">
                <AnimeCard
                  :trunc="30"
                  v-for="anime in sugg.slice(0, 10)"
                  :key="anime.mal_id"
                  :anime="anime"
                  home
                />
              </div>
            </q-scroll-area>
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
import AnimeCard from 'components/AnimeCard.vue';
import qs from 'qs';
import { getCache } from '../helpers';
import Vue from 'vue';
import * as Plyr from 'plyr';

export default Vue.extend({
  components: { AnimeCard },
  name: 'PageAnime',
  data() {
    return {
      sugg: [],
      removed: false,
      map: {
        'On Hold': 'on_hold',
        Completed: 'completed',
        'Currently Watching': 'watching',
        Dropped: 'dropped',
        'Plan to Watch': 'plan_to_watch'
      },
      disabled: true,
      loading: false,
      revmap: {},
      options: [
        'On Hold',
        'Completed',
        'Currently Watching',
        'Dropped',
        'Plan to Watch'
      ],
      status: null,
      oldstatus: null,
      player: null,
      score: null,
      oldscore: null,
      anime: {
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
        rank: 0
      },
      error: ''
    };
  },
  created() {
    ['on_hold', 'completed', 'watching', 'dropped', 'plan_to_watch'].forEach(
      (key, i) =>
        // @ts-ignore
        (this.revmap[key] = [
          'On Hold',
          'Completed',
          'Currently Watching',
          'Dropped',
          'Plan to Watch'
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
    }
  },
  methods: {
    remove() {
      this.loading = true;

      axios
        .delete(
          `https://mirai-api.glitch.me/anime?id=${this.$route.params.id}&code=${
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
        .catch(e => console.log(e));
    },
    submit() {
      this.loading = true;
      this.removed = false;

      axios
        .post(
          `https://mirai-api.glitch.me/anime?id=${this.$route.params.id}&code=${
            // @ts-ignore
            this.$q.cookies.get('mal_auth').code
          }`,
          {
            // @ts-ignore
            status: this.map[this.status],
            score: this.score
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
        .then(e => {
          this.loading = false;

          console.log(e);
          this.loading = false;
        })
        .catch(e => {
          console.log(e);
          this.loading = false;
        });
    },
    checkNotif(e: Event) {
      let cache = this.$q.localStorage.getItem('cache');
      // @ts-ignore
      if (e.ctrlKey || cache.gogo) {
      } else {
        e.preventDefault();
        this.$q
          .dialog({
            title: 'Hold up!',
            message:
              'This streaming service has a lot of potentially mature ads and pop-ups, so I\'d suggest you get <a target="_blank" href="https://github.com/gorhill/uBlock/blob/master/README.md">a good adblocker</a> before proceeding.',
            cancel: true,
            html: true,
            persistent: true
          })
          .onOk(() => {
            // @ts-ignore
            cache.gogo = true;
            this.$q.localStorage.set('cache', cache);
            window.location.href = `https://www25.gogoanimes.tv//search.html?keyword=${encodeURIComponent(
              this.anime.title
            )}`;
          });
      }
    },
    norm(x: number) {
      if (!x) return;
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    fetchData() {
      this.error = '';
      this.$q.loading.show({
        delay: 400 // ms
      });
      const currentAnime = this.$route.params.id;
      if (!navigator.onLine) {
        getCache(
          'anime',
          this.$q.localStorage,
          currentAnime,
          () => this.$route.params.id,
          (x: string) => {
            this.$q.notify(x);
          },
          () => {
            this.$q.loading.hide();
          }
        );
        // @ts-ignore
        this.anime = this.$q.localStorage.getItem('cache').anime[
          this.$route.params.id
        ];
      }
      // replace `getPost` with your data fetching util / API wrapper
      axios
        .get(`https://api.jikan.moe/v3/anime/${this.$route.params.id}`)
        .then(data => {
          this.$q.loading.hide();
          this.anime = data.data;
          setTimeout(() => {
            // @ts-ignore
            this.player = new Plyr('#player');
          }, 1000);
          document.title = `${this.anime.title_english ||
            this.anime.title} | Mirai`;
          /* @ts-ignore */
          let cache = this.$q.localStorage.getItem('cache');
          /* @ts-ignore */
          if (!cache) {
            this.$q.localStorage.set('cache', {});
            cache = this.$q.localStorage.getItem('cache');
          }
          /* @ts-ignore */
          if (!cache.anime) cache.anime = {};
          /* @ts-ignore */
          cache.anime[this.$route.params.id] = this.anime;
          /* @ts-ignore */
          cache.anime[this.$route.params.id].date = new Date();
          if (currentAnime != this.$route.params.id) return;

          this.$q.localStorage.set('cache', cache);

          axios
            .get(
              `https://api.jikan.moe/v3/anime/${this.$route.params.id}/recommendations`
            )
            .then(data => {
              this.sugg = data.data.recommendations;
            })
            .catch(e => console.log(e));
          this.loading = true;
          if (this.$q.cookies.get('mal_auth')) {
            axios
              .get(
                'https://mirai-api.glitch.me/anime?' +
                  qs.stringify({
                    // @ts-ignore

                    code: this.$q.cookies.get('mal_auth').code,
                    id: this.$route.params.id
                  })
              )
              .then(e => {
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
          }
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
