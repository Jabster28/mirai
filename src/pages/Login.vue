<template>
  <q-page class="row items-center justify-evenly"> </q-page>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { defineComponent, onMounted } from 'vue';
import { Cookies, Loading, Platform } from 'quasar';
import { useRouter, useRoute } from 'vue-router';

export default defineComponent({
  name: 'PageLogin',
  setup() {
    const router = useRouter();
    const route = useRoute();
    onMounted(() => {
      Loading.show({
        delay: 200,
      });
      if (Cookies.get('mal_auth') && !route.query.f) {
        router.replace('/me').catch((e) => console.log(e));
      } else {
        window.location.replace(
          'https://mirai-api.herokuapp.com/auth?red=' +
            encodeURIComponent(
              window.location.protocol +
                '//' +
                window.location.hostname +
                ':' +
                window.location.port +
                (Platform.is.electron ? '/#' : '')
            )
        );
      }
    });
    return {};
  },
});
</script>
