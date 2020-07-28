<template>
  <q-page class="row items-center justify-evenly">
    <q-markdown :src="md" class="col-10"></q-markdown>
  </q-page>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios';

export default Vue.extend({
  name: 'PageIncidents',
  mounted() {
    this.$q.loading.show({
      delay: 400 // ms
    });
    document.title = 'Mirai Incidents';
    axios
      .get(
        'https://raw.githubusercontent.com/Jabster28/mirai/master/INCIDENTS.md'
      )
      .then(res => {
        this.$q.loading.hide();
        this.md = res.data;
      })
      .catch(e => {
        this.$q.loading.hide();
        console.log(e);
        this.$q.notify(
          'Hmm, something went wrong. Try again in a few moments.'
        );
      });
  },
  data() {
    return {
      md: ''
    };
  }
});
</script>
