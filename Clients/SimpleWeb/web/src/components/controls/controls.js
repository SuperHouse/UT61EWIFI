import themes from '../../services/themes.js';

export default {
  created() {
  },
  data() {
    return {
      page: ""
    };
  },
  methods: {
    toggleTheme() {
      let index = themes.themeIndex + 1;

      if (! themes.themes[index]) {
        index = 0;
      }

      themes.themeIndex = index;
      themes.theme = themes.themes[index];

      this.$setTheme(index);
    }
  },
  mounted() {
    this.page = this.$tools.getParameterByName("page");
  }
}