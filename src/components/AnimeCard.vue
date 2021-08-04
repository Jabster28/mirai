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
      @click="goto"
    >
      <q-img
        style="height: 400px"
        :src="suggestions ? anime.main_picture.large : anime.image_url"
      >
        <div class="absolute-bottom">
          <div class="text-h6">{{ truncateString(anime.title, trunc) }}</div>
          <div class="text-subtitle2" v-if="!(home || suggestions)">
            {{ anime.type }}, {{ Math.round(anime.score) }} stars
            {{ anime.rated ? `(${anime.rated})` : '' }}
          </div>
          <div v-else-if="sub">{{ sub }}</div>
        </div>
      </q-img>
    </q-card>
  </transition>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
export default defineComponent({
  name: 'AnimeCard',
  props: {
    suggestions: {
      type: Boolean,
      default: false,
    },
    home: {
      type: Boolean,
      default: false,
    },
    search: {
      type: Boolean,
      default: false,
    },
    anime: {
      type: Object,
      required: true,
    },
    trunc: {
      type: Number,
      default: 45,
    },
    sub: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const router = useRouter();

    function goto() {
      router
        .push(
          `/anime/${props.suggestions ? props.anime.id : props.anime.mal_id}`
        )
        .catch((e) => console.log(e));
    }
    function truncateString(str: string, num: number) {
      if (str.length > num) {
        return str.slice(0, num) + '...';
      } else {
        return str;
      }
    }
    return {
      goto,
      truncateString,
    };
  },
});
</script>
