/*
BlazeGears JavaScript Toolkit
Version 1.0.3-s, July 21st, 2012

Copyright (c) 2011-2012 Gabor Soos

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

// Class: BlazeGears.Formats
// A singleton class that handles various string formatting tasks.
// 
// Superclasses:
//   <BlazeGears.BaseClass>
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
	
	// Function: enableUtcTime
	// Enables or disable the usage of the UTC time for date formatting.
	// 
	// Arguments:
	//   enable - If it's true, the date functions will be using UTC time, otherwise they will be using the local time zone.
	//
	// See Also:
	//   <formatDate>
	enableUtcTime: function(self, enable) {
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
				result = self._formatPhpDate(date, configuration.syntax);
				break;
			
			case "unix":
				result = self._formatUnixDate(date, configuration.syntax);
				break;
			
			default:
				result = configuration.syntax;
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
		
		var counter = 0;
		var decimal;
		var digits;
		var groups = [];
		var negative = false;
		var properties = ["decimal_delimiter", "decimal_length", "force_decimals", "group_delimiter", "group_length", "leading_zero", "negative_prefix", "negative_suffix", "negatives_first", "prefix", "suffix"];
		var result = number
		
		// default the missing configuration keys
		for (var i in properties) {
			if (!self.is(configuration[properties[i]])) {
				configuration[properties[i]] = self.number_format[properties[i]];
			}
		}
		
		// check the number
		if (!self.isNumber(number)) {
			str = parseFloat(str);
		}
		
		// get some info of the number
		if (number < 0) {
			number = Math.abs(number);
			negative = true;
		}
		decimal = number - Math.floor(number);
		number = Math.floor(number);
		digits = number.toString().length % configuration.group_length;
		
		// create the decimals
		if (configuration.decimal_length > 0) {
			// calculate the actual decimal part
			decimal = Math.round(decimal * Math.pow(10, configuration.decimal_length));
			decimal = decimal.toString();
			while (decimal.length < configuration.decimal_length) {
				decimal = "0" + decimal;
			}
			
			// remove the unnecessary zeroes
			if (!configuration.force_decimals) {
				for (var i = decimal.length - 1; i >= 0; i--) {
					if (decimal.charAt(i) == "0") {
						decimal = decimal.substr(0, i);
					} else {
						break;
					}
				}
			}
			
			// apply the decimal separator
			if (decimal.length > 0) {
				decimal = configuration.decimal_delimiter + decimal;
			}
		} else {
			decimal = "";
		}
		
		// if the first group won't be full then assign the leading digits there
		number = number.toString();
		if (digits != 0) {
			groups[0] = number.substr(0, digits);
			number = number.substr(digits);
			counter++;
		}
		
		// assign the digits to their groups
		while (number.length > 0) {
			groups[counter] = number.substr(0, configuration.group_length);
			number = number.substr(configuration.group_length);
			counter++;
		}
		
		// remove the leading zero
		if (!configuration.leading_zero && groups.length == 1 && parseInt(groups[0]) == 0 && decimal.length > 0) {
			groups[0] = "";
		}
		
		// join the groups and the decimals
		number = groups.join(configuration.group_delimiter) + decimal;
		
		// apply the affixes
		if (configuration.negatives_first) {
			if (negative) {
				number = configuration.negative_prefix + number + configuration.negative_suffix;
			}
			number = configuration.prefix + number + configuration.suffix;
		} else {
			number = configuration.prefix + number + configuration.suffix;
			if (negative) {
				number = configuration.negative_prefix + number + configuration.negative_suffix;
			}
		}
		
		return number;
	},
	
	// determines if utc time or the local time should be used
	_is_utc_time_enabled: false,
	
	// formats a date using php's date function's syntax
	_formatPhpDate: function(self, date, syntax) {
		var character;
		var chunk;
		var result = "";
		
		for (var i = 0; i < syntax.length; i++) {
			character = syntax.charAt(i);
			switch(character) {
				case "\\":
					i++;
					character = syntax.charAt(i);
					if (i < syntax.length) {
						result += character;
					}
					break;
				
				case "A": // abbreviated upper-case meridiems (AM - PM)
					result += self._getUpperCaseMeridiem(date);
					break;
				
				case "B": // swatch internet time (000 - 999)
					result += self._getSwatchInternetTime(date);
					break;
				
				case "D": // abbreviated weekday names (Sun - Sat)
					result += self._getAbbreviatedDayName(date);
					break;
				
				case "F": // month names (January - December)
					result += self._getMonthName(date);
					break;
				
				case "G": // international hours (0 - 23)
					result += self._getHours(date);
					break;
				
				case "H": // international hours (00 - 23)
					result += self._padStringLeft(self._getHours(date), "0", 2);
					break;
				
				case "I": // daylight saving time (0 - 1)
					result += 0;
					break;
				
				case "L": // leap years (0 - 1)
					result += self._isLeapYear(date) ? "1" : "0";
					break;
				
				case "M": // abbreviated month names (Jan - Dec)
					result += self._getAbbreviatedMonthName(date);
					break;
				
				case "N": // weekdays, starting on monday (1 - 7)
					result += self._getDayOfWeek(date);
					break;
				
				case "O": // time zone offset in hours and minutes (-1200 - +1300)
					//result += self._formatUnixDate(date, "%z");
					break;
				
				case "P": // time zone offset in hours and minutes (-12:00 - +13:00)
					//result += self._formatUnixDate(date, "%:z");
					break;
				
				case "S": // ordinals for the days of the month (st, nd, rd, or th)
					result += self._getOrdinalSuffix(date);
					break;
				
				case "T": // abbreviated time zone names (e.g. UTC)
					//result += "";
					break;
				
				case "U": // unix timestamp
					result += self._getTimestamp(date);
					break;
				
				case "W": // iso-8601 weeks (01 - 53)
					result += self._padStringLeft(self._getIso8601Week(date), "0", 2);
					break;
				
				case "Y": // years (1970 - 2038)
					result += self._getFullYear(date);
					break;
				
				case "Z": // time zone offset in seconds (-43200 - 50400)
					//result += "";
					break;
				
				case "a": // abbreviated lower-case meridiems (am - pm)
					result += self._getLowerCaseMeridiem(date);
					break;
				
				case "c": // same as "Y-m-d\\TH:i:sP"
					result += self._formatPhpDate(date, "Y-m-d\\TH:i:sP");
					break;
				
				case "d": // days (01 - 31)
					result += self._padStringLeft(self._getDate(date), "0", 2);
					break;
				
				case "e": // time zone names (e.g. Nuku'alofa)
					//result += "";
					break;
				
				case "g": // hours (1 - 12)
					result += self._getTwelveHourHours(date);
					break;
				
				case "h": // hours (01 - 12)
					result += self._padStringLeft(self._getTwelveHourHours(date), "0", 2);
					break;
				
				case "i": // minutes (00 - 59)
					result += self._padStringLeft(self._getMinutes(date), "0", 2);
					break;
				
				case "j": // days (1 - 31)
					result += self._getDate(date);
					break;
				
				case "l": // weekday names (Sunday - Saturday)
					result += self._getDayName(date);
					break;
				
				case "m": // months (01 - 12)
					result += self._padStringLeft(self._getMonth(date) + 1, "0", 2);
					break;
				
				case "n": // months (1 - 12)
					result += self._getMonth(date) + 1;
					break;
				
				case "o": // iso-8601 years (1970 - 2038)
					result += self._getIso8601Year(date);
					break;
				
				case "r": // same as "D, d M Y H:i:s O"
					result += self._formatPhpDate(date, "D, d M Y H:i:s O");
					break;
				
				case "s": // seconds (00 - 59)
					result += self._padStringLeft(self._getSeconds(date), "0", 2);
					break;
				
				case "t": // number of days in the month (28 - 31)
					result += self._getNumberOfDaysInMonth(date);
					break;
				
				case "u": // microseconds (000000 - 999999)
					result += "000000";
					break;
				
				case "w": // weekdays, starting on sunday (0 - 6)
					result += self._getDay(date);
					break;
				
				case "y": // abbreviated years (00 - 99)
					result += self._getAbbreviatedYear(date);
					break;
				
				case "z": // days of the year (0 - 365)
					result += self._getDayOfYear(date) - 1;
					break;
				
				default:
					result += character;
			}
		}
		
		return result;
	},
	
	// formats a date using unix syntax
	_formatUnixDate: function(self, date, syntax) {
		var character;
		var chunk;
		var has_padding_modifier = false;
		var local_date = false;
		var local_numbers = false;
		var opposite;
		var padding;
		var precision;
		var result = "";
		var specifier;
		var temporary;
		var upper;
		
		for (var i = 0; i < syntax.length; i++) {
			character = syntax.charAt(i);
			if (character == "%") {
				i++;
				character = syntax.charAt(i);
				specifier = "%";
				local_date = false;
				local_numbers = false;
				opposite = false;
				padding = "0";
				precision = 0;
				upper = false;
				
				while (true) {
					if (self.isInArray(character, ["-", "_", "0", "^", "#", "E", "O", ":"])) {
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
						character = syntax.charAt(i);
					} else {
						break;
					}
				}
				specifier += character;
				
				switch (character) {
					case "%":
						chunk = "%";
						break;
					
					case "A": // weekday names (Sunday - Saturday)
						chunk = self._getDayName(date);
						if (upper || opposite) {
							chunk = chunk.toUpperCase();
						}
						break;
					
					case "B": // month names (January - December)
						chunk = self._getMonthName(date);
						if (upper || opposite) {
							chunk = chunk.toUpperCase();
						}
						break;
					
					case "C": // centuries (20 - 21)
						chunk = self._getCentury(date) - 1;
						break;
					
					case "D": // same as "%m/%d/%y"
						chunk = self._formatUnixDate(date, "%m/%d/%y");
						break;
					
					case "F": // same as "%Y-%m-%d"
						chunk = self._formatUnixDate(date, "%Y-%m-%d");
						break;
					
					case "G": // iso-8601 years (1970 - 2038)
						chunk = self._getIso8601Year(date);
						break;
					
					case "H": // international hours (00 - 23)
						chunk = self._padStringLeft(self._getHours(date), padding, 2);
						break;
					
					case "I": // hours (01 - 12)
						chunk = self._padStringLeft(self._getTwelveHourHours(date), padding, 2);
						break;
					
					case "L": // leap years (0 - 1)
						chunk = self._isLeapYear(date) ? "1" : "0";
						break;
					
					case "M": // minutes (00 - 59)
						chunk = self._padStringLeft(self._getMinutes(date), padding, 2);
						break;
					
					case "N": // nanoseconds (000000000 - 999999999)
						chunk = "000000000";
						break;
					
					case "P": // abbreviated lower-case meridiems (am - pm)
						chunk = self._getLowerCaseMeridiem(date);
						break;
					
					case "R": // same as "%H:%M"
						chunk = self._formatUnixDate(date, "%H:%M");
						break;
					
					case "S": // seconds (00 - 59)
						chunk = self._padStringLeft(self._getSeconds(date), padding, 2);
						break;
					
					case "T": // same as "%H:%M:%S".
					case "X":
						chunk = self._formatUnixDate(date, "%H:%M:%S");
						break;
					
					case "U": // weeks, staring on sunday (00 - 53)
						chunk = self._padStringLeft(self._getSundayWeek(date), padding, 2);
						break;
					
					case "V": // iso-8601 weeks (01 - 53)
						chunk = self._padStringLeft(self._getIso8601Week(date), padding, 2);
						break;
					
					case "W": // weeks, staring on monday (00 - 53)
						chunk = self._padStringLeft(self._getMondayWeek(date), padding, 2);
						break;
					
					case "Y": // years (1970 - 2038)
						chunk = self._getFullYear(date);
						break;
					
					case "Z": // abbreviated time zone names (e.g. UTC)
						chunk = "";
						break;
					
					case "a": // abbreviated weekday names (Sun - Sat)
						chunk = self._getAbbreviatedDayName(date);
						if (upper || opposite) {
							chunk = chunk.toUpperCase();
						}
						break;
					
					case "b": // abbreviated month names (Jan - Dec)
					case "h":
						chunk = self._getAbbreviatedMonthName(date);
						if (upper || opposite) {
							chunk = chunk.toUpperCase();
						}
						break;
					
					case "c": // same as "%a %b %d %H:%M:%S %Y"
						chunk = self._formatUnixDate(date, "%a %b %_d %H:%M:%S %Y");
						if (upper) {
							chunk = chunk.toUpperCase();
						}
						break;
					
					case "d": // days (01 - 31)
						chunk = self._padStringLeft(self._getDate(date), padding, 2);
						break;
					
					case "e": // same as "%_d"
						if (!has_padding_modifier) {
							padding = " ";
						}
						chunk = self._padStringLeft(self._getDate(date), padding, 2);
						break;
					
					case "g": // abbreviated iso-8601 years (00 - 99)
						chunk = self._padStringLeft(self._getIso8601Year(date) % 100, padding, 2);
						break;
					
					case "j": // days of the year (001 - 366)
						chunk = self._padStringLeft(self._getDayOfYear(date), padding, 3);
						break;
					
					case "k": // same as "%_H"
						if (!has_padding_modifier) {
							padding = " ";
						}
						chunk = self._padStringLeft(self._getHours(date), padding, 2);
						break;
					
					case "l": // same as "%_I"
						if (!has_padding_modifier) {
							padding = " ";
						}
						chunk = self._padStringLeft(self._getTwelveHourHours(date), padding, 2);
						break;
					
					case "m": // months (01 - 12)
						chunk = self._padStringLeft(self._getMonth(date) + 1, padding, 2);
						break;
					
					case "n": // newline
						chunk = "\n";
						break;
					
					case "o": // ordinals for the days of the month (st, nd, rd, or th)
						chunk = self._getOrdinalSuffix(date);
						break;
					
					case "p": // abbreviated upper-case meridiems (AM - PM)
						chunk = self._getUpperCaseMeridiem(date);
						if (opposite) {
							chunk = chunk.toLowerCase();
						}
						break;
					
					case "r": // same as "%I:%M:%S %p"
						chunk = self._formatUnixDate(date, "%I:%M:%S %p");
						break;
					
					case "s": // unix timestamp
						chunk = self._getTimestamp(date);
						break;
					
					case "t": // tab
						chunk = "\t";
						break;
					
					case "u": // weekdays, starting on monday (1 - 7)
						chunk = self._getDayOfWeek(date);
						break;
					
					case "w": // weekdays, starting on sunday (0 - 6)
						chunk = self._getDay(date);
						break;
					
					case "x": // same as "%m/%d/%y"
						chunk = self._formatUnixDate(date, "%m/%d/%y");
						break;
					
					case "y": // abbreviated years (00 - 99)
						chunk = self._padStringLeft(self._getFullYear(date) % 100, padding, 2);
						break;
					
					case "z": // time zone offset (-1200 - +1300)
						//switch (precision) {
						//	case 0: break; // (-1200 - +1300)
						//	case 1: break; // (-12:00 - +13:00)
						//	case 2: break; // (-12:00:00 - +13:00:00)
						//	case 3: break; // minimal required precision
						//}
						chunk = "";
						break;
					
					default:
						continue;
				}
				
				result += chunk;
			} else {
				result += character;
			}
		}
		
		return result;
	},
	
	_getAbbreviatedDayName: function(self, date) {
		return self.texts.short_days[self._getDay(date)];
	},
	
	_getAbbreviatedMonthName: function(self, date) {
		return self.texts.short_months[self._getMonth(date)];
	},
	
	_getAbbreviatedYear: function(self, date) {
		var result = String(self._getFullYear(date));
		
		result = result.substr(result.length - 2);
		
		return result;
	},
	
	_getCentury: function(self, date) {
		return Math.ceil((self._getFullYear(date) + 1) / 100);
	},
	
	_getDate: function(self, date) {
		return self._is_utc_time_enabled ? date.getUTCDate() : date.getDate();
	},
	
	_getDay: function(self, date) {
		return self._is_utc_time_enabled ? date.getUTCDay() : date.getDay();
	},
	
	_getDayName: function(self, date) {
		return self.texts.full_days[self._getDay(date)];
	},
	
	_getDayOfWeek: function(self, date) {
		var result = self._getDay(date);
		
		if (result == 0) {
			result = 7;
		}
		
		return result;
	},
	
	_getDayOfYear: function(self, date) {
		var month_lenghts = [31, self._isLeapYear(date) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		var result = 0;
		
		for (var i = self._getMonth(date) - 1; i >= 0; --i) {
			result += month_lenghts[i];
		}
		result += self._getDate(date);
		
		return result;
	},
	
	_getFirstDayOfYear: function(self, date) {
		var first_day = new Date(self._getFullYear(date), 0, 1, 0, 0, 0, 0);
		
		return self._getDay(first_day);
	},
	
	_getFullYear: function(self, date) {
		return self._is_utc_time_enabled ? date.getUTCFullYear() : date.getFullYear();
	},
	
	_getHours: function(self, date) {
		return self._is_utc_time_enabled ? date.getUTCHours() : date.getHours();
	},
	
	_getIso8601Year: function(self, date) {
		var result;
		
		if (self._getMonth(date) == 0 && self._getIso8601Week(date) > 50) {
			result = self._getFullYear(date) - 1;
		} else {
			result = self._getFullYear(date);
		}
		
		return result;
	},
	
	_getIso8601Week: function(self, date) {
		var day_of_year = parseInt(self._formatUnixDate(date, "%-j"));
		var first_day = self._getDayOfWeek(new Date(self._getFullYear(date), 0, 1, 0, 0, 0, 0));
		var last_day = self._getDayOfWeek(new Date(self._getFullYear(date), 11, 31, 0, 0, 0, 0));
		var year_length = self._isLeapYear(date) ? 366 : 365;
		var result;
		
		first_day = first_day > 4 ? first_day - 8 : first_day - 1;
		last_day = last_day < 4 ? last_day : 0;
		if (day_of_year <= -first_day) {
			result = self._getIso8601Week(new Date(self._getFullYear(date) - 1, 11, 31, 0, 0, 0, 0));
		} else if (day_of_year > year_length - last_day) {
			result = 1;
		} else {
			result = Math.ceil((day_of_year + first_day) / 7);
		}
		
		return result;
	},
	
	_getLastDayOfYear: function(self, date) {
		var last_day = new Date(self._getFullYear(date), 11, 31, 0, 0, 0, 0);
		
		return self._getDay(last_day);
	},
	
	_getLowerCaseMeridiem: function(self, date) {
		return self.texts.short_lower_meridiems[self._getHours(date) < 12 ? 0 : 1];
	},
	
	_getMinutes: function(self, date) {
		return self._is_utc_time_enabled ? date.getUTCMinutes() : date.getMinutes();
	},
	
	_getMondayWeek: function(self, date) {
		var day_of_year = self._getDayOfYear(date);
		var first_day = self._getFirstDayOfYear(date);
		var result;
		
		if (first_day == 0) {
			first_day = 7;
		}
		day_of_year = parseInt(self._formatUnixDate(date, "%-j"));
		if (first_day > 1) {
			day_of_year -= 8 - first_day;
		}
		if (day_of_year <= 0) {
			result = 0;
		} else {
			result = Math.ceil(day_of_year / 7);
		}
		
		return result;
	},
	
	_getMonth: function(self, date) {
		return self._is_utc_time_enabled ? date.getUTCMonth() : date.getMonth();
	},
	
	_getMonthName: function(self, date) {
		return self.texts.full_months[self._getMonth(date)];
	},
	
	_getNumberOfDaysInMonth: function(self, date) {
		var month = self._getMonth(date);
		var result;
		
		if (self.isInArray(month, [0, 2, 4, 6, 7, 9, 11])) {
			result = 31;
		} else if (self.isInArray(month, [3, 5, 8, 10])) {
			result = 30;
		} else if (self._isLeapYear(date)) {
			result = 29;
		} else {
			result = 28;
		}
		
		return result;
	},
	
	_getOrdinalSuffix: function(self, date) {
		return self.texts.ordinal_suffixes[self._getDate(date) - 1];
	},
	
	_getSeconds: function(self, date) {
		return self._is_utc_time_enabled ? date.getUTCSeconds() : date.getSeconds();
	},
	
	_getSundayWeek: function(self, date) {
		var day_of_year = self._getDayOfYear(date);
		var first_day = self._getFirstDayOfYear(date);
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
	},
	
	_getSwatchInternetTime: function(self, date) {
		var result = date.getUTCHours() + 1;
		
		if (result > 23) {
			result = 0;
		}
		result *= 3600;
		result += date.getUTCMinutes() * 60;
		result += date.getUTCSeconds();
		result /= 86.4;
		result = Math.floor(result);
		result = self._padStringLeft(result, "0", 3);
		
		return result;
	},
	
	_getTimestamp: function(self, date) {
		return Math.round(date.getTime() / 1000);
	},
	
	_getTwelveHourHours: function(self, date) {
		var result = self._getHours(date);
		
		if (result > 12) {
			result -= 12;
		}
		if (result == 0) {
			result = 12;
		}
		
		return result;
	},
	
	_getUpperCaseMeridiem: function(self, date) {
		return self.texts.short_upper_meridiems[self._getHours(date) < 12 ? 0 : 1];
	},
	
	_isLeapYear: function(self, date) {
		var year = self._getFullYear(date);
		
		return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
	},
	
	_padStringLeft: function(self, string, padding, expected_width) {
		var result = string.toString();
		
		if (padding.length > 0) {
			while (result.length < expected_width) {
				result = padding + result;
			}
		}
		
		return result;
	}
});
