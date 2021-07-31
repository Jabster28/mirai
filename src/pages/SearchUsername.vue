<template>
  <q-page class="row items-center justify-evenly">
    <q-form @submit="onSubmit" class="col-8 q-gutter-md">
      <q-input
        filled
        v-model="username"
        label="Enter a username..."
        autofocus
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />

      <div>
        <q-btn label="Submit" type="submit" color="primary" />
      </div>
    </q-form>
  </q-page>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'PageSearchUsername',
  data() {
    return {
      username: '',
    };
  },
  mounted() {
    document.title = 'search for users | mirai';
  },
  methods: {
    onSubmit() {
      this.$router.push(`/user/${this.username}`).catch((e) => console.log(e));
    },
  },
});
</script>
