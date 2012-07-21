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

/*
Class: BlazeGears.Formats

A singleton class that handles various string formatting tasks.

Superclasses:
	<BlazeGears.BaseClass>
*/
BlazeGears.Formats = BlazeGears.Singleton(BlazeGears.BaseClass, {
	/*
	Field: date_format
	
	The default date format dictionary used by <formatDate>.
	
	Keys:
		syntax - The syntax string to be used.
		parser - Decides which syntax the "syntax" key uses. It can be either "unix" for the <date at http://unixhelp.ed.ac.uk/CGI/man-cgi?date> command of the Unix-like systems, or "php" for the <date at http://php.net/manual/en/function.date.php> function of PHP.
	*/
	date_format: {
		parser: "unix",
		syntax: "%B %-d%o, %Y %-I:%M%P"
	},
	
	/*
	Field: number_format
	
	The default number format dictionary used by <formatNumber> and <formatFilesize>.
	
	Keys:
		decimal_delimiter - The string used to separate the integer part from the decimal part.
		decimal_length - The number of digits to be displayed after the decimal.
		force_decimals - If it's true, the digits after the decimal will be displayed all the time, even if the those digits are all zeros.
		group_delimiter - The string used to separate the digit groups.
		group_length - The maximum number of digits in a digit group.
		leading_zero - If it's true, the leading zero will be displayed for numbers that are less than 1 and greater than -1.
		negative_prefix - The prefix applied to numbers less than zero.
		negative_suffix - The suffix applied to numbers less than zero.
		negatives_first - If it's true, the negative affixes will be applied before the general affixes.
		prefix - The prefix applied to all numbers.
		suffix - The suffix applied to all numbers.
	*/
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
	
	/*
	Field: texts
	
	This dictionary contains the default text-packs used by <formatDate> and <formatFilesize>.
	
	Keys:
		filesizes - The names of the file size units used by <formatFilesize>.
		full_days - The full names of days used by <formatDate>.
		full_months - The full names of months used by <formatDate>.
		short_lower_meridiems - The abbreviated lower-case variants of ante meridiem and post meridiem used by <formatDate>.
		short_upper_meridiems - The abbreviated upper-case variants of ante meridiem and post meridiem used by <formatDate>.
		ordinal_suffixes - The ordinal suffixes for the days of the month used by <formatDate>.
		short_days - The abbreviated name of days used by <formatDate>.
		short_months - The abbreviated names of months used by <formatDate>.
	*/
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
	
	/*
	Function: formatDate
	
	Formats a date using either Unix or PHP syntax.
	
	Arguments:
		[date = new Date()] - The date to be formatted.
		[config = {}] - A dictionary that defines how the date should be formatted. The missing keys will be copied from <date_format>.
	
	Return Value:
		Returns the formatted date.
	
	Broken Unix Specifiers:
		E - Use the locale's alternate representation for date and time. Doesn't do anything.
		N - Nanoseconds. Always returns "000000000".
		O - Use the locale's alternate numeric symbols for numbers. Doesn't do anything.
		Z - Abbreviated time zone name. Always returns an empty string.
		z - Time zone offset. Always returns an empty string.
	
	Broken PHP Specifiers:
		I - Daylight saving time. Always returns 0.
		O - Timezone offset in hours and minutes. Always returns an empty string.
		P - Timezone offset in hours and minutes. Always returns an empty string.
		T - Abbreviated time zone name. Always returns an empty string.
		Z - Timezone offset in seconds. Always returns an empty string.
		e - Time zone name. Always returns an empty string.
		u - Microseconds. Always returns "000000".
	
	See Also:
		- <date_format>
		- <texts>
	*/
	formatDate: function(self, date, config) {
		if (!self.is(date)) date = new Date();
		if (!self.is(config)) config = {};
		
		var properties = ["syntax", "parser"];
		var result;
		
		// default the missing configuration keys
		for (var i in properties) {
			if (!self.is(config[properties[i]])) {
				config[properties[i]] = self.date_format[properties[i]];
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
		switch (config.parser) {
			case "php":
				result = self._formatPhpDate(date, config.syntax);
				break;
			
			case "unix":
				result = self._formatUnixDate(date, config.syntax);
				break;
			
			default:
				result = config.syntax;
		}
		
		return result;
	},
	
	/*
	Function: formatFilesize
	
	Formats a number into a file size by rounding down to the nearest significant value.
	
	Arguments:
		filesize - The file size to be formatted in bytes.
		[config = {}] - A dictionary that defines how the number should be formatted. The missing keys will be copied from <number_format>.
	
	Return Value:
		Returns the formatted filesize.
	
	See Also:
		- <formatNumber>
		- <number_format>
		- <texts>
	*/
	formatFilesize: function(self, filesize, config) {
		var unit = 0;
		
		// check the filesize
		filesize = parseInt(filesize);
		if (isNaN(filesize)) {
			filesize = 0;
		}
		
		// round down until it runs out
		while (filesize > 1023 && unit < self.texts.filesizes.length - 1) {
			filesize = Math.round(filesize / 1024);
			unit++;
		}
		filesize = self.formatNumber(filesize, config);
		
		return filesize + self.texts.filesizes[unit];
	},
	
	/*
	Function: formatNumber
	
	Formats a number.
	
	Arguments:
		number - The number to be formatted.
		[config = {}] - A dictionary that defines how the number should be formatted. The missing keys will be copied from <number_format>.
	
	Return Value:
		Returns the formatted number.
	
	See Also:
		<number_format>
	*/
	formatNumber: function(self, number, config) {
		if (!self.is(config)) config = {};
		
		var counter = 0;
		var decimal;
		var digits;
		var groups = [];
		var negative = false;
		var properties = ["decimal_delimiter", "decimal_length", "force_decimals", "group_delimiter", "group_length", "leading_zero", "negative_prefix", "negative_suffix", "negatives_first", "prefix", "suffix"];
		var result = number
		
		// default the missing configuration keys
		for (var i in properties) {
			if (!self.is(config[properties[i]])) {
				config[properties[i]] = self.number_format[properties[i]];
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
		digits = number.toString().length % config.group_length;
		
		// create the decimals
		if (config.decimal_length > 0) {
			// calculate the actual decimal part
			decimal = Math.round(decimal * Math.pow(10, config.decimal_length));
			decimal = decimal.toString();
			while (decimal.length < config.decimal_length) {
				decimal = "0" + decimal;
			}
			
			// remove the unnecessary zeroes
			if (!config.force_decimals) {
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
				decimal = config.decimal_delimiter + decimal;
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
		
		// assing the digits to their groups
		while (number.length > 0) {
			groups[counter] = number.substr(0, config.group_length);
			number = number.substr(config.group_length);
			counter++;
		}
		
		// remove the leading zero
		if (!config.leading_zero && groups.length == 1 && parseInt(groups[0]) == 0 && decimal.length > 0) {
			groups[0] = "";
		}
		
		// join the groups and the decimals
		number = groups.join(config.group_delimiter) + decimal;
		
		// apply the affixes
		if (config.negatives_first) {
			if (negative) {
				number = config.negative_prefix + number + config.negative_suffix;
			}
			number = config.prefix + number + config.suffix;
		} else {
			number = config.prefix + number + config.suffix;
			if (negative) {
				number = config.negative_prefix + number + config.negative_suffix;
			}
		}
		
		return number;
	},
	
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
					result += self._formatUnixDate(date, "%p");
					break;
				
				case "B": // swatch internet time (000 - 999)
					chunk = date.getUTCHours() + 1;
					if (chunk > 23) {
						chunk = 0;
					}
					chunk *= 3600;
					chunk += date.getUTCMinutes() * 60;
					chunk += date.getUTCSeconds();
					chunk /= 86.4;
					chunk = String(Math.floor(chunk));
					while (chunk.length < 3) {
						chunk = "0" + chunk;
					}
					result += chunk;
					break;
				
				case "D": // abbreviated weekday names (Sun - Sat)
					result += self._formatUnixDate(date, "%a");
					break;
				
				case "F": // month names (January - December)
					result += self._formatUnixDate(date, "%B");
					break;
				
				case "G": // international hours (0 - 23)
					result += self._formatUnixDate(date, "%-H");
					break;
				
				case "H": // international hours (00 - 23)
					result += self._formatUnixDate(date, "%H");
					break;
				
				case "I": // daylight saving time (0 - 1)
					result += 0;
					break;
				
				case "L": // leap years (0 - 1)
					result += self._formatUnixDate(date, "%L");
					break;
				
				case "M": // abbreviated month names (Jan - Dec)
					result += self._formatUnixDate(date, "%b");
					break;
				
				case "N": // weekdays, starting on monday (1 - 7)
					result += self._formatUnixDate(date, "%u");
					break;
				
				case "O": // time zone offset in hours and minutes (-1200 - +1300)
					result += self._formatUnixDate(date, "%z");
					break;
				
				case "P": // time zone offset in hours and minutes (-12:00 - +13:00)
					result += self._formatUnixDate(date, "%:z");
					break;
				
				case "S": // ordinals for the days of the month (st, nd, rd, or th)
					result += self._formatUnixDate(date, "%o");
					break;
				
				case "T": // abbreviated time zone names (e.g. UTC)
					result += "";
					break;
				
				case "U": // unix timestamp
					result += self._formatUnixDate(date, "%s");
					break;
				
				case "W": // iso-8601 weeks (01 - 53)
					result += self._formatUnixDate(date, "%V");
					break;
				
				case "Y": // years (1970 - 2038)
					result += self._formatUnixDate(date, "%Y");
					break;
				
				case "Z": // time zone offset in seconds (-43200 - 50400)
					result += "";
					break;
				
				case "a": // abbreviated lower-case meridiems (am - pm)
					result += self._formatUnixDate(date, "%P");
					break;
				
				case "c": // same as "Y-m-d\\TH:i:sP"
					result += self._formatPhpDate(date, "Y-m-d\\TH:i:sP");
					break;
				
				case "d": // days (01 - 31)
					result += self._formatUnixDate(date, "%d");
					break;
				
				case "e": // time zone names (e.g. Nuku'alofa)
					result += "";
					break;
				
				case "g": // hours (1 - 12)
					result += self._formatUnixDate(date, "%-I");
					break;
				
				case "h": // hours (01 - 12)
					result += self._formatUnixDate(date, "%I");
					break;
				
				case "i": // minutes (00 - 59)
					result += self._formatUnixDate(date, "%M");
					break;
				
				case "j": // days (1 - 31)
					result += self._formatUnixDate(date, "%-d");
					break;
				
				case "l": // weekday names (Sunday - Saturday)
					result += self._formatUnixDate(date, "%A");
					break;
				
				case "m": // months (01 - 12)
					result += self._formatUnixDate(date, "%m");
					break;
				
				case "n": // months (1 - 12)
					result += self._formatUnixDate(date, "%-m");
					break;
				
				case "o": // iso-8601 years (1970 - 2038)
					result += self._formatUnixDate(date, "%G");
					break;
				
				case "r": // same as "D, d M Y H:i:s O"
					result += self._formatPhpDate(date, "D, d M Y H:i:s O");
					break;
				
				case "s": // seconds (00 - 59)
					result += self._formatUnixDate(date, "%S");
					break;
				
				case "t": // number of days in the month (28 - 31)
					chunk = date.getMonth() + 1;
					if (chunk == 1 || chunk == 3 || chunk == 5 || chunk == 7 || chunk == 8 || chunk == 10 || chunk == 12) {
						result += 31;
					} else if (chunk == 4 || chunk == 6 || chunk == 9 || chunk == 11) {
						result += 30;
					} else if (self._formatPhpDate(date, "L") == "0") {
						result += 29;
					} else {
						result += 28;
					}
					break;
				
				case "u": // microseconds (000000 - 999999)
					result += "000000";
					break;
				
				case "w": // weekdays, starting on sunday (0 - 6)
					result += self._formatUnixDate(date, "%w");
					break;
				
				case "y": // abbreviated years (00 - 99)
					result += self._formatUnixDate(date, "%y");
					break;
				
				case "z": // days of the year (0 - 365)
					result += parseInt(self._formatUnixDate(date, "%-j")) - 1;
					break;
				
				default:
					result += character;
			}
		}
		
		return result;
	},
	
	_formatUnixDate: function(self, date, syntax) {
		var character;
		var chunk;
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
								padding = "";
								break;
							
							case "_": // pad with spaces
								padding = " ";
								break;
							
							case "0": // pad with zeros
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
						chunk = self.texts.full_days[date.getDay()];
						break;
					
					case "B": // month names (January - December)
						chunk = self.texts.full_months[date.getMonth()];
						break;
					
					case "C": // centuries (20 - 21)
						chunk = Math.ceil(date.getFullYear() / 100);
						break;
					
					case "D": // same as "%m/%d/%y"
						chunk = self._formatUnixDate(date, "%m/%d/%y");
						break;
					
					case "F": // same as "%Y-%m-%d"
						chunk = self._formatUnixDate(date, "%Y-%m-%d");
						break;
					
					case "G": // iso-8601 years (1970 - 2038)
						if (date.getMonth() == 0 && parseInt(self._formatUnixDate(date, "%-V")) > 50) {
							chunk = date.getFullYear() - 1;
						} else {
							chunk = date.getFullYear();
						}
						break;
					
					case "H": // international hours (00 - 23)
						chunk = date.getHours();
						if (padding.length > 0 && chunk < 10) {
							chunk = padding + chunk;
						}
						break;
					
					case "I": // hours (01 - 12)
						chunk = date.getHours();
						if (chunk > 12) {
							chunk -= 12;
						}
						if (chunk == 0) {
							chunk = 12;
						}
						if (chunk < 10) {
							chunk = padding + chunk;
						}
						break;
					
					case "L": // leap years (0 - 1)
						chunk = date.getFullYear();
						chunk = ((chunk % 4 == 0) && (chunk % 100 != 0)) || (chunk % 400 == 0) ? 1 : 0;
						break;
					
					case "M": // minutes (00 - 59)
						chunk = date.getMinutes();
						if (chunk < 10) {
							chunk = padding + chunk;
						}
						break;
					
					case "N": // nanoseconds (000000000 - 999999999)
						chunk = "000000000";
						break;
					
					case "P": // abbreviated lower-case meridiems (am - pm)
						chunk = self.texts.short_lower_meridiems[date.getHours() < 12 ? 0 : 1];
						break;
					
					case "R": // same as "%H:%M"
						chunk = self._formatUnixDate(date, "%H:%M");
						break;
					
					case "S": // seconds (00 - 59)
						chunk = date.getSeconds();
						if (chunk < 10) {
							chunk = padding + chunk;
						}
						break;
					
					case "T": // same as "%H:%M:%S".
					case "X":
						chunk = self._formatUnixDate(date, "%H:%M:%S");
						break;
					
					case "U": // weeks, staring on sunday (00 - 53)
						temporary = new Date(date.getFullYear(), 0, 1, 0, 0, 0, 0).getDay();
						temporary++;
						chunk = parseInt(self._formatUnixDate(date, "%-j"));
						if (temporary > 1) {
							chunk -= 8 - temporary;
						}
						if (chunk <= 0) {
							chunk = 0;
						} else {
							chunk = Math.ceil(chunk / 7);
						}
						if (chunk < 10) {
							chunk = padding + chunk;
						}
						break;
					
					case "V": // iso-8601 weeks (01 - 53)
						temporary = [
							new Date(date.getFullYear(), 0, 1, 0, 0, 0, 0).getDay(),
							new Date(date.getFullYear(), 11, 31, 0, 0, 0, 0).getDay(),
							self._formatUnixDate(date, "%L") == "1" ? 366 : 365
						];
						for (var i = 0; i < 2; i++) {
							if (temporary[i] == 0) {
								temporary[i] = 7;
							}
						}
						temporary[0] = temporary[0] > 4 ? -8 + temporary[0] : temporary[0] - 1;
						temporary[1] = temporary[1] < 4 ? temporary[1] : 0;
						chunk = parseInt(self._formatUnixDate(date, "%-j"));
						if (chunk <= -temporary[0]) {
							chunk = self._formatUnixDate(new Date(date.getFullYear() - 1, 11, 31, 0, 0, 0, 0), specifier);
						} else  if (chunk > temporary[2] - temporary[1]) {
							chunk = padding + 1;
						} else {
							chunk = Math.ceil((chunk + temporary[0]) / 7);
							if (chunk < 10) {
								chunk = padding + chunk;
							}
						}
						break;
					
					case "W": // weeks, staring on monday (00 - 53)
						temporary = new Date(date.getFullYear(), 0, 1, 0, 0, 0, 0).getDay();
						if (temporary == 0) {
							temporary = 7;
						}
						chunk = parseInt(self._formatUnixDate(date, "%-j"));
						if (temporary > 1) {
							chunk -= 8 - temporary;
						}
						if (chunk <= 0) {
							chunk = 0;
						} else {
							chunk = Math.ceil(chunk / 7);
						}
						if (chunk < 10) {
							chunk = padding + chunk;
						}
						break;
					
					case "Y": // years (1970 - 2038)
						chunk = date.getFullYear();
						break;
					
					case "Z": // abbreviated time zone names (e.g. UTC)
						chunk = "";
						break;
					
					case "a": // abbreviated weekday names (Sun - Sat)
						chunk = self.texts.short_days[date.getDay()];
						break;
					
					case "b": // abbreviated month names (Jan - Dec)
					case "h":
						chunk = self.texts.short_months[date.getMonth()];
						break;
					
					case "c": // same as "%a %b %d %H:%M:%S %Y"
						chunk = self._formatUnixDate(date, "%a %b %d %H:%M:%S %Y");
						break;
					
					case "d": // days (01 - 31)
						chunk = date.getDate();
						if (chunk < 10) {
							chunk = padding + chunk;
						}
						break;
					
					case "e": // same as "%_d"
						chunk = self._formatUnixDate(date, "%_d");
						break;
					
					case "g": // abbreviated iso-8601 years (00 - 99)
						chunk = self._formatUnixDate(date, "%G");
						chunk = chunk.substr(chunk.length - 2);
						break;
					
					case "j": // days of the year (001 - 366)
						chunk = date.getFullYear();
						temporary = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
						if (self._formatUnixDate(date, "%L") == "1") {
							temporary[1] = 29;
						}
						chunk = 0;
						for (var j = date.getMonth() - 1; j >= 0; j--) {
							chunk += temporary[j];
						}
						chunk += date.getDate();
						if (padding.length > 0) {
							while (chunk.length < 3) {
								chunk = padding + chunk;
							}
						}
						break;
					
					case "k": // same as "%_H"
						chunk = self._formatUnixDate(date, "%_H");
						break;
					
					case "l": // same as "%_I"
						chunk = self._formatUnixDate(date, "%_I");
						break;
					
					case "m": // months (01 - 12)
						chunk = date.getMonth() + 1;
						if (chunk < 10) {
							chunk = padding + chunk;
						}
						break;
					
					case "n": // newline
						chunk = "\n";
						break;
					
					case "o": // ordinals for the days of the month (st, nd, rd, or th)
						chunk = self.texts.ordinal_suffixes[date.getDate() - 1];
						break;
					
					case "p": // abbreviated upper-case meridiems (AM - PM)
						chunk = self.texts.short_upper_meridiems[date.getHours() < 12 ? 0 : 1];
						break;
					
					case "r": // same as "%I:%M:%S %p"
						chunk = self._formatUnixDate(date, "%I:%M:%S %p");
						break;
					
					case "s": // unix timestamp
						chunk = Math.round(date.getTime() / 1000);
						break;
					
					case "t": // tab
						chunk = "\t";
						break;
					
					case "u": // weekdays, starting on monday (1 - 7)
						chunk = date.getDay();
						if (chunk == 0) {
							chunk = 7;
						}
						break;
					
					case "w": // weekdays, starting on sunday (0 - 6)
						chunk = date.getDay();
						break;
					
					case "x": // same as "%m/%d/%y"
						chunk = self._formatUnixDate(date, "%m/%d/%y");
						break;
					
					case "y": // abbreviated years (00 - 99)
						chunk = String(date.getFullYear());
						chunk = chunk.substr(chunk.length - 2);
						break;
					
					case "z": // time zone offset (-1200 - +1300)
						switch (precision) {
							case 0: break; // (-1200 - +1300)
							case 1: break; // (-12:00 - +13:00)
							case 2: break; // (-12:00:00 - +13:00:00)
							case 3: break; // minimal required precision
						}
						chunk = "";
						break;
					
					default:
						continue;
				}
				
				if (local_date) {}
				if (local_numbers) {}
				if (upper) {
					chunk = String(chunk);
					chunk = chunk.toUpperCase();
				}
				if (opposite) {} // debug
				
				result += chunk;
			} else {
				result += character;
			}
		}
		
		return result;
	}
});
