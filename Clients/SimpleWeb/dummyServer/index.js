const express = require('express');
const http = require('http');
const ws = require('ws');
const mqtt = require('mqtt')

const lockToSingleType = false;
const numberRange = [0, 250];
const keepModeForX = 10;
const canGoNeg = true;
const canHold = true;
const liveFakeData = false;
const relayFromMQTT = false;
const MQTT_Host = [{
  host: '0',
  port: 15399
}];
const MQTT_OPTs = {
  servers: MQTT_Host,
  protocolId: 'MQTT',
  username: 'server1',
  password: ''
};
const MQTT_TOPIC = 'tele/7054A0/JSON';


const units = ["V", "A", "Ω", "Hz", "F", "deg", "%"];
const modes = ["voltage", "current", "resistance", "continuity", "diode", "frequency", "capacitance", "duty_cycle", "temperature"];
let pastMode = modes[0];
let pastModeCounter = 0;
const createDummyData = () => {
  let val = (Math.random() * numberRange[1]) + numberRange[0];
  let neg = canGoNeg ? Math.floor((Math.random() * 2) + 0) : false;
  let dcAc = Math.floor((Math.random() * 2) + 0);
  let range = Math.floor((Math.random() * 2) + 0);
  let hold = Math.floor((Math.random() * 100) + 0);
  let unit = units[Math.floor((Math.random() * units.length) + 0)];
  if (pastModeCounter > keepModeForX) {
    pastMode = modes[Math.floor((Math.random() * modes.length) + 0)];
    pastModeCounter = 0;
  }
  pastModeCounter++;
  let lowBatt = Math.floor((Math.random() * 2) + 0);
  if (neg)
    val = val * -1;
  return {
    "value": val,
    "unit": lockToSingleType ? units[0] : unit,
    "display_value": val,
    "display_unit": lockToSingleType ? units[0] : unit,
    "display_string": val.toFixed(2),
    "mode": lockToSingleType ? modes[0] : pastMode,
    "currentType": lockToSingleType ? "DC" : (dcAc == 0 ? "AC" : 'DC'),
    "peak": "",
    "relative": "0",
    "hold": canHold ? (lockToSingleType ? false : hold >= 50) : false,
    "range": range == 0 ? "auto" : "manual",
    "operation": "normal",
    "battery_low": lowBatt == 0,
    "negative": neg == 0
  }
}

const app = express();

const server = http.createServer(app);

const wss = new ws.Server({
  server
});

server.listen(process.env.PORT || 8999, () => {
  console.log(`Server started on port ${server.address().port} :)`);

  if (liveFakeData) {
    let co = JSON.parse(require('fs').readFileSync('./log.json').toString());
    let loopData = async () => {
      for (let item of co) {
        let asStr = JSON.stringify(item);
        console.log(asStr);
        wss.clients.forEach(client => {
          if (client !== ws && client.readyState === 1) {
            client.send(asStr);
          }
        })
        await (new Promise((r) => setTimeout(r, 1000)));
      }
      loopData();
    }
    loopData();
  } else if (relayFromMQTT) {
    console.warn(`MQTT Connect To ${MQTT_Host[0].host}:${MQTT_Host[0].port}`)
    const MQTT_CLIENT = mqtt.connect(MQTT_OPTs)

    MQTT_CLIENT.on('connect', () => {
      console.warn('MQTT Connected')
      MQTT_CLIENT.subscribe(MQTT_TOPIC, (err) => {
        if (err) {
          return console.error(err);
        }
        console.warn('MQTT Subbed to ' + MQTT_TOPIC)
      })
    })

    MQTT_CLIENT.on('message', function(topic, message) {
      console.log(message.toString())
      wss.clients.forEach(client => {
        if (client !== ws && client.readyState === 1) {
          client.send(message.toString());
        }
      })

      // store data 
      /*let co = JSON.parse(require('fs').readFileSync('./log.json').toString());
      co.push(JSON.parse(message.toString()));
      require('fs').writeFileSync('./log.json', JSON.stringify(co));*/
    })
  } else {
    setInterval(() => {
      const dummyData = JSON.stringify(createDummyData());
      console.log('send: ' + dummyData)
      wss.clients.forEach(client => {
        if (client !== ws && client.readyState === 1) {
          client.send(dummyData);
        }
      })
    }, 1000);
  }
});