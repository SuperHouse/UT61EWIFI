<template>
  <div class="wrapper" :class="$theme.className">
    <mainHeader />
    <lcd v-if="page === 'meter'" />
    <liveGraph v-if="page === 'graph'" />
    <controls />
    <div style="display: none;" @click="resetSession()">RESET SESSION</div>
  </div>
</template>

<script>
import mainHeader from "./components/header/header.vue";
import lcd from "./components/lcd/lcd.vue";
import controls from "./components/controls/controls.vue";
import liveGraph from "./components/live-graph/graph.vue";

export default {
  name: "App",
  components: {
    mainHeader,
    lcd,
    controls,
    liveGraph,
  },
  methods: {
    resetSession() {
      this.$tools.resetSession();
    },
  },
  created() {
    console.log(this.$themes);
  },
  data() {
    return {
      loading: true,
      page: '',
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
:root {
  --default-spacing: 4vw;
}

#app {
  color: white;
  font-family: 'Roboto Mono', monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.wrapper {
  padding: var(--default-spacing) 2.5vw;
  background-color: var(--background);
  height: 100vh;
}
.theme-default {
  --background: black;
  --lcd-background: #5139FA;
  --lcd-text-color: black;
  --control-background: #484646;
  --control-text-color: white;
  --ghost-opacity: 0.07;
}
.theme-contrast {
  --background: #333;
  --lcd-background: #252525;
  --lcd-text-color: white;
  --control-background: #484646;
  --control-text-color: white;
  --ghost-opacity: 0.04;
}

</style>

<style src="./assets/fonts/fonts.css"></style>
