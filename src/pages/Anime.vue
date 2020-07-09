<template>
  <q-page class="row items-center justify-evenly">
    <div class="post">
      <div v-if="error" class="error">
        {{ error }}
      </div>

      <div v-if="anime.mal_id" class="content">
        <div class="col q-mx-lg">
          <q-img :src="anime.image_url" />
          <q-btn
            class="q-ma-lg"
            color="secondary"
            clickable
            type="a"
            target="_blank"
            :href="anime.url"
          >
            Open in MAL</q-btn
          >
        </div>
        <div class="col q-mx-lg items-center justify-evenly">
          <h2>{{ anime.title }}</h2>
          <h6 class="disabled">{{ anime.title_english }}</h6>
          <h5><q-icon name="stars" /> {{ anime.score * 10 }}%</h5>
          <h5><q-icon name="visibility" /> {{ norm(anime.members) }}</h5>
          <h5><q-icon name="star" />{{ norm(anime.favorites) }}</h5>
          <h5>Ranked: #{{ anime.rank }}</h5>
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
  name: 'PageAnime',
  data() {
    return {
      anime: {
        title: '',
        mal_id: ''
      },
      error: ''
    };
  },
  created() {
    console.log('created');
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchData();
  },
  watch: {
    // call again the method if the route changes
    $route: 'fetchData'
  },
  methods: {
    norm(x: number) {
      if (!x) return;
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    fetchData() {
      this.error = '';
      this.$q.loading.show({
        delay: 400 // ms
      });

      // replace `getPost` with your data fetching util / API wrapper
      axios
        .get(`https://api.jikan.moe/v3/anime/${this.$route.params.id}`)
        .then(data => {
          console.log(data.data);
          this.$q.loading.hide();
          this.anime = data.data;
          document.title = `${this.anime.title} | Mirai`;
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
