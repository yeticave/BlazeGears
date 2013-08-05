/*
BlazeGears JavaScript Toolkit
Version 1.1.0-s.1, January 1st, 2013

Copyright (c) 2011-2013 Gabor Soos

This software is provided 'as-is', without any express or implied warranty. In
no event will the authors be held liable for any damages arising from the use of
this software.

Permission is granted to anyone to use this software for any purpose, including
commercial applications, and to alter it and redistribute it freely, subject to
the following restrictions:

  1. The origin of this software must not be misrepresented; you must not claim
     that you wrote the original software. If you use this software in a
     product, an acknowledgment in the product documentation would be
     appreciated but is not required.
  2. Altered source versions must be plainly marked as such, and must not be
     misrepresented as being the original software.
  3. This notice may not be removed or altered from any source distribution.

Email: info@yeticave.com
Homepage: http://www.yeticave.com
*/

// Namespace: blazegears.formatting
var blazegears = (typeof blazegears === "undefined") ? {} : blazegears;
blazegears.formatting = (typeof blazegears.formatting === "undefined") ? {} : blazegears.formatting;

// Enum: blazegears.formatting.DecimalVisibility
blazegears.formatting.DecimalVisibility = {
	FIXED: 1,
	MINIMAL: 2,
	TRUNCATED: 3
};

// Enum: blazegears.formatting.TimeZoneOffset
blazegears.formatting.TimeZoneOffset = {
	AUTOMATIC: null,
	UTC: 0
};

// Class: blazegears.formatting.DateFormat
blazegears.formatting.DateFormatTemplate = function() {
	this._tokens = [];
}

// Method: addCallback
blazegears.formatting.DateFormatTemplate.prototype.addCallback = function(callback) {
	this._tokens.push(callback);
}

// Method: addLiteral
blazegears.formatting.DateFormatTemplate.prototype.addLiteral = function(literal) {
	if (this._tokens.length === 0 || BlazeGears.isFunction(this._tokens[this._tokens.length - 1])) {
		this._tokens.push(literal.toString());
	} else {
		this._tokens[this._tokens.length - 1] += literal.toString();
	}
}

// Method: merge
blazegears.formatting.DateFormatTemplate.prototype.merge = function(date_format_template) {
	var i;
	var token_count = date_format_template._tokens.length;
	var tokens = date_format_template._tokens;
	
	for (i = 0; i < token_count; ++i) {
		this._tokens.push(tokens[i]);
	}
}

// Method: render
blazegears.formatting.DateFormatTemplate.prototype.render = function(context, date) {
	var i;
	var result = "";
	var token;
	var tokens = this._tokens;
	var token_count = tokens.length;
	
	for (i = 0; i < token_count; ++i) {
		token = tokens[i];
		if (BlazeGears.isFunction(token)) {
			result += token.call(context, date).toString();
		} else {
			result += token.toString();
		}
	}
	
	return result;
}

// Class: blazegears.formatting.DateFormatter
blazegears.formatting.DateFormatter = function() {
	this._format = null;
	this._template = null;
	this._is_utc_time_enabled = false;
	this._full_day_names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	this._full_month_names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	this._short_meridiems = ["AM", "PM", "am", "pm"];
	this._ordinal_suffixes = ["st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th", "st"];
	this._short_day_names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	this._short_month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
}

// Method: getDateFormat
blazegears.formatting.DateFormatter.prototype.getDateFormat = function() {
	return this._format;
}

// Method: setDateFormat
blazegears.formatting.DateFormatter.prototype.setDateFormat = function(format) {
	if (format !== this._format) {
		this._format = format;
		this._template = null;
	}
}

// Method: getFullDayNames
blazegears.formatting.DateFormatter.prototype.getFullDayNames = function() {
	return this._full_day_names.slice();
}

// Method: setFullDayNames
blazegears.formatting.DateFormatter.prototype.setFullDayNames = function(day_names) {
	this._full_day_names = [];
	for (var i = 0; i < 7; ++i) {
		this._full_day_names.push(day_names[i].toString());
	}
}

// Method: getFullMonthNames
blazegears.formatting.DateFormatter.prototype.getFullMonthNames = function() {
	return this._full_month_names.slice();
}

// Method: setFullMonthNames
blazegears.formatting.DateFormatter.prototype.setFullMonthNames = function(month_names) {
	this._full_month_names = [];
	for (var i = 0; i < 12; ++i) {
		this._full_month_names.push(month_names[i].toString());
	}
}

// Method: getOrdinalSuffixes
blazegears.formatting.DateFormatter.prototype.getOrdinalSuffixes = function() {
	return this._ordinal_suffixes.slice();
}

// Method: setOrdinalSuffixes
blazegears.formatting.DateFormatter.prototype.setOrdinalSuffixes = function(ordinal_suffixes) {
	this._ordinal_suffixes = [];
	for (var i = 0; i < 31; ++i) {
		this._ordinal_suffixes.push(ordinal_suffixes[i].toString());
	}
}

// Method: getShortDayNames
blazegears.formatting.DateFormatter.prototype.getShortDayNames = function() {
	return this._short_day_names.slice();
}

// Method: setShortDayNames
blazegears.formatting.DateFormatter.prototype.setShortDayNames = function(day_names) {
	this._short_day_names = [];
	for (var i = 0; i < 7; ++i) {
		this._short_day_names.push(day_names[i].toString());
	}
}

// Method: getShortLowerMeridiemNames
blazegears.formatting.DateFormatter.prototype.getShortLowerMeridiemNames = function() {
	return [this._short_meridiems[2], this._short_meridiems[3]];
}

// Method: setShortLowerMeridiemNames
blazegears.formatting.DateFormatter.prototype.setShortLowerMeridiemNames = function(meridiem_names) {
	this._short_meridiems[2] = meridiem_names[0].toString();
	this._short_meridiems[3] = meridiem_names[1].toString();
}

// Method: getShortUpperMeridiemNames
blazegears.formatting.DateFormatter.prototype.getShortUpperMeridiemNames = function() {
	return [this._short_meridiems[0], this._short_meridiems[1]];
}

// Method: setShortUpperMeridiemNames
blazegears.formatting.DateFormatter.prototype.setShortUpperMeridiemNames = function(meridiem_names) {
	this._short_meridiems[0] = meridiem_names[0].toString();
	this._short_meridiems[1] = meridiem_names[1].toString();
}

// Method: getShortMonthNames
blazegears.formatting.DateFormatter.prototype.getShortMonthNames = function() {
	return this._short_month_names.slice();
}

// Method: setShortMonthNames
blazegears.formatting.DateFormatter.prototype.setShortMonthNames = function(month_names) {
	this._short_month_names = [];
	for (var i = 0; i < 12; ++i) {
		this._short_month_names.push(month_names[i].toString());
	}
}

// Method: getTimeZoneOffset
blazegears.formatting.DateFormatter.prototype.getTimeZoneOffset = function() {
	var result = null;
	
	if (this._is_utc_time_enabled) {
		result = blazegears.formatting.TimeZoneOffset.UTC;
	}
	
	return result;
}

// Method: setTimeZoneOffset
blazegears.formatting.DateFormatter.prototype.setTimeZoneOffset = function(time_zone_offset) {
	var TimeZoneOffset = blazegears.formatting.TimeZoneOffset;
	
	if (time_zone_offset === TimeZoneOffset.AUTOMATIC) {
		this._is_utc_time_enabled = false;
	} else if (time_zone_offset === TimeZoneOffset.UTC) {
		this._is_utc_time_enabled = true;
	}
}

// Method: formatDate
blazegears.formatting.DateFormatter.prototype.formatDate = function(date) {
	var result = "";
	
	date = this._prepareDate(date);
	if (this._template === null) {
		this._template = this.parseDateFormat(this._format);
	}
	result = this._template.render(this, date);
	
	return result;
}

// Method: parseDateFormat
blazegears.formatting.DateFormatter.prototype.parseDateFormat = function(format) {
	throw blazegears.NotOverriddenError();
}

// short names of days (sun - sat)
blazegears.formatting.DateFormatter.prototype._getAbbreviatedDayName = function(date) {
	return this._short_day_names[this._getDay(date)];
}

// short names of months (jan - dec)
blazegears.formatting.DateFormatter.prototype._getAbbreviatedMonthName = function(date) {
	return this._short_month_names[this._getMonth(date)];
}

// short years (0 - 99)
blazegears.formatting.DateFormatter.prototype._getAbbreviatedYear = function(date) {
	var result = String(this._getFullYear(date));
	
	result = result.substr(result.length - 2);
	
	return result;
}

// centuries (0 - 99)
blazegears.formatting.DateFormatter.prototype._getCentury = function(date) {
	return Math.ceil((this._getFullYear(date) + 1) / 100);
}

// days of the month (1 - 31)
blazegears.formatting.DateFormatter.prototype._getDate = function(date) {
	return this._is_utc_time_enabled ? date.getUTCDate() : date.getDate();
}

// days of the week, starting sunday (0 - 6)
blazegears.formatting.DateFormatter.prototype._getDay = function(date) {
	return this._is_utc_time_enabled ? date.getUTCDay() : date.getDay();
}

// full names of days (sunday - saturday)
blazegears.formatting.DateFormatter.prototype._getDayName = function(date) {
	return this._full_day_names[this._getDay(date)];
}

// days of the week, starting monday (1 - 7)
blazegears.formatting.DateFormatter.prototype._getDayOfWeek = function(date) {
	var result = this._getDay(date);
	
	if (result == 0) {
		result = 7;
	}
	
	return result;
}

// days of the year (1 - 366)
blazegears.formatting.DateFormatter.prototype._getDayOfYear = function(date) {
	var month_lenghts = [31, this._isLeapYear(date) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	var result = 0;
	
	for (var i = this._getMonth(date) - 1; i >= 0; --i) {
		result += month_lenghts[i];
	}
	result += this._getDate(date);
	
	return result;
}

// first day of the year helper
blazegears.formatting.DateFormatter.prototype._getFirstDayOfYear = function(date) {
	var first_day = new Date(this._getFullYear(date), 0, 1, 0, 0, 0, 0);
	
	return this._getDay(first_day);
}

// full years (1970 - 2038)
blazegears.formatting.DateFormatter.prototype._getFullYear = function(date) {
	return this._is_utc_time_enabled ? date.getUTCFullYear() : date.getFullYear();
}

// international hours (0 - 23)
blazegears.formatting.DateFormatter.prototype._getHours = function(date) {
	return this._is_utc_time_enabled ? date.getUTCHours() : date.getHours();
}

// iso-8601 years (1970 - 2038)
blazegears.formatting.DateFormatter.prototype._getIso8601Year = function(date) {
	var result;
	
	if (this._getMonth(date) == 0 && this._getIso8601Week(date) > 50) {
		result = this._getFullYear(date) - 1;
	} else {
		result = this._getFullYear(date);
	}
	
	return result;
}

// iso-8601 weeks of the year (1 - 53)
blazegears.formatting.DateFormatter.prototype._getIso8601Week = function(date) {
	var day_of_year = this._getDayOfYear(date);
	var first_day = this._getDayOfWeek(new Date(this._getFullYear(date), 0, 1, 0, 0, 0, 0));
	var last_day = this._getDayOfWeek(new Date(this._getFullYear(date), 11, 31, 0, 0, 0, 0));
	var year_length = this._isLeapYear(date) ? 366 : 365;
	var result;
	
	first_day = first_day > 4 ? first_day - 8 : first_day - 1;
	last_day = last_day < 4 ? last_day : 0;
	if (day_of_year <= -first_day) {
		result = this._getIso8601Week(new Date(this._getFullYear(date) - 1, 11, 31, 0, 0, 0, 0));
	} else if (day_of_year > year_length - last_day) {
		result = 1;
	} else {
		result = Math.ceil((day_of_year + first_day) / 7);
	}
	
	return result;
}

// last day of the year helper
blazegears.formatting.DateFormatter.prototype._getLastDayOfYear = function(date) {
	var last_day = new Date(this._getFullYear(date), 11, 31, 0, 0, 0, 0);
	
	return this._getDay(last_day);
}

// leap years (0 - 1)
blazegears.formatting.DateFormatter.prototype._getLeapYear = function(date) {
	return this._isLeapYear(date) ? "1" : "0";
}

// short lowercase meridiems (am - pm)
blazegears.formatting.DateFormatter.prototype._getLowerCaseMeridiem = function(date) {
	return this._short_meridiems[this._getHours(date) < 12 ? 2 : 3];
}

// minutes (0 - 59)
blazegears.formatting.DateFormatter.prototype._getMinutes = function(date) {
	return this._is_utc_time_enabled ? date.getUTCMinutes() : date.getMinutes();
}

// weeks of the year, starting on the first monday (0 - 53)
blazegears.formatting.DateFormatter.prototype._getMondayWeek = function(date) {
	var day_of_year = this._getDayOfYear(date);
	var first_day = this._getFirstDayOfYear(date);
	var result;
	
	if (first_day == 0) {
		first_day = 7;
	}
	if (first_day > 1) {
		day_of_year -= 8 - first_day;
	}
	if (day_of_year <= 0) {
		result = 0;
	} else {
		result = Math.ceil(day_of_year / 7);
	}
	
	return result;
}

// months (0 - 11)
blazegears.formatting.DateFormatter.prototype._getMonth = function(date) {
	return this._is_utc_time_enabled ? date.getUTCMonth() : date.getMonth();
}

// full names of months (january - december)
blazegears.formatting.DateFormatter.prototype._getMonthName = function(date) {
	return this._full_month_names[this._getMonth(date)];
}

// number of days of the month (28 - 31)
blazegears.formatting.DateFormatter.prototype._getNumberOfDaysInMonth = function(date) {
	var month = this._getMonth(date);
	var result;
	
	if (BlazeGears.isInArray(month, [0, 2, 4, 6, 7, 9, 11])) {
		result = 31;
	} else if (BlazeGears.isInArray(month, [3, 5, 8, 10])) {
		result = 30;
	} else if (this._isLeapYear(date)) {
		result = 29;
	} else {
		result = 28;
	}
	
	return result;
}

// ordinal suffixes (st, nd, rd, th)
blazegears.formatting.DateFormatter.prototype._getOrdinalSuffix = function(date) {
	return this._ordinal_suffixes[this._getDate(date) - 1];
}

// seconds (0 - 59)
blazegears.formatting.DateFormatter.prototype._getSeconds = function(date) {
	return this._is_utc_time_enabled ? date.getUTCSeconds() : date.getSeconds();
}

// weeks of the year, starting on the first sunday (0 - 53)
blazegears.formatting.DateFormatter.prototype._getSundayWeek = function(date) {
	var day_of_year = this._getDayOfYear(date);
	var first_day = this._getFirstDayOfYear(date);
	var result;
	
	first_day++;
	if (first_day > 1) {
		day_of_year -= 8 - first_day;
	}
	if (day_of_year <= 0) {
		result = 0;
	} else {
		result = Math.ceil(day_of_year / 7);
	}
	
	return result;
}

// swatch internet time (000 - 999)
blazegears.formatting.DateFormatter.prototype._getSwatchInternetTime = function(date) {
	var result = date.getUTCHours() + 1;
	
	if (result > 23) {
		result = 0;
	}
	result *= 3600;
	result += date.getUTCMinutes() * 60;
	result += date.getUTCSeconds();
	result /= 86.4;
	result = Math.floor(result);
	result = blazegears._padStringLeft(result, "0", 3);
	
	return result;
}

// unix timestamp (0 - 2147485547)
blazegears.formatting.DateFormatter.prototype._getTimestamp = function(date) {
	return Math.round(date.getTime() / 1000);
}

// hours (1 - 12)
blazegears.formatting.DateFormatter.prototype._getTwelveHourHours = function(date) {
	var result = this._getHours(date);
	
	if (result > 12) {
		result -= 12;
	}
	if (result == 0) {
		result = 12;
	}
	
	return result;
}

// short uppercase meridiems (am - pm)
blazegears.formatting.DateFormatter.prototype._getUpperCaseMeridiem = function(date) {
	return this._short_meridiems[this._getHours(date) < 12 ? 0 : 1];
}

// leap years (0 - 1)
blazegears.formatting.DateFormatter.prototype._isLeapYear = function(date) {
	var year = this._getFullYear(date);
	
	return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}

// creates a date object from the provided value
blazegears.formatting.DateFormatter.prototype._prepareDate = function(date) {
	var result;
	var timestamp;
	
	if (BlazeGears.isDate(date)) {
		result = date;
	} else if (BlazeGears.isNumber(date)) {
		result = new Date(date);
	} else {
		result = new Date();
	}
	
	return result;
}

// Class: blazegears.formatting.NumberFormatter
blazegears.formatting.NumberFormatter = function() {
	this._decimal_delimiter = ".";
	this._decimal_precision = 0;
	this._decimal_visibility = blazegears.formatting.DecimalVisibility.FIXED;
	this._group_delimiter = ",";
	this._group_size = 3;
	this._is_leading_zero_enabled = true;
	this._negative_prefix = "-";
	this._negative_suffix = "";
	this._rounding_callback = Math.round;
}

// Method: formatNumber
blazegears.formatting.NumberFormatter.prototype.formatNumber = function(number) {
	var DecimalVisibility = blazegears.formatting.DecimalVisibility;
	var decimal_part;
	var decimal_significand;
	var group_count;
	var group_offset;
	var groups;
	var has_decimal_part = true;
	var i;
	var integer_part;
	var integer_string;
	var integer_string_length;
	var is_negative;
	var result;
	
	// validate the number
	if (!BlazeGears.isNumber(number)) {
		number = parseFloat(number);
		if (isNaN(number)) {
			number = 0;
		}
	}
	is_negative = number < 0;
	
	// separate the number into integer and decimal parts
	integer_part = number > 0 ? Math.floor(number) : Math.ceil(number);
	decimal_part = number - integer_part;
	
	// create the decimal string
	if (this._decimal_precision > 0) {
		decimal_significand = Math.abs(this._rounding_callback.call(this, Math.pow(10, this._decimal_precision) * decimal_part)).toString();
		if (this._decimal_visibility === DecimalVisibility.FIXED) {
			while (decimal_significand.length < this._decimal_precision) {
				decimal_significand += "0";
			}
		} else {
			while (decimal_significand.length > 0 && decimal_significand.charAt(decimal_significand.length - 1) === "0") {
				decimal_significand = decimal_significand.substr(0, decimal_significand.length - 1);
			}
		}
		if (decimal_significand.length === 0 && this._decimal_visibility === DecimalVisibility.MINIMAL) {
			decimal_significand += "0";
		}
	} else {
		has_decimal_part = false;
		integer_part = this._rounding_callback.call(this, number);
	}
	
	// separate the integer part into groups
	integer_string = Math.abs(integer_part).toString();
	if (this._group_size > 0 && this._group_delimiter.length > 0 && integer_string.length > this._group_delimiter.length) {
		integer_string_length = integer_string.length;
		group_count = Math.ceil(integer_string_length / this._group_size);
		groups = [];
		
		for (i = 0; i < group_count; ++i) {
			group_offset = integer_string_length - this._group_size * (group_count - i);
			if (group_offset < 0) {
				groups.push(integer_string.substr(0, this._group_size + group_offset));
			} else {
				groups.push(integer_string.substr(group_offset, this._group_size));
			}
		}
		integer_string = groups.join(this._group_delimiter);
	}
	
	// combine the parts into the result
	if (Math.abs(integer_part) > 0) {
		result = integer_string;
	} else if (this._is_leading_zero_enabled) {
		result = "0";
	} else {
		result = "";
	}
	if (has_decimal_part && decimal_significand.length > 0) {
		result += this._decimal_delimiter + decimal_significand;
	}
	if (is_negative) {
		result = this._negative_prefix + result + this._negative_suffix;
	}
	if (result.length === 0) {
		result = "0";
	}
	
	return result;
}

// Method: enableLeadingZero
blazegears.formatting.NumberFormatter.prototype.enableLeadingZero = function(enable) {
	this._is_leading_zero_enabled = enable;
}

// Method: isLeadingZeroEnabled
blazegears.formatting.NumberFormatter.prototype.isLeadingZeroEnabled = function() {
	return this._is_leading_zero_enabled;
}

// Method: getDecimalDelimiter
blazegears.formatting.NumberFormatter.prototype.getDecimalDelimiter = function() {
	return this._decimal_delimiter;
}

// Method: setDecimalDelimiter
blazegears.formatting.NumberFormatter.prototype.setDecimalDelimiter = function(decimal_delimiter) {
	this._decimal_delimiter = decimal_delimiter;
}

// Method: getDecimalPrecision
blazegears.formatting.NumberFormatter.prototype.getDecimalPrecision = function() {
	return this._decimal_precision;
}

// Method: setDecimalPrecision
blazegears.formatting.NumberFormatter.prototype.setDecimalPrecision = function(decimal_precision) {
	this._decimal_precision = decimal_precision;
}

// Method: getDecimalVisibility
blazegears.formatting.NumberFormatter.prototype.getDecimalPrecision = function() {
	return this._decimal_visibility;
}

// Method: setDecimalVisibility
blazegears.formatting.NumberFormatter.prototype.setDecimalVisibility = function(decimal_visibility) {
	this._decimal_visibility = decimal_visibility;
}

// Method: getGroupDelimiter
blazegears.formatting.NumberFormatter.prototype.getGroupDelimiter = function() {
	return this._group_delimiter;
}

// Method: setGroupDelimiter
blazegears.formatting.NumberFormatter.prototype.setGroupDelimiter = function(group_delimiter) {
	this._group_delimiter = group_delimiter;
}

// Method: getGroupSize
blazegears.formatting.NumberFormatter.prototype.getGroupSize = function() {
	return this._group_size;
}

// Method: setGroupSize
blazegears.formatting.NumberFormatter.prototype.setGroupSize = function(group_size) {
	this._group_size = group_size;
}

// Method: getNegativePrefix
blazegears.formatting.NumberFormatter.prototype.getNegativePrefix = function() {
	return this._negative_prefix;
}

// Method: setNegativePrefix
blazegears.formatting.NumberFormatter.prototype.setNegativePrefix = function(negative_prefix) {
	this._negative_prefix = negative_prefix;
}

// Method: getNegativeSuffix
blazegears.formatting.NumberFormatter.prototype.getNegativeSuffix = function() {
	return this._negative_suffix;
}

// Method: setNegativeSuffix
blazegears.formatting.NumberFormatter.prototype.setNegativeSuffix = function(negative_suffix) {
	this._negative_suffix = negative_suffix;
}

// Method: getRoundingCallback
blazegears.formatting.NumberFormatter.prototype.getRoundingCallback = function() {
	return this._rounding_callback;
}

// Method: setRoundingCallback
blazegears.formatting.NumberFormatter.prototype.setRoundingCallback = function(rounding_callback) {
	this._rounding_callback = rounding_callback;
}

// Class: blazegears.formatting.PHPDateFormatter
blazegears.formatting.PHPDateFormatter = function() {
	blazegears.formatting.DateFormatter.call(this);
	this._format = "c";
}
blazegears.formatting.PHPDateFormatter.prototype = new blazegears.formatting.DateFormatter();
blazegears.formatting.PHPDateFormatter.prototype.constructor = blazegears.formatting.PHPDateFormatter;

// Method: generateDateFormatCache
blazegears.formatting.PHPDateFormatter.prototype.parseDateFormat = function(format) {
	var character;
	var result = new blazegears.formatting.DateFormatTemplate();
	
	for (var i = 0; i < format.length; i++) {
		character = format.charAt(i);
		switch(character) {
			case "\\":
				i++;
				character = format.charAt(i);
				result.addLiteral(character);
				break;
			
			case "A": // abbreviated upper-case meridiems (AM - PM)
				result.addCallback(this._getUpperCaseMeridiem);
				break;
			
			case "B": // swatch internet time (000 - 999)
				result.addCallback(this._getSwatchInternetTime);
				break;
			
			case "D": // abbreviated weekday names (Sun - Sat)
				result.addCallback(this._getAbbreviatedDayName);
				break;
			
			case "F": // month names (January - December)
				result.addCallback(this._getMonthName);
				break;
			
			case "G": // international hours (0 - 23)
				result.addCallback(this._getHours);
				break;
			
			case "H": // international hours (00 - 23)
				result.addCallback(this._getInternationalHours);
				break;
			
			case "I": // daylight saving time (0 - 1)
				result.addLiteral("0");
				break;
			
			case "L": // leap years (0 - 1)
				result.addCallback(this._getLeapYear);
				break;
			
			case "M": // abbreviated month names (Jan - Dec)
				result.addCallback(this._getAbbreviatedMonthName);
				break;
			
			case "N": // weekdays, starting on monday (1 - 7)
				result.addCallback(this._getDayOfWeek);
				break;
			
			case "O": // time zone offset in hours and minutes (-1200 - +1300)
				break;
			
			case "P": // time zone offset in hours and minutes (-12:00 - +13:00)
				break;
			
			case "S": // ordinals for the days of the month (st, nd, rd, or th)
				result.addCallback(this._getOrdinalSuffix);
				break;
			
			case "T": // abbreviated time zone names (e.g. UTC)
				break;
			
			case "U": // unix timestamp
				result.addCallback(this._getTimestamp);
				break;
			
			case "W": // iso-8601 weeks (01 - 53)
				result.addCallback(this._getPaddedIso8601Week);
				break;
			
			case "Y": // years (1970 - 2038)
				result.addCallback(this._getFullYear);
				break;
			
			case "Z": // time zone offset in seconds (-43200 - 50400)
				break;
			
			case "a": // abbreviated lower-case meridiems (am - pm)
				result.addCallback(this._getLowerCaseMeridiem);
				break;
			
			case "c": // same as "Y-m-d\\TH:i:sP"
				result.merge(this.parseDateFormat("Y-m-d\\TH:i:sP"));
				break;
			
			case "d": // days (01 - 31)
				result.addCallback(this._getPaddedDays);
				break;
			
			case "e": // time zone names (e.g. Nuku'alofa)
				break;
			
			case "g": // hours (1 - 12)
				result.addCallback(this._getTwelveHourHours);
				break;
			
			case "h": // hours (01 - 12)
				result.addCallback(this._getPaddedShortHours);
				break;
			
			case "i": // minutes (00 - 59)
				result.addCallback(this._getPaddedMinutes);
				break;
			
			case "j": // days (1 - 31)
				result.addCallback(this._getDate);
				break;
			
			case "l": // weekday names (Sunday - Saturday)
				result.addCallback(this._getDayName);
				break;
			
			case "m": // months (01 - 12)
				result.addCallback(this._getPaddedMonth);
				break;
			
			case "n": // months (1 - 12)
				result.addCallback(this._getIncrementedMonth);
				break;
			
			case "o": // iso-8601 years (1970 - 2038)
				result.addCallback(this._getIso8601Year);
				break;
			
			case "r": // same as "D, d M Y H:i:s O"
				result.merge(this.parseDateFormat("D, d M Y H:i:s O"));
				break;
			
			case "s": // seconds (00 - 59)
				result.addCallback(this._getPaddedSeconds);
				break;
			
			case "t": // number of days in the month (28 - 31)
				result.addCallback(this._getNumberOfDaysInMonth);
				break;
			
			case "u": // microseconds (000000 - 999999)
				result.addLiteral("000000");
				break;
			
			case "w": // weekdays, starting on sunday (0 - 6)
				result.addCallback(this._getDay);
				break;
			
			case "y": // abbreviated years (00 - 99)
				result.addCallback(this._getAbbreviatedYear);
				break;
			
			case "z": // days of the year (0 - 365)
				result.addCallback(this._getDecrementedDayOfYear);
				break;
			
			default:
				result.addLiteral(character);
		}
	}
	
	return result;
}

blazegears.formatting.PHPDateFormatter.prototype._getDecrementedDayOfYear = function(date) {
	return this._getDayOfYear(date) - 1;
}

blazegears.formatting.PHPDateFormatter.prototype._getInternationalHours = function(date) {
	return blazegears._padStringLeft(this._getHours(date), "0", 2);
}

blazegears.formatting.PHPDateFormatter.prototype._getIncrementedMonth = function(date) {
	return this._getMonth(date) + 1;
}

blazegears.formatting.PHPDateFormatter.prototype._getPaddedDays = function(date) {
	return blazegears._padStringLeft(this._getDate(date), "0", 2);
}

blazegears.formatting.PHPDateFormatter.prototype._getPaddedIso8601Week = function(date) {
	return blazegears._padStringLeft(this._getIso8601Week(date), "0", 2);
}

blazegears.formatting.PHPDateFormatter.prototype._getPaddedMinutes = function(date) {
	return blazegears._padStringLeft(this._getMinutes(date), "0", 2);
}

blazegears.formatting.PHPDateFormatter.prototype._getPaddedMonth = function(date) {
	return blazegears._padStringLeft(this._getMonth(date) + 1, "0", 2);
}

blazegears.formatting.PHPDateFormatter.prototype._getPaddedSeconds = function(date) {
	return blazegears._padStringLeft(this._getSeconds(date), "0", 2);
}

blazegears.formatting.PHPDateFormatter.prototype._getPaddedShortHours = function(date) {
	return blazegears._padStringLeft(this._getTwelveHourHours(date), "0", 2);
}

// Class: blazegears.formatting.UnixDateFormatter
blazegears.formatting.UnixDateFormatter = function() {
	blazegears.formatting.DateFormatter.call(this);
	this._format = "%Y-%m-%dT%H:%M:%S%z";
}
blazegears.formatting.UnixDateFormatter.prototype = new blazegears.formatting.DateFormatter();
blazegears.formatting.UnixDateFormatter.prototype.constructor = blazegears.formatting.UnixDateFormatter;

// Method: generateDateFormatCache
blazegears.formatting.UnixDateFormatter.prototype.parseDateFormat = function(format) {
	var character;
	var closure;
	var has_padding_modifier = false;
	var local_date = false;
	var local_numbers = false;
	var opposite;
	var padding;
	var precision;
	var result = new blazegears.formatting.DateFormatTemplate();
	var specifier;
	var upper;
	
	for (var i = 0; i < format.length; i++) {
		character = format.charAt(i);
		if (character == "%") {
			i++;
			character = format.charAt(i);
			specifier = "%";
			local_date = false;
			local_numbers = false;
			opposite = false;
			padding = "0";
			precision = 0;
			upper = false;
			
			while (true) {
				if (BlazeGears.isInArray(character, ["-", "_", "0", "^", "#", "E", "O", ":"])) {
					specifier += character;
					switch (character) {
						case "-": // disable padding
							has_padding_modifier = true;
							padding = "";
							break;
						
						case "_": // pad with spaces
							has_padding_modifier = true;
							padding = " ";
							break;
						
						case "0": // pad with zeros
							has_padding_modifier = true;
							padding = "0";
							break;
						
						case "^": // convert to upper-case
							upper = true;
							break;
						
						case "#": // convert to opposite case
							opposite = true;
							break;
						
						case "E": // use the locale's alternate representation for date and time
							local_date = true;
							break;
						
						case "O": // use the locale's alternate numeric symbols for numbers
							local_numbers = true;
							break;
						
						case ":":
							precision++;
							break;
					}
					i++;
					character = format.charAt(i);
				} else {
					break;
				}
			}
			specifier += character;
			
			switch (character) {
				case "%":
					result.addLiteral("%");
					break;
				
				case "A": // weekday names (Sunday - Saturday)
					closure = function(upper, opposite) {
						return function(date) {
							var result = this._getDayName(date);
							if (upper || opposite) {
								result = result.toUpperCase();
							}
							return result;
						}
					}
					result.addCallback(closure(upper, opposite));
					break;
				
				case "B": // month names (January - December)
					closure = function(upper, opposite) {
						return function(date) {
							var result = this._getMonthName(date);
							if (upper || opposite) {
								result = result.toUpperCase();
							}
							return result;
						}
					}
					result.addCallback(closure(upper, opposite));
					break;
				
				case "C": // centuries (20 - 21)
					result.addCallback(this._getDecrementedCentury);
					break;
				
				case "D": // same as "%m/%d/%y"
					result.merge(this.parseDateFormat("%m/%d/%y"));
					break;
				
				case "F": // same as "%Y-%m-%d"
					result.merge(this.parseDateFormat("%Y-%m-%d"));
					break;
				
				case "G": // iso-8601 years (1970 - 2038)
					result.addCallback(this._getIso8601Year);
					break;
				
				case "H": // international hours (00 - 23)
					closure = function(padding) {
						return function(date) {
							return blazegears._padStringLeft(this._getHours(date), padding, 2);
						}
					}
					result.addCallback(closure(padding));
					break;
				
				case "I": // hours (01 - 12)
					closure = function(padding) {
						return function(date) {
							return blazegears._padStringLeft(this._getTwelveHourHours(date), padding, 2);
						}
					}
					result.addCallback(closure(padding));
					break;
				
				case "L": // leap years (0 - 1)
					result.addCallback(this._getLeapYear);
					break;
				
				case "M": // minutes (00 - 59)
					closure = function(padding) {
						return function(date) {
							return blazegears._padStringLeft(this._getMinutes(date), padding, 2);
						}
					}
					result.addCallback(closure(padding));
					break;
				
				case "N": // nanoseconds (000000000 - 999999999)
					result.addLiteral("000000000");
					break;
				
				case "P": // abbreviated lower-case meridiems (am - pm)
					result.addCallback(this._getLowerCaseMeridiem);
					break;
				
				case "R": // same as "%H:%M"
					result.merge(this.parseDateFormat("%H:%M"));
					break;
				
				case "S": // seconds (00 - 59)
					closure = function(padding) {
						return function(date) {
							return blazegears._padStringLeft(this._getSeconds(date), padding, 2);
						}
					}
					result.addCallback(closure(padding));
					break;
				
				case "T": // same as "%H:%M:%S".
				case "X":
					result.merge(this.parseDateFormat("%H:%M:%S"));
					break;
				
				case "U": // weeks, staring on sunday (00 - 53)
					closure = function(padding) {
						return function(date) {
							return blazegears._padStringLeft(this._getSundayWeek(date), padding, 2);
						}
					}
					result.addCallback(closure(padding));
					break;
				
				case "V": // iso-8601 weeks (01 - 53)
					closure = function(padding) {
						return function(date) {
							return blazegears._padStringLeft(this._getIso8601Week(date), padding, 2);
						}
					}
					result.addCallback(closure(padding));
					break;
				
				case "W": // weeks, staring on monday (00 - 53)
					closure = function(padding) {
						return function(date) {
							return blazegears._padStringLeft(this._getMondayWeek(date), padding, 2);
						}
					}
					result.addCallback(closure(padding));
					break;
				
				case "Y": // years (1970 - 2038)
					result.addCallback(this._getFullYear);
					break;
				
				case "Z": // abbreviated time zone names (e.g. UTC)
					break;
				
				case "a": // abbreviated weekday names (Sun - Sat)
					closure = function(upper, opposite) {
						return function(date) {
							var result = this._getAbbreviatedDayName(date);
							if (upper || opposite) {
								result = result.toUpperCase();
							}
							return result;
						}
					}
					result.addCallback(closure(upper, opposite));
					break;
				
				case "b": // abbreviated month names (Jan - Dec)
				case "h":
					closure = function(upper, opposite) {
						return function(date) {
							var result = this._getAbbreviatedMonthName(date);
							if (upper || opposite) {
								result = result.toUpperCase();
							}
							return result;
						}
					}
					result.addCallback(closure(upper, opposite));
					break;
				
				case "c": // same as "%a %b %_d %H:%M:%S %Y"
					closure = function(inner_format, upper) {
						return function(date) {
							var result = inner_format.render(this, date);
							if (upper) {
								result = result.toUpperCase();
							}
							return result;
						}
					}
					result.addCallback(closure(this.parseDateFormat("%a %b %_d %H:%M:%S %Y"), upper));
					break;
				
				case "d": // days (01 - 31)
					closure = function(padding) {
						return function(date) {
							return blazegears._padStringLeft(this._getDate(date), padding, 2);
						}
					}
					result.addCallback(closure(padding));
					break;
				
				case "e": // same as "%_d"
					closure = function(padding, has_padding_modifier) {
						if (!has_padding_modifier) {
							padding = " ";
						}
						return function(date) {
							return blazegears._padStringLeft(this._getDate(date), padding, 2);
						}
					}
					result.addCallback(closure(padding, has_padding_modifier));
					break;
				
				case "g": // abbreviated iso-8601 years (00 - 99)
					closure = function(padding) {
						return function(date) {
							return blazegears._padStringLeft(this._getIso8601Year(date) % 100, padding, 2);
						}
					}
					result.addCallback(closure(padding));
					break;
				
				case "j": // days of the year (001 - 366)
					closure = function(padding) {
						return function(date) {
							return blazegears._padStringLeft(this._getDayOfYear(date), padding, 3);
						}
					}
					result.addCallback(closure(padding));
					break;
				
				case "k": // same as "%_H"
					closure = function(padding, has_padding_modifier) {
						if (!has_padding_modifier) {
							padding = " ";
						}
						return function(date) {
							return blazegears._padStringLeft(this._getHours(date), padding, 2);
						}
					}
					result.addCallback(closure(padding, has_padding_modifier));
					break;
				
				case "l": // same as "%_I"
					closure = function(padding, has_padding_modifier) {
						if (!has_padding_modifier) {
							padding = " ";
						}
						return function(date) {
							return blazegears._padStringLeft(this._getTwelveHourHours(date), padding, 2);
						}
					}
					result.addCallback(closure(padding, has_padding_modifier));
					break;
				
				case "m": // months (01 - 12)
					closure = function(padding) {
						return function(date) {
							return blazegears._padStringLeft(this._getMonth(date) + 1, padding, 2);
						}
					}
					result.addCallback(closure(padding));
					break;
				
				case "n": // newline
					result.addLiteral("\n");
					break;
				
				case "o": // ordinals for the days of the month (st, nd, rd, or th)
					result.addCallback(this._getOrdinalSuffix);
					break;
				
				case "p": // abbreviated upper-case meridiems (AM - PM)
					closure = function(opposite) {
						return function(date) {
							var result = this._getUpperCaseMeridiem(date);
							if (opposite) {
								result = result.toLowerCase();
							}
							return result;
						}
					}
					result.addCallback(closure(opposite));
					break;
				
				case "r": // same as "%I:%M:%S %p"
					result.merge(this.parseDateFormat("%I:%M:%S %p"));
					break;
				
				case "s": // unix timestamp
					result.addCallback(this._getTimestamp);
					break;
				
				case "t": // tab
					result.addLiteral("\t");
					break;
				
				case "u": // weekdays, starting on monday (1 - 7)
					result.addCallback(this._getDayOfWeek);
					break;
				
				case "w": // weekdays, starting on sunday (0 - 6)
					result.addCallback(this._getDay);
					break;
				
				case "x": // same as "%m/%d/%y"
					result.merge(this.parseDateFormat("%m/%d/%y"));
					break;
				
				case "y": // abbreviated years (00 - 99)
					closure = function(padding) {
						return function(date) {
							return blazegears._padStringLeft(this._getFullYear(date) % 100, padding, 2);
						}
					}
					result.addCallback(closure(padding));
					break;
				
				case "z": // time zone offset (-1200 - +1300)
					//switch (precision) {
					//	case 0: break; // (-1200 - +1300)
					//	case 1: break; // (-12:00 - +13:00)
					//	case 2: break; // (-12:00:00 - +13:00:00)
					//	case 3: break; // minimal required precision
					//}
					break;
				
				default:
					continue;
			}
		} else {
			result.addLiteral(character);
		}
	}
	
	return result;
}

blazegears.formatting.UnixDateFormatter.prototype._getDecrementedCentury = function(date) {
	return this._getCentury(date) - 1;
}

// Class: BlazeGears.Formats [Deprecated]
// This class has been deprecated, use <blazegears.formatting.NumberFormatter>,  <blazegears.formatting.FileSizeFormatter>,  <blazegears.formatting.PHPDateFormatter>, and <blazegears.formatting.UnixDateFormatter> instead. A singleton class that handles various string formatting tasks.
// 
// Superclasses:
//   <BlazeGears.BaseClass [Deprecated]>
BlazeGears.Formats = BlazeGears.Classes.declareSingleton(BlazeGears.BaseClass, {
	// Field: date_format
	// The default date format dictionary used by <formatDate>.
	// 
	// Keys:
	//   syntax - The syntax string to be used.
	//   parser - Decides which syntax the "syntax" key uses. It can be either "unix" for the <date at http://unixhelp.ed.ac.uk/CGI/man-cgi?date> command of the Unix-like systems, or "php" for the <date at http://php.net/manual/en/function.date.php> function of PHP.
	date_format: {
		parser: "unix",
		syntax: "%B %-d%o, %Y %-I:%M%P"
	},
	
	// Field: number_format
	// The default number format dictionary used by <formatNumber> and <formatFilesize>.
	// 
	// Keys:
	//   decimal_delimiter - The decimal delimiter character.
	//   decimal_length - The number of digits to be displayed after the decimal delimiter.
	//   force_decimals - If it's true, the amount of digits specified by decimal_length will be always displayed, even if the those digits are all zeros.
	//   group_delimiter - The string used to separate the digit groups.
	//   group_length - The maximum number of digits in a digit group.
	//   leading_zero - If it's true, the leading zero will be displayed for numbers that are less than 1 and greater than -1.
	//   negative_prefix - The prefix applied to numbers less than zero.
	//   negative_suffix - The suffix applied to numbers less than zero.
	//   negatives_first - If it's true, the negative affixes will be applied before the general affixes.
	//   prefix - The prefix applied to all numbers.
	//   suffix - The suffix applied to all numbers.
	number_format: {
		decimal_delimiter: ".",
		decimal_length: 0,
		force_decimals: false,
		group_delimiter: ",",
		group_length: 3,
		leading_zero: true,
		negative_prefix: "-",
		negative_suffix: "",
		negatives_first: false,
		prefix: "",
		suffix: ""
	},
	
	// Field: texts
	// This dictionary contains the default text collections used by <formatDate> and <formatFilesize>.
	// 
	// Keys:
	//   filesizes - The names of the file size units used by <formatFilesize>.
	//   full_days - The full names of days used by <formatDate>.
	//   full_months - The full names of months used by <formatDate>.
	//   short_lower_meridiems - The abbreviated lower-case variants of ante meridiem and post meridiem used by <formatDate>.
	//   short_upper_meridiems - The abbreviated upper-case variants of ante meridiem and post meridiem used by <formatDate>.
	//   ordinal_suffixes - The ordinal suffixes for the days of the month used by <formatDate>.
	//   short_days - The abbreviated names of days used by <formatDate>.
	//   short_months - The abbreviated names of months used by <formatDate>.
	texts: {
		filesizes: ["b", "Kb", "Mb", "Gb", "Tb"],
		full_days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		full_months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		short_lower_meridiems: ["am", "pm"],
		short_upper_meridiems: ["AM", "PM"],
		ordinal_suffixes: ["st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th", "st"],
		short_days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		short_months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
	},
	
	// Function: enableUTCTime
	// Enables or disable the usage of the UTC time for date formatting.
	// 
	// Arguments:
	//   enable - If it's true, the date functions will be using UTC time, otherwise they will be using the local time zone.
	//
	// See Also:
	//   <formatDate>
	enableUTCTime: function(self, enable) {
		self._is_utc_time_enabled = enable;
	},
	
	// Function: formatDate
	// Formats a date using either Unix or PHP syntax.
	// 
	// Arguments:
	//   [date = new Date()] - The date to be formatted.
	//   [configuration = {}] - A dictionary that defines how the date should be formatted. The missing keys will be copied from <date_format>.
	// 
	// Return Value:
	// 	Returns the formatted date.
	// 
	// Broken Unix Specifiers:
	//   E - Use the locale's alternate representation for date and time. Doesn't do anything.
	//   N - Nanoseconds. Always returns "000000000".
	//   O - Use the locale's alternate numeric symbols for numbers. Doesn't do anything.
	//   Z - Abbreviated time zone name. Always returns an empty string.
	//   z - Time zone offset. Always returns an empty string.
	// 
	// Broken PHP Specifiers:
	//   I - Daylight saving time. Always returns 0.
	//   O - Timezone offset in hours and minutes. Always returns an empty string.
	//   P - Timezone offset in hours and minutes. Always returns an empty string.
	//   T - Abbreviated time zone name. Always returns an empty string.
	//   Z - Timezone offset in seconds. Always returns an empty string.
	//   e - Time zone name. Always returns an empty string.
	//   u - Microseconds. Always returns "000000".
	// 
	// See Also:
	//   - <date_format>
	//   - <texts>
	formatDate: function(self, date, configuration) {
		if (!self.is(date)) date = new Date();
		if (!self.is(configuration)) configuration = {};
		
		var formatter = null;
		var properties = ["syntax", "parser"];
		var result;
		
		// default the missing configuration keys
		for (var i in properties) {
			if (!self.is(configuration[properties[i]])) {
				configuration[properties[i]] = self.date_format[properties[i]];
			}
		}
		
		// verify the date
		if (!self.isDate(date)) {
			if (self.isString(date)) {
				date = new Date(date);
				if (isNaN(date)) {
					date = new Date(0);
				}
			} else {
				date = parseInt(date);
				if (isNaN(date)) {
					date = 0;
				}
				date = new Date(date * 1000);
			}
		}
		
		// use the selected parser
		switch (configuration.parser) {
			case "php":
				formatter = new blazegears.formatting.PHPDateFormatter();
				break;
			
			case "unix":
				formatter = new blazegears.formatting.UnixDateFormatter();
				break;
			
			default:
				result = configuration.syntax;
		}
		
		if (formatter != null) {
			formatter._is_utc_time_enabled = this._is_utc_time_enabled;
			formatter._short_day_names = self.texts.short_days;
			formatter._short_meridiems = [self.texts.short_upper_meridiems[0], self.texts.short_upper_meridiems[1], self.texts.short_lower_meridiems[0], self.texts.short_lower_meridiems[1]];
			formatter._short_month_names = self.texts.short_months;
			formatter._full_day_names = self.texts.full_days;
			formatter._full_month_names = self.texts.full_months;
			formatter._ordinal_suffixes = self.texts.ordinal_suffixes;
			formatter.setDateFormat(configuration.syntax);
			result = formatter.formatDate(date);
		}
		
		return result;
	},
	
	// Function: formatFilesize
	// Formats a number into a file size by rounding down to the nearest significant value.
	// 
	// Arguments:
	//   filesize - The file size to be formatted in bytes.
	//   [configuration = {}] - A dictionary that defines how the number should be formatted. The missing keys will be copied from <number_format>.
	// 
	// Return Value:
	//   Returns the formatted file size.
	// 
	// See Also:
	//   - <formatNumber>
	//   - <number_format>
	//   - <texts>
	formatFilesize: function(self, filesize, configuration) {
		var unit = 0;
		
		// check the file size
		filesize = parseInt(filesize);
		if (isNaN(filesize)) {
			filesize = 0;
		}
		
		// round down until it runs out
		while (filesize > 1023 && unit < self.texts.filesizes.length - 1) {
			filesize = Math.round(filesize / 1024);
			unit++;
		}
		filesize = self.formatNumber(filesize, configuration);
		
		return filesize + self.texts.filesizes[unit];
	},
	
	// Function: formatNumber
	// Formats a number.
	// 
	// Arguments:
	//   number - The number to be formatted.
	//   [configuration = {}] - A dictionary that defines how the number should be formatted. The missing keys will be copied from <number_format>.
	// 
	// Return Value:
	//   Returns the formatted number.
	// 
	// See Also:
	//   <number_format>
	formatNumber: function(self, number, configuration) {
		if (!self.is(configuration)) configuration = {};
		
		var DecimalVisibility = blazegears.formatting.DecimalVisibility;
		var decimal_visibility;
		var formatter = new blazegears.formatting.NumberFormatter();
		var negative = false;
		var properties = ["decimal_delimiter", "decimal_length", "force_decimals", "group_delimiter", "group_length", "leading_zero", "negative_prefix", "negative_suffix", "negatives_first", "prefix", "suffix"];
		var result;
		
		// default the missing configuration keys
		for (var i in properties) {
			if (!self.is(configuration[properties[i]])) {
				configuration[properties[i]] = self.number_format[properties[i]];
			}
		}
		
		// format the number
		if (!BlazeGears.isNumber(number)) {
			number = parseFloat(number);
		}
		if (number < 0) {
			negative = true;
		}
		decimal_visibility = configuration.force_decimals ? DecimalVisibility.FIXED : DecimalVisibility.TRUNCATED;
		formatter.enableLeadingZero(configuration.leading_zero);
		formatter.setDecimalDelimiter(configuration.decimal_delimiter);
		formatter.setDecimalPrecision(configuration.decimal_length);
		formatter.setDecimalVisibility(decimal_visibility);
		formatter.setGroupDelimiter(configuration.group_delimiter);
		formatter.setGroupSize(configuration.group_length);
		formatter.setNegativePrefix("");
		formatter.setNegativeSuffix("");
		formatter.setRoundingCallback(Math.round);
		result = formatter.formatNumber(number);
		
		// apply the affixes
		if (configuration.negatives_first) {
			if (negative) {
				result = configuration.negative_prefix + result + configuration.negative_suffix;
			}
			result = configuration.prefix + result + configuration.suffix;
		} else {
			result = configuration.prefix + result + configuration.suffix;
			if (negative) {
				result = configuration.negative_prefix + result + configuration.negative_suffix;
			}
		}
		
		return result;
	},
	
	// determines if utc time or the local time should be used
	_is_utc_time_enabled: false
});
