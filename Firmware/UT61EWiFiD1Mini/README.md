# ut61e_display decode library example - display contents

Author: @CableTie https://github.com/cabletie/UT61EWIFI
Based on code by Steffen Vogel https://github.com/stv0g/dmm_ut61e
Licenced LGPL2+
Copyright
  (C) 2013 Domas Jokubauskis (domas@jokubauskis.lt)
  (C) 2014 Philipp Klaus (philipp.l.klaus@web.de)

## Synopsys
Extracts display data from ut61e packet suitable for re-displaying in synthesised display

value: foating point actual value of reading. No multipliers. eg 1000 Ω not 1.000 kΩ
unit: One of V,A,Ω,Hz,F,deg,% with no prefix
display_value: Numerical value of the display digits. e.g 1 for when 1 kΩ or 220 for 220uF
display_unit: One of V,A,Ω,Hz,F,deg,% with multiplier prefix such as M,k,m,u,n
mode: Function selector mode. One of "voltage", "current", "resistance", "continuity", "diode", "frequency", "capacitance", or "temperature"
currentType: "AC" or "DC"
peak: Peak measurement mode one of "min" or "max"
relative: In relative mode "true" or "false"
hold: In hold mode "true" or "false"
range: Range operation "manual" or "auto"
operation: "Normal", "overload" or "underload"
battery_low: "true" or "false"