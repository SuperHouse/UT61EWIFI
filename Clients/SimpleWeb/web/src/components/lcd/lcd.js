import utSrc from './lcd-src';

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
      if (!this.isBooted) return {
        text: "SERVER",
        ok: false
      };
      if (!this.isConnected) return {
        text: "ERROR",
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
      let fixedVal = this.displayStringRequiredLength;
      let valAsFull = '';
      do {
        fixedVal--;
        valAsFull = this.value.toFixed(fixedVal);
      } while (valAsFull.length > this.displayStringRequiredLength)
      return {
        text: valAsFull,
        ok: true
      };
    },
  },
  data() {
    return {
      defaultLCDLength: 6,
      negLCDLength: 5,

      logo: utSrc.logo,
      utlogo: utSrc.utlogo,
      uttext: utSrc.uttext,

      isBooted: false,
      isConnected: false,

      currentType: "DC",
      displayUnit: "V",
      negative: false,
      range: "auto",
      mode: "voltage",
      value: 0,
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
  beforeDestroy() {
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
  mounted() {
    const self = this;
    this.eventBus.on("ws-boot", () => self.isBooted = true);
    this.eventBus.on("ws-state", state => self.isConnected = state);

    this.eventBus.on("e-current-type", cType => self.updateData('currentType', cType));
    this.eventBus.on("e-operation", operation => self.updateData('operationalState', operation));
    this.eventBus.on("e-hold", hold => self.updateData('onHold', hold));
    this.eventBus.on("e-batt-low", lowBattery => self.updateData('lowBattery', lowBattery));
    this.eventBus.on("e-unit", unit => self.updateData('displayUnit', unit));
    this.eventBus.on("e-mode", mode => self.updateData('mode', mode));
    this.eventBus.on("e-range", range => self.updateData('range', range));
    this.eventBus.on("e-value", value => {
      let canUpdate = self.updateData('negative', (value < 0));
      if (!canUpdate) return;
      if (self.negative) {
        value = value * -1;
      }
      self.updateData('value', value);
    });
  }
};