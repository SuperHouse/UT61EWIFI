/**
  Read data from a UT61e multimeter and echo it directly to the host
  computer via USB.

0: There is no decimal point
1: There are three decimal digits
2: There are two decimal digits
4: There is one decimal digit
*/

#include <HardwareSerial.h>

HardwareSerial ut61e(1);

void setup()
{
  Serial.begin(115200);   // Serial port for connection to host
  ut61e.begin(19200, SERIAL_7O1, 16, 17);    // Serial port for connection to multimeter
  Serial.println("Serial reflector starting");
}

/**
   Loop
*/
void loop()
{
  if (ut61e.available())
  {
    Serial.write(ut61e.read());
  }
}
