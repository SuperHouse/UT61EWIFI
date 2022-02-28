import {
  createApp
} from 'vue'
import App from './App.vue'
import mitt from 'mitt';
import tools from './services/tools';
import wsService from './services/wsService';
import ut61E from './services/ut61E';
import pages from "./services/pages";
import themes from "./services/themes";
import srcs from "./services/srcs";
const emitter = mitt();

const app = createApp(App);
app.config.globalProperties.eventBus = emitter;
app.config.globalProperties.$srcs = srcs;

app.config.globalProperties.$theme = themes.theme;
app.config.globalProperties.$themes = themes.themes;
app.config.globalProperties.$themeIndex = themes.themeIndex;
app.config.globalProperties.$setTheme = themes.setTheme;

app.config.globalProperties.$page = pages.page;
app.config.globalProperties.$pages = pages.pages;
app.config.globalProperties.$pageIndex = pages.pageIndex;
app.config.globalProperties.$setPage = pages.setPage;

app.$eventBus = emitter;
app.$tools = tools;
app.config.globalProperties.$tools = tools;
app.use(wsService);
app.use(ut61E);
app.mount('#app');