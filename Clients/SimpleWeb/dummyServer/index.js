const express = require('express');
const http = require('http');
const ws = require('ws');

const units = ["V","A","Ω","Hz","F","deg","%"];
const modes = ["voltage", "current", "resistance", "continuity", "diode", "frequency", "capacitance", "duty_cycle", "temperature"];
const createDummyData = () => {
  let val = Math.floor((Math.random() * 10000));
  let neg = Math.floor((Math.random() * 2) + 0);
  let dcAc = Math.floor((Math.random() * 2) + 0);
  let range = Math.floor((Math.random() * 2) + 0);
  let hold = Math.floor((Math.random() * 100) + 0);
  let unit = units[Math.floor((Math.random() * units.length) + 0)];
  let mode = modes[Math.floor((Math.random() * modes.length) + 0)];
  let lowBatt = Math.floor((Math.random() * 2) + 0);
  if (neg)
    val = val * -1;
  return {
    "value": val,
    "unit": unit,
    "display_value": val,
    "display_unit": unit,
    "display_string": val.toFixed(2),
    "mode": mode,
    "currentType": dcAc == 0 ? "AC" : 'DC',
    "peak": "",
    "relative": "0",
    "hold": hold>= 50,
    "range": range == 0 ? "auto" : "manual",
    "operation": "normal",
    "battery_low": lowBatt == 0,
    "negative": neg == 0
  }
}

const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new ws.Server({
  server
});

//start our server
server.listen(process.env.PORT || 8999, () => {
  console.log(`Server started on port ${server.address().port} :)`);

  setInterval(() => {
    const dummyData = JSON.stringify(createDummyData());
    console.log('send: ' + dummyData)
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === 1) {
        client.send(dummyData);
      }
    })
  }, 1000)
});