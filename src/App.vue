<template>
  <router-view />
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

export default {
  created() {
    /* @ts-ignore */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    let theme = this.$q.localStorage.getItem('theme');
    if (!theme) {
      /* @ts-ignore */
      this.$q.localStorage.set('theme', 'auto');
      /* @ts-ignore */
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      theme = this.$q.localStorage.getItem('theme');
    }

    /* @ts-ignore */
    this.$q.dark.set(theme);
  },
  name: 'App',
};
</script>
