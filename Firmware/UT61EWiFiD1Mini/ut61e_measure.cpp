/*
 * ut61e_measure.cpp
 *
 *  Created on: 2021-07-25
 *         git: https://github.com/cabletie/UT61EWIFI
 *      Author: CableTie
 *    Based on: https://github.com/stv0g/dmm_ut61e by Steffen Vogel
 */

#include "ut61e_measure.h"
#include <exception>
#include <cstdlib>

const char* UT61E_MEAS::modelbl[] = { "V", "A", "Ω", "▶︎", "Hz", "F", "H", "℧" };
const char* UT61E_MEAS::fmodelbl[] = { "Duty" , "Frequency" };
const char* UT61E_MEAS::powerlbl[] = {"AC", "DC" };
const char* UT61E_MEAS::rangelbl[] = { "Auto", "Manual" };
const char* UT61E_MEAS::loadlbl[] = { "Overload", "Normal", "Underload" };
const char* UT61E_MEAS::peaklbl[] = { "Maximum", "Minimum" };

UT61E_MEAS::UT61E_MEAS() {
	mode = M_VOLTAGE;
}

UT61E_MEAS::~UT61E_MEAS() {}

// Returns current DMM mode from packet
// "V", "A", "Ω", "▶︎", "Hz", "F", "H", "℧"
const char* UT61E_MEAS::getMode() {
	return UT61E_MEAS::modelbl[mode];
}

// Returns current Frequency Mode from DMM packet
const char* UT61E_MEAS::getFMode() {
	return UT61E_MEAS::fmodelbl[fmode];
}

// Returns current power type AC/DC from DMM packet
const char* UT61E_MEAS::getPower() {
	return UT61E_MEAS::powerlbl[power];
}

// Returns current DMM range setting
const char* UT61E_MEAS::getRange() {
	return UT61E_MEAS::rangelbl[range];
}

// Checks DMM packet for integrity, returns true if OK
bool UT61E_MEAS::check(char * data) {
	if ((data[0] & 0x30) == 0x30 && data[12] == 0x0d && data[13] == 0x0a) {
		return true;
	} else {
		return false;
	}
}

// Extracts / decodes DMM packet data
// Must be called prior to 
void UT61E_MEAS::parse(char * data) {
	char digits[] = { data[1], data[2], data[3], data[4], data[5] };
	value = atof(digits);

	lastmode = mode;

	bat = (data[7] & 2) ? true : false;
	rel = (data[8] & 2) ? true : false;
	hold = (data[11] & 2) ? true : false;

	if (data[7] & 0x04)
		value *= -1;

	if (data[10] & 8)
		power = DC;
	else if (data[10] & 4)
		power = AC;

	if (data[10] & 2)
		range = AUTO;
	else
		range = MANUAL;

	if (data[7] & 1)
		load = OVERLOAD;
	else if (data[9] & 8)
		load = UNDERLOAD;
	else
		load = NORMAL;

	if (data[9] & 4)
		peak = MAX;
	else if (data[9] & 2)
		peak = MIN;

	if (data[10] & 1)
		fmode = F_FREQUENCY;

	if (data[7] & 8)
		fmode = F_DUTY;

	double multp = 1;
	switch (data[6]) {
	case '1':
		mode = M_DIODE;
		break;

	case '2':
		mode = M_FREQUENCY;

		switch (data[0]) {
		case '0':
			multp = 1e-2;
			break;
		case '1':
			multp = 1e-1;
			break;
		case '3':
			multp = 1;
			break;
		case '4':
			multp = 1e1;
			break;
		case '5':
			multp = 1e2;
			break;
		case '6':
			multp = 1e3;
			break;
		case '7':
			multp = 1e4;
			break;
		default:
			throw std::exception();
		}
		break;

	case '3':
		mode = M_RESISTANCE;

		switch (data[0]) {
		case '0':
			multp = 1e-2;
			break;
		case '1':
			multp = 1e-1;
			break;
		case '2':
			multp = 1;
			break;
		case '3':
			multp = 1e1;
			break;
		case '4':
			multp = 1e2;
			break;
		case '5':
			multp = 1e3;
			break;
		case '6':
			multp = 1e4;
			break;
		default:
			throw std::exception();
		}
		break;

	case '5':
		mode = M_CONDUCTANCE;
		break;

	case '6':
		mode = M_CAPACITANCE;

		switch (data[0]) {
		case '0':
			multp = 1e-12;
			break;
		case '1':
			multp = 1e-11;
			break;
		case '2':
			multp = 1e-10;
			break;
		case '3':
			multp = 1e-9;
			break;
		case '4':
			multp = 1e-8;
			break;
		case '5':
			multp = 1e-7;
			break;
		case '6':
			multp = 1e-6;
			break;
		case '7':
			multp = 1e-5;
			break;
		default:
			throw std::exception();
		}
		break;

	case 0x3b: // V
		mode = M_VOLTAGE;

		switch (data[0]) {
		case '0':
			multp = 1e-4;
			break;
		case '1':
			multp = 1e-3;
			break;
		case '2':
			multp = 1e-2;
			break;
		case '3':
			multp = 1e-1;
			break;
		case '4':
			multp = 1e-5;
			break;
		default:
			throw std::exception();
		}
		break;

	case '0': // A
		mode = M_CURRENT;
		if (data[0] == '0')
			multp = 1e-3;
		else {
			throw std::exception();
		}
		break;

	case 0x3d: // uA
		mode = M_CURRENT;

		switch (data[0]) {
		case '0':
			multp = 1e-8;
			break;
		case '1':
			multp = 1e-7;
			break;
		default:
			throw std::exception();
		}

		break;
	case 0x3f: // mA
		mode = M_CURRENT;

		switch (data[0]) {
		case '0':
			multp = 1e-6;
			break;
		case '1':
			multp = 1e-5;
			break;
		default:
			throw std::exception();
		}

		break;
	default:
		throw std::exception();
	}

	value *= multp;

	if (mode != lastmode) {
		max = 0;
		min = 0;
		sample = 0;
		average = value;
	}

	if (value > max)
		max = value;

	if (value < min)
		min = value;

	average = (sample * average + value) / ++sample;
}
