<template>
  <q-page class="row items-center justify-evenly">
    <div class="col-5 q-my-lg">
      <h1>mirai</h1>
      <p disabled>the best MAL client out there.</p>
    </div>
    <div v-if="top" class="col-10">
      <h2>Top anime for {{ top.season_name }}, {{ top.season_year }}</h2>
      <q-scroll-area horizontal class="q-ma-md" style="height: 400px;">
        <div class="row no-wrap">
          <AnimeCard
            trunc="30"
            v-for="anime in top.anime.slice(0, 40)"
            :key="anime.mal_id"
            :anime="anime"
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
  },
  data() {
    return {
      top: null
    };
  }
});
</script>
