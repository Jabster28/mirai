<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageMe',
  mounted() {
    /* @ts-ignore */
    let username = this.$q.cookies.get('mal_auth');
    /* @ts-ignore */
    if (!username) {
      this.$router.replace('/login').catch((e) => console.log(e));
    } else {
      this.$router
        // @ts-ignore
        .replace('/user/' + encodeURIComponent(username.name))
        .catch((e) => console.log(e));
    }
  },
});
</script>
