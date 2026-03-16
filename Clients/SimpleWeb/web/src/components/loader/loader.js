export default {
  beforeUnmount() {
    this.eventBus.off("ws-boot");
  },
  created() {
    const self = this;
    this.eventBus.on("ws-boot", (x) => self.bootState = x);
  },
  data() {
    return {
      bootState: -2
    }
  },
  computed: {
    comment() {
      console.log(this.bootState)
      if (this.bootState == -2) return {
        text: "BOOT",
        ok: false
      };
      if (this.bootState == -1) return {
        text: "FINDING SERVER",
        ok: false
      };
      if (this.bootState == 0) return {
        text: "SAVING KNOWN SERVER",
        ok: false
      };
      if (this.bootState == 1) return {
        text: "CONNECTING",
        ok: false
      };
      if (this.bootState == 2) return {
        text: "CONNECTED",
        ok: false
      };
      return {
        text: "ERROR: UNKNOWN STATE",
        ok: false
      }
    }
  }
}