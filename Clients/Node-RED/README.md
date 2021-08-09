UT61EWIFI Node-RED Web UI
=========================

*Written by Aaron Knox*

A node that receives data from a UT61e multimeter as a JSON message,
and provides a web interface that mimics the display on the multimeter.

Multimeter data connection
--------------------------

Data is received from the multimeter using:

[UT61e Wifi to MQTT board](https://www.superhouse.tv/product/ut61e-multimeter-wifi-interface/)

Configure MQTT
--------------
Data is received via an MQTT broker. In Node, add an "MQTT In" Node,
ensuring you configure your MQTT Broker and Topic. For example:

```
tele/ut61e/json

tele/7054A0_x/JSON
```

 **tele/ut61e/json**

Note: UT61e Web UI expects the JSON Topic provided by the UT61e Wifi
to MQTT board library.

Configure SuperHouse UT61e UI Node
----------------------------------
Configure the "SuperHouse | UT61e UI" when double clicking one the Node you will see some configuration options in the properties sidebar. The configuration options are "Web UI URL" and "Node Red Home Assistant Add-on?".

**Web UI URL**

You are able to customise the Web UI URL. By default this is set to:

 **your-node-red-host/ut61e** For example: **http://nodered.local/ut61e**

**Node Red Home Assistant Add-on?**

Here you specify whether your installation of Node Red is a Home Assitant Add-On or not.

Home Assistant with Node RED Add-On:
----------------------------------
If you are running Node RED as an Home Assistant Add-on then you will need to ensure you access the Web UI using Home Assistant Host with the Node Red PORT.

In the Node Properties tab ensure you select 'Yes' for the field "Node Red Home Assistant Add-on?"

You may be aware that to access a UI using the Node Red HA Add-on you also need to append /endpoint to your url. This therefore would look like this example

`http://<home-assistant-host>:<node-red-port>`/endpoint/`<\your-ui-url>`

e.g.
 - http://homeassistant.local:1880/endpoint/ut61e
 - http://192.168.1.20:1880/endpoint/ut61e

Expected JSON format
--------------------
The Node expects to receive messages in the format provided by the UT61e
WiFi Adapter firmware. This is still subject to change. Currently the
format looks like:

```
{
  "value": 242.69,
  "unit": "V",
  "display_value": 242.69,
  "display_unit": "V",
  "display_string": "0242.7",
  "mode": "voltage",
  "currentType": "AC",
  "peak": "",
  "relative": "0",
  "hold": "0",
  "range": "auto",
  "operation": "normal",
  "battery_low": "0",
  "negative": false
}
```

Need help?
----------
If you have an issue please join the SuperHouse community on the [SuperHouse Discord](https://discord.gg/VW9YRvd)
