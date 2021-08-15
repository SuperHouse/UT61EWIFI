/* eslint-disable */

const WS_URLS = [
  `wss://${location.host}/endpoint`,
  `ws://${location.host}/endpoint`,
  `wss://${location.host}/`,
  `ws://${location.host}/`,
  'ws://localhost:8999/'
];

let serverConnected = false;
let serverConnectionTo = null;

let WS_SERVER;

export default {
  install(Vue) { // eslint-disable-line no-unused-vars
    Vue.$eventBus.emit("ws-state", false);
    const connectToServer = () => {
      console.log('CONNECT TO: ' + serverConnectionTo);
      WS_SERVER = new WebSocket(serverConnectionTo);
      WS_SERVER.onopen = () => {
        console.log('OPENED');
        serverConnected = true;
        Vue.$eventBus.emit("ws-state", true);
      };
      WS_SERVER.onmessage = (msg) => {
        let data = JSON.parse(msg.data);
        if (!data.currentType) {
          return;
        }
        Vue.$eventBus.emit("ws-data", data);
      }
      WS_SERVER.onclose = () => {
        console.log('CLOSED');
        serverConnected = false;
        Vue.$eventBus.emit("ws-state", false);
        setTimeout(connectToServer, 1000);
      };
      WS_SERVER.onerror = (err) => {
        console.log('ERRORED');
        console.error(err)
        console.error(err.message)
        WS_SERVER.close();
      };
      setTimeout(() => {
        if (!serverConnected) {
          WS_SERVER.close();
        }
      }, 1000);
    }

    const findConnectableServer = () => {
      let wsServers = [];
      const closeAllServers = () => {
        console.log('Close connection tester');
        wsServers.forEach(x => x.ws.close());
        if (serverConnectionTo !== null) {
          console.log(`Found server: ${serverConnectionTo}`);
          Vue.$eventBus.emit("ws-boot", true);
          connectToServer();
        } else {
          setTimeout(findConnectableServer, 5000);
        }
      };
      WS_URLS.forEach(x => {
        let tWS = new WebSocket(x);
        wsServers.push({
          url: x,
          ws: tWS
        });
        tWS.onopen = () => {
          serverConnectionTo = x;
          closeAllServers();
        };
        tWS.onclose = () => {
          for (let i = 0; i < wsServers.length; i++) {
            if (wsServers[i].url === x) {
              wsServers.splice(i, 1);
              return;
            }
          }
        };
      })
      setTimeout(() => {
        if (serverConnectionTo === null)
          closeAllServers();
      }, 5000);
    }

    findConnectableServer();
  },
};