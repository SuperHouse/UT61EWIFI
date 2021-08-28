<template>
  <loader v-if="loading" />
  <div v-else>
    <lcd v-if="page === 'lcd'" />
    <liveGraph v-if="page === 'graph'" />
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
import loader from "./components/loader/loader.vue";
import cookies from "cookies-js";

export default {
  name: "App",
  components: {
    logo,
    lcd,
    liveGraph,
    loader,
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
  data() {
    return {
      loading: true,
      page: "",
    };
  },
  beforeUnmount() {
    this.eventBus.off("ws-state");
  },
  mounted() {
    const self = this;
    this.eventBus.on("ws-state", (state) => {
      if (!state) return;
      self.loading = false;
      self.eventBus.off("ws-state");
    });
    this.page = this.$tools.getParameterByName("page");
    this.$tools.forceNavigate({ page: this.page });
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
