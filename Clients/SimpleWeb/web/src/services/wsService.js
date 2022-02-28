import cookies from './storage';

let serverConnectionTo = null;

let bootCounter = Number.parseInt(cookies.get('boot-counter') || '0') || 0;

if (bootCounter >= 0) {
  bootCounter++;
  cookies.set('boot-counter', bootCounter);

  if (bootCounter >= 3) {
    let forceServer = prompt('We were unable to connect to the server. Please manually enter the server address:', `ws://${location.host}/websocket`);
    cookies.set('active-server', forceServer);
    cookies.set('boot-counter', 0);
  }
}

export default {
  install(Vue) {
    const WS_URLS = [
      `ws://${location.host}/websocket`,
      `ws://${location.host}/endpoint/websocket`,
      `wss://${location.host}/websocket`,
      `wss://${location.host}/endpoint/websocket`,
      Vue.$tools.getParameterByName('wsserver') || 'wss://localhost:8999/',
      window._customWSHost || 'ws://localhost:8999/'
    ];

    Vue.$eventBus.emit("ws-state", false);
    let failedRepeater = 0;
    const connectToServer = () => {
      console.log('CONNECT TO: ' + serverConnectionTo);
      Vue.$eventBus.emit("ws-boot", 1);
      const WS_SERVER = new WebSocket(serverConnectionTo);
      WS_SERVER.onmessage = (msg) => {
        let data = JSON.parse(msg.data);
        console.debug(data);
        if (!data.currentType) {
          return;
        }
        Vue.$eventBus.emit("ws-data", data);
      }
      WS_SERVER.onopen = () => {
        console.log('WS OPENED');
        Vue.$eventBus.emit("ws-boot", 2);
        Vue.$eventBus.emit("ws-state", true);
        cookies.set('boot-counter', -1);
        failedRepeater = -1;
      };
      WS_SERVER.onclose = () => {
        console.log('WS CLOSED');
        Vue.$eventBus.emit("ws-state", false);
        if (failedRepeater !== -1) {
          failedRepeater++;
          if (failedRepeater > 5) {
            console.error('Could not connect to known server... clear and retry');
            return Vue.$tools.resetSession();
          }
        }
        setTimeout(connectToServer, 1000);
      };
      WS_SERVER.onerror = (err) => {
        console.log('WS ERRORED');
        console.error(err)
        console.error(err.data)
        //WS_SERVER.close();
      };
      Vue.$eventBus.emit("ws-boot", 1);
    }

    const findConnectableServer = () => {
      let wsServers = [];
      let overArchTimeout = setTimeout(() => {
        if (serverConnectionTo === null)
          closeAllServers();
      }, 10000);
      const closeAllServers = () => {
        console.log('Close connection tester');
        window.clearTimeout(overArchTimeout);
        wsServers.forEach(x => x.ws.close());
        if (serverConnectionTo !== null) {
          console.log(`Found server: ${serverConnectionTo}`);
          cookies.set('active-server', serverConnectionTo);
          Vue.$eventBus.emit("ws-boot", 0);
          setTimeout(connectToServer, 5000);
        } else {
          console.error('Could not find server to connect to');
          Vue.$tools.resetSession();
          //setTimeout(findConnectableServer, 5000);
        }
      };
      for (let srv of WS_URLS) {
        console.log(`Try WS Connect to ${srv}`);
        try {
          let tWS = new WebSocket(srv);
          wsServers.push({
            url: srv,
            ws: tWS
          });
          tWS.onopen = () => {
            serverConnectionTo = srv;
            closeAllServers();
          };
          tWS.onclose = () => {
            Vue.$eventBus.emit("ws-boot", -1);
            for (let i = 0; i < wsServers.length; i++) {
              if (wsServers[i].url === srv) {
                wsServers.splice(i, 1);
                return;
              }
            }
          };
        } catch (xc) {
          console.error(`Error WS Connect to ${srv}`);
          console.error(xc)
        }
      }
      Vue.$eventBus.emit("ws-boot", -1);
    }

    let knownServer = cookies.get('active-server') || null;
    if (knownServer !== null && knownServer !== '') {
      serverConnectionTo = knownServer;
      console.log(`Using known server: ${serverConnectionTo}`);
      Vue.$eventBus.emit("ws-boot", 1);
      return connectToServer();
    }
    findConnectableServer();
  },
};