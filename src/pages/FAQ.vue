<template>
  <q-page class="row q-ma-lg items-center justify-evenly">
    <div :class="[$q.screen.gt.sm ? 'col-7' : 'col-11']">
      <h1>FAQ</h1>
      <h5 disabled>
        Got a question? Look no further! You can ctrl (or cmd) + F if you want
        to find something specific
      </h5>

      <div class="col-10">
        <h4 class="text-italic">So, what is Mirai, anyway?</h4>
        <p class="text-body1">
          Mirai is a new, modern, sleek and quicker web interface for
          MyAnimeList.net
        </p>
      </div>

      <div class="col-10">
        <h4 class="text-italic">It's a replacement?</h4>
        <p class="text-body1">
          Not exactly - a replacement for you, maybe; but not a replacement for
          the whole website. All of the data shown on this website is taken
          using
          <q-btn
            rel="noopener"
            color="blue-10"
            clickable
            type="a"
            target="_blank"
            href="https://jikan.moe/"
          >
            Jikan</q-btn
          >, which takes the data directly from MAL.
        </p>
      </div>

      <div class="col-10">
        <h4 class="text-italic">So a reskin?</h4>
        <p class="text-body1">Eh, sure. Let's go with that.</p>
      </div>

      <div class="col-10">
        <h4 class="text-italic">But why? Their website looks fine to me...</h4>
        <p class="text-body1">
          To a degree, it is. It shows any data you ask it for, and you can
          navigate it like any website. However, Mirai goes a step further by
          making it a Progressive Web App - with caching, no reloads etc.
        </p>
      </div>

      <div class="col-10">
        <h4 class="text-italic">Progressive Web App?</h4>
        <p class="text-body1">
          A PWA is simply a website that follows a specific set of rules that
          are intended to better the UX (user's experience) of the website.
          Things like caching data, making it secure, ensuring it works on
          mobile and offline (without any work from the user), all attribute to
          a good PWA.
        </p>
      </div>

      <div class="col-10">
        <h4 class="text-italic">Caching?</h4>
        <p class="text-body1">
          Caching is like asking a question to someone, and remembering the
          answer so that you don't need to ask the person again. Almost
          everything is cached on this website (even the website itself! Try
          accessing this without internet and see what happens) such as the
          images of animes, user statistics, pretty much everything.
        </p>
      </div>

      <div class="col-10">
        <h4 class="text-italic">
          But won't the data become old at some point?
        </h4>
        <p class="text-body1">
          Yes, and I've solved this by using what I like to call
          <span class="text-bold">Speed Caching</span>. Instead of searching for
          an anime that you've searched for before and leaving the user with
          nothing to look at for a couple seconds, the website will load the
          cached version, and update it in the background, in case there were
          any changes. This allows the user to see what they want quickly and
          show them something while they wait.
        </p>
      </div>

      <div class="col-10">
        <h4 class="text-italic">
          Wait, how come the URL changes when I click a link, but the page
          doesn't load anything?
        </h4>
        <p class="text-body1">
          That's the power of a Single Page Application, my friend. Put simply,
          an SPA is an application (web app, in this case) that uses one page
          that laods every page and dynamically switches between them based on
          user input. It's the same reson that GMail doesn't reload when you
          open an email, but the URL still changes.
        </p>
      </div>

      <div class="col-10">
        <h4 class="text-italic">Cool, but why is it called Mirai?</h4>
        <p class="text-body1">
          Mirai is Japanese for "future", and that's exactly what I wanted this
          website to feel like compared to MAL.
        </p>
      </div>

      <div class="col-10">
        <h4 class="text-italic">
          Are you going to collect my IP Address and kill me in my sleep?
        </h4>
        <p class="text-body1">No.</p>
      </div>

      <div class="col-10">
        <h4 class="text-italic">
          Do you mine cryptocurrencies in the website?
        </h4>
        <p class="text-body1">No.</p>
      </div>

      <div class="col-10">
        <h4 class="text-italic">
          So I won't be abducted by two guys in black suits?
        </h4>
        <p class="text-body1">
          You might, but it has nothing to do with me or this website.
        </p>
      </div>

      <div class="col-10">
        <h4 class="text-italic">
          And you're not going to email me about my dead uncle's $500,000 worth
          of unpolished diamonds?
        </h4>
        <p class="text-body1">No.</p>
      </div>

      <div class="col-10">
        <h4 class="text-italic">Really?</h4>
        <p class="text-body1">
          Yes, we don't use any data collection tools or analytics.
        </p>
      </div>

      <div class="col-10">
        <h4 class="text-italic">How can I trust you?</h4>
        <p class="text-body1">
          <a href="https://github.com/Jabster28/mirai"
            >Here's all of the source code to my application.</a
          >
          You can build it, hash the results and compare them to this website.
          Either I'm telling the truth, or I'm stealing all of your data AND
          managed to do make a hash collision that would require me to
          <em>hash 6 billion files per second for 100 years</em> =)
        </p>
      </div>

      <div class="col-10">
        <h4 class="text-italic">What if I still don't trust you?</h4>
        <p class="text-body1">
          <a
            href="https://github.com/gorhill/uBlock/blob/master/README.md#installation"
            >Go ahead and install uBlock Origin</a
          >, which might be the best advertising, tracking, cryptomining blocker
          out there. (you can also install
          <a href="https://reek.github.io/anti-adblock-killer/"
            >anti adblock killer</a
          >
          if you don't like websites telling you to disable it)
        </p>
      </div>

      <div class="col-10">
        <h4 class="text-italic">Will there ever be ads?</h4>
        <p class="text-body1">No, if I can afford it.</p>
      </div>

      <div class="col-10">
        <h4 class="text-italic">Will I ever have to pay for this?</h4>
        <p class="text-body1">
          Do you honestly think I'm going to promote a paid UI to a free
          service? I'm not Microsoft Office, am I?
        </p>
      </div>
      <div class="col-10">
        <h4 class="text-italic">Did you make this by yourself?</h4>
        <p class="text-body1">
          While I am the sole developer of this, lots of NPM modules gave me the
          powers to even think of making this. For example, I wouldn't be able
          to build a PWA with electron, SPA and mobile support without the help
          from the lovely people at
          <q-btn
            rel="noopener"
            color="primary"
            clickable
            type="a"
            target="_blank"
            href="https://quasar.dev"
          >
            Quasar</q-btn
          >. With support for almost every platform, and using
          <q-btn
            rel="noopener"
            color="amber"
            clickable
            type="a"
            target="_blank"
            href="https://babeljs.io/"
          >
            Babel</q-btn
          >
          for transpiling next-gen JS and IE11 support,
          <q-btn
            rel="noopener"
            color="teal"
            clickable
            type="a"
            target="_blank"
            href="https://www.electronjs.org/"
          >
            Electron</q-btn
          >
          for desktop apps and distribution, and
          <q-btn
            rel="noopener"
            color="green"
            clickable
            type="a"
            target="_blank"
            href="https://vuejs.org"
          >
            Vue</q-btn
          >
          for their intuitive yet deep web framework and array of extensions, it
          was hard not to use it! Many thanks to everyone who contributed to
          those projects for allowing me to make this :D
        </p>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageIndex',
  mounted() {
    document.title = 'Mirai';
  },
  data() {
    return {};
  },
});
</script>
