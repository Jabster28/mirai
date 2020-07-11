<template>
  <div></div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'PageMe',
  mounted() {
    /* @ts-ignore */
    let username = this.$q.localStorage.getItem('username');
    /* @ts-ignore */
    if (!username) {
      this.$router.replace('/setusr/me').catch(e => console.log(e));
    } else {
      this.$router
        .replace('/user/' + encodeURIComponent(username.toString()))
        .catch(e => console.log(e));
    }
  }
});
</script>
