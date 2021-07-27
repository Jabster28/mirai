<template>
  <q-page class="row items-center justify-evenly"> </q-page>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'PageLogout',
  data() {
    return {};
  },
  mounted() {
    this.$q.loading.show({
      delay: 200,
    });
    this.$q.cookies.set('mal_auth', '');
    this.$q.cookies.remove('mal_auth');
    this.$q.loading.hide();
    window.location.replace('/');
  },
});
</script>
