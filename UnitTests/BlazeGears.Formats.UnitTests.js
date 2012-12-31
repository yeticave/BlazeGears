module("BlazeGears.Formats");
BlazeGears.Formats.UnitTests = {};

BlazeGears.Formats.UnitTests.unixDateFormattingTest = function() {
	// "E": invalid, "N": invalid, "O": invalid
	var broken_specifiers = ["Z", "^Z", "#Z", "z", "-z", "_z", "0z"];
	var formatter = new BlazeGears.Formats();
	var result;
	var results = BlazeGears.Formats.UnitTests.formatUnixDateResults;
	var specifier;
	var timestamp
	
	formatter.enableUTCTime(true);
	for (specifier in results) {
		if (BlazeGears.isInArray(specifier, broken_specifiers)) {
			continue;
		}
		if (results.hasOwnProperty(specifier)) {
			result = {};
			for (timestamp in results[specifier]) {
				if (results[specifier].hasOwnProperty(timestamp)) {
					result[timestamp] = formatter.formatDate(parseInt(timestamp), {parser: "unix", syntax: "%" + specifier});
				}
			}
			deepEqual(result, results[specifier], "Use the %" + specifier + " specifier.");
		}
	}
}
test("Unix Date Formatting", BlazeGears.Formats.UnitTests.unixDateFormattingTest);

BlazeGears.Formats.UnitTests.phpDateFormattingTest = function() {
	// "c": dependency on P, "r": dependecy on O
	var broken_specifiers = ["I", "O", "P", "T", "Z", "c", "e", "r", "u"];
	var formatter = new BlazeGears.Formats();
	var result;
	var results = BlazeGears.Formats.UnitTests.formatPhpDateResults;
	var specifier;
	var timestamp
	
	formatter.enableUTCTime(true);
	for (specifier in results) {
		if (BlazeGears.isInArray(specifier, broken_specifiers)) {
			continue;
		}
		if (results.hasOwnProperty(specifier)) {
			result = {};
			for (timestamp in results[specifier]) {
				if (results[specifier].hasOwnProperty(timestamp)) {
					result[timestamp] = formatter.formatDate(parseInt(timestamp), {parser: "php", syntax: specifier});
				}
			}
			deepEqual(result, results[specifier], "Use the " + specifier + " specifier.");
		}
	}
}
test("PHP Date Formatting", BlazeGears.Formats.UnitTests.phpDateFormattingTest);

BlazeGears.Formats.UnitTests.numberFormatting = function() {
	var formatter = new BlazeGears.Formats();
	var number = 1234567890.123456;
	var number_format = {
		decimal_delimiter: ".",
		decimal_length: 2,
		force_decimals: false,
		group_delimiter: ",",
		group_length: 3,
		leading_zero: true,
		negative_prefix: "-",
		negative_suffix: "",
		negatives_first: false,
		prefix: "",
		suffix: ""
	};
	
	number_format.decimal_delimiter = "x";
	strictEqual(formatter.formatNumber(number, number_format), "1,234,567,890x12", "Change the decimal delimiter.");
	number_format.decimal_delimiter = ".";
	
	number_format.decimal_length = 4;
	strictEqual(formatter.formatNumber(number, number_format), "1,234,567,890.1235", "Change the number of the decimal digits.");
	number_format.decimal_length = 2;
	
	strictEqual(formatter.formatNumber(Math.floor(number), number_format), "1,234,567,890", "Hide the decimal digits.");
	number_format.force_decimals = true;
	strictEqual(formatter.formatNumber(Math.floor(number), number_format), "1,234,567,890.00", "Force show the decimal digits.");
	number_format.force_decimals = false;
	
	number_format.group_delimiter = "x";
	strictEqual(formatter.formatNumber(number, number_format), "1x234x567x890.12", "Change the group delimiter.");
	number_format.group_delimiter = ",";
	
	number_format.group_length = 4;
	strictEqual(formatter.formatNumber(number, number_format), "12,3456,7890.12", "Change the group size.");
	number_format.group_length = 3;
	
	strictEqual(formatter.formatNumber(number - Math.round(number), number_format), "0.12", "Force show the leading zero.");
	number_format.leading_zero = false;
	strictEqual(formatter.formatNumber(number - Math.round(number), number_format), ".12", "Hide the leading zero.");
	number_format.leading_zero = true;
	
	number_format.negative_prefix = "x";
	strictEqual(formatter.formatNumber(-number, number_format),  "x1,234,567,890.12", "Change the negative prefix.");
	number_format.negative_prefix = "-";
	
	number_format.negative_suffix = "x";
	strictEqual(formatter.formatNumber(-number, number_format),  "-1,234,567,890.12x", "Change the negative suffix.");
	number_format.negative_suffix = "";
	
	number_format.prefix = "x";
	strictEqual(formatter.formatNumber(number, number_format),  "x1,234,567,890.12", "Change the prefix.");
	number_format.prefix = "";
	
	number_format.suffix = "x";
	strictEqual(formatter.formatNumber(number, number_format),  "1,234,567,890.12x", "Change the suffix.");
	number_format.suffix = "";
	
	number_format.negative_suffix = "x";
	number_format.prefix = "a";
	number_format.suffix = "b";
	strictEqual(formatter.formatNumber(-number, number_format),  "-a1,234,567,890.12bx", "Show the negative affixes first.");
	number_format.negatives_first = true;
	strictEqual(formatter.formatNumber(-number, number_format),  "a-1,234,567,890.12xb", "Show the negative affixes last.");
	number_format.negative_suffix = "";
	number_format.negatives_first = false;
	number_format.prefix = "";
	number_format.suffix = "";
}
test("Number Formatting", BlazeGears.Formats.UnitTests.numberFormatting);

BlazeGears.Formats.UnitTests.formatUnixDateResults = {
	"%": {
		915861600: "%",
		947419749: "%",
		1009738799: "%"
	},
	"A": {
		915861600: "Saturday",
		947419749: "Sunday",
		1009738799: "Sunday"
	},
	"^A": {
		915861600: "SATURDAY",
		947419749: "SUNDAY",
		1009738799: "SUNDAY"
	},
	"#A": {
		915861600: "SATURDAY",
		947419749: "SUNDAY",
		1009738799: "SUNDAY"
	},
	"B": {
		915861600: "January",
		947419749: "January",
		1009738799: "December"
	},
	"^B": {
		915861600: "JANUARY",
		947419749: "JANUARY",
		1009738799: "DECEMBER"
	},
	"#B": {
		915861600: "JANUARY",
		947419749: "JANUARY",
		1009738799: "DECEMBER"
	},
	"C": {
		915861600: "19",
		947419749: "20",
		1009738799: "20"
	},
	"-C": {
		915861600: "19",
		947419749: "20",
		1009738799: "20"
	},
	"_C": {
		915861600: "19",
		947419749: "20",
		1009738799: "20"
	},
	"0C": {
		915861600: "19",
		947419749: "20",
		1009738799: "20"
	},
	"D": {
		915861600: "01/09/99",
		947419749: "01/09/00",
		1009738799: "12/30/01"
	},
	"F": {
		915861600: "1999-01-09",
		947419749: "2000-01-09",
		1009738799: "2001-12-30"
	},
	"G": {
		915861600: "1999",
		947419749: "2000",
		1009738799: "2001"
	},
	"-G": {
		915861600: "1999",
		947419749: "2000",
		1009738799: "2001"
	},
	"_G": {
		915861600: "1999",
		947419749: "2000",
		1009738799: "2001"
	},
	"0G": {
		915861600: "1999",
		947419749: "2000",
		1009738799: "2001"
	},
	"H": {
		915861600: "06",
		947419749: "12",
		1009738799: "18"
	},
	"-H": {
		915861600: "6",
		947419749: "12",
		1009738799: "18"
	},
	"_H": {
		915861600: " 6",
		947419749: "12",
		1009738799: "18"
	},
	"0H": {
		915861600: "06",
		947419749: "12",
		1009738799: "18"
	},
	"I": {
		915861600: "06",
		947419749: "12",
		1009738799: "06"
	},
	"-I": {
		915861600: "6",
		947419749: "12",
		1009738799: "6"
	},
	"_I": {
		915861600: " 6",
		947419749: "12",
		1009738799: " 6"
	},
	"0I": {
		915861600: "06",
		947419749: "12",
		1009738799: "06"
	},
	"M": {
		915861600: "00",
		947419749: "09",
		1009738799: "59"
	},
	"-M": {
		915861600: "0",
		947419749: "9",
		1009738799: "59"
	},
	"_M": {
		915861600: " 0",
		947419749: " 9",
		1009738799: "59"
	},
	"0M": {
		915861600: "00",
		947419749: "09",
		1009738799: "59"
	},
	"P": {
		915861600: "am",
		947419749: "pm",
		1009738799: "pm"
	},
	"R": {
		915861600: "06:00",
		947419749: "12:09",
		1009738799: "18:59"
	},
	"S": {
		915861600: "00",
		947419749: "09",
		1009738799: "59"
	},
	"-S": {
		915861600: "0",
		947419749: "9",
		1009738799: "59"
	},
	"_S": {
		915861600: " 0",
		947419749: " 9",
		1009738799: "59"
	},
	"0S": {
		915861600: "00",
		947419749: "09",
		1009738799: "59"
	},
	"T": {
		915861600: "06:00:00",
		947419749: "12:09:09",
		1009738799: "18:59:59"
	},
	"X": {
		915861600: "06:00:00",
		947419749: "12:09:09",
		1009738799: "18:59:59"
	},
	"U": {
		915861600: "01",
		947419749: "02",
		1009738799: "52"
	},
	"-U": {
		915861600: "1",
		947419749: "2",
		1009738799: "52"
	},
	"_U": {
		915861600: " 1",
		947419749: " 2",
		1009738799: "52"
	},
	"0U": {
		915861600: "01",
		947419749: "02",
		1009738799: "52"
	},
	"V": {
		915861600: "01",
		947419749: "01",
		1009738799: "52"
	},
	"-V": {
		915861600: "1",
		947419749: "1",
		1009738799: "52"
	},
	"_V": {
		915861600: " 1",
		947419749: " 1",
		1009738799: "52"
	},
	"0V": {
		915861600: "01",
		947419749: "01",
		1009738799: "52"
	},
	"W": {
		915861600: "01",
		947419749: "01",
		1009738799: "52"
	},
	"-W": {
		915861600: "1",
		947419749: "1",
		1009738799: "52"
	},
	"_W": {
		915861600: " 1",
		947419749: " 1",
		1009738799: "52"
	},
	"0W": {
		915861600: "01",
		947419749: "01",
		1009738799: "52"
	},
	"Y": {
		915861600: "1999",
		947419749: "2000",
		1009738799: "2001"
	},
	"-Y": {
		915861600: "1999",
		947419749: "2000",
		1009738799: "2001"
	},
	"_Y": {
		915861600: "1999",
		947419749: "2000",
		1009738799: "2001"
	},
	"0Y": {
		915861600: "1999",
		947419749: "2000",
		1009738799: "2001"
	},
	"Z": {
		915861600: "UTC",
		947419749: "UTC",
		1009738799: "UTC"
	},
	"^Z": {
		915861600: "UTC",
		947419749: "UTC",
		1009738799: "UTC"
	},
	"#Z": {
		915861600: "utc",
		947419749: "utc",
		1009738799: "utc"
	},
	"a": {
		915861600: "Sat",
		947419749: "Sun",
		1009738799: "Sun"
	},
	"^a": {
		915861600: "SAT",
		947419749: "SUN",
		1009738799: "SUN"
	},
	"#a": {
		915861600: "SAT",
		947419749: "SUN",
		1009738799: "SUN"
	},
	"b": {
		915861600: "Jan",
		947419749: "Jan",
		1009738799: "Dec"
	},
	"^b": {
		915861600: "JAN",
		947419749: "JAN",
		1009738799: "DEC"
	},
	"#b": {
		915861600: "JAN",
		947419749: "JAN",
		1009738799: "DEC"
	},
	"h": {
		915861600: "Jan",
		947419749: "Jan",
		1009738799: "Dec"
	},
	"^h": {
		915861600: "JAN",
		947419749: "JAN",
		1009738799: "DEC"
	},
	"#h": {
		915861600: "JAN",
		947419749: "JAN",
		1009738799: "DEC"
	},
	"c": {
		915861600: "Sat Jan  9 06:00:00 1999",
		947419749: "Sun Jan  9 12:09:09 2000",
		1009738799: "Sun Dec 30 18:59:59 2001"
	},
	"^c": {
		915861600: "SAT JAN  9 06:00:00 1999",
		947419749: "SUN JAN  9 12:09:09 2000",
		1009738799: "SUN DEC 30 18:59:59 2001"
	},
	"#c": {
		915861600: "Sat Jan  9 06:00:00 1999",
		947419749: "Sun Jan  9 12:09:09 2000",
		1009738799: "Sun Dec 30 18:59:59 2001"
	},
	"d": {
		915861600: "09",
		947419749: "09",
		1009738799: "30"
	},
	"-d": {
		915861600: "9",
		947419749: "9",
		1009738799: "30"
	},
	"_d": {
		915861600: " 9",
		947419749: " 9",
		1009738799: "30"
	},
	"0d": {
		915861600: "09",
		947419749: "09",
		1009738799: "30"
	},
	"e": {
		915861600: " 9",
		947419749: " 9",
		1009738799: "30"
	},
	"-e": {
		915861600: "9",
		947419749: "9",
		1009738799: "30"
	},
	"_e": {
		915861600: " 9",
		947419749: " 9",
		1009738799: "30"
	},
	"0e": {
		915861600: "09",
		947419749: "09",
		1009738799: "30"
	},
	"g": {
		915861600: "99",
		947419749: "00",
		1009738799: "01"
	},
	"-g": {
		915861600: "99",
		947419749: "0",
		1009738799: "1"
	},
	"_g": {
		915861600: "99",
		947419749: " 0",
		1009738799: " 1"
	},
	"0g": {
		915861600: "99",
		947419749: "00",
		1009738799: "01"
	},
	"j": {
		915861600: "009",
		947419749: "009",
		1009738799: "364"
	},
	"-j": {
		915861600: "9",
		947419749: "9",
		1009738799: "364"
	},
	"_j": {
		915861600: "  9",
		947419749: "  9",
		1009738799: "364"
	},
	"0j": {
		915861600: "009",
		947419749: "009",
		1009738799: "364"
	},
	"k": {
		915861600: " 6",
		947419749: "12",
		1009738799: "18"
	},
	"-k": {
		915861600: "6",
		947419749: "12",
		1009738799: "18"
	},
	"_k": {
		915861600: " 6",
		947419749: "12",
		1009738799: "18"
	},
	"0k": {
		915861600: "06",
		947419749: "12",
		1009738799: "18"
	},
	"l": {
		915861600: " 6",
		947419749: "12",
		1009738799: " 6"
	},
	"-l": {
		915861600: "6",
		947419749: "12",
		1009738799: "6"
	},
	"_l": {
		915861600: " 6",
		947419749: "12",
		1009738799: " 6"
	},
	"0l": {
		915861600: "06",
		947419749: "12",
		1009738799: "06"
	},
	"m": {
		915861600: "01",
		947419749: "01",
		1009738799: "12"
	},
	"-m": {
		915861600: "1",
		947419749: "1",
		1009738799: "12"
	},
	"_m": {
		915861600: " 1",
		947419749: " 1",
		1009738799: "12"
	},
	"0m": {
		915861600: "01",
		947419749: "01",
		1009738799: "12"
	},
	"p": {
		915861600: "AM",
		947419749: "PM",
		1009738799: "PM"
	},
	"^p": {
		915861600: "AM",
		947419749: "PM",
		1009738799: "PM"
	},
	"#p": {
		915861600: "am",
		947419749: "pm",
		1009738799: "pm"
	},
	"r": {
		915861600: "06:00:00 AM",
		947419749: "12:09:09 PM",
		1009738799: "06:59:59 PM"
	},
	"s": {
		915861600: "915861600",
		947419749: "947419749",
		1009738799: "1009738799"
	},
	"u": {
		915861600: "6",
		947419749: "7",
		1009738799: "7"
	},
	"w": {
		915861600: "6",
		947419749: "0",
		1009738799: "0"
	},
	"x": {
		915861600: "01/09/99",
		947419749: "01/09/00",
		1009738799: "12/30/01"
	},
	"y": {
		915861600: "99",
		947419749: "00",
		1009738799: "01"
	},
	"-y": {
		915861600: "99",
		947419749: "0",
		1009738799: "1"
	},
	"_y": {
		915861600: "99",
		947419749: " 0",
		1009738799: " 1"
	},
	"0y": {
		915861600: "99",
		947419749: "00",
		1009738799: "01"
	},
	"z": {
		915861600: "+0000",
		947419749: "+0000",
		1009738799: "+0000"
	},
	"-z": {
		915861600: "+0",
		947419749: "+0",
		1009738799: "+0"
	},
	"_z": {
		915861600: "+   0",
		947419749: "+   0",
		1009738799: "+   0"
	},
	"0z": {
		915861600: "+0000",
		947419749: "+0000",
		1009738799: "+0000"
	}
};

BlazeGears.Formats.UnitTests.formatPhpDateResults = {
	"A": {
		915861600: "AM",
		947419749: "PM",
		1009738799: "PM"
	},
	"B": {
		915861600: "291",
		947419749: "548",
		1009738799: "833"
	},
	"D": {
		915861600: "Sat",
		947419749: "Sun",
		1009738799: "Sun"
	},
	"F": {
		915861600: "January",
		947419749: "January",
		1009738799: "December"
	},
	"G": {
		915861600: "6",
		947419749: "12",
		1009738799: "18"
	},
	"H": {
		915861600: "06",
		947419749: "12",
		1009738799: "18"
	},
	"I": {
		915861600: "0",
		947419749: "0",
		1009738799: "0"
	},
	"L": {
		915861600: "0",
		947419749: "1",
		1009738799: "0"
	},
	"M": {
		915861600: "Jan",
		947419749: "Jan",
		1009738799: "Dec"
	},
	"N": {
		915861600: "6",
		947419749: "7",
		1009738799: "7"
	},
	"O": {
		915861600: "+0000",
		947419749: "+0000",
		1009738799: "+0000"
	},
	"P": {
		915861600: "+00:00",
		947419749: "+00:00",
		1009738799: "+00:00"
	},
	"S": {
		915861600: "th",
		947419749: "th",
		1009738799: "th"
	},
	"T": {
		915861600: "UTC",
		947419749: "UTC",
		1009738799: "UTC"
	},
	"U": {
		915861600: "915861600",
		947419749: "947419749",
		1009738799: "1009738799"
	},
	"W": {
		915861600: "01",
		947419749: "01",
		1009738799: "52"
	},
	"Y": {
		915861600: "1999",
		947419749: "2000",
		1009738799: "2001"
	},
	"Z": {
		915861600: "0",
		947419749: "0",
		1009738799: "0"
	},
	"a": {
		915861600: "am",
		947419749: "pm",
		1009738799: "pm"
	},
	"c": {
		915861600: "1999-01-09T06:00:00+00:00",
		947419749: "2000-01-09T12:09:09+00:00",
		1009738799: "2001-12-30T18:59:59+00:00"
	},
	"d": {
		915861600: "09",
		947419749: "09",
		1009738799: "30"
	},
	"e": {
		915861600: "UTC",
		947419749: "UTC",
		1009738799: "UTC"
	},
	"g": {
		915861600: "6",
		947419749: "12",
		1009738799: "6"
	},
	"h": {
		915861600: "06",
		947419749: "12",
		1009738799: "06"
	},
	"i": {
		915861600: "00",
		947419749: "09",
		1009738799: "59"
	},
	"j": {
		915861600: "9",
		947419749: "9",
		1009738799: "30"
	},
	"l": {
		915861600: "Saturday",
		947419749: "Sunday",
		1009738799: "Sunday"
	},
	"m": {
		915861600: "01",
		947419749: "01",
		1009738799: "12"
	},
	"n": {
		915861600: "1",
		947419749: "1",
		1009738799: "12"
	},
	"o": {
		915861600: "1999",
		947419749: "2000",
		1009738799: "2001"
	},
	"r": {
		915861600: "Sat, 09 Jan 1999 06:00:00 +0000",
		947419749: "Sun, 09 Jan 2000 12:09:09 +0000",
		1009738799: "Sun, 30 Dec 2001 18:59:59 +0000"
	},
	"s": {
		915861600: "00",
		947419749: "09",
		1009738799: "59"
	},
	"t": {
		915861600: "31",
		947419749: "31",
		1009738799: "31"
	},
	"u": {
		915861600: "000000",
		947419749: "000000",
		1009738799: "000000"
	},
	"w": {
		915861600: "6",
		947419749: "0",
		1009738799: "0"
	},
	"y": {
		915861600: "99",
		947419749: "00",
		1009738799: "01"
	},
	"z": {
		915861600: "8",
		947419749: "8",
		1009738799: "363"
	}
};
