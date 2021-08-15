export default {
  install(Vue) {
    Vue.$eventBus.on("ws-data", data => {
      console.log(data);
      Vue.$eventBus.emit('e-current-type', data.currentType);
      Vue.$eventBus.emit('e-value', data.value);
      Vue.$eventBus.emit('e-hold', data.hold);
      Vue.$eventBus.emit('e-unit', data.display_unit);
      Vue.$eventBus.emit('e-range', data.range);
      Vue.$eventBus.emit('e-mode', data.mode);
      Vue.$eventBus.emit('e-batt-low', data.battery_low);
      Vue.$eventBus.emit('e-operation', data.operation === "normal" ? 0 : (data.operation === "overload" ? 1 : -1));
    });
  },
};