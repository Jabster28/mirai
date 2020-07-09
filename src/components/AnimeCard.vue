<template>
  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  >
    <q-card class="q-ma-md">
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

      <q-card-actions>
        <q-btn flat clickable tag="a" :to="'/anime/' + anime.mal_id"
          >Open</q-btn
        >
        <q-btn flat>Action 2</q-btn>
      </q-card-actions>
    </q-card>
  </transition>
</template>

<script>
export default {
  name: 'AnimeCard',
  props: {
    anime: {
      type: Object,
      required: true
    }
  }
};
</script>
