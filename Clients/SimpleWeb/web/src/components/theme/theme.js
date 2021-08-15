export default {
  created() {
    //this.changeTheme(0);
  },
  methods: {
    changeTheme(index) {
      this.$setTheme(index);
    }
  }
}