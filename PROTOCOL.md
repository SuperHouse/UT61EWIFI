UT61e WiFi Interface Protocol
=============================

The example firmware reports data from the multimeter to an MQTT broker
in multiple formats.

Raw data packet
---------------
The raw data packet is published directly to the "raw" topic configured
in the firmware. This is the 14-byte message payload exactly as the
UT61e reports it, suitable for external processing by the client of
your choice.

Discrete values
---------------
The parsed reading values are published to topics as follows:

 *To do: define these!*

JSON message
------------
The parsed values are published as a unified JSON message containing
various fields. The fields are:

* value (float): the measured value, including sign if the value is negative. 
* unit (string): the units for the measured value.
* display_value (float): the measured value, including sign if the value is negative. 
* display_unit (string): the units for the measured value.
* display_string (string): the measured value, it does not include the sign if the value is negative.
* mode (string): [Description Required]
* currentType (string): [Description Required]
* peak (string): [Description Required]
* relative (string): [Description Required]
* hold (string): [Description Required]
* range (string): [Description Required]
* operation (string): [Description Required]
* battery_low (string): [Description Required]
* negative (boolean): [Description Required]

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