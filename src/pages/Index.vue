<template>
  <q-page class="row items-center justify-evenly">
    <div class="col-5 q-my-lg">
      <h1>mirai</h1>
      <h5 disabled>the best MAL client out there.</h5>
    </div>
    <div class="row items-center justify-evenly">
      <div class="col-6">
        <h6>
          MyAnimeList is a great website - it has virtually every anime known to
          man, you can use it to remember which animes you've watched and when,
          it even shows you some recommendations. It's all that a weeb could ask
          for!
        </h6>
        <h6>
          But let's be honest here - the user interface is pretty old. Sure, it
          works, and it's fairly quick, but "quick" isn't enough for me, and it
          shouldn't be for you, either.
        </h6>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'PageIndex',
  mounted() {
    document.title = 'Mirai';
  },
  data() {
    return {};
  }
});
</script>
