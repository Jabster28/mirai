<template>
  <q-page class="items-center justify-evenly" :key="this.$route.path">
    <div class="post">
      <div v-if="error" class="error">
        {{ error }}
      </div>

      <div v-if="anime.mal_id" class="content">
        <div v-if="$q.screen.lt.sm" class="col-7 q-mx-lg">
          <div v-if="anime.title_english && anime.title_english != anime.title">
            <h4>{{ anime.title_english }}</h4>

            <p class="text-subtitle1 text-weight-thin">{{ anime.title }}</p>
          </div>
        </div>
        <div
          :class="[
            'q-mx-lg',
            'items-start',
            'justify-evenly',
            $q.screen.gt.sm ? 'row' : 'col',
          ]"
        >
          <div :class="[`q-ma-${$q.screen.gt.sm ? 'xl' : 'sm'}`, 'col']">
            <q-card>
              <q-card-section horizontal>
                <q-img :src="anime.image_url" style="max-width: 300px" />
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
                    :href="`https://www25.gogoanimes.tv/search.html?keyword=${encodeURIComponent(
                      anime.title
                    )}`"
                    aria-label="Watch on gogo anime"
                  >
                    <q-tooltip>Watch on GOGO</q-tooltip>
                  </q-btn>
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
                  >
                    <q-tooltip> Open in MyAnimeList </q-tooltip>
                  </q-btn>
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
                    aria-label="Watch trailer on YouTube"
                    :href="anime.trailer_url.replace('embed/', 'watch?v=')"
                  >
                    <q-tooltip> Watch trailer on YouTube </q-tooltip>
                  </q-btn>
                </q-card-actions>
              </q-card-section>
            </q-card>
            <div v-if="anime.trailer_url" class="q-my-xl">
              <div
                id="player"
                data-plyr-provider="youtube"
                :data-plyr-embed-id="anime.trailer_url"
              ></div>
            </div>
            <div
              class="text-subtitle1 q-my-md"
              v-for="i in Object.keys(desc).filter((e) => anime[e])"
              :key="i"
            >
              <span class="text-weight-bold">{{ desc[i] }}:</span>
              {{ anime[i] }}
            </div>
          </div>
          <div class="col-8 q-mx-lg">
            <div v-if="$q.screen.gt.sm">
              <div
                v-if="anime.title_english && anime.title_english != anime.title"
              >
                <h2>{{ anime.title_english }}</h2>

                <h6 class="text-subtitle text-weight-thin">
                  {{ anime.title }}
                </h6>
              </div>

              <h2 v-else>{{ anime.title }}</h2>
            </div>

            <p class="text-body1">{{ anime.synopsis }}</p>
            <q-card class="q-pa-md q-my-lg">
              <h5>
                <div class="float-left q-mx-sm">
                  <q-icon name="stars" />&nbsp;{{
                    anime.score ? anime.score.toPrecision(3) : '-'
                  }}
                  / 10
                </div>

                <div class="float-left q-mx-sm">
                  <q-icon name="visibility" />&nbsp;{{
                    norm(anime.members) || '0'
                  }}
                </div>
                <div class="float-left q-mx-sm">
                  <q-icon name="star" />&nbsp;{{ norm(anime.favorites) || '0' }}
                </div>
                <div class="q-mx-sm">
                  #&nbsp;{{ anime.rank ? ordinal_suffix_of(anime.rank) : '-' }}
                </div>
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
            <div v-if="reviews.length > 0" class="q-my-md">
              <h5 class="text-weight-thin q-mx-sm">Reviews</h5>
              <q-scroll-area
                class="q-my-lg inset-shadow rounded-borders"
                style="height: 250px; max-width: 1800px"
              >
                <div class="row no-wrap">
                  <q-card
                    color="accent"
                    v-for="n in reviews"
                    :key="n"
                    style="width: 400px"
                    class="q-px-sm q-ma-md"
                  >
                    <q-card-section>
                      <q-btn
                        class="text-subtitle2 q-ma-sm"
                        clickable
                        flat
                        dense
                        type="a"
                        :to="'/user/' + n.reviewer.username"
                      >
                        {{ n.reviewer.username }}
                      </q-btn>
                      <div class="row no-wrap items-center">
                        <q-rating
                          :modelValue="n.reviewer.scores.overall / 2"
                          :max="5"
                          no-dimming
                          icon="star_border"
                          icon-selected="star"
                          icon-half="star_half"
                          readonly
                          color="yellow"
                        />
                      </div>
                      {{
                        g[n.url] ? n.content : truncateString(n.content, 250)
                      }}
                    </q-card-section>
                    <q-card-actions>
                      <q-btn
                        v-if="n.content.length > 250"
                        color="grey"
                        round
                        flat
                        dense
                        :icon="
                          g[n.url] ? 'keyboard_arrow_up' : 'keyboard_arrow_down'
                        "
                        aria-label="Expand"
                        @click="g[n.url] = !g[n.url]"
                      >
                        <q-tooltip>Expand</q-tooltip>
                      </q-btn>
                      <q-btn
                        rel="noopener"
                        clickable
                        dense
                        flat
                        icon="img:mal.png"
                        type="a"
                        target="_blank"
                        :href="anime.url"
                        aria-label="Open in MyAnimeList"
                      >
                        <q-tooltip> Open in MyAnimeList </q-tooltip>
                      </q-btn>
                    </q-card-actions>
                  </q-card>
                </div>
              </q-scroll-area>
            </div>
          </div>
          <br />
          <div v-if="sugg.length > 0" class="row col-12 q-my-md">
            <p class="text-body1 text-weight-thin col-10 q-mx-xl">
              More like this
            </p>
            <q-scroll-area
              :visible="false"
              class="q-px-md col-12"
              style="height: 400px"
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
import { getCache, Anime } from '../helpers';
import { useRouter, useRoute } from 'vue-router';
import { defineComponent, onMounted, watch, ref, onBeforeUpdate } from 'vue';
import { Loading, Notify, LocalStorage, Dialog, Cookies } from 'quasar';
import Vue from 'vue';
import Plyr from 'plyr';

export default defineComponent({
  components: { AnimeCard },
  name: 'PageAnime',
  setup(props) {
    const route = useRoute();
    let desc: { [key: string]: string } = {
      rating: 'Content Rating',
      duration: 'Duration',
      premiered: 'Premiered on',
      broadcast: 'Broadcasts on',
      type: 'Type',
      episodes: 'Episodes',
      title_japanese: 'Japanese Title',
    };
    let sugg: Vue.Ref<Anime[]> = ref([]);
    let reviews: Vue.Ref<any[]> = ref([]);
    let removed = ref(false);
    let g: Vue.Ref<{ [key: string]: boolean }> = ref({});
    let map = {
      'On Hold': 'on_hold',
      Completed: 'completed',
      'Currently Watching': 'watching',
      Dropped: 'dropped',
      'Plan to Watch': 'plan_to_watch',
    };
    let disabled = ref(true);
    let loading = ref(false);
    let revmap: { [key: string]: string } = Object.fromEntries(
      Object.entries(map).map((e) => e.reverse())
    );
    let options = [
      'On Hold',
      'Completed',
      'Currently Watching',
      'Dropped',
      'Plan to Watch',
    ];
    let status: Vue.Ref<
      'on_hold' | 'completed' | 'watching' | 'dropped' | 'plan_to_watch' | null
    > = ref(null);
    let oldstatus: Vue.Ref<
      'on_hold' | 'completed' | 'watching' | 'dropped' | 'plan_to_watch' | null
    > = ref(null);
    let player = null;
    let score = ref(0);
    let oldscore = ref(0);
    let anime: Vue.Ref<Anime> = ref({
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
      watching_status: 0,
    });
    let error = '';
    function ordinal_suffix_of(i: number) {
      var j = i % 10,
        k = i % 100;
      if (j == 1 && k != 11) {
        return `${i}st`;
      }
      if (j == 2 && k != 12) {
        return `${i}nd`;
      }
      if (j == 3 && k != 13) {
        return `${i}rd`;
      }
      return `${i}th`;
    }
    function remove() {
      loading.value = true;

      axios
        .delete(
          `https://mirai-api.glitch.me/anime?id=${route.params.id}&code=${
            // @ts-ignore
            Cookies.get('mal_auth').code
          }`
        )
        .then(() => {
          loading.value = false;
          removed.value = true;
          oldstatus = ref(null);
          oldscore = ref(0);
          status = ref(null);
          score = ref(0);
          //
        })
        .catch((e) => console.log(e));
    }
    function submit() {
      loading.value = true;
      removed.value = false;

      axios
        .post(
          `https://mirai-api.glitch.me/anime?id=${route.params.id}&code=${
            // @ts-ignore
            Cookies.get('mal_auth').code
          }`,
          {
            // @ts-ignore
            status: map[status],
            score: score,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        .then((e) => {
          loading.value = false;
        })
        .catch((e) => {
          console.log(e);
          loading.value = false;
        });
    }
    function checkNotif(e: Event) {
      let cache = LocalStorage.getItem('cache');
      // @ts-ignore
      if (e.ctrlKey || cache.gogo) {
      } else {
        e.preventDefault();
        Dialog.create({
          title: 'Hold up!',
          message:
            'This streaming service has a lot of potentially mature ads and pop-ups, so I\'d suggest you get <a target="_blank" href="https://github.com/gorhill/uBlock/blob/master/README.md">a good adblocker</a> before proceeding.',
          cancel: true,
          html: true,
          persistent: true,
        }).onOk(() => {
          // @ts-ignore
          cache.gogo = true;
          LocalStorage.set('cache', cache);
          window.location.href = `https://www25.gogoanimes.tv//search.html?keyword=${encodeURIComponent(
            anime.value.title
          )}`;
        });
      }
    }
    function norm(x: number) {
      if (!x) return;
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function truncateString(str: string, num: number) {
      if (str.length > num) {
        return str.slice(0, num) + '...';
      } else {
        return str;
      }
    }

    function fetchData() {
      error = '';
      Loading.show({
        delay: 400, // ms
      });
      const currentAnime = route.params.id;
      if (!navigator.onLine) {
        getCache(
          'anime',
          LocalStorage,
          currentAnime,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          () => route.params.id,
          (x: string) => {
            Notify.create({ message: x });
          },
          () => {
            Loading.hide();
          }
        );
        // @ts-ignore
        anime.value = LocalStorage.getItem('cache').anime[route.params.id];
      }
      // replace `getPost` with your data fetching util / API wrapper
      axios
        .get(`https://api.jikan.moe/v3/anime/${route.params.id}`)
        .then((data) => {
          Loading.hide();
          anime.value = data.data;
          setTimeout(() => {
            // @ts-ignore
            player = new Plyr('#player');
          }, 1000);
          document.title = `${
            anime.value.title_english || anime.value.title
          } | Mirai`;
          /* @ts-ignore */
          let cache = LocalStorage.getItem('cache');
          /* @ts-ignore */
          if (!cache) {
            LocalStorage.set('cache', {});
            cache = LocalStorage.getItem('cache');
          }
          /* @ts-ignore */
          if (!cache.anime) cache.anime = {};
          /* @ts-ignore */
          cache.anime[route.params.id] = anime;
          /* @ts-ignore */
          cache.anime[route.params.id].date = new Date();
          if (currentAnime != route.params.id) return;

          LocalStorage.set('cache', cache);

          axios
            .get(
              `https://api.jikan.moe/v3/anime/${route.params.id}/recommendations`
            )
            .then((data) => {
              sugg.value = data.data.recommendations;
            })
            .catch((e) => console.log(e));
          axios
            .get(`https://api.jikan.moe/v3/anime/${route.params.id}/reviews`)
            .then((data) => {
              reviews.value = data.data.reviews.map((e: any) => {
                e.content = e.content.replaceAll(/(\\n)|(\\r)/gm, '\n');
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return e;
              });
            })
            .catch((e) => console.log(e));
          loading.value = true;
          if (Cookies.get('mal_auth')) {
            axios
              .get(
                'https://mirai-api.glitch.me/anime?' +
                  qs.stringify({
                    // @ts-ignore
                    code: Cookies.get('mal_auth').code,
                    id: route.params.id,
                  })
              )
              .then((e) => {
                loading.value = false;
                console.log('status', e);

                if (!e.data.my_list_status) {
                  removed.value = true;
                  loading.value = false;
                  oldstatus.value = null;
                  oldscore.value = 0;
                  status.value = null;
                  score.value = 0;
                  return;
                }
                // @ts-ignore
                oldstatus.value = revmap[e.data.my_list_status.status];
                oldscore.value = e.data.my_list_status.score;
                // @ts-ignore
                status.value = revmap[e.data.my_list_status.status];
                score.value = e.data.my_list_status.score;
              })
              .catch((e: string) => {
                error = e;
              });
          }
        })
        .catch((e: string) => {
          console.log(e);
          Loading.hide();
          error = e;
        });
    }
    onMounted(() => {
      // fetch the data when the view is created and the data is
      // already being observed
      fetchData();
    });
    onBeforeUpdate(() => {
      if (route.params.id != anime.value.mal_id) {
        // somethings not right, better refetch data
        console.log('hmmm');
        fetchData();
      }
    });
    watch(status, () => {
      if (oldstatus.value == status.value && oldscore.value == score.value) {
        disabled.value = true;
      } else {
        disabled.value = false;
      }
    });
    watch(score, () => {
      if (oldstatus.value == status.value && oldscore.value == score.value) {
        disabled.value = true;
      } else {
        disabled.value = false;
      }
    });
    return {
      props,
      sugg,
      removed,
      map,
      disabled,
      loading,
      revmap,
      options,
      status,
      oldstatus,
      player,
      score,
      oldscore,
      anime,
      error,
      norm,
      checkNotif,
      remove,
      submit,
      ordinal_suffix_of,
      reviews,
      desc,
      truncateString,
      g,
    };
  },
});
</script>
