<template>
  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  >
    <q-card
      :class="[`q-m${search ? 'a' : 'x'}-md`]"
      style="width: 280px"
      v-ripple
      @click="goto('/manga/' + manga.mal_id)"
    >
      <q-img :src="manga.image_url" style="height: 400px">
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
      required: true,
    },
    search: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    goto(e) {
      this.$router.push(e);
    },
  },
};
</script>
