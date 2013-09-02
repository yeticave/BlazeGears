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
// Deals with formatting dates and numbers.
var blazegears = blazegears || {};
blazegears.formatting = blazegears.formatting || {};

/*
Enum: blazegears.formatting.DecimalVisibility
	Specifies the possible display modes of a *Number*'s decimal part.

Values:
	FIXED - The number of decimal digits will match the specified precision. In case there are less decimal digits than required, the decimal part will be zero-padded on the right.
	MINIMAL - The decimal part's zero-padding on the right will be removed, but at least a single digit is kept at all times.
	TRUNCATED - The decimal part's zero-padding on the right will be removed.
*/
blazegears.formatting.DecimalVisibility = {
	FIXED: 1,
	MINIMAL: 2,
	TRUNCATED: 3
};

/*
Enum: blazegears.formatting.TimeZone
	Specifies the usable time zones for date and time formatting.

Values:
	AUTOMATIC - The local time will be used for formatting.
	UTC - UTC time will be used for formatting.
*/
blazegears.formatting.TimeZone = {
	AUTOMATIC: null,
	UTC: 0
};

// Class: blazegears.formatting.DateFormatTemplate
// A collection of callbacks and literals for formatting date.
blazegears.formatting.DateFormatTemplate = function() {
	this._tokens = [];
}

/*
Method: addCallback
	Add a new date formatting callback to the collection.

Arguments:
	callback - (*Function*) The callback to add to the collection. The callback will be passed a single *Date* argument and must return a *String*, which will be added to the rendered output.

Exceptions:
	blazegears.ArgumentError - *callback* ins't an instance of *Function*.
*/
blazegears.formatting.DateFormatTemplate.prototype.addCallback = function(callback) {
	if (!BlazeGears.isFunction(callback)) {
		throw blazegears.ArgumentError._invalidArgumentType("callback", "Function");
	}
	this._tokens.push(callback);
}

/*
Method: addLiteral
	Adds a literal to the collection that will be added to the rendered output.

Arguments:
	[literal = ""] - (*String*) The literal to add to the collection.
*/
blazegears.formatting.DateFormatTemplate.prototype.addLiteral = function(literal) {
	if (this._tokens.length === 0 || BlazeGears.isFunction(this._tokens[this._tokens.length - 1])) {
		this._tokens.push(blazegears._forceParseString(literal));
	} else {
		this._tokens[this._tokens.length - 1] += blazegears._forceParseString(literal);
	}
}

/*
Method: merge
	Merges the callbacks and literals of another <DateFormatTemplate> into the current one.

Arguments:
	date_format_template - (<DateFormatTemplate>) The collection to merge in.

Exceptions:
	blazegears.ArgumentError - *date_format_template* is not an instance of <DateFormatTemplate>.
*/
blazegears.formatting.DateFormatTemplate.prototype.merge = function(date_format_template) {
	var i;
	var token_count;
	var tokens;
	
	if (!(date_format_template instanceof blazegears.formatting.DateFormatTemplate)) {
		throw blazegears.ArgumentError._invalidArgumentType("date_format_template", "blazegears.formatting.DateFormatTemplate");
	}
	token_count = date_format_template._tokens.length;
	tokens = date_format_template._tokens;
	for (i = 0; i < token_count; ++i) {
		this._tokens.push(tokens[i]);
	}
}

/*
Method: render
	Renders the template for a date.

Arguments:
	context - (*Object*) The object that will be assigned to *this* when calling the callbacks. Primitive objects will be boxed.
	[date = new Date()] - (*Date* / *Number*) The date that will be passed to the callback as their first argument. In case it's a *Number*, it will be treated as a timestamp and converted to a *Date*.

Return Value:
	(*String*) Concatenates the return values of the callbacks and the literals in the order which they were added to the collection.
*/
blazegears.formatting.DateFormatTemplate.prototype.render = function(context, date) {
	var i;
	var prepared_date = this._prepareDate(date);
	var result = "";
	var token;
	var tokens = this._tokens;
	var token_count = tokens.length;
	
	for (i = 0; i < token_count; ++i) {
		token = tokens[i];
		if (BlazeGears.isFunction(token)) {
			result += token.call(context, prepared_date).toString();
		} else {
			result += token.toString();
		}
	}
	
	return result;
}

// creates a date object from the provided value
blazegears.formatting.DateFormatTemplate.prototype._prepareDate = function(date) {
	var result = null;
	
	if (BlazeGears.isDate(date)) {
		result = date;
	} else if (BlazeGears.isNumber(date)) {
		result = new Date(date);
	} else {
		result = new Date();
	}
	
	return result;
}

// Class: blazegears.formatting.DateFormatter
// The base class for date formatters.
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
// Gets the date format as a *String*. Defaults to the format that's the closest to ISO 8601 that the implementation can produce.
blazegears.formatting.DateFormatter.prototype.getDateFormat = function() {
	return this._format;
}

/*
Method: setDateFormat
	Setter for <getDateFormat>.

Arguments:
	[value = ""] - (*String*) The new value that will be lazily parsed into a <DateFormatTemplate>.
*/
blazegears.formatting.DateFormatter.prototype.setDateFormat = function(value) {
	if (value !== this._format) {
		this._format = blazegears._forceParseString(value);
		this._template = null;
	}
}

// Method: getFullDayNames
// Gets a clone of the full names of days, from Sunday to Saturday, as an *Array* of 7 *Strings*.
blazegears.formatting.DateFormatter.prototype.getFullDayNames = function() {
	return this._full_day_names.slice();
}

/*
Method: setFullDayNames
	Setter for <getFullDayNames>.

Arguments:
	value - (*Array*) The value to clone.

Exceptions:
	blazegears.ArgumentError - *value* isn't an instance of *Array* or doesn't have a *length* of 7.
*/
blazegears.formatting.DateFormatter.prototype.setFullDayNames = function(value) {
	this._full_day_names = [];
	if (!BlazeGears.isArray(value)) {
		throw blazegears.ArgumentError._invalidArgumentType("value", "Array");
	}
	if (value.length !== 7) {
		throw blazegears.ArgumentError._invalidArrayLength("value", 7);
	}
	for (var i = 0; i < 7; ++i) {
		this._full_day_names.push(value[i].toString());
	}
}

// Method: getFullMonthNames
// Gets a clone of the full names of months, from January to December, as an *Array* of 12 *Strings*.
blazegears.formatting.DateFormatter.prototype.getFullMonthNames = function() {
	return this._full_month_names.slice();
}

/*
Method: setFullMonthNames
	Setter for <getFullMonthNames>.

Arguments:
	value - (*Array*) The value to clone.

Exceptions:
	blazegears.ArgumentError - *value* isn't an instance of *Array* or doesn't have a *length* of 12.
*/
blazegears.formatting.DateFormatter.prototype.setFullMonthNames = function(value) {
	this._full_month_names = [];
	if (!BlazeGears.isArray(value)) {
		throw blazegears.ArgumentError._invalidArgumentType("value", "Array");
	}
	if (value.length !== 12) {
		throw blazegears.ArgumentError._invalidArrayLength("value", 12);
	}
	for (var i = 0; i < 12; ++i) {
		this._full_month_names.push(value[i].toString());
	}
}

// Method: getOrdinalSuffixes
// Returns a clone of the ordinal suffixes as an *Array* of 31 *Strings*.
blazegears.formatting.DateFormatter.prototype.getOrdinalSuffixes = function() {
	return this._ordinal_suffixes.slice();
}

/*
Method: setOrdinalSuffixes
	Setter for <getOrdinalSuffixes>.

Arguments:
	value - (*Array*) The value to clone.

Exceptions:
	blazegears.ArgumentError - *value* isn't an instance of *Array* or doesn't have a *length* of 31.
*/
blazegears.formatting.DateFormatter.prototype.setOrdinalSuffixes = function(value) {
	this._ordinal_suffixes = [];
	if (!BlazeGears.isArray(value)) {
		throw blazegears.ArgumentError._invalidArgumentType("value", "Array");
	}
	if (value.length !== 31) {
		throw blazegears.ArgumentError._invalidArrayLength("value", 31);
	}
	for (var i = 0; i < 31; ++i) {
		this._ordinal_suffixes.push(value[i].toString());
	}
}

// Method: getShortDayNames
// Gets a clone of the short names of days, from Sun to Sat, as an *Array* of 7 *Strings*.
blazegears.formatting.DateFormatter.prototype.getShortDayNames = function() {
	return this._short_day_names.slice();
}

/*
Method: setShortDayNames
	Setter for <getShortDayNames>.

Arguments:
	value - (*Array*) The value to clone.

Exceptions:
	blazegears.ArgumentError - *value* isn't an instance of *Array* or doesn't have a *length* of 7.
*/
blazegears.formatting.DateFormatter.prototype.setShortDayNames = function(value) {
	this._short_day_names = [];
	if (!BlazeGears.isArray(value)) {
		throw blazegears.ArgumentError._invalidArgumentType("value", "Array");
	}
	if (value.length !== 7) {
		throw blazegears.ArgumentError._invalidArrayLength("value", 7);
	}
	for (var i = 0; i < 7; ++i) {
		this._short_day_names.push(value[i].toString());
	}
}

// Method: getShortLowerMeridiemNames
// Gets a clone of the short names of lowercase meridiems, from am to pm, as an *Array* of 2 *Strings*.
blazegears.formatting.DateFormatter.prototype.getShortLowerMeridiemNames = function() {
	return [this._short_meridiems[2], this._short_meridiems[3]];
}

/*
Method: setShortLowerMeridiemNames
	Setter for <getShortLowerMeridiemNames>.

Arguments:
	value - (*Array*) The value to clone.

Exceptions:
	blazegears.ArgumentError - *value* isn't an instance of *Array* or doesn't have a *length* of 2.
*/
blazegears.formatting.DateFormatter.prototype.setShortLowerMeridiemNames = function(value) {
	if (!BlazeGears.isArray(value)) {
		throw blazegears.ArgumentError._invalidArgumentType("value", "Array");
	}
	if (value.length !== 2) {
		throw blazegears.ArgumentError._invalidArrayLength("value", 2);
	}
	this._short_meridiems[2] = value[0].toString();
	this._short_meridiems[3] = value[1].toString();
}

// Method: getShortUpperMeridiemNames
// Gets a clone of the short names of upper case meridiems, from AM to PM, as an *Array* of 2 *Strings*.
blazegears.formatting.DateFormatter.prototype.getShortUpperMeridiemNames = function() {
	return [this._short_meridiems[0], this._short_meridiems[1]];
}

/*
Method: setShortUpperMeridiemNames
	Setter for <getShortUpperMeridiemNames>.

Arguments:
	value - (*Array*) The value to clone.

Exceptions:
	blazegears.ArgumentError - *value* isn't an instance of *Array* or doesn't have a *length* of 2.
*/
blazegears.formatting.DateFormatter.prototype.setShortUpperMeridiemNames = function(value) {
	if (!BlazeGears.isArray(value)) {
		throw blazegears.ArgumentError._invalidArgumentType("value", "Array");
	}
	if (value.length !== 2) {
		throw blazegears.ArgumentError._invalidArrayLength("value", 2);
	}
	this._short_meridiems[0] = value[0].toString();
	this._short_meridiems[1] = value[1].toString();
}

// Method: getShortMonthNames
// Gets a clone of the short names of months, from Jan to Dec, as an *Array* of 12 *Strings*.
blazegears.formatting.DateFormatter.prototype.getShortMonthNames = function() {
	return this._short_month_names.slice();
}

/*
Method: setShortMonthNames
	Setter for <getShortMonthNames>.

Arguments:
	value - (*Array*) The value to clone.

Exceptions:
	blazegears.ArgumentError - *value* isn't an instance of *Array* or doesn't have a *length* of 12.
*/
blazegears.formatting.DateFormatter.prototype.setShortMonthNames = function(value) {
	this._short_month_names = [];
	if (!BlazeGears.isArray(value)) {
		throw blazegears.ArgumentError._invalidArgumentType("value", "Array");
	}
	if (value.length !== 12) {
		throw blazegears.ArgumentError._invalidArrayLength("value", 12);
	}
	for (var i = 0; i < 12; ++i) {
		this._short_month_names.push(value[i].toString());
	}
}

// Method: getTimeZone
// Gets the timezone used for date and time formatting as a <blazegears.formatting.TimeZone>. Defaults to <blazegears.formatting.TimeZone>.AUTOMATIC.
blazegears.formatting.DateFormatter.prototype.getTimeZone = function() {
	var result = null;
	
	if (this._is_utc_time_enabled) {
		result = blazegears.formatting.TimeZone.UTC;
	}
	
	return result;
}

/*
Method: setTimeZone
	Setter for <getTimeZone>.

Arguments:
	value - (<blazegears.formatting.TimeZone>) The new value.

Exceptions:
	blazegears.ArgumentError - *value* isn't an acceptable value for <blazegears.formatting.TimeZone>.
*/
blazegears.formatting.DateFormatter.prototype.setTimeZone = function(value) {
	var TimeZone = blazegears.formatting.TimeZone;
	
	if (value === TimeZone.AUTOMATIC) {
		this._is_utc_time_enabled = false;
	} else if (value === TimeZone.UTC) {
		this._is_utc_time_enabled = true;
	} else {
		throw blazegears.ArgumentError._invalidEnumValue("value", "blazegears.formatting.TimeZone");
	}
}

/*
Method: formatDate
	Formats a date as a *String*.

Arguments:
	[date = new Date()] - (*Date* / *Number*) The date to format. In case it's a *Number*, it will be treated as a timestamp and converted to a *Date*.

Remarks:
	It the time of calling this method <getDateFormat> will be parsed into a <DateFormatTemplate> using <parseDateFormat>, if it wasn't before. The formatter itself will be passed as the *context* to the <DateFormatTemplate> for rendering.
*/
blazegears.formatting.DateFormatter.prototype.formatDate = function(date) {
	var result = "";
	
	if (this._template === null) {
		this._template = this.parseDateFormat(this._format);
	}
	result = this._template.render(this, date);
	
	return result;
}

/*
Method: parseDateFormat
	Parses a date format into a <DateFormatTemplate>.

Arguments:
	[date_format = ""] - (*String*) The date format to parse.

Exceptions:
	blazegears.NotOverriddenError - This method is abstract and will always throw this exception.
*/
blazegears.formatting.DateFormatter.prototype.parseDateFormat = function(date_format) {
	throw new blazegears.NotOverriddenError();
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

// short upper case meridiems (am - pm)
blazegears.formatting.DateFormatter.prototype._getUpperCaseMeridiem = function(date) {
	return this._short_meridiems[this._getHours(date) < 12 ? 0 : 1];
}

// leap years (0 - 1)
blazegears.formatting.DateFormatter.prototype._isLeapYear = function(date) {
	var year = this._getFullYear(date);
	
	return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}

// Class: blazegears.formatting.NumberFormatter
// Formats numbers.
blazegears.formatting.NumberFormatter = function() {
	this._decimal_delimiter = ".";
	this._decimal_precision = 0;
	this._decimal_visibility = blazegears.formatting.DecimalVisibility.FIXED;
	this._group_delimiter = ",";
	this._group_size = 3;
	this._is_leading_zero_enabled = true;
	this._negative_prefix = "-";
	this._negative_suffix = "";
	this._positive_prefix = "";
	this._positive_suffix = "";
	this._rounding_callback = Math.round;
}

/*
Method: isLeadingZeroEnabled
	Determines if the leading zero should be displayed for numbers with an absolute value less than one but greated than zero. Defaults to *true*.
*/
blazegears.formatting.NumberFormatter.prototype.isLeadingZeroEnabled = function() {
	return this._is_leading_zero_enabled;
}

/*
Method: enableLeadingZero
	Setter for <isLeadingZeroEnabled>.

Arguments:
	enable - (*Boolean*) The new value.
*/
blazegears.formatting.NumberFormatter.prototype.enableLeadingZero = function(enable) {
	this._is_leading_zero_enabled = Boolean(enable);
}

// Method: getDecimalDelimiter
// Gets the delimiter that will be used to separate the integer part of a number from its decimal part as a *String*. Defaults to a dot.
blazegears.formatting.NumberFormatter.prototype.getDecimalDelimiter = function() {
	return this._decimal_delimiter;
}

/*
Method: setDecimalDelimiter
	Setter for <getDecimalDelimiter>.

Arguments:
	value - (*String*) The new value.
*/
blazegears.formatting.NumberFormatter.prototype.setDecimalDelimiter = function(value) {
	this._decimal_delimiter = blazegears._forceParseString(value);
}

// Method: getDecimalPrecision
// Gets the maximum number of decimal digits to display as a *Number*. Defaults to zero.
blazegears.formatting.NumberFormatter.prototype.getDecimalPrecision = function() {
	return this._decimal_precision;
}

/*
Method: setDecimalPrecision
	Setter for <getDecimalPrecision>.

Arguments:
	value - (*Number*) The new value.
*/
blazegears.formatting.NumberFormatter.prototype.setDecimalPrecision = function(value) {
	this._decimal_precision = blazegears._forceParseInt(value);
}

// Method: getDecimalVisibility
// Gets the mode of diplaying the decimal part of numbers as a <blazegears.formatting.DecimalVisibility>. Defaults to <blazegears.formatting.DecimalVisibility>.FIXED.
blazegears.formatting.NumberFormatter.prototype.getDecimalVisibility = function() {
	return this._decimal_visibility;
}

/*
Method: setDecimalVisibility
	Setter for <getDecimalVisibility>.

Arguments:
	value - (<blazegears.formatting.DecimalVisibility>) The new value.

Exceptions:
	blazegears.ArgumentError - *value* isn't an acceptable value for <blazegears.formatting.DecimalVisibility>.
*/
blazegears.formatting.NumberFormatter.prototype.setDecimalVisibility = function(value) {
	if (BlazeGears.isNumber(value) && value > 0 && value < 4) {
		this._decimal_visibility = value;
	} else {
		throw blazegears.ArgumentError._invalidEnumValue("value", "blazegears.formatting.DecimalVisibility");
	}
}

// Method: getGroupDelimiter
// Gets the delimiter that will be used to separate the number groups in the integer parts of a number as a *String*. Defaults to a comma.
blazegears.formatting.NumberFormatter.prototype.getGroupDelimiter = function() {
	return this._group_delimiter;
}

/*
Method: setGroupDelimiter
	Setter for <getGroupDelimiter>.

Arguments:
	value - (*String*) The new value.
*/
blazegears.formatting.NumberFormatter.prototype.setGroupDelimiter = function(value) {
	this._group_delimiter = blazegears._forceParseString(value);
}

// Method: getGroupSize
// Gets the maximum number of digits in a group in the integer part of a number. Defaults to 3.
blazegears.formatting.NumberFormatter.prototype.getGroupSize = function() {
	return this._group_size;
}

/*
Method: setGroupSize
	Setter for <getGroupSize>.

Arguments:
	value - (*Number*) The new value.
*/
blazegears.formatting.NumberFormatter.prototype.setGroupSize = function(value) {
	this._group_size = blazegears._forceParseInt(value);
}

// Method: getNegativePrefix
// Gets the prefix used for negative numbers as a *String*. Defaults to a minus sign.
blazegears.formatting.NumberFormatter.prototype.getNegativePrefix = function() {
	return this._negative_prefix;
}

/*
Method: setNegativePrefix
	Setter for <getNegativePrefix>.

Arguments:
	value - (*String*) The new value.
*/
blazegears.formatting.NumberFormatter.prototype.setNegativePrefix = function(value) {
	this._negative_prefix = blazegears._forceParseString(value);
}

// Method: getNegativeSuffix
// Gets the suffix used for negative numbers as a *String*. Defaults to an empty string.
blazegears.formatting.NumberFormatter.prototype.getNegativeSuffix = function() {
	return this._negative_suffix;
}

/*
Method: setNegativeSuffix
	Setter for <getNegativeSuffix>.

Arguments:
	value - (*String*) The new value.
*/
blazegears.formatting.NumberFormatter.prototype.setNegativeSuffix = function(value) {
	this._negative_suffix = blazegears._forceParseString(value);
}

// Method: getPositivePrefix
// Gets the prefix used for positive numbers as a *String*. Defaults to an empty string.
blazegears.formatting.NumberFormatter.prototype.getPositivePrefix = function() {
	return this._positive_prefix;
}

/*
Method: setPositivePrefix
	Setter for <getPositivePrefix>.

Arguments:
	value - (*String*) The new value.
*/
blazegears.formatting.NumberFormatter.prototype.setPositivePrefix = function(value) {
	this._positive_prefix = blazegears._forceParseString(value);
}

// Method: getPositiveSuffix
// Gets the suffix used for positive numbers as a *String*. Defaults to an empty string.
blazegears.formatting.NumberFormatter.prototype.getPositiveSuffix = function() {
	return this._positive_suffix;
}

/*
Method: setPositiveSuffix
	Setter for <getPositiveSuffix>.

Arguments:
	value - (*String*) The new value.
*/
blazegears.formatting.NumberFormatter.prototype.setPositiveSuffix = function(value) {
	this._positive_suffix = blazegears._forceParseString(value);
}

// Method: getRoundingCallback
// Gets the callback used for rounding numbers as a *Function*.
blazegears.formatting.NumberFormatter.prototype.getRoundingCallback = function() {
	return this._rounding_callback;
}

/*
Method: setRoundingCallback
	Setter for <getRoundingCallback>.

Arguments:
	value - (*Function*) The new value.

Exceptions:
	blazegears.ArgumentError - *value* isn't an instance of *Function*.
*/
blazegears.formatting.NumberFormatter.prototype.setRoundingCallback = function(value) {
	if (!BlazeGears.isFunction(value)) {
		throw blazgears.ArgumentError._invalidArgumentType("value", "Function");
	}
	this._rounding_callback = value;
}

/*
Method: formatNumber
	Formats a number as a *String*.

Arguments:
	number - (*Number*) The number to format.
*/
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
	} else {
		result = this._positive_prefix + result + this._positive_suffix;
	}
	if (result.length === 0) {
		result = "0";
	}
	
	return result;
}

/*
Class: blazegears.formatting.PHPDateFormatter
	The implementation of <DateFormatter> that's using the date format syntax of <PHP's date function at http://php.net/manual/en/function.date.php>.

Parent Class:
	<DateFormatter>
*/
blazegears.formatting.PHPDateFormatter = function() {
	blazegears.formatting.DateFormatter.call(this);
	this._format = "c";
}
blazegears.formatting.PHPDateFormatter.prototype = new blazegears.formatting.DateFormatter();
blazegears.formatting.PHPDateFormatter.prototype.constructor = blazegears.formatting.PHPDateFormatter;

/*
Method: parseDateFormat
	Parses a date format into a <DateFormatTemplate> using the date format syntax of <PHP's date function at http://php.net/manual/en/function.date.php>.

Arguments:
	[date_format = ""] - (*String*) The date format to parse.

Supported Specifiers:
	A - Abbreviated upper case meridiem: *AM* or *PM*
	B - Swatch internet time: *000* to *999*
	D - Abbreviated weekday name: *Sun* to *Sat*
	F - Full month name: January to December
	G - 24-hour format hour: *0* to *23*
	H - Zero padded 24-hour format hour: *00* to *23*
	L - Is it a leap year: *1* for leap years, *0* otherwise
	M - Abbreviated month name: *Jan* to *Dec*
	N - Numeric weekday, starting on Monday: *1* to *7*
	S - Ordinal suffix for the day of the month: *st*, *nd*, *rd*, or *th*
	U - Unix timestamp: *0* to *2147483647*
	W - ISO 8601 week of the year: *01* to *53*
	Y - Full year: *1970* to *2038*
	a - Abbreviated lower case meridiems: *am* or *pm*
	c - ISO 8601 date: Same as *Y-m-d\\TH:i:sP*
	d - Zero padded day of the month: *01* to *31*
	g - 12-hour format hour: *1* to *12*
	h - Zero padded 12-hour format hour: *01* to *12*
	i - Zero padded minute: *00* to *59*
	j - Day of the month: *1* to *31*
	l - Full weekday name: *Sunday* to *Saturday*
	m - Zero padded numeric month: *01* to *12*
	n - Numeric month: *1* to *12*
	o - ISO 8601 full year: *1970* to *2038*
	r - RFC 2822 date: Same as *D, d M Y H:i:s O*
	s - Zero padded second: *00* to *59*
	t - Number of days in the month: *28* to *31*
	w - Numeric weekday, starting on Sunday: *0* to *6*
	y - Short year: *00* to *99*
	z - Day of the year: *0* to *365*

Unsupported Specifiers:
	I - Is it daylight saving time: *1* for daylight saving time, *0* for standard time, always returns *0*
	O - Time zone offset in hours and minutes: *-1200* to *+1400*, always returns an empty string
	P - Time zone offset in hours and minutes with a colon delimiter: *-12:00* to *+14:00*, always returns an empty string
	T - Abbreviated time zone name: e.g., *UTC*, always returns an empty string
	Z - Time zone offset in seconds: *-43200* to *50400*, always returns an empty string
	e - Full time zone name: e.g., *Coordinated Universal Time*, always returns an empty string
	u - Microseconds: *000000* to *999999*, always returns *000000*
*/
blazegears.formatting.PHPDateFormatter.prototype.parseDateFormat = function(format) {
	var character;
	var result = new blazegears.formatting.DateFormatTemplate();
	
	format = blazegears._forceParseString(format);
	for (var i = 0; i < format.length; i++) {
		character = format.charAt(i);
		switch(character) {
			case "\\":
				i++;
				character = format.charAt(i);
				result.addLiteral(character);
				break;
			
			case "A": // abbreviated upper case meridiem
				result.addCallback(this._getUpperCaseMeridiem);
				break;
			
			case "B": // swatch internet time
				result.addCallback(this._getSwatchInternetTime);
				break;
			
			case "D": // abbreviated weekday name
				result.addCallback(this._getAbbreviatedDayName);
				break;
			
			case "F": // full month name
				result.addCallback(this._getMonthName);
				break;
			
			case "G": // 24-hour format hour
				result.addCallback(this._getHours);
				break;
			
			case "H": // zero padded 24-hour format hour
				result.addCallback(this._getInternationalHours);
				break;
			
			case "I": // is it daylight saving time
				result.addLiteral("0");
				break;
			
			case "L": // is it a leap year
				result.addCallback(this._getLeapYear);
				break;
			
			case "M": // abbreviated month name
				result.addCallback(this._getAbbreviatedMonthName);
				break;
			
			case "N": // numeric weekday, starting on monday
				result.addCallback(this._getDayOfWeek);
				break;
			
			case "O": // time zone offset in hours and minutes
				break;
			
			case "P": // time zone offset in hours and minutes with a colon delimiter
				break;
			
			case "S": // ordinal suffix for the day of the month
				result.addCallback(this._getOrdinalSuffix);
				break;
			
			case "T": // abbreviated time zone name
				break;
			
			case "U": // unix timestamp
				result.addCallback(this._getTimestamp);
				break;
			
			case "W": // iso 8601 week number
				result.addCallback(this._getPaddedIso8601Week);
				break;
			
			case "Y": // full year
				result.addCallback(this._getFullYear);
				break;
			
			case "Z": // time zone offset in seconds
				break;
			
			case "a": // abbreviated lower case meridiems
				result.addCallback(this._getLowerCaseMeridiem);
				break;
			
			case "c": // iso 8601 date, same as Y-m-d\\TH:i:sP
				result.merge(this.parseDateFormat("Y-m-d\\TH:i:sP"));
				break;
			
			case "d": // zero padded day of month
				result.addCallback(this._getPaddedDays);
				break;
			
			case "e": // full time zone name
				break;
			
			case "g": // 12-hour format hour
				result.addCallback(this._getTwelveHourHours);
				break;
			
			case "h": // zero padded 12-hour format hour
				result.addCallback(this._getPaddedShortHours);
				break;
			
			case "i": // zero padded minute
				result.addCallback(this._getPaddedMinutes);
				break;
			
			case "j": // day of month
				result.addCallback(this._getDate);
				break;
			
			case "l": // full weekday name
				result.addCallback(this._getDayName);
				break;
			
			case "m": // zero padded numeric month
				result.addCallback(this._getPaddedMonth);
				break;
			
			case "n": // numeric month
				result.addCallback(this._getIncrementedMonth);
				break;
			
			case "o": // iso 8601 year
				result.addCallback(this._getIso8601Year);
				break;
			
			case "r": // rfc 2822 date, same as D, d M Y H:i:s O
				result.merge(this.parseDateFormat("D, d M Y H:i:s O"));
				break;
			
			case "s": // zero padded second
				result.addCallback(this._getPaddedSeconds);
				break;
			
			case "t": // number of days in the month
				result.addCallback(this._getNumberOfDaysInMonth);
				break;
			
			case "u": // microseconds
				result.addLiteral("000000");
				break;
			
			case "w": // numeric weekday, starting on Sunday
				result.addCallback(this._getDay);
				break;
			
			case "y": // short year
				result.addCallback(this._getAbbreviatedYear);
				break;
			
			case "z": // day of year
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

/*
Class: blazegears.formatting.UnixDateFormatter
	The implementation of <DateFormatter> that's using the date format syntax of the <date command of Unix-like systems at http://linux.die.net/man/1/date>.

Parent Class:
	<DateFormatter>
*/
blazegears.formatting.UnixDateFormatter = function() {
	blazegears.formatting.DateFormatter.call(this);
	this._format = "%Y-%m-%dT%H:%M:%S%z";
	this._use_deprecated = false;
}
blazegears.formatting.UnixDateFormatter.prototype = new blazegears.formatting.DateFormatter();
blazegears.formatting.UnixDateFormatter.prototype.constructor = blazegears.formatting.UnixDateFormatter;

/*
Method: parseDateFormat
	Parses a date format into a <DateFormatTemplate> using the date format syntax of the <date command of Unix-like systems at http://linux.die.net/man/1/date>.

Arguments:
	[date_format = ""] - (*String*) The date format to parse.

Supported Specifiers:
	%A - Full weekday name: *Sunday* to *Saturday*
	%B - Full weekday name: *Sunday* to *Saturday*
	%C - Century: *20* - *21*
	%D - Same as *%m/%d/%y*
	%F - Same as *%Y-%m-%d*
	%G - ISO 8601 full year: *1970* to *2038*
	%H - Zero padded 24-hour format hour: *00* to *23*
	%I - Zero padded 12-hour format hour: *01* to *12*
	%M - Zero padded minute: *00* to *59*
	%P - Abbreviated lower case meridiems: *am* or *pm*
	%R - Same as *%H:%M*
	%S - Zero padded second: *00* to *59*
	%T - Same as *%H:%M:%S* and *%X*
	%U - Week of the year, starting on Sunday: *01* to *53*
	%V - ISO 8601 week of the year: *01* to *53*
	%W - Week of the year, starting on Monday: *01* to *53*
	%Y - Full year: *1970* to *2038*
	%a - Abbreviated weekday name: *Sun* to *Sat*
	%b - Abbreviated month name: *Jan* to *Dec*, same as *%h*
	%c - Same as *%a %b %_d %H:%M:%S %Y*
	%d - Zero padded day of the month: *01* to *31*
	%e - Space padded day of the month: *1* to *31*
	%g - ISO 8601 short year: *00* to *99*
	%j - Zero padded day of the year: *001* to *366*
	%k - Space padded 24-hour format hour: *00* to *23*
	%l - Space padded 12-hour format hour: *01* to *12*
	%m - Zero padded numeric month: *01* to *12*
	%n - Newline character
	%p - Abbreviated upper case meridiem: *AM* or *PM*
	%r - Same as *%I:%M:%S %p*
	%s - Unix timestamp: *0* to *2147483647*
	%t - Tab character
	%u - Numeric weekday, starting on Monday: *1* to *7*
	%w - Numeric weekday, starting on Sunday: *0* to *6*
	%x - Same as *%m/%d/%y*
	%y - Short year: *00* to *99*

Supported Modifiers:
	%- - Disable padding.
	%_ - Use space padding.
	%0 - Use zero padding.
	%^ - Convert to upper case.
	%# - Convert to opposite case.

Unsupported Specifiers:
	%N - Nanoseconds: *000000000* to *999999999*, always returns *000000000*
	%Z - Abbreviated time zone name: e.g., *UTC*, always returns an empty string
	%z - Time zone offset in hours and minutes: *-1200* to *+1400*, always returns an empty string

Unsupported Modifiers:
	%: - Increase the precision of the time zone offset representation, can be stacked up to three instances. Doesn't do anything.
*/
blazegears.formatting.UnixDateFormatter.prototype.parseDateFormat = function(format) {
	var character;
	var closure;
	var has_padding_modifier = false;
	var local_date = false;
	var local_numbers = false;
	var modifiers = ["-", "_", "0", "^", "#", ":"];
	var opposite;
	var padding;
	var precision;
	var result = new blazegears.formatting.DateFormatTemplate();
	var specifier;
	var upper;
	
	if (this._use_deprecated) {
		modifiers.push("E");
		modifiers.push("O");
	}
	
	format = blazegears._forceParseString(format);
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
				if (BlazeGears.isInArray(character, modifiers)) {
					specifier += character;
					switch (character) {
						case "-": // disable padding
							has_padding_modifier = true;
							padding = "";
							break;
						
						case "_": // use space padding
							has_padding_modifier = true;
							padding = " ";
							break;
						
						case "0": // use zero padding
							has_padding_modifier = true;
							padding = "0";
							break;
						
						case "^": // convert to upper case
							upper = true;
							break;
						
						case "#": // convert to opposite case
							opposite = true;
							break;
						
						case "E": // use the locale's alternate representation for date and time, doesn't do anything
							local_date = true;
							break;
						
						case "O": // use the locale's alternate numeric symbols for numbers, doesn't do anything
							local_numbers = true;
							break;
						
						case ":": // increase the precision of the time zone offset representation, doesn't do anything
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
				
				case "A": // full weekday name
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
				
				case "B": // full weekday name
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
				
				case "D": // same as %m/%d/%y
					result.merge(this.parseDateFormat("%m/%d/%y"));
					break;
				
				case "F": // same as %Y-%m-%d
					result.merge(this.parseDateFormat("%Y-%m-%d"));
					break;
				
				case "G": // iso 8601 year
					result.addCallback(this._getIso8601Year);
					break;
				
				case "H": // zero padded 24-hour format hour
					closure = function(padding) {
						return function(date) {
							return blazegears._padStringLeft(this._getHours(date), padding, 2);
						}
					}
					result.addCallback(closure(padding));
					break;
				
				case "I": // zero padded 12-hour format hour
					closure = function(padding) {
						return function(date) {
							return blazegears._padStringLeft(this._getTwelveHourHours(date), padding, 2);
						}
					}
					result.addCallback(closure(padding));
					break;
				
				case "L": // is it a leap year
					if (this._use_deprecated) {
						result.addCallback(this._getLeapYear);
					}
					break;
				
				case "M": // zero padded minute
					closure = function(padding) {
						return function(date) {
							return blazegears._padStringLeft(this._getMinutes(date), padding, 2);
						}
					}
					result.addCallback(closure(padding));
					break;
				
				case "N": // nanoseconds
					result.addLiteral("000000000");
					break;
				
				case "P": // abbreviated lower case meridiems
					result.addCallback(this._getLowerCaseMeridiem);
					break;
				
				case "R": // same as %H:%M
					result.merge(this.parseDateFormat("%H:%M"));
					break;
				
				case "S": // zero padded second
					closure = function(padding) {
						return function(date) {
							return blazegears._padStringLeft(this._getSeconds(date), padding, 2);
						}
					}
					result.addCallback(closure(padding));
					break;
				
				case "T": // same as %H:%M:%S
				case "X":
					result.merge(this.parseDateFormat("%H:%M:%S"));
					break;
				
				case "U": // week of year, starting on sunday
					closure = function(padding) {
						return function(date) {
							return blazegears._padStringLeft(this._getSundayWeek(date), padding, 2);
						}
					}
					result.addCallback(closure(padding));
					break;
				
				case "V": // iso 8601 week of year
					closure = function(padding) {
						return function(date) {
							return blazegears._padStringLeft(this._getIso8601Week(date), padding, 2);
						}
					}
					result.addCallback(closure(padding));
					break;
				
				case "W": // week of year, starting on monday
					closure = function(padding) {
						return function(date) {
							return blazegears._padStringLeft(this._getMondayWeek(date), padding, 2);
						}
					}
					result.addCallback(closure(padding));
					break;
				
				case "Y": // full year
					result.addCallback(this._getFullYear);
					break;
				
				case "Z": // abbreviated time zone name
					break;
				
				case "a": // abbreviated weekday name
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
				
				case "b": // abbreviated month name
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
				
				case "d": // zero padded day of the month
					closure = function(padding) {
						return function(date) {
							return blazegears._padStringLeft(this._getDate(date), padding, 2);
						}
					}
					result.addCallback(closure(padding));
					break;
				
				case "e": // same as %_d
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
				
				case "g": // iso 8601 short year
					closure = function(padding) {
						return function(date) {
							return blazegears._padStringLeft(this._getIso8601Year(date) % 100, padding, 2);
						}
					}
					result.addCallback(closure(padding));
					break;
				
				case "j": // zero padded day of the year
					closure = function(padding) {
						return function(date) {
							return blazegears._padStringLeft(this._getDayOfYear(date), padding, 3);
						}
					}
					result.addCallback(closure(padding));
					break;
				
				case "k": // space padded 24-hour format hour
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
				
				case "l": // space padded 12-hour format hour
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
				
				case "m": // zero padded numeric month
					closure = function(padding) {
						return function(date) {
							return blazegears._padStringLeft(this._getMonth(date) + 1, padding, 2);
						}
					}
					result.addCallback(closure(padding));
					break;
				
				case "n": // newline character
					result.addLiteral("\n");
					break;
				
				case "o": // ordinal suffix for the day of the month
					if (this._use_deprecated) {
						result.addCallback(this._getOrdinalSuffix);
					}
					break;
				
				case "p": // abbreviated upper case meridiem
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
				
				case "r": // same as %I:%M:%S %p
					result.merge(this.parseDateFormat("%I:%M:%S %p"));
					break;
				
				case "s": // unix timestamp
					result.addCallback(this._getTimestamp);
					break;
				
				case "t": // tab character
					result.addLiteral("\t");
					break;
				
				case "u": // numeric weekday, starting on monday
					result.addCallback(this._getDayOfWeek);
					break;
				
				case "w": // numeric weekday, starting on sunday
					result.addCallback(this._getDay);
					break;
				
				case "x": // same as %m/%d/%y
					result.merge(this.parseDateFormat("%m/%d/%y"));
					break;
				
				case "y": // short year
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

/*
Class: BlazeGears.Formats [Deprecated]
	This class has been deprecated, use <blazegears.formatting.NumberFormatter>, <blazegears.formatting.PHPDateFormatter>, and <blazegears.formatting.UnixDateFormatter> instead. A singleton class that handles various string formatting tasks.

Superclasses:
	<BlazeGears.BaseClass [Deprecated]>

Date Formatting:
	Dates can be formatted based either on the syntax of the <date at http://unixhelp.ed.ac.uk/CGI/man-cgi?date> command of the Unix-like systems, or the <date at http://php.net/manual/en/function.date.php> function's of PHP. The syntax can be provided on-the-fly, but there's always a fallback configuration that will be used if it isn't.
	
	(code)
		formats = new BlazeGears.Formats();
		now = new Date();
		
		date_format = {parser: "unix", syntax: "%B %-d%o, %Y"};
		time_format = {parser: "unix", syntax: "%-I:%M%P"};
		
		alert(formats.formatDate(now)); // fallback configuration, August 27th, 2011 6:32pm
		alert(formats.formatDate(now, date_format)); // August 27th, 2011
		alert(formats.formatDate(now, time_format)); // 6:32pm
	(end)

Number Formatting:
	Number formatting works in a way very similar to the date formatting.
	
	(code)
		formats = new BlazeGears.Formats();
		number = 1234567.89
		
		float_format = {decimal_length: 3, force_decimals: true};
		money_format = {decimal_length: 2, force_decimals: true, prefix: "$"};
		
		alert(formats.formatNumber(number)); // fallback configuration, 1,234,567
		alert(formats.formatNumber(number, float_format)); // 1,234,567.890
		alert(formats.formatNumber(number, money_format)); // $1,234,567.89
	(end)
*/
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
				this._use_deprecated = true;
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
