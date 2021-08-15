import {
  createApp
} from 'vue'
import App from './App.vue'
import mitt from 'mitt';
import wsService from './services/wsService';
import ut61E from './services/ut61E';
const emitter = mitt();

const app = createApp(App);
app.config.globalProperties.eventBus = emitter;
app.$eventBus = emitter;
app.use(wsService);
app.use(ut61E);
app.mount('#app');