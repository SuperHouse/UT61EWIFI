export default {
  install(Vue) {
    let knownLastState = false; //anti-dup
    Vue.$eventBus.on("ws-state", state => {
      if (state === knownLastState) return;
      knownLastState = state;
      if (!state) {
        Vue.$eventBus.emit('e-current-type', 'AC');
        Vue.$eventBus.emit('e-value', 0);
        Vue.$eventBus.emit('e-hold', false);
        Vue.$eventBus.emit('e-unit', 'X');
        Vue.$eventBus.emit('e-range', 'auto');
        Vue.$eventBus.emit('e-mode', 'voltage');
        Vue.$eventBus.emit('e-batt-low', false);
        Vue.$eventBus.emit('e-operation', 0);
        Vue.$eventBus.emit('e-negative', false);
      }
    });
    Vue.$eventBus.on("ws-data", data => {
      //console.log(data);
      Vue.$eventBus.emit('e-display-string', data.display_string);
      Vue.$eventBus.emit('e-current-type', data.currentType);
      Vue.$eventBus.emit('e-value', data.value);
      Vue.$eventBus.emit('e-hold', data.hold);
      Vue.$eventBus.emit('e-unit', data.display_unit);
      Vue.$eventBus.emit('e-range', data.range);
      Vue.$eventBus.emit('e-mode', data.mode);
      Vue.$eventBus.emit('e-batt-low', data.battery_low);
      Vue.$eventBus.emit('e-operation', data.operation === "normal" ? 0 : (data.operation === "overload" ? 1 : -1));
      Vue.$eventBus.emit('e-negative', data.negative);
    });
  },
};