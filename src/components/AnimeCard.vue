<template>
  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  >
    <q-card
      :class="['q-ma-md', $q.screen.width > 400 ? 'col-2' : 'col-10']"
      v-ripple
      @click="goto('/anime/' + anime.mal_id)"
    >
      <q-img :src="anime.image_url">
        <div class="absolute-bottom">
          <div class="text-h6">{{ anime.title }}</div>
          <div class="text-subtitle2">
            {{ anime.type }}, {{ Math.round(anime.score) }} stars ({{
              anime.rated
            }})
          </div>
        </div>
      </q-img>
    </q-card>
  </transition>
</template>

<script>
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export default {
  name: 'AnimeCard',
  props: {
    anime: {
      type: Object,
      required: true
    }
  },
  methods: {
    goto(e) {
      this.$router.push(e);
    }
  }
};
</script>
