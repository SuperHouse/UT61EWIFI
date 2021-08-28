import cookies from 'cookies-js';

let serverConnectionTo = null;

export default {
  install(Vue) {
    let customHashUrl = Vue.$tools.getParameterByName('wsserver')
    if (customHashUrl !== null && customHashUrl !== '')
      window._customWSHost = customHashUrl.substring(1);

    const WS_URLS = [
      `ws://${location.host}/websocket`,
      `ws://${location.host}/endpoint/websocket`,
      `wss://${location.host}/websocket`,
      `wss://${location.host}/endpoint/websocket`,
      window._customWSHost || 'ws://localhost:8999/'
    ];

    Vue.$eventBus.emit("ws-state", false);
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
      };
      WS_SERVER.onclose = () => {
        console.log('WS CLOSED');
        Vue.$eventBus.emit("ws-state", false);
        setTimeout(connectToServer, 1000);
      };
      WS_SERVER.onerror = (err) => {
        console.log('WS ERRORED');
        console.error(err)
        console.error(err.data)
        //WS_SERVER.close();
      };
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
          setTimeout(findConnectableServer, 5000);
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
    }

    let knownServer = cookies.get('active-server') || null;
    if (knownServer !== null && knownServer !== '') {
      serverConnectionTo = knownServer;
      console.log(`Using known server: ${serverConnectionTo}`);
      Vue.$eventBus.emit("ws-boot", 0);
      return connectToServer();
    }
    findConnectableServer();
  },
};