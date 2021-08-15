<template>
  <div class="graph" style="padding: 0 45px 20px 25px;" v-if="renderOk">
    <apexchart
      type="line"
      height="350"
      ref="chart"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script src="./graph.js"></script>
