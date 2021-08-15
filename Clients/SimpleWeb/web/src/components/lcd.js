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
        text: "0VER!L",
        ok: false
      };
      if (this.operationalState == -1) return {
        text: "UNDR!L",
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
  mounted() {
    const self = this;
    this.eventBus.on("ws-boot", () => self.isBooted = true);
    this.eventBus.on("ws-state", state => self.isConnected = state);

    this.eventBus.on("e-current-type", cType => self.currentType = self.onHold ? self.currentType : cType);
    this.eventBus.on("e-operation", operation => self.operationalState = operation);
    this.eventBus.on("e-hold", hold => self.onHold = hold);
    this.eventBus.on("e-batt-low", lowBattery => self.lowBattery = lowBattery);
    this.eventBus.on("e-unit", unit => self.displayUnit = self.onHold ? self.displayUnit : unit);
    this.eventBus.on("e-mode", mode => self.mode = self.onHold ? self.mode : mode);
    this.eventBus.on("e-range", range => self.range = self.onHold ? self.range : range);
    this.eventBus.on("e-value", value => {
      if (self.onHold) return;
      self.negative = (value < 0);
      if (self.negative) {
        value = value * -1;
      }
      self.value = value;
    });
  }
};