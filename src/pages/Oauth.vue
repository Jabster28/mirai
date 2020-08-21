<template>
  <q-page class="row items-center justify-evenly"> </q-page>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import Vue from 'vue';
export default Vue.extend({
  name: 'PageOauth',
  data() {
    return {};
  },
  mounted() {
    this.$q.loading.show({
      delay: 400 // ms
    });
    this.$q.cookies.set(
      'mal_auth',
      JSON.stringify(this.$router.currentRoute.query),
      {
        expires: 14600
      }
    );
    this.$q.loading.hide();
    if (this.$route.params.redirect)
      window.location.replace(
        '/' + decodeURIComponent(this.$route.params.redirect)
      );
    else window.location.replace('/');
  }
});
</script>
