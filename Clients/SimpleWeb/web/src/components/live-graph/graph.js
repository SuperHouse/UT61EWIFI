import VueApexCharts from "vue3-apexcharts";

export default {
  components: {
    apexchart: VueApexCharts,
  },
  beforeUnmount() {
    this.eventBus.off("ws-boot");
    this.eventBus.off("ws-state");
    this.eventBus.off("ws-current-type");
    this.eventBus.off("ws-operation");
    this.eventBus.off("ws-hold");
    this.eventBus.off("ws-batt-low");
    this.eventBus.off("ws-unit");
    this.eventBus.off("ws-mode");
    this.eventBus.off("ws-range");
    this.eventBus.off("ws-value");
  },
  created() {
    for (let i = this.maxBackLength - 1; i >= 0; i--) {
      this.chartOptions.xaxis.categories.push(`-${i}s`);
    }
  },
  mounted() {
    const self = this;
    this.eventBus.on("ws-boot", (x) => self.bootState = x);
    this.eventBus.on("ws-state", state => {
      self.isConnected = state;
      if (state)
        self.resetChart();
    });

    this.eventBus.on("e-current-type", cType => self.updateData('currentType', cType));
    this.eventBus.on("e-operation", operation => self.updateData('operationalState', operation));
    this.eventBus.on("e-hold", hold => self.updateData('onHold', hold));
    this.eventBus.on("e-unit", unit => self.updateData('displayUnit', unit));
    this.eventBus.on("e-mode", mode => self.updateData('mode', mode));
    this.eventBus.on("e-range", range => self.updateData('range', range));
    this.eventBus.on("e-value", value => {
      if (self.onHold) return;
      if (this.operationalState !== 0) return;
      self.addValueItem(value);
    });
  },
  methods: {
    generateBaseItem() {
      let arrOfData = [];
      for (let i = 0; i < this.maxBackLength; i++)
        arrOfData.push(null)
      return arrOfData;
    },
    addValueItem(value) {
      this.$data.data[this.mode] = this.$data.data[this.mode] || {
        name: this.mode,
        data: this.generateBaseItem()
      };
      this.$data.data[this.mode].data.push(value);
      this.refreshChart();
    },
    updateData(name, value) {
      if (name === "onHold") {
        this.onHold = value;
        return true;
      }
      if (this.onHold) return false;

      if (this[name] === value) return;

      this[name] = value;
      this.refreshChart();
      return true;
    },
    cleanOldData() {
      let keys = Object.keys(this.data);
      let nukeKeys = [];
      for (let key of keys) {
        let hasData = false;
        for (let item of this.data[key].data) {
          if (item !== null) {
            hasData = true;
            break;
          }
        }
        if (!hasData) {
          nukeKeys.push(key);
        }
      }
      for (let keyToNuke of nukeKeys) {
        delete this.data[keyToNuke];
      }
    },
    refreshChart() {
      if (!this.renderOk) return;

      this.cleanOldData();

      let keys = Object.keys(this.data);
      let newSeries = [];
      for (let key of keys) {
        if (this.data[key].data.length == this.maxBackLength)
          this.data[key].data.push(null);

        this.data[key].data.splice(0, 1);
      }
      for (let key of keys) {
        newSeries.push(this.data[key])
      }
      let colours = '#222222,'.repeat(keys.length).split(',').filter(x => x === '' ? null : x);
      colours[keys.indexOf(this.mode)] = this.$theme.primary;
      this.$data.chartOptions.colors = colours;

      if (this.$refs.chart === null)
        return this.resetChart();
      if (this.$refs.chart.updateOptions === undefined || this.$refs.chart.updateSeries === undefined) return
      this.$refs.chart.updateOptions(this.chartOptions);
      this.$refs.chart.updateSeries(newSeries);
    },
    resetChart() {
      this.renderOk = false;
      this.data = {};
      this.series = [];
      const self = this;
      this.$nextTick(() => {
        self.renderOk = true;
        self.$nextTick(() =>
          self.refreshChart());
      });
    }
  },
  data() {
    return {
      renderOk: true,
      bootState: -1,
      isConnected: false,
      coreChangeItems: ['currentType', 'displayUnit', 'mode'],
      maxBackLength: 15,

      currentType: "DC",
      displayUnit: "V",
      range: "auto",
      mode: "voltage",
      onHold: false,
      operationalState: 0,

      data: {},
      series: [],
      chartOptions: {
        chart: {
          animations: {
            enabled: false,
          },
          height: 350,
          type: 'line',
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          },
          foreColor: '#888888'
        },
        colors: [],
        dataLabels: {
          enabled: false,
        },
        tooltip: {
          enabled: true,
          theme: "dark"
        },
        stroke: {
          curve: 'smooth'
        },
        grid: {
          row: {
            colors: ['#333333']
          },
          column: {
            colors: ['#333333']
          }
        },
        markers: {
          size: 0
        },
        xaxis: {
          categories: [],
          labels: {
            style: {
              colors: '#888888'
            }
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: '#888888'
            },
            formatter: (value) => value === null ? null : `${value.toFixed(4)} ${this.displayUnit}`
          }
        },
        legend: {
          show: false
        }
      }
    }
  }
}