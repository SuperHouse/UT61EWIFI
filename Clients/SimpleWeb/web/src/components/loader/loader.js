export default {
  beforeUnmount() {
    this.eventBus.off("ws-boot");
  },
  mounted() {
    const self = this;
    this.eventBus.on("ws-boot", (x) => self.bootState = x);
  },
  data() {
    return {
      bootState: 'Loading'
    }
  },
  computed: {
    comment() {
      if (this.bootState == -1) return {
        text: "TEST",
        ok: false
      };
      if (this.bootState == 0) return {
        text: "WAIT 5",
        ok: false
      };
      if (this.bootState == 1) return {
        text: "CONNECTING",
        ok: false
      };
      return {
        text: "ERROR: UNKNOWN STATE",
        ok: false
      }
    }
  }
}