<template>
  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  >
    <q-card
      :class="[
        'q-ma-md',
        $q.screen.width > 400 && !(home || suggestions) ? 'col-2' : 'col-10'
      ]"
      v-ripple
      @click="goto"
    >
      <q-img :src="suggestions ? anime.main_picture.large : anime.image_url">
        <div class="absolute-bottom">
          <div class="text-h6">{{ truncateString(anime.title, trunc) }}</div>
          <div class="text-subtitle2" v-if="!(home || suggestions)">
            {{ anime.type }}, {{ Math.round(anime.score) }} stars
            {{ anime.rated ? `(${anime.rated})` : '' }}
          </div>
        </div>
      </q-img>
    </q-card>
  </transition>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export default {
  name: 'AnimeCard',
  props: {
    suggestions: {
      type: Boolean,
      default: false
    },
    home: {
      type: Boolean,
      default: false
    },
    anime: {
      type: Object,
      required: true
    },
    trunc: {
      type: Number,
      default: 45
    }
  },
  methods: {
    goto() {
      // @ts-ignore
      this.$router.push(
        // @ts-ignore
        `/anime/${this.suggestions ? this.anime.id : this.anime.mal_id}`
      );
    },
    truncateString(str: string, num: number) {
      if (str.length > num) {
        return str.slice(0, num) + '...';
      } else {
        return str;
      }
    }
  }
};
</script>
