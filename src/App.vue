<template>
  <the-header></the-header>
  <router-view v-slot="slotProps">
    <transition name="route" mode="out-in">
      <component :is="slotProps.Component"></component>
    </transition>
  </router-view>
  <footer><a href="https://github.com/Sevichecc/Find-a-coach-vue3">Github</a></footer>
</template>
<script>
import TheHeader from './components/layout/TheHearder.vue';

export default {
  components: {
    TheHeader,
  },
  computed: {
    didAutoLogout() {
      return this.$store.getters.didAutoLogout;
    },
  },
  watch: {
    didAutoLogout(cur, old) {
      if (cur && cur !== old) {
        this.$router.replace('/coaches');
      }
    },
  },
  created() {
    this.$store.dispatch('tryLogin');
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

* {
  box-sizing: border-box;
}

html {
  font-family: 'Roboto', sans-serif;
}

body {
  margin: 0;
}
.route-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}
.route-leave-to {
  opacity: 1;
  transform: translateY(30px);
}
.route-enter-active {
  transition: all 0.3s ease-out;
}

.route-leave-active {
  transition: all 0.3s ease-out;
}
.route-enter-to,
.router-leave-from {
  opacity: 1;
  transform: translateY(0);
}
footer>a {
  color:#777;
  display: block;
  text-align: center;
  margin: 10px auto;
}
</style>
