<template>
  <loader v-if="loading" />
  <div v-else>
    <lcd v-if="$page.pages.indexOf('lcd') >= 0" />
    <liveGraph v-if="$page.pages.indexOf('graph') >= 0" />
    <theme />
    <page />

    <a href="https://www.superhouse.tv/" target="_blank">
      <logo />
    </a>

    <div @click="resetSession()">RESET SESSION</div>
  </div>
</template>

<script>
import logo from "./components/logo/logo.vue";
import lcd from "./components/lcd/lcd.vue";
import theme from "./components/theme/theme.vue";
import page from "./components/page/page.vue";
import liveGraph from "./components/live-graph/graph.vue";
import loader from "./components/loader/loader.vue";

export default {
  name: "App",
  components: {
    logo,
    lcd,
    liveGraph,
    loader,
    theme,
    page,
  },
  methods: {
    resetSession() {
      this.$tools.resetSession();
    },
  },
  created() {
    console.log(this.$themes);
    console.log(this.$pages);
  },
  data() {
    return {
      loading: true
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
