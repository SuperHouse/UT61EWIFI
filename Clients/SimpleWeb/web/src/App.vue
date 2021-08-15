<template>
  <div>
    <lcd />
    <liveGraph />
    <theme />
  </div>
</template>

<script>
import lcd from "./components/lcd/lcd.vue";
import theme from "./components/theme/theme.vue";
import liveGraph from "./components/live-graph/graph.vue";

export default {
  name: "App",
  components: {
    lcd,
    liveGraph,
    theme,
  },
  created () {

    console.log(this.$themes)
  }
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
