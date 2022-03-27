<template>
  <div class="graph" v-if="renderOk">
    <apexchart
      type="line"
      height="100%"
      ref="chart"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script src="./graph.js"></script>

<style>
.graph {
  position: relative;
  height: 47vw;
  color: var(--lcd-text-color);
  margin: var(--default-spacing) 0;
  padding: 1vw 3vw 2vw 1vw;
  border-radius: 2.5vw;
  background-color: var(--lcd-background);
  box-shadow: 0.4vw 0.4vw 0.1vw 0 rgba(0, 0, 0, 0.1) inset;
}
</style>
