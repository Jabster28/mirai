<template>
  <q-page class="row items-center justify-evenly">
    <div class="col-5 q-my-lg">
      <h1>mirai</h1>
      <p disabled>the best MAL client out there.</p>
    </div>
    <div v-if="top" class="col-10">
      <h2>Top 10 anime for {{ top.season_name }}, {{ top.season_year }}</h2>
      <q-scroll-area horizontal class="q-ma-md" style="height: 400px;">
        <div class="row no-wrap">
          <AnimeCard
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
      <h2>Recommeneded anime:</h2>
      <q-scroll-area horizontal class="q-ma-md" style="height: 400px;">
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
  </q-page>
</template>

<script lang="ts">
import Vue from 'vue';
import AnimeCard from 'components/AnimeCard.vue';
import axios from 'axios';
import qs from 'qs';

export default Vue.extend({
  components: { AnimeCard },
  name: 'PageIndex',
  mounted() {
    document.title = 'Mirai';
    axios
      .get('https://api.jikan.moe/v3/season')
      .then(data => {
        this.top = data.data;
      })
      .catch(e => console.log(e));
    if (this.$q.cookies.get('mal_auth')) {
      axios
        .get(
          'https://mirai-api.glitch.me/suggestions?' +
            // @ts-ignore
            qs.stringify({ code: this.$q.cookies.get('mal_auth').code })
        )
        .then(data => {
          if (Array.isArray(data.data.data)) this.suggestions = data.data.data;
        })
        .catch(e => console.log(e));
    }
  },
  data() {
    return {
      top: null,
      suggestions: []
    };
  }
});
</script>
