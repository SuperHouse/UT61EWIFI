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

 **tele/ut61e/json**

Note: UT61e Web UI expects the JSON Topic provided by the UT61e Wifi
to MQTT board library.

Configure SuperHouse UT61e UI Node
----------------------------------
Configure the "SuperHouse | UT61e UI" Node by ensuring your Node Red
Host is correctly entered. This setting is required so that your browser
can load resources for the web interface. For example:

 **nodered.local** or **192.168.1.50**

Note: Do not include the port.

You are able to customise the Web UI URL. By default this is set to:

 **your-node-red-host/ut61e** For example: **http://nodered.local/ut61e**

Expected JSON format
--------------------
The Node expects to receive messages in the format provided by the UT61e
WiFi Adapter firmware. This is still subject to change. Currently the
format looks like:

**{"currentType":"DC","unit":"V","value":"24.318","negative":false}**

Need help?
----------
If you have an issue please join the SuperHouse community on the [SuperHouse Discord](https://discord.gg/VW9YRvd)
