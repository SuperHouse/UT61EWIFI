/*
 * ut61e_measure.h
 *
 *  Created on: 2021-07-25
 *      Author: CableTie
 *    Based on: https://github.com/stv0g/dmm_ut61e
 */

#include <cstdlib> // Needed for uint8_t
#include <string>
#include <unordered_map>
#include <tuple>
#include <sstream>
#include <HardwareSerial.h> 

using std::unordered_map;
using std::string;
using std::tuple;
using std::stringstream;

#ifndef UT61E_DISP_H_
#define UT61E_DISP_H_

// Range setting 
// value_multiplier:  Multiply the displayed value by this factor to get the value in base units.
// dp_digit_position: The digit position of the decimal point in the displayed meter reading value.
// display_unit:      The unit the displayed value is shown in.
// e.g. {1e-9, 3, "nF"}
struct Range_Dict
{
		float value_multiplier;
		int dp_digit_position;
		string display_unit;
};
// Maps a range setting bitmap pattern to a range setting dictionary
typedef unordered_map<uint8_t, Range_Dict> range_dict_map_t;

// function: dial/pushbutton setting
// subfunction: 
// unit: Single character base unit
// e.g. {"voltage", RANGE_VOLTAGE, "V"}
struct Function_Dict
{
		string function;
		range_dict_map_t subfunction;
		string unit;
};
// Maps a function setting bitmap pattern to a function and range
typedef unordered_map<uint8_t, Function_Dict> function_dict_map_t;
typedef unordered_map<uint8_t, string> status_map_t;
typedef unordered_map<string, uint8_t> bit_map_t;
typedef tuple<string, uint8_t> bit_tuple_t;

struct packet_bytes_t
{
		uint8_t d_range, d_digit4, d_digit3, d_digit2, d_digit1, d_digit0, d_function, d_status, d_option1, d_option2, d_option3, d_option4;
};

union packet_u_t
{
		char char_packet[12];
    uint8_t raw_packet[12];
		packet_bytes_t pb;
};

class UT61E_DISP {
	private:
		packet_u_t packet;
		bool _parse(bool);
		bit_map_t get_bits(uint8_t b, status_map_t bitmap);
		stringstream results;
		void dump_map(bit_map_t m);
		void print_byte(uint8_t byte);
		HardwareSerial *serial {0};
	public:
			// ut61e class to map data packet to display value and flags
			// extern const range_dict_map_t  RANGE_VOLTAGE;
			static range_dict_map_t RANGE_VOLTAGE;

			// undocumented in datasheet
			static  range_dict_map_t RANGE_CURRENT_AUTO_UA;

			// undocumented in datasheet
			static  range_dict_map_t RANGE_CURRENT_AUTO_MA;

			//2-range auto A *It includes auto μA, mA, 22.000A/220.00A, 220.00A/2200.0A.
			static  unordered_map<uint8_t, const char*> RANGE_CURRENT_AUTO;
			static  range_dict_map_t RANGE_CURRENT_22A;
			static  range_dict_map_t RANGE_CURRENT_MANUAL;
			static  range_dict_map_t RANGE_ADP;
			static  range_dict_map_t RANGE_RESISTANCE;
			static  range_dict_map_t RANGE_FREQUENCY;
			static  range_dict_map_t RANGE_CAPACITANCE;

			// When the meter operates in continuity mode or diode mode, this packet is always
			// 0110000 since the full-scale ranges in these modes are fixed.
			static  range_dict_map_t RANGE_DIODE;
			static  range_dict_map_t RANGE_CONTINUITY;
			static  range_dict_map_t RANGE_NULL;
			static  function_dict_map_t DIAL_FUNCTION;
			static  unordered_map<uint8_t, int> LCD_DIGITS;
			static  status_map_t STATUS;
			static  status_map_t OPTION1;
			static  status_map_t OPTION2;
			static  status_map_t OPTION3;
			static  status_map_t OPTION4; 

			float value; //float
			string unit; //string
			float display_value; //float
			string display_unit; // string
			char display_string[10]; // char *
			string mode; // string
			string currentType; //string
			string peak; //string
			bool relative; //bool
			bool hold; //bool
			string mrange; //string
			string operation; //string
			bool battery_low; //bool
			bool sign; //Negative sign

			UT61E_DISP();
			UT61E_DISP(HardwareSerial &s);
			~UT61E_DISP() { }

			bool parse(char const *, bool);
			bool parse(uint8_t const *, bool);
			const char *get(); // Format results into a string stream then return its .str
};

#endif /* UT61E_DISP_H_ */
