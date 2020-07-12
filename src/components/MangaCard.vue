<template>
  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  >
    <q-card
      :class="['q-ma-md', $q.screen.width > 400 ? 'col-2' : 'col-10']"
      v-ripple
      @click="goto('/manga/' + manga.mal_id)"
    >
      <q-img :src="manga.image_url">
        <div class="absolute-bottom">
          <div class="text-h6">{{ manga.title }}</div>
          <div class="text-subtitle2">
            {{ manga.type }}, {{ Math.round(manga.score) }} stars
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
    manga: {
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
