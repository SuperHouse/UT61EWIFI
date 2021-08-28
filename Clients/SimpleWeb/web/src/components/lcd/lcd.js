export default {
  computed: {
    displayStringRequiredLength() {
      return this.negative ? this.negLCDLength : this.defaultLCDLength;
    },
    displayString() {
      let textUnfor = this.displayStringUnformatted;
      let thisLength = textUnfor.ok ? this.displayStringRequiredLength : this.defaultLCDLength;
      textUnfor.text = textUnfor.text.replace(/ /g, '!');
      thisLength += (textUnfor.text.match(/\./g) || []).length;
      while (textUnfor.text.length < thisLength) textUnfor.text = `!${textUnfor.text}`;
      if (textUnfor.ok)
        return (this.negative ? '-' : '') + textUnfor.text;
      return textUnfor.text;
    },
    displayStringUnformatted() {      
      if (!this.isConnected) return {
        text: "------",
        ok: false
      };
      if (this.operationalState == 1) return {
        text: "0L.!!",
        ok: false
      };
      if (this.operationalState == -1) return {
        text: "VL.!!",
        ok: false
      };
      return {
        text: this.valueS,
        ok: true
      };
    },
  },
  data() {
    return {
      defaultLCDLength: 6,
      negLCDLength: 5,

      isConnected: true,

      currentType: "DC",
      displayUnit: "V",
      negative: false,
      range: "auto",
      mode: "voltage",
      valueS: '',
      onHold: false,
      lowBattery: false,
      operationalState: 0
    };
  },
  methods: {
    updateData(name, value) {
      if (name === "onHold") {
        this.onHold = value;
        return true;
      }
      if (this.onHold) return false;
      this[name] = value;
      return true;
    }
  },
  beforeUnmount() {
    this.eventBus.off("ws-state");
    this.eventBus.off("e-current-type");
    this.eventBus.off("e-operation");
    this.eventBus.off("e-hold");
    this.eventBus.off("e-batt-low");
    this.eventBus.off("e-unit");
    this.eventBus.off("e-mode");
    this.eventBus.off("e-range");
    this.eventBus.off("e-display-string");
  },
  mounted() {
    const self = this;
    this.eventBus.on("ws-state", state => self.isConnected = state);

    this.eventBus.on("e-current-type", cType => self.updateData('currentType', cType));
    this.eventBus.on("e-operation", operation => self.updateData('operationalState', operation));
    this.eventBus.on("e-hold", hold => self.updateData('onHold', hold));
    this.eventBus.on("e-batt-low", lowBattery => self.updateData('lowBattery', lowBattery));
    this.eventBus.on("e-unit", unit => self.updateData('displayUnit', unit));
    this.eventBus.on("e-mode", mode => self.updateData('mode', mode));
    this.eventBus.on("e-range", range => self.updateData('range', range));
    this.eventBus.on("e-display-string", value => self.updateData('valueS', value));
  }
};