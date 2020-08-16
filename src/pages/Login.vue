<template>
  <q-page class="row items-center justify-evenly"> </q-page>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import Vue from 'vue';
export default Vue.extend({
  name: 'PageLogin',
  data() {
    return {};
  },
  mounted() {
    this.$q.loading.show({
      delay: 400
    });
    if (this.$q.cookies.get('mal_auth')) {
      this.$router.replace('/me').catch(e => console.log(e));
    } else {
      window.location.replace(
        'https://mirai-api.glitch.me/auth?red=' +
          encodeURIComponent(
            window.location.protocol + '//' + window.location.hostname
          )
      );
    }
  }
});
</script>
