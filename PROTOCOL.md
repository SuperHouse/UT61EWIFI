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
 * currentType (string): ?
 * unit (string): the units for the measured value.
 * absValue (float): the absolute value of the latest measurement, with no sign.
 * negative (boolean): whether the measured value is negative.

{"value":"-24.318","currentType":"DC","unit":"V","absValue":"24.318","negative":false}
