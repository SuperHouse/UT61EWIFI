<template>
  <div>
    <lcd />
    <liveGraph />
  </div>
</template>

<script>
import lcd from "./components/lcd/lcd.vue";
import liveGraph from "./components/live-graph/graph.vue";

export default {
  name: "App",
  components: {
    lcd,
    liveGraph,
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
