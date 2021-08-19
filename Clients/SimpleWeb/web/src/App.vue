<template>
  <div>
    <lcd />
    <liveGraph />
    <theme />

    <router-link src="https://www.superhouse.tv/" target="_blank">
      <logo />
    </router-link>

    <div @click="resetSession()">RESET SESSION</div>
  </div>
</template>

<script>
import logo from "./components/logo/logo.vue";
import lcd from "./components/lcd/lcd.vue";
import theme from "./components/theme/theme.vue";
import liveGraph from "./components/live-graph/graph.vue";
import cookies from "cookies-js";

export default {
  name: "App",
  components: {
    logo,
    lcd,
    liveGraph,
    theme,
  },
  methods: {
    resetSession() {
      cookies.expire("active-server");
      cookies.expire("active-theme");
      window.location.reload(true);
    },
  },
  created() {
    console.log(this.$themes);
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #ffffff;
  background-color: #333333;
}
</style>
