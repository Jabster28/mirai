<template>
  <q-page class="items-center justify-evenly" :key="this.$route.path">
    <div class="post">
      <div v-if="error" class="error">
        {{ error }}
      </div>

      <div v-if="anime.mal_id" class="content">
        <q-dialog v-model="reviewPop">
          <q-card>
            <q-card-section class="row items-center q-pb-none">
              <q-btn
                class="text-h6 q-ma-sm"
                clickable
                flat
                dense
                type="a"
                :to="'/user/' + currentRev.name"
              >
                {{ currentRev.name }}
              </q-btn>
              <q-space />
              <q-btn
                icon="arrow_back"
                flat
                round
                dense
                :disabled="!prevrevable"
                @click="prevrev(currentRev)"
              >
                <q-tooltip>previous review</q-tooltip></q-btn
              >
              <q-btn icon="close" flat round dense v-close-popup>
                <q-tooltip>close</q-tooltip>
              </q-btn>
              <q-btn
                icon="arrow_forward"
                flat
                round
                dense
                :disabled="!nextrevable"
                @click="nextrev(currentRev)"
              >
                <q-tooltip>next review</q-tooltip>
              </q-btn>
            </q-card-section>

            <q-card-section>
              <q-rating
                :modelValue="currentRev.score"
                :max="5"
                no-dimming
                icon="star_border"
                icon-selected="star"
                icon-half="star_half"
                readonly
                color="warning"
              />
            </q-card-section>
            <q-card-section>
              <p v-html="currentRev.text"></p>
              <p class="text-weight-thin">
                {{ currentRev.helpful }}
                {{ currentRev.helpful == 1 ? 'person' : 'people' }} found this
                helpful
              </p>
              <q-btn
                rel="noopener"
                clickable
                dense
                flat
                icon="img:mal.png"
                type="a"
                target="_blank"
                :href="currentRev.url"
                aria-label="open in MyAnimeList"
              >
                <q-tooltip> open in MyAnimeList </q-tooltip>
              </q-btn>
            </q-card-section>
          </q-card>
        </q-dialog>
        <div v-if="$q.screen.width < 700" class="col-7 q-mx-lg">
          <div v-if="anime.title_english && anime.title_english != anime.title">
            <h4>{{ anime.title_english }}</h4>

            <p class="text-subtitle1 text-weight-thin">{{ anime.title }}</p>
          </div>
          <h4 v-else>{{ anime.title }}</h4>
        </div>
        <div
          :class="[
            'q-mx-lg',
            'items-start',
            'justify-evenly',
            $q.screen.width > 700 ? 'row' : 'col',
          ]"
        >
          <div :class="[`q-ma-${$q.screen.width > 700 ? 'xl' : 'sm'}`, 'col']">
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
                    aria-label="watch on gogo anime"
                  >
                    <q-tooltip>watch on GOGO</q-tooltip>
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
                    <q-tooltip> open in MyAnimeList </q-tooltip>
                  </q-btn>
                  <q-btn
                    rel="noopener"
                    v-if="traktURL"
                    class="q-ma-sm"
                    clickable
                    round
                    padding="none"
                    style="font-size: 25px"
                    icon="img:trakt-icon-red.png"
                    type="a"
                    target="_blank"
                    :href="traktURL"
                  >
                    <q-tooltip> open in Trakt.tv </q-tooltip>
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
                    aria-label="watch trailer on YouTube"
                    :href="anime.trailer_url.replace('embed/', 'watch?v=')"
                  >
                    <q-tooltip> watch trailer on YouTube </q-tooltip>
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
              <span class="text-weight-bold">{{ desc[i].toLowerCase() }}:</span>
              {{ anime[i] }}
            </div>
          </div>
          <div class="col-8 q-mx-lg">
            <div v-if="$q.screen.width > 700">
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
                  <q-icon name="stars" /> &nbsp;{{
                    anime.score ? anime.score.toPrecision(3) : '-'
                  }}
                  / 10
                  <q-tooltip>average rating out of 10</q-tooltip>
                </div>

                <div class="float-left q-mx-sm">
                  <q-icon name="visibility" /> &nbsp;{{
                    norm(anime.members) || '0'
                  }}
                  <q-tooltip
                    >number of people with this anime in their list</q-tooltip
                  >
                </div>
                <div class="float-left q-mx-sm">
                  <q-icon name="star" /> &nbsp;{{
                    norm(anime.favorites) || '0'
                  }}
                  <q-tooltip
                    >number of people who favorited this anime</q-tooltip
                  >
                </div>
                <div class="q-mx-sm">
                  #&nbsp;{{ anime.rank ? ordinal_suffix_of(anime.rank) : '-' }}
                  <q-tooltip
                    >official ranking in MAL's Top Anime list</q-tooltip
                  >
                </div>
              </h5>
              <div v-if="$q.cookies.get('mal_auth')">
                <q-select
                  v-model="status"
                  :options="options"
                  label="status"
                  class="q-my-md"
                />
                <q-badge color="accent">
                  score: {{ score == 0 ? '-' : score }}
                </q-badge>
                <q-slider
                  v-model="score"
                  label
                  :min="0"
                  :max="10"
                  color="accent"
                />
                <q-btn
                  label="Update"
                  :loading="loading"
                  push
                  @click="submit"
                  class="q-ma-sm"
                  :disabled="loading || disabled"
                  color="secondary"
                />
                <q-btn
                  label="Remove"
                  :loading="loading"
                  push
                  @click="remove"
                  class="q-ma-sm"
                  :disabled="loading || removed"
                  color="negative"
                />
              </div>
            </q-card>
            <div v-if="reviews.length > 0" class="q-my-md">
              <h5 class="text-weight-thin q-mx-sm">reviews</h5>
              <q-scroll-area
                class="q-ma-md q-mb-xl q-py-none rounded-borders"
                style="height: 250px"
              >
                <div class="row no-wrap">
                  <q-card
                    color="accent"
                    v-for="n in reviews"
                    :key="n"
                    style="width: 400px"
                    class="q-px-sm q-mx-md q-my-none q-pb-xs"
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
                          color="warning"
                        />
                      </div>
                      {{ truncateString(n.content, 200) }}
                    </q-card-section>
                    <q-card-actions class="q-pb-none">
                      <q-btn
                        round
                        flat
                        dense
                        icon="
                          keyboard_arrow_down
                        "
                        aria-label="expand"
                        @click="popout(n)"
                      >
                        <q-tooltip>expand</q-tooltip>
                      </q-btn>
                      <q-btn
                        rel="noopener"
                        clickable
                        dense
                        flat
                        icon="img:mal.png"
                        type="a"
                        target="_blank"
                        :href="n.url"
                        aria-label="open in MyAnimeList"
                      >
                        <q-tooltip> open in MyAnimeList </q-tooltip>
                      </q-btn>
                    </q-card-actions>
                  </q-card>
                </div>
              </q-scroll-area>
            </div>
          </div>
          <br />
          <div v-if="related.length > 0" class="row col-12 q-my-md">
            <p class="text-body1 text-weight-thin col-10 q-mx-xl">
              linked anime
            </p>
            <q-scroll-area
              :visible="false"
              class="q-px-md col-12"
              style="height: 400px"
            >
              <div class="row no-wrap">
                <AnimeCard
                  :trunc="30"
                  v-for="anime in related"
                  :key="anime.node.mal_id"
                  :anime="anime.node"
                  :sub="anime.relation_type_formatted.toLowerCase()"
                  home
                  suggestions
                />
              </div>
            </q-scroll-area>
          </div>
          <div v-if="sugg.length > 0" class="row col-12 q-my-md">
            <p class="text-body1 text-weight-thin col-10 q-mx-xl">
              more like this
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
import { getCache, Anime, Review } from '../helpers';
import { useRoute } from 'vue-router';
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
    let related: Vue.Ref<
      {
        relation_type: string;
        relation_type_formatted: string;
        node: Anime;
      }[]
    > = ref([]);
    let sugg: Vue.Ref<Anime[]> = ref([]);
    let reviews: Vue.Ref<Review[]> = ref([]);
    let removed = ref(false);
    let reviewPop = ref(false);
    let nextrevable = ref(false);
    let prevrevable = ref(false);
    let currentRev: Vue.Ref<{
      name: string;
      text: string;
      url: string;
      score: number;
      helpful: number;
    }> = ref({
      name: '',
      text: '',
      url: '',
      score: 0,
      helpful: 0,
    });
    let g: Vue.Ref<{ [key: string]: boolean }> = ref({});
    let map = {
      'on hold': 'on_hold',
      completed: 'completed',
      'currently watching': 'watching',
      dropped: 'dropped',
      'plan to watch': 'plan_to_watch',
    };
    let traktURL = ref('');
    let disabled = ref(true);
    let loading = ref(false);
    let revmap: { [key: string]: string } = Object.fromEntries(
      Object.entries(map).map((e) => e.reverse())
    );
    let options = [
      'on hold',
      'completed',
      'currently watching',
      'dropped',
      'plan to watch',
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
      rated: '',
      type: '',
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
          `https://mirai-api.herokuapp.com/anime?id=${route.params.id}&code=${
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
          `https://mirai-api.herokuapp.com/anime?id=${route.params.id}&code=${
            // @ts-ignore
            Cookies.get('mal_auth').code
          }`,
          {
            // @ts-ignore
            status: map[status.value],
            score: score.value,
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
    function popout(h: Review) {
      nextrevable.value = true;
      prevrevable.value = true;
      if (
        reviews.value.findIndex((w) => w.content == h.content) + 1 ==
        reviews.value.length
      )
        nextrevable.value = false;

      if (reviews.value.findIndex((w) => w.content == h.content) == 0)
        prevrevable.value = false;
      currentRev.value.name = h.reviewer.username;
      currentRev.value.url = h.url;
      currentRev.value.text = h.content;
      currentRev.value.score = h.reviewer.scores.overall / 2;
      currentRev.value.helpful = h.helpful_count;
      reviewPop.value = true;
    }
    function nextrev(h: any) {
      console.log('oo?');
      if (
        reviews.value.findIndex((w) => w.content == h.text) + 1 ==
        reviews.value.length
      )
        return;

      popout(
        reviews.value[reviews.value.findIndex((w) => w.content == h.text) + 1]
      );
    }
    function prevrev(h: any) {
      console.log('oo?');
      if (reviews.value.findIndex((w) => w.content == h.text) == 0) return;

      popout(
        reviews.value[reviews.value.findIndex((w) => w.content == h.text) - 1]
      );
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
        delay: 200, // ms
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
          } | mirai`;
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

          sugg.value = [];
          reviews.value = [];
          related.value = [];
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
              reviews.value = data.data.reviews.map(
                (e: { content: string }) => {
                  e.content = e.content.replace(/(\n)|(\r)/gm, '<br>');
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                  return e;
                }
              );
            })
            .catch((e) => console.log(e));
          loading.value = true;
          axios
            .get(
              `https://api.trakt.tv/search/${
                data.data.type == 'TV' ? 'show' : 'movie'
              }?query=${data.data.title_english || data.data.title}`,
              {
                headers: {
                  'trakt-api-version': '2',
                  'trakt-api-key':
                    '1d2505a69777719260c1a952548af63fd5cd92de4a96d32b3825a32e8adbc158',
                },
              }
            )
            .then((e) => {
              if (e.data[0]) {
                traktURL.value = `https://trakt.tv/${
                  data.data.type == 'TV' ? 'shows' : 'movies'
                }/${e.data[0][e.data[0].type].ids.trakt}`;
              } else {
                console.log('trakt not found, skipping');
              }
            })
            .catch((e) => console.log(e));
          if (Cookies.get('mal_auth')) {
            axios
              .get(
                'https://mirai-api.herokuapp.com/anime?' +
                  qs.stringify({
                    // @ts-ignore
                    code: Cookies.get('mal_auth').code,
                    id: route.params.id,
                  })
              )
              .then((e) => {
                related.value = e.data.related_anime;
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
      related,
      disabled,
      loading,
      revmap,
      options,
      status,
      oldstatus,
      player,
      score,
      oldscore,
      reviewPop,
      anime,
      error,
      norm,
      popout,
      nextrev,
      prevrev,
      nextrevable,
      prevrevable,
      checkNotif,
      remove,
      submit,
      ordinal_suffix_of,
      reviews,
      currentRev,
      desc,
      truncateString,
      g,
      traktURL,
    };
  },
});
</script>
