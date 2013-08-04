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

// Namespace: blazegears
// The main namespace that contains all the fundamental functionality.
var blazegears = (typeof blazegears === "undefined") ? {} : blazegears;

// Class: Core
// Provides some basic information about the API.
blazegears.Core = {};

/*
Method: getVersion
	Gets the API's version number.

Return Value:
	An *Array* of three *Numbers*, representing the major, minor, and patch versions of the API.

Remarks:
	Starting from v2.0.0, the API versioning will follow the <Semantic Versioning v2.0.0 specifications at http://semver.org/spec/v2.0.0.html>.

Examples:
	(begin code)
		// v1.2.3-beta.3+build.5:
		blazegears.getVersion(); // [1, 2, 3]
	(end)
*/
blazegears.Core.getVersion = function() {
	return [1, 1, 0, 0];
}

/*
Method: getVersionMetadata
	Gets the API's version metadata.

Return Value:
	A *String* reperesentation of the API's pre-release/build metadata. It's usually empty for stable releases.

Remarks:
	Starting from v2.0.0, the API versioning will follow the <Semantic Versioning v2.0.0 specifications at http://semver.org/spec/v2.0.0.html>.

Examples:
	(begin code)
		// v1.2.3-beta.3+build.5:
		blazegears.getVersionExtension(); // -beta.3+build.5
	(end)
*/
blazegears.Core.getVersionMetadata = function() {
	return "-s.1";
}

blazegears._countStringOccurrences = function(needle, haystack) {
	var length;
	var position;
	var result = 0;
	
	needle = needle ? String(needle) : "";
	haystack = haystack ? String(haystack) : "";
	length = needle.length;
	
	if (length > 0) {
		while (true) {
			position = haystack.indexOf(needle, position);
			if (position > -1) {
				++result;
				position += length;
			} else {
				break;
			}
		}
	}
	
	return result;
}

blazegears._forceParseInt = function(value, default_value) {
	var result = parseInt(value);
	
	if (isNaN(result)) {
		result = default_value === undefined ? 0 : default_value;
	}
	
	return result;
}

blazegears._getColumnNumber = function(string, offset) {
	var last_line_break;
	var result;
	
	string = string.substr(0, offset);
	string = string.replace("\r\n", "\n");
	string = string.replace("\r", "\n");
	last_line_break = string.lastIndexOf("\n");
	result = offset - last_line_break;
	
	return result;
}

blazegears._getLineNumber = function(string, offset) {
	var result;
	
	string = string.substr(0, offset);
	string = string.replace("\r\n", "\n");
	string = string.replace("\r", "\n");
	result = blazegears._countStringOccurrences("\n", string) + 1;
	
	return result;
}

blazegears._padStringLeft = function(string, padding, expected_width) {
	var result = string.toString();
	
	if (padding.length > 0) {
		while (result.length < expected_width) {
			result = padding + result;
		}
	}
	
	return result;
}

/*
Class: Error
	The exception that will be thrown when an error occurs. It will try to compose the most appropriate error message from *message* and *inner_error*. All custom exceptions will inherit from this class.

Parent Class:
	*Error*

Arguments:
	[message = null] - (*String*) The base error message. If it's *null*, a generic message will be used.
	[inner_error = null] - (*Error*) Setter for <getInnerError>.

Exceptions:
	blazegears.ArgumentError - *inner_error* isn't an instance of *Error* and isn't *null*.

Examples:
	(begin code)
		var a;
		var b;
		var new_error;
		
		try {
			b = a.length
		} catch (error) {
			// An error with a message and an inner error:
			new_error = new blazegears.Error("Assignment failed.", error);
			new_error.toString(); // blazegears.Error: Assignment failed.
			
			// An error with only an inner error:
			new_error = new blazegears.Error(null, error);
			new_error.toString(); // blazegears.Error: An error occurred: Cannot read property 'length' of null
			
			// An error with no message or inner error:
			new_error = new blazegears.Error();
			new_error.toString(); // blazegears.Error: An error occurred.
		}
	(end)
*/
blazegears.Error = function(message, inner_error) {
	if (inner_error === undefined) inner_error = null;
	if (inner_error !== null && !(inner_error instanceof Error)) {
		throw  blazegears.ArgumentError._invalidArgumentType("inner_error", "Error");
	}
	
	Error.call(this);
	this.message = blazegears.Error._composeMessage("An error occurred", message, inner_error);
	this.name = "blazegears.Error";
	this._inner_error = inner_error;
}
blazegears.Error.prototype = new Error();
blazegears.Error.prototype.constructor = blazegears.Error;

/*
Method: getInnerError
	Gets the *Error* that's the cause of the current error.
*/
blazegears.Error.prototype.getInnerError = function() {
	return this._inner_error;
}

/*
Method: getMessage
	Gets the *String* representation of the error message.
*/
blazegears.Error.prototype.getMessage = function() {
	return this.message;
}

// composes the message for the error depending on if there's a message or inner error available
blazegears.Error._composeMessage = function(default_message, message, inner_error) {
	var result;
	
	if (message === undefined || message === null) {
		result = default_message;
		if (inner_error === undefined || inner_error === null) {
			result += ".";
		} else {
			if (inner_error instanceof Error) {
				result += ": " + inner_error.message.toString();
			} else {
				result += ": " + inner_error.toString();
			}
		}
	} else {
		result = message.toString();
	}
	
	return result;
}

/*
Class: ArgumentError
	The exception that will be thrown when an argument provided to a function is invalid.

Parent Class:
	<Error>

Arguments:
	argument_name - (*String*) Setter for <getArgumentName>.
	[message = null] - (*String*) Will be chained to <Error>'s constructor.
	[inner_error = null] - (*Error*) Will be chained to <Error>'s constructor.
*/
blazegears.ArgumentError = function(argument_name, message, inner_error) {
	blazegears.Error(this, message, inner_error);
	this.message = blazegears.Error._composeMessage("The <" + argument_name + "> argument is invalid", message, inner_error);
	this.name = "blazegears.ArgumentError";
	this._argument_name = argument_name.toString();
}
blazegears.ArgumentError.prototype = new blazegears.Error();
blazegears.ArgumentError.prototype.constructor = blazegears.ArgumentError;

// Method: getArgumentName
// Gets the *String* representation of the name of the invalid argument.
blazegears.ArgumentError.prototype.getArgumentName = function() {
	return this._argument_name;
}

// generates the message for an invalid argument type
blazegears.ArgumentError._invalidArgumentType = function(argument_name, expected_type) {
	return new blazegears.ArgumentError(argument_name, "The <" + argument_name + "> argument is expected to be an instance of <" + expected_type + ">.");
}

// Class: Event
// A collection of callbacks that can be simultaneously raised upon the occurrence of an event.
blazegears.Event = function() {
	this._callbacks = [];
}

/*
Method: addCallback
	Adds a callback to the collection.

Arguments:
	context - (*Object*) The object that will be assigned to *this* upon raising the event.
	callback - (*Function*) The callback function.

Exceptions:
	blazegears.ArgumentError - *callback* is not an instance of *Function*.
*/
blazegears.Event.prototype.addCallback = function(context, callback) {
	if (!BlazeGears.isFunction(callback)) {
		throw blazegears.ArgumentError("callback", "Function");
	}
	this._callbacks.push([context, callback]);
}

/*
Method: dispose
	Removes all the callbacks of the event.

Remarks:
	It is advised to dispose of the Event at the end of its usefulness to avoid retaining references to objects that otherwise would get garbage collected.
*/
blazegears.Event.prototype.dispose = function() {
	var callbacks = this._callbacks;
	var callback_count = callbacks.length;
	var i;
	
	for (i = 0; i < callback_count; ++i) {
		callbacks[i][0] = null;
		callbacks[i][1] = null;
		callbacks[i].length = 0;
		callbacks.splice(i, 1);
	}
	callbacks.length = 0;
}

/*
Method: raise
	Raises the callbacks of the event.

Arguments:
	All arguments passed to this method will be applied to the callback as-is.
*/
blazegears.Event.prototype.raise = function() {
	var callbacks = this._callbacks;
	var callback_count = callbacks.length;
	var i;
	
	for (i = 0; i < callback_count; ++i) {
		callbacks[i][1].apply(callbacks[i][0], arguments);
	}
}

/*
Method: removeCallback
	Removes a callback from the collection.

Arguments:
	context - (*Object*) The object that would be be assigned to *this* upon raising the callback.
	callback - (*Function*) The callback function.

Return Value:
	(Boolean) *true* if the callback was found and removed, otherwise *false*.

Errors:
	blazegears.ArgumentError - *callback* is not an instance of *Function*.
*/
blazegears.Event.prototype.removeCallback = function(context, callback) {
	var callbacks = this._callbacks;
	var callback_count = callbacks.length;
	var i;
	var result = false;
	
	if (!BlazeGears.isFunction(callback)) {
		throw new blazegears.ArgumentError("callback");
	}
	for (i = 0; i < callback_count; ++i) {
		if (context === callbacks[i][0] && callback === callbacks[i][1]) {
			callbacks[i][0] = null;
			callbacks[i][1] = null;
			callbacks[i].length = 0;
			callbacks.splice(i, 1);
			result = true;
			break;
		}
	}
	
	return result;
}

/*
Class: NotOverriddenError
	The error that will be thrown when an abstract method gets called.

Parent Class:
	<Error>

Arguments:
	[message = null] - (*String*) Will be chained to <Error>'s constructor.
	[inner_error = null] - (*Error*) Will be chained to <Error>'s constructor.
*/
blazegears.NotOverriddenError = function(message, inner_error) {
	blazegears.Error(this, message, inner_error);
	this.message = blazegears.Error._composeMessage("This method has to be overridden by a child class", message, inner_error);
	this.name = "blazegears.NotOverriddenError";
	this._argument_name = argument_name;
}
blazegears.NotOverriddenError.prototype = new blazegears.Error();
blazegears.NotOverriddenError.prototype.constructor = blazegears.NotOverriddenError;

// Namespace: BlazeGears [Deprecated]
// Every variable, method, and class is deprecated in this namespace and it will be completely removed. The main namespace that contains all the fundamental functionality.
BlazeGears = {};

BlazeGears._entities = {}; // stores the declared entities
BlazeGears._included_css = []; // stores the list of included css files
BlazeGears._included_js = []; // stores the list of included javascript files

// Variable: config
// The dictionary that's used for configuration.
// 
// Keys:
//   display_errors - If it's true, <error> will display an alert window whenever it's called. Defaults to false.
//   entity_id_length - The length of the random IDs used for entities. Defaults to 10.
//   entity_id_prefix - This prefix will be applied to every random entity ID to avoid clashes with other IDs. It doesn't count towards the length of the ID. Defaults to "blazegears_entity_".
//   escape_encoding - The default escaping method used by <escapeHtml>. Defaults to "html".
BlazeGears.config = {
	display_errors: false,
	entity_id_length: 10,
	entity_id_prefix: "blazegears_entity_",
	escape_encoding: "html"
};

// Function: Class [Deprecated]
// Alias for <BlazeGears.Classes [Deprecated].declareClass>.
BlazeGears.Class = function() {
	return BlazeGears.Classes.declareClass.apply(BlazeGears, arguments);
}

// Function: Singleton [Deprecated]
// Alias for <BlazeGears.Classes [Deprecated].declareSingleton>.
BlazeGears.Singleton = function() {
	return BlazeGears.Classes.declareSingleton.apply(BlazeGears, arguments);
}

// Function: StyleSheet
// Generates and outputs the markup for a style sheet.
// 
// Arguments:
//   selector - The selector of the style sheet. Also accepts an array of selectors.
//   properties - A dictionary where the keys are the CSS properties' names.
//   [media = "all"] - The media attribute of the style sheet.
BlazeGears.StyleSheet = function(selector, properties, media) {
	if (!BlazeGears.is(media)) media = "all";
	
	var result = "<style media='" + media + "' type='text/css'>";
	var selectors = "";
	
	if (BlazeGears.isArray(selector)) {
		for (var i in selector) {
			selectors += "," + selector[i];
		}
		selectors = selectors.substr(1);
		result += selectors;
	} else {
		result += selector;
	}
	result += "{";
	for (var i in properties) {
		result += i + ":" + properties[i] + ";";
	}
	result += "}";
	result += "</style>";
	document.write(result);
}

// Function: cloneArray [Deprecated]
// Alias for <cloneObject>.
BlazeGears.cloneArray = function(template) {
	return BlazeGears.cloneObject(template);
}

// Function: cloneObject
// Creates a deep copy of an object.
// 
// Arguments:
//   template - The object to be cloned.
// 
// Return Value:
//   Returns the cloned object.
// 
// Notes:
//   This method uses object literals for cloning, so all constructor, type, and prototype data/metadata will be lost.
BlazeGears.cloneObject = function(template) {
	var clone = BlazeGears.isArray(template) ? [] : {};
	
	for (var i in template) {
		if (template[i] && BlazeGears.isAnonymousObject(template[i]) && template[i] != null) {
			clone[i] = BlazeGears.cloneObject(template[i]);
		} else {
			clone[i] = template[i];
		}
	}
	
	return clone;
}

// Function: createEntity
// This function is deprecated and its functionality will be completely removed. Creates an internally stored variable.
// 
// Arguments:
//   [value = null] - The value of the entity.
//   [id = null] - The suggested ID for the entity.
// 
// Return Value:
//   Returns the ID of the entity, or null, if the suggested ID is already in use.
BlazeGears.createEntity = function(value, id) {
	if (!BlazeGears.is(id)) id = null;
	if (!BlazeGears.is(value)) value = null;
	
	var result = null;
	var unique;
	
	if (id == null) {
		do {
			id = "";
			unique = true;
			for (var i = 1; i <= BlazeGears.config.entity_id_length; i++) {
				id += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
			}
			id = BlazeGears.config.entity_id_prefix + id;
			if (BlazeGears.is(BlazeGears._entities[id]) || document.getElementById(id) != null) {
				unique = false;
			}
		} while (!unique);
		BlazeGears._entities[id] = value;
		result = id;
	} else {
		if (!BlazeGears.is(BlazeGears._entities[id])) {
			BlazeGears._entities[id] = value;
			result = id;
		}
	}
	
	return result;
}

// Function: createListener
// This function is deprecated and its functionality will be completely removed. Creates a cross-browser event listener.
// 
// Arguments:
//   caller - The listener will be attached to this element.
//   event - The name of the event, without the "on" prefix.
//   callback - The callback to be called when the event fires.
BlazeGears.createListener = function(caller, event, callback) {
	if (caller.addEventListener) {
		caller.addEventListener(event, callback, false);
	} else if (caller.attachEvent) {
		caller.attachEvent("on" + event, callback);
	} else {
		caller["on" + event] = callback;
	}
}

// Function: destroyEntity
// This function is deprecated and its functionality will be completely removed. Destroys an entity created by <createEntity>.
// 
// Arguments:
//   id - The ID of the entity.
// 
// Return Value:
//   Returns true if the entity with this ID was found, else false.
BlazeGears.destroyEntity = function(id) {
	var result = false;
	
	if (BlazeGears.is(BlazeGears._entities[id])) {
		delete BlazeGears._entities[id];
		result = true;
	} else {
		BlazeGears.error("BlazeGears", "Entity doesn't exist!", id);
	}
	
	return result;
}

// Function: destroyListener
// This function is deprecated and its functionality will be completely removed. Destroys a cross-browser event listener.
// 
// Arguments:
//   caller - The listener will be attached to this element.
//   event - The name of the event, without the "on" prefix.
//   callback - The callback to be called when the event fires.
BlazeGears.destroyListener = function(caller, event, callback) {
	if (caller.removeEventListener) {
		caller.removeEventListener(event, callback, false);
	} else if (caller.detachEvent) {
		caller.detachEvent("on" + event, callback);
	} else {
		delete caller["on" + event]
	}
}

// Function: error
// This function is deprecated and its functionality will be completely removed. Logs and/or displays an error message.
// 
// Arguments:
//   module - The name of the module that issues the error message.
//   [message = null] - The message itself.
//   [details = null] - Additional details.
//
// Notes:
//   Currently no logging is being done by this method.
BlazeGears.error = function(module, message, details) {
	if (!BlazeGears.is(message)) message = null;
	if (!BlazeGears.is(details)) details = null;
	
	if (BlazeGears.config.display_errors) {
		if (message != null) {
			module += ": " + message;
		}
		if (details != null) {
			module += " (" + details + ")";
		}
		window.alert(module);
	}
}

// Function: escape [Deprecated]
// Alias for <escapeHtml>.
BlazeGears.escape = function(text, encoding) {
	return BlazeGears.escapeHtml(text, encoding);
}

// Function: escapeHtml
// Escapes a string based on the selected escaping method.
// 
// Arguments:
//   text - The string to be escaped.
//   [method] [Deprecated] - This argument is deprecated and its functionality will be completely removed. The escaping method to be used. If not provided, <config>.escape_encoding will be used.
// 
// Return Value:
//   Returns the escaped string.
// 
// Escaping Methods:
//   html - Only escapes HTML control characters.
//   newlines - Only escapes the carriage return and new line characters.
//   utf-8 - All non-ASCII and HTML control characters will be escaped.
BlazeGears.escapeHtml = function(text, encoding) {
	if (!BlazeGears.is(encoding)) encoding = BlazeGears.config.escape_encoding;
	
	var code;
	var character;
	var entities = {};
	var result = "";
	
	// check the string
	if (text == null) {
		text = "";
	} else {
		text = text.toString();
	}
	
	if (encoding == "utf-8") {
		// escape all the non-ASCII and HTML characters
		for (var i = 0; i < text.length; i++) {
			character = text.charAt(i);
			code = text.charCodeAt(i);
			if (code > 128 || code == 34 || code == 38 || code == 39 || code == 60 || code == 62) {
				result += "&#" + code + ";";
			} else {
				result += character;
			}
		}
	} else {
		// select the characters to be escaped
		switch (encoding) {
			case "html":
				entities = {34: "&quot;", 38: "&amp;", 39: "&#39;", 60: "&lt;", 62: "&gt;"};
				break;
			
			case "newlines":
				entities = {10: "\\n", 13: "\\r"};
				break;
			
			default:
				entities = encoding;
		}
		
		// check all the characters against the escaping dictionary
		for (var i = 0; i < text.length; i++) {
			character = text.charAt(i);
			code = text.charCodeAt(i);
			
			if (BlazeGears.is(entities[code])) {
				result += entities[code];
			} else {
				result += character;
			}
		}
	}
	
	return result;
}

// Function: generateFlash [Deprecated]
// Alias for <renderFlash>.
BlazeGears.generateFlash = function(id, filename, width, height, parameters) {
	return BlazeGears.renderFlash(id, filename, width, height, parameters);
}

// Function: getEntity [Deprecated]
// Alias for <getEntityValue>.
BlazeGears.getEntity = function(id) {
	return BlazeGears.getEntityValue(id);
}

// Function: getEntityValue
// This function is deprecated and its functionality will be completely removed. Returns the value of an entity created by <createEntity>.
// 
// Arguments:
//   id - The ID of the entity.
// 
// Return Value:
//   Returns the value of the entity, or null, if the entity doesn't exist.
BlazeGears.getEntityValue = function(id) {
	if (BlazeGears.is(BlazeGears._entities[id])) {
		return BlazeGears._entities[id];
	} else {
		return null;
	}
}

// Function: includeCss
// This function is deprecated and its functionality will be completely removed. Generates a link element in the head of the document for including a CSS file.
// 
// Arguments:
//   filename - The file name of the CSS file. Also accepts an array of file names.
//   [media = "all"] - The media attribute of the CSS link.
//   [once = true] - If it's true, the same file won't be included more than once.
BlazeGears.includeCss = function(filename, media, once) {
	if (!BlazeGears.is(media)) media = "all";
	if (!BlazeGears.is(once)) once = true;
	
	var element;
	var head;
	var included = false;
	
	if (BlazeGears.isArray(filename)) {
		// process the filenames if there's more than one
		for (var i in filename) {
			BlazeGears.includeCss(filename[i], media, once);
		}
	} else {
		// check if the file was included before
		for (var i in BlazeGears._included_css) {
			if (BlazeGears._included_css[i] == filename) {
				included = true;
				break;
			}
		}
		
		// register the inclusion and create the element
		if (!included) {
			if (once) {
				BlazeGears._included_css.push(filename);
			}
			element = document.createElement("link");
			element.href = filename + "";
			element.media = media;
			element.rel = "stylesheet";
			element.type = "text/css";
			head = document.getElementsByTagName("head").item(0)
			head.appendChild(element);
		}
	}
}

// Function: includeJs
// This function is deprecated and its functionality will be completely removed. Generates the markup for including a JavaScript file and outputs it.
// 
// Arguments:
//   filename - The filename of the JavaScript file. Also accepts an array of filenames.
//   [once = true] - If it's true, the same file won't be included more than once.
BlazeGears.includeJs = function(filename, once) {
	if (!BlazeGears.is(once)) once = true;
	
	var included = false;
	
	if (BlazeGears.isArray(filename)) {
		// process the filenames if there's more than one
		for (var i in filename) {
			BlazeGears.includeJs(filename[i]);
		}
	} else {
		// check if the file was included before
		for (var i in BlazeGears._included_js) {
			if (BlazeGears._included_js[i] == filename) {
				included = true;
				break;
			}
		}
		
		// register the inclusion and create the element
		if (!included) {
			if (once) {
				BlazeGears._included_js.push(filename);
			}
			document.write("<script src='" + BlazeGears.escapeHtml(filename) + "' type='text/javascript'></script>");
		}
	}
}

// Function: is
// Determines if a variable is not undefined.
BlazeGears.is = function(variable) {
	return typeof variable != "undefined";
}

// Function: isAnonymousObject
// Determines if a variable is an anonymous object or object literal.
// 
// Arguments:
//   variable - The variable to be checked.
// 
// Return Value:
//   Returns true if the variable is an object, else false.
BlazeGears.isAnonymousObject = function(variable) {
	var constructorPattern = /^(\s*)function(\s*)Object\(\)(\s*)\{/;
	var result = variable != null ? constructorPattern.test(variable.constructor) : false;
	return result;
}

// Function: isArray
// Determines if a variable is an array.
// 
// Arguments:
//   variable - The variable to be checked.
// 
// Return Value:
//   Returns true if the variable is an array, else false.
BlazeGears.isArray = function(variable) {
	return variable instanceof Array;
}

// Function: isBoolean
// Determines if a variable is a Boolean.
// 
// Arguments:
//   variable - The variable to be checked.
// 
// Return Value:
//   Returns true if the variable is a Boolean, else false.
BlazeGears.isBoolean = function(variable) {
	return variable instanceof Boolean || typeof variable == "boolean";
}

// Function: isDate
// Determines if a variable is a date object.
// 
// Arguments:
//   variable - The variable to be checked.
// 
// Return Value:
//   Returns true if the variable is a date object, else false.
BlazeGears.isDate = function(variable) {
	return variable instanceof Date
}

// Function: isFunction
// Determines if a variable is a function.
// 
// Arguments:
//   variable - The variable to be checked.
// 
// Return Value:
//   Returns true if the variable is a function, else false.
BlazeGears.isFunction = function(variable) {
	return variable instanceof Function || typeof variable == "function";
}

// Function: isInArray
// This function is deprecated and its functionality will be completely removed. Determines if a value can be found in an array using linear search.
// 
// Arguments:
//   needle - The value to look for.
//   haystack - The array to search in.
//   [recursion = true] - If it's true, the sub-arrays of the original one will also be searched.
// 
// Return Value:
//   Returns true if the value can be found in the array or one of its sub-arrays (if recursion is enabled), else false.
BlazeGears.isInArray = function(needle, haystack, recursion) {
	if (!BlazeGears.is(recursion)) recursion = true;
	
	var result = false;
	
	for (var i in haystack) {
		if ((BlazeGears.isArray(haystack[i]) && BlazeGears.isInArray(needle, haystack[i]) && recursion) || haystack[i] == needle) {
			result = true;
			break;
		}
	}
	
	return result;
}

// Function: isNumber
// Determines if a variable is a number.
// 
// Arguments:
//   variable - The variable to be checked.
// 
// Return Value:
//   Returns true if the variable is a number, else false.
BlazeGears.isNumber = function(variable) {
	return variable instanceof Number || typeof variable == "number";
}

// Function: isObject [Deprecated]
// Alias for <isAnonymousObject>.
BlazeGears.isObject = function(variable) {
	return BlazeGears.isAnonymousObject(variable);
}

// Function: isRegExp
// Determines if a variable is a regular expression.
// 
// Arguments:
//   variable - The variable to be checked.
// 
// Return Value:
//   Returns true if the variable is a regular expression, else false.
BlazeGears.isRegExp = function(variable) {
	return variable instanceof RegExp;
}

// Function: isString
// Determines if a variable is a string.
// 
// Arguments:
//   variable - The variable to be checked.
// 
// Return Value:
//   Returns true if the variable is a string, else false.
BlazeGears.isString = function(variable) {
	return variable instanceof String || typeof variable == "string";
}

// Function: renderFlash
// This function is deprecated and its functionality will be completely removed. Generates the cross-browser markup for a Flash application.
// 
// Arguments:
//   id - The ID attribute for the object tag of the application.
//   filename - The filename of the application.
//   width - The width of the application.
//   height - The height of the application.
//   [parameters = {}] - A dictionary that defines the parameters for the application.
// 
// Return Value:
//   Returns the generated markup.
BlazeGears.renderFlash = function(id, filename, width, height, parameters) {
	if (!BlazeGears.is(parameters)) parameters = {};
	
	var result = "";
	
	result += "<!--[if !IE]>--><object data='" + filename + "' height='" + height + "' id='" + id + "' type='application/x-shockwave-flash' width='" + width + "'><!--<![endif]-->";
	result += "<!--[if IE]><object classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0' height='" + height + "' width='" + width + "' ><param name='movie' value='" + filename + "' /><![endif]-->";
	for (var i in parameters) {
		result += "<param name='" + i + "' value='" + parameters[i] + "' />";
	}
	result += "</object>";
	
	return result;
}

// Function: setEntityValue
// This function is deprecated and its functionality will be completely removed. Sets the value of an entity created by <createEntity>.
// 
// Arguments:
//   id - The ID of the entity.
// 
// Return Value:
//   Returns true if the entity with this ID was found, else false.
BlazeGears.setEntityValue = function(id, value) {
	var result = false;
	
	if (BlazeGears.is(BlazeGears._entities[id])) {
		BlazeGears._entities[id] = value;
		result = true;
	} else {
		BlazeGears.error("BlazeGears", "Entity doesn't exist!", id);
	}
	
	return result;
}

// Function: updateEntity [Deprecated]
// Alias for <setEntityValue>.
BlazeGears.updateEntity = function(id, value) {
	return BlazeGears.setEntityValue(id, value);
}

BlazeGears.StyleSheet("*[class|='BlazeGears'] .Clear", {
	clear: "both",
	height: "0px",
	overflow: "hidden"
});
