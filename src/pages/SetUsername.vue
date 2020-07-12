<template>
  <q-page class="row items-center justify-evenly">
    <q-form @submit="onSubmit" class="col-6 q-gutter-md">
      <q-input
        filled
        v-model="username"
        label="Your username"
        lazy-rules
        :loading="loading"
        :rules="[val => (val && val.length > 0) || 'Please type something']"
      />

      <div>
        <q-btn
          label="Submit"
          :loading="loading"
          :disabled="loading"
          type="submit"
          color="primary"
        />
      </div>
    </q-form>
  </q-page>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import Vue from 'vue';
import axios from 'axios';
export default Vue.extend({
  name: 'PageSetUsername',
  data() {
    return {
      username: '',
      loading: false
    };
  },
  mounted() {
    this.username = this.$q.localStorage.getItem('username') || '';
    document.title = 'Set your username | Mirai';
  },
  methods: {
    load() {
      this.loading = true;
    },

    onSubmit() {
      if (!navigator.onLine) {
        this.$q.notify({
          color: 'red',
          icon: 'error',
          message: "Offline; can't verify username"
        });
        return;
      }
      this.loading = true;
      axios
        .get(`https://api.jikan.moe/v3/user/${this.username}`)
        .then(() => {
          /* @ts-ignore */
          let savedname = this.$q.localStorage.getItem('username');
          /* @ts-ignore */
          if (!savedname) {
            this.$q.localStorage.set('username', '');
            savedname = this.$q.localStorage.getItem('username');
          }
          savedname = this.username;
          this.$q.localStorage.set('username', savedname);
          this.loading = false;
          this.$q.notify({
            color: 'green',
            icon: 'check',
            message: 'Saved'
          });
          if (this.$route.params.redirect)
            this.$router
              .replace('/' + decodeURIComponent(this.$route.params.redirect))
              .catch(e => console.log(e));
        })
        .catch(e => {
          console.log(e);
          this.loading = false;

          if (e == 'Error: Request failed with status code 404') {
            this.$q.notify({
              color: 'red',
              icon: 'error',
              message: 'User not found.'
            });
          }
        });
    }
  }
});
</script>
