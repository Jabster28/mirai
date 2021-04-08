<template>
  <q-page class="row items-center justify-evenly"> </q-page>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { defineComponent, onMounted } from 'vue';
import { Cookies, Loading } from 'quasar';
import { useRouter, useRoute } from 'vue-router';
export default defineComponent({
  name: 'PageOauth',
  setup() {
    const route = useRoute();
    const router = useRouter();
    onMounted(() => {
      Loading.show({
        delay: 400, // ms
      });
      console.log('h', router.currentRoute);
      Cookies.set(
        'mal_auth',
        // @ts-ignore
        JSON.stringify(router.currentRoute._value.query),
        {
          expires: 14600,
        }
      );
      Loading.hide();
      if (route.params.redirect)
        window.location.replace(
          // @ts-ignore
          '/' + decodeURIComponent(route.params.redirect)
        );
      else window.location.replace('/');
    });
    return {};
  },
});
</script>
