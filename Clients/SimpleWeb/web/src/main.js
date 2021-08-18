import {
  createApp
} from 'vue'
import App from './App.vue'
import mitt from 'mitt';
import wsService from './services/wsService';
import ut61E from './services/ut61E';
import themes from "./services/themes";
import srcs from "./services/srcs";
const emitter = mitt();

const app = createApp(App);
app.config.globalProperties.eventBus = emitter;
app.config.globalProperties.$theme = themes.theme;
app.config.globalProperties.$srcs = srcs;
app.config.globalProperties.$themes = themes.themes;
app.config.globalProperties.$themeIndex = themes.themeIndex;
app.config.globalProperties.$setTheme = themes.setTheme;
app.$eventBus = emitter;
app.use(wsService);
app.use(ut61E);
app.mount('#app');