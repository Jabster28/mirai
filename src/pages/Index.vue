<template>
  <q-page class="row items-center justify-evenly">
    <div v-if="top" class="col-10">
      <h4>Top 10 anime for {{ top.season_name }}, {{ top.season_year }}</h4>
      <q-scroll-area horizontal class="q-ma-md" style="height: 400px">
        <div class="row no-wrap" style="height: 400px">
          <AnimeCard
            style="height: 400px"
            :trunc="30"
            v-for="anime in top.anime.slice(0, 10)"
            :key="anime.mal_id"
            home
            :anime="anime"
          />
        </div>
      </q-scroll-area>
    </div>
    <div v-if="suggestions.length" class="col-10">
      <h4>Recommeneded anime:</h4>
      <q-scroll-area
        horizontal
        :visible="false"
        class="q-ma-md"
        style="height: 400px"
      >
        <div class="row no-wrap">
          <AnimeCard
            :trunc="30"
            v-for="anime in suggestions"
            :key="anime.node.id"
            :anime="anime.node"
            home
            suggestions
          />
        </div>
      </q-scroll-area>
    </div>
    <div v-if="hold.length" class="col-10">
      <h4>Animes you've paused:</h4>
      <q-scroll-area
        horizontal
        :visible="false"
        class="q-ma-md"
        style="height: 400px"
      >
        <div class="row no-wrap">
          <AnimeCard
            :trunc="30"
            v-for="anime in hold"
            :key="anime.mal_id"
            :anime="anime"
            home
          />
        </div>
      </q-scroll-area>
    </div>
  </q-page>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { defineComponent } from 'vue';
import AnimeCard from 'components/AnimeCard.vue';
import axios from 'axios';
import qs from 'qs';

export default defineComponent({
  components: { AnimeCard },
  name: 'PageIndex',
  mounted() {
    document.title = 'Mirai';
    axios
      .get('https://api.jikan.moe/v3/season')
      .then((data) => {
        this.top = data.data;
      })
      .catch((e) => console.log(e));
    if (this.$q.cookies.get('mal_auth')) {
      axios
        .get(
          'https://mirai-api.herokuapp.com/suggestions?' +
            // @ts-ignore
            qs.stringify({ code: this.$q.cookies.get('mal_auth').code })
        )
        .then((data) => {
          if (Array.isArray(data.data.data)) this.suggestions = data.data.data;
        })
        .catch((e) => console.log(e));
      axios
        .get(
          `https://api.jikan.moe/v3/user/${
            // @ts-ignore
            this.$q.cookies.get('mal_auth').name
          }/animelist/OnHold`
        )
        .then((data) => {
          if (Array.isArray(data.data.anime)) this.hold = data.data.anime;
        })
        .catch((e) => console.log(e));
    }
  },
  data() {
    return {
      top: null,
      suggestions: [],
      hold: [],
    };
  },
});
</script>
