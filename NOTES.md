JSON format based on Aaron's idea?
{"currentType":"DC","unit":"V","value":"-24.120","absValue":"24.129","negative":true}

Check out Homie JSON format.
SCPI message format.



The schematic for the RS232 adapter is wrong! See here:  
http://www.designelectronics.com.au/DesignElectronics_UT61E-APO.htm

http://gushh.net/blog/ut61e-protocol/

http://kiedontaa.blogspot.com/2016/02/bluetooth-adapter-for-uni-t-ut61e.html

https://github.com/stv0g/dmm_ut61e

ESP8266 software serial with 7-bit support:  
https://github.com/plerup/espsoftwareserial

https://www.eevblog.com/forum/chat/ut61e-auto-power-off-modification/

Battery voltage monitoring: clever trick is to put the bottom of
a voltage divider onto a digital I/O pin, which is high impedance
while the MCU is turned off so no power bleeds. The MCU needs to
set the pin to LOW to activate the voltage divider. Idea from:

https://tinker.yeoman.com.au/2015/12/04/esp8266-smart-shelf-part-1/

Comparator to detect rising and falling edge:

https://e2e.ti.com/support/logic-group/logic/f/logic-forum/856131/sn74hc14-schmitt-trigger-to-cleanup-digital-signal

https://www.digikey.com/en/products/detail/texas-instruments/TLV7011DCKT/8604643
