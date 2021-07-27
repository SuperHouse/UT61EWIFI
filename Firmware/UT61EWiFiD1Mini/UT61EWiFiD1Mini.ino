
/*
  UT61e to MQTT firmware (ESP8266 version)

  Written by Jonathan Oxer for www.superhouse.tv
   https://github.com/superhouse/UT61EWIFI

  Read from a UNI-T UT61e multimeter and publish the data to an MQTT
  broker. Intended for use with a Wemos D1 Mini. The pin numbers
  used are based on the D1 Mini board profile.

  External dependencies. Install using the Arduino library manager:
    - "PubSubClient" by Nick O'Leary
    - "NeoPixel" by Adafruit

*/
#define VERSION "1.2"

/*--------------------------- Configuration ------------------------------*/
// Configuration should be done in the included file:
#include "config.h"

/*--------------------------- Libraries ----------------------------------*/
#include <ESP8266WiFi.h>              // ESP8266 WiFi driver
#include <PubSubClient.h>             // For MQTT
#include <Adafruit_NeoPixel.h>        // For status LED
#include <SoftwareSerial.h>           // Must be the EspSoftwareSerial library
#include <ut61e_measure.h>


/*--------------------------- Global Variables ---------------------------*/
// MQTT
char g_mqtt_message_buffer[150];    // General purpose buffer for MQTT messages
uint8_t g_buffer_position    = 0;
char g_command_topic[50];           // MQTT topic for receiving commands
char g_mqtt_raw_topic[50];          // MQTT topic for reporting the raw data packet
char g_mqtt_json_topic[50];         // MQTT topic for reporting the decoded reading
char g_json_message_buffer[256];    // MQTT JSON data for reporting JSON format

// Wifi
#define WIFI_CONNECT_INTERVAL          500   // Wait 500ms intervals for wifi connection
#define WIFI_CONNECT_MAX_ATTEMPTS       10   // Number of attempts/intervals to wait

// General
uint32_t g_device_id;                        // Unique ID from ESP chip ID

/*--------------------------- Function Signatures ---------------------------*/
bool initWifi();
void reconnectMqtt();

/*--------------------------- Instantiate Global Objects --------------------*/
// MQTT
WiFiClient esp_client;
PubSubClient client(esp_client);
SoftwareSerial ut61e(UT61E_RX_PIN, -1); // RX, TX
Adafruit_NeoPixel pixels(1, STATUS_LED_PIN, NEO_GRB + NEO_KHZ800);
UT61E_MEAS dmm;

/*--------------------------- Program ---------------------------------------*/
/**
  Setup
*/
void setup()
{
  pixels.begin();
  pixels.clear();
  pixels.show();
  pixels.setBrightness(50);
  pixels.setPixelColor(0, pixels.Color(100, 0, 0));  // Red
  pixels.show();

  Serial.begin(SERIAL_BAUD_RATE);
  Serial.println();
  Serial.print("UT61e multimeter WiFi/USB interface starting up, v");
  Serial.println(VERSION);
  Serial.println("For more information see https://www.superhouse.tv/ut61ewifi");


  // Open a connection to the PMS and put it into passive mode
  ut61e.begin(UT61E_BAUD_RATE, SWSERIAL_7O1, UT61E_RX_PIN, -1);  // Connection for multimeter

  // We need a unique device ID for our MQTT client connection
  g_device_id = ESP.getChipId();  // Get the unique ID of the ESP8266 chip
  Serial.print("Device ID: ");
  Serial.println(g_device_id, HEX);

  // Set up the topics for publishing sensor readings. By inserting the unique ID,
  // the result is of the form: "device/d9616f/PM1P0" etc
  sprintf(g_command_topic,        "cmnd/%X/COMMAND",   g_device_id);  // For receiving commands
  sprintf(g_mqtt_raw_topic,       "tele/%X/RAW",       g_device_id);  // Data from multimeter
  sprintf(g_mqtt_json_topic,      "tele/%X/JSON",      g_device_id);  // Data from multimeter

  // Report the MQTT topics to the serial console
  Serial.println(g_command_topic);       // For receiving messages
  Serial.println("MQTT topics:");
  Serial.println(g_mqtt_raw_topic);      // From PMS
  Serial.println(g_mqtt_json_topic);     // From PMS

  // Connect to WiFi
  if (initWifi())
  {
    Serial.println(WiFi.localIP());
    pixels.setPixelColor(0, pixels.Color(0, 0, 100));  // Blue
    pixels.show();
  } else {
    Serial.println("WiFi connection failed");
  }

  /* Set up the MQTT client */
  client.setServer(mqtt_broker, 1883);
  client.setCallback(callback);
}

/*
  Main loop
*/
void loop() {
  if (WiFi.status() == WL_CONNECTED)
  {
    if (!client.connected()) {
      reconnectMqtt();
    }
  }
  client.loop();  // Process any outstanding MQTT messages

  /* Report value */
  String message_string;
  if (ut61e.available())
  {
    byte this_character = ut61e.read();
    //Serial.write(this_character);
    g_mqtt_message_buffer[g_buffer_position] = this_character;
    g_buffer_position++;
    if((13 == g_mqtt_message_buffer[g_buffer_position-2]) && (10 == g_mqtt_message_buffer[g_buffer_position-1]) ) {
      if(dmm.check(g_mqtt_message_buffer)) {
        pixels.setPixelColor(0, pixels.Color(0, 255, 0));  // Green
        pixels.show();
        g_mqtt_message_buffer[g_buffer_position-2] = 0;
        g_buffer_position = 0;
        client.publish(g_mqtt_raw_topic, g_mqtt_message_buffer);
        Serial.println(g_mqtt_message_buffer);
        pixels.setPixelColor(0, pixels.Color(0, 0, 0));  // Off
        pixels.show();
        dmm.parse(g_mqtt_message_buffer);
        if (!dmm.hold)
        {
          // Strictly Jon's definition
// The parsed values are published as a unified JSON message containing
// various fields. The fields are:

//  * value (float): the measured value, including sign if the value is negative.
//  * currentType (string): ?
//  * unit (string): the units for the measured value.
//  * absValue (float): the absolute value of the latest measurement, with no sign.
//  * negative (boolean): whether the measured value is negative.
// {
//   "currentType":"AC",
//   "unit":"V",
//   "value":-24.318,
//   "absValue":"24.419",
//   "negative":true
// }

          sprintf(g_json_message_buffer,"{\"currentType\":\"%s\",\"unit\":\"%s\",\"value\":%.4f,\"absValue\":\"%.4f\",\"negative\":%s}",
          dmm.getPower(), dmm.getMode(), dmm.value, abs(dmm.value), dmm.value<0?"true":"false");
          Serial.print("Squirrel JSON: ");
          Serial.println(g_json_message_buffer);
          // Official @superhousetv JSON spec.
          client.publish(g_mqtt_json_topic, g_json_message_buffer);

          // Everything we've got
          sprintf(g_json_message_buffer,"{\"sampleNumber\":\"%lu\",\"value\":\"%.5f\",\"valueMax\":\"%.5f\",\"valueMin\":\"%.5f\",\"valueAverage\":\"%.5f\",\"mode\":\"%s\",\"currentType\":\"%s\",\"range\":\"%s\",\"frequencyMode\":\"%s\"}", dmm.sample, dmm.value, dmm.max , dmm.min, dmm.average , dmm.getMode() , dmm.getPower(),dmm.getRange(),dmm.getFMode());
          Serial.print("JSON: ");
          Serial.println(g_json_message_buffer);
          // Don't publish this - Aaron Knox's NR code will barf
          // client.publish(g_mqtt_json_topic, g_json_message_buffer);
        }
      } else { // Data error
        pixels.setPixelColor(0, pixels.Color(255, 0, 0));  // Red
        pixels.show();
        g_buffer_position = 0;
        client.publish(g_mqtt_raw_topic, g_mqtt_message_buffer);
        sprintf(g_json_message_buffer,"{\"error\":\"invalid data!\"}");
        pixels.setPixelColor(0, pixels.Color(0, 0, 0));  // Off
        pixels.show();
      }
    }
  }
}


/**
  Report the most recent values to MQTT if enough time has passed
*/
void reportToMqtt()
{
  String message_string;

  /* Report all values combined into one JSON message */
  // Note: The PubSubClient library limits MQTT message size to 128 bytes, which is
  // set inside the library as MQTT_MAX_PACKET_SIZE. This prevents us reporting all
  // the values as a single JSON message, unless the library is edited. See:
  //  https://github.com/knolleary/pubsubclient/issues/110
  // The library has a method for sending large messages. Perhaps modify to use
  // this technique:
  //  https://github.com/knolleary/pubsubclient/blob/master/examples/mqtt_large_message/mqtt_large_message.ino

  // This is an example message generated by Tasmota, to match the format:
  // {"Time":"2020-02-27T03:27:22","PMS5003":{"CF1":0,"CF2.5":1,"CF10":1,"PM1":0,"PM2.5":1,"PM10":1,"PB0.3":0,"PB0.5":0,"PB1":0,"PB2.5":0,"PB5":0,"PB10":0}}
  // This is the source code from Tasmota:
  //ResponseAppend_P(PSTR(",\"PMS5003\":{\"CF1\":%d,\"CF2.5\":%d,\"CF10\":%d,\"PM1\":%d,\"PM2.5\":%d,\"PM10\":%d,\"PB0.3\":%d,\"PB0.5\":%d,\"PB1\":%d,\"PB2.5\":%d,\"PB5\":%d,\"PB10\":%d}"),
  //    pms_g_data.pm10_standard, pms_data.pm25_standard, pms_data.pm100_standard,
  //    pms_data.pm10_env, pms_data.pm25_env, pms_data.pm100_env,
  //    pms_data.particles_03um, pms_data.particles_05um, pms_data.particles_10um, pms_data.particles_25um, pms_data.particles_50um, pms_data.particles_100um);
  /*
    sprintf(g_mqtt_message_buffer,  "{\"UT61E\":{\"RANGE\":%i,\"VALUE\":%i}}",
            g_ut61e_range, g_ut61e_value);
    client.publish(g_mqtt_json_topic, g_mqtt_message_buffer);
  */
}


/**
  Connect to Wifi. Returns false if it can't connect.
*/
bool initWifi() {
  // Clean up any old auto-connections
  if (WiFi.status() == WL_CONNECTED) {
    WiFi.disconnect();
  }
  WiFi.setAutoConnect(false);

  // RETURN: No SSID, so no wifi!
  if (sizeof(ssid) == 1) {
    return false;
  }

  // Connect to wifi
  WiFi.begin(ssid, password);

  // Wait for connection set amount of intervals
  int num_attempts = 0;
  while (WiFi.status() != WL_CONNECTED && num_attempts <= WIFI_CONNECT_MAX_ATTEMPTS)
  {
    delay(WIFI_CONNECT_INTERVAL);
    num_attempts++;
  }

  if (WiFi.status() != WL_CONNECTED) {
    return false;
  } else {
    return true;
  }
}

/**
  Reconnect to MQTT broker, and publish a notification to the status topic
*/
void reconnectMqtt() {
  char mqtt_client_id[20];
  sprintf(mqtt_client_id, "esp8266-%X", g_device_id);

  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection to ");
    Serial.print(mqtt_broker);
    Serial.print(" as ");
    Serial.print(mqtt_client_id);
    Serial.print("... ");
    // Attempt to connect
    if (client.connect(mqtt_client_id, mqtt_username, mqtt_password))
    {
      // Once connected, publish an announcement
      sprintf(g_mqtt_message_buffer, "Device %s starting up", mqtt_client_id);
      client.publish(status_topic, g_mqtt_message_buffer);
      pixels.setPixelColor(0, pixels.Color(0, 50, 0));  // Dim green
      pixels.show();
      // Resubscribe
      //client.subscribe(g_command_topic);
      Serial.println("success");
    } else {
      //Serial.print("failed, rc=");
      //Serial.print(client.state());
      //Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      Serial.println("FAILED");
      delay(5000);
    }
  }
}

/*
  This callback is invoked when an MQTT message is received. It's not important
  right now for this project because we don't receive commands via MQTT. You
  can modify this function to make the device act on commands that you send it.
*/
void callback(char* topic, byte* message, unsigned int length) {
  //Serial.print("Message arrived [");
  //Serial.print(topic);
  //Serial.print("] ");
  //for (int i = 0; i < length; i++) {
  //  Serial.print((char)payload[i]);
  //}
  //Serial.println();
}
