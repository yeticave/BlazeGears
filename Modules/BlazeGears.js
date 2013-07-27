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

blazegears._entities = {}; // stores the declared entities
blazegears._included_css = []; // stores the list of included css files
blazegears._included_js = []; // stores the list of included javascript files

// Variable: config [Deprecated]
// This variable is deprecated and its functionality will be completely removed. The dictionary that's used for configuration.
// 
// Keys:
//   display_errors - If it's true, <error [Deprecated]> will display an alert window whenever it's called. Defaults to false.
//   entity_id_length - The length of the random IDs used for entities. Defaults to 10.
//   entity_id_prefix - This prefix will be applied to every random entity ID to avoid clashes with other IDs. It doesn't count towards the length of the ID. Defaults to "blazegears_entity_".
//   escape_encoding - The default escaping method used by <escapeHtml>. Defaults to "html".
blazegears.config = {
	display_errors: false,
	entity_id_length: 10,
	entity_id_prefix: "blazegears_entity_",
	escape_encoding: "html"
};

// Function: Class [Deprecated]
// Alias for <BlazeGears.Classes [Deprecated].declareClass>.
blazegears.Class = function() {
	return BlazeGears.Classes.declareClass.apply(blazegears, arguments);
}

// Function: Singleton [Deprecated]
// Alias for <BlazeGears.Classes [Deprecated].declareSingleton>.
blazegears.Singleton = function() {
	return BlazeGears.Classes.declareSingleton.apply(blazegears, arguments);
}

// Function: StyleSheet [Deprecated]
// This function is deprecated and its functionality will be completely removed. Generates and outputs the markup for a style sheet.
// 
// Arguments:
//   selector - The selector of the style sheet. Also accepts an array of selectors.
//   properties - A dictionary where the keys are the CSS properties' names.
//   [media = "all"] - The media attribute of the style sheet.
blazegears.StyleSheet = function(selector, properties, media) {
	if (!blazegears.is(media)) media = "all";
	
	var result = "<style media='" + media + "' type='text/css'>";
	var selectors = "";
	
	if (blazegears.isArray(selector)) {
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
// Alias for <cloneObject [Deprecated]>.
blazegears.cloneArray = function(template) {
	return blazegears.cloneObject(template);
}

// Function: cloneObject [Deprecated]
// This function is deprecated and its functionality will be completely removed. Creates a deep copy of an object.
// 
// Arguments:
//   template - The object to be cloned.
// 
// Return Value:
//   Returns the cloned object.
// 
// Notes:
//   This method uses object literals for cloning, so all constructor, type, and prototype data/metadata will be lost.
blazegears.cloneObject = function(template) {
	var clone = blazegears.isArray(template) ? [] : {};
	
	for (var i in template) {
		if (template[i] && blazegears.isAnonymousObject(template[i]) && template[i] != null) {
			clone[i] = blazegears.cloneObject(template[i]);
		} else {
			clone[i] = template[i];
		}
	}
	
	return clone;
}

// Function: createEntity [Deprecated]
// This function is deprecated and its functionality will be completely removed. Creates an internally stored variable.
// 
// Arguments:
//   [value = null] - The value of the entity.
//   [id = null] - The suggested ID for the entity.
// 
// Return Value:
//   Returns the ID of the entity, or null, if the suggested ID is already in use.
blazegears.createEntity = function(value, id) {
	if (!blazegears.is(id)) id = null;
	if (!blazegears.is(value)) value = null;
	
	var result = null;
	var unique;
	
	if (id == null) {
		do {
			id = "";
			unique = true;
			for (var i = 1; i <= blazegears.config.entity_id_length; i++) {
				id += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
			}
			id = blazegears.config.entity_id_prefix + id;
			if (blazegears.is(blazegears._entities[id]) || document.getElementById(id) != null) {
				unique = false;
			}
		} while (!unique);
		blazegears._entities[id] = value;
		result = id;
	} else {
		if (!blazegears.is(blazegears._entities[id])) {
			blazegears._entities[id] = value;
			result = id;
		}
	}
	
	return result;
}

// Function: createListener [Deprecated]
// This function is deprecated and its functionality will be completely removed. Creates a cross-browser event listener.
// 
// Arguments:
//   caller - The listener will be attached to this element.
//   event - The name of the event, without the "on" prefix.
//   callback - The callback to be called when the event fires.
blazegears.createListener = function(caller, event, callback) {
	if (caller.addEventListener) {
		caller.addEventListener(event, callback, false);
	} else if (caller.attachEvent) {
		caller.attachEvent("on" + event, callback);
	} else {
		caller["on" + event] = callback;
	}
}

// Function: destroyEntity [Deprecated]
// This function is deprecated and its functionality will be completely removed. Destroys an entity created by <createEntity [Deprecated]>.
// 
// Arguments:
//   id - The ID of the entity.
// 
// Return Value:
//   Returns true if the entity with this ID was found, else false.
blazegears.destroyEntity = function(id) {
	var result = false;
	
	if (blazegears.is(blazegears._entities[id])) {
		delete blazegears._entities[id];
		result = true;
	} else {
		blazegears.error("BlazeGears", "Entity doesn't exist!", id);
	}
	
	return result;
}

// Function: destroyListener [Deprecated]
// This function is deprecated and its functionality will be completely removed. Destroys a cross-browser event listener.
// 
// Arguments:
//   caller - The listener will be attached to this element.
//   event - The name of the event, without the "on" prefix.
//   callback - The callback to be called when the event fires.
blazegears.destroyListener = function(caller, event, callback) {
	if (caller.removeEventListener) {
		caller.removeEventListener(event, callback, false);
	} else if (caller.detachEvent) {
		caller.detachEvent("on" + event, callback);
	} else {
		delete caller["on" + event]
	}
}

// Function: error [Deprecated]
// This function is deprecated and its functionality will be completely removed. Logs and/or displays an error message.
// 
// Arguments:
//   module - The name of the module that issues the error message.
//   [message = null] - The message itself.
//   [details = null] - Additional details.
//
// Notes:
//   Currently no logging is being done by this method.
blazegears.error = function(module, message, details) {
	if (!blazegears.is(message)) message = null;
	if (!blazegears.is(details)) details = null;
	
	if (blazegears.config.display_errors) {
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
blazegears.escape = function(text, encoding) {
	return blazegears.escapeHtml(text, encoding);
}

// Function: escapeHtml
// Escapes a string based on the selected escaping method.
// 
// Arguments:
//   text - The string to be escaped.
//   [method] [Deprecated] - This argument is deprecated and its functionality will be completely removed. The escaping method to be used. If not provided, <config [Deprecated]>.escape_encoding will be used.
// 
// Return Value:
//   Returns the escaped string.
// 
// Escaping Methods:
//   html - Only escapes HTML control characters.
//   newlines - Only escapes the carriage return and new line characters.
//   utf-8 - All non-ASCII and HTML control characters will be escaped.
blazegears.escapeHtml = function(text, encoding) {
	if (!blazegears.is(encoding)) encoding = blazegears.config.escape_encoding;
	
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
			
			if (blazegears.is(entities[code])) {
				result += entities[code];
			} else {
				result += character;
			}
		}
	}
	
	return result;
}

// Function: generateFlash [Deprecated]
// Alias for <renderFlash [Deprecated]>.
blazegears.generateFlash = function(id, filename, width, height, parameters) {
	return blazegears.renderFlash(id, filename, width, height, parameters);
}

// Function: getEntity [Deprecated]
// Alias for <getEntityValue [Deprecated]>.
blazegears.getEntity = function(id) {
	return blazegears.getEntityValue(id);
}

// Function: getEntityValue [Deprecated]
// This function is deprecated and its functionality will be completely removed. Returns the value of an entity created by <createEntity [Deprecated]>.
// 
// Arguments:
//   id - The ID of the entity.
// 
// Return Value:
//   Returns the value of the entity, or null, if the entity doesn't exist.
blazegears.getEntityValue = function(id) {
	if (blazegears.is(blazegears._entities[id])) {
		return blazegears._entities[id];
	} else {
		return null;
	}
}

// Function: getVersion
blazegears.getVersion = function() {
	return [1, 2, 0, 0];
}

// Function: includeCss [Deprecated]
// This function is deprecated and its functionality will be completely removed. Generates a link element in the head of the document for including a CSS file.
// 
// Arguments:
//   filename - The file name of the CSS file. Also accepts an array of file names.
//   [media = "all"] - The media attribute of the CSS link.
//   [once = true] - If it's true, the same file won't be included more than once.
blazegears.includeCss = function(filename, media, once) {
	if (!blazegears.is(media)) media = "all";
	if (!blazegears.is(once)) once = true;
	
	var element;
	var head;
	var included = false;
	
	if (blazegears.isArray(filename)) {
		// process the filenames if there's more than one
		for (var i in filename) {
			blazegears.includeCss(filename[i], media, once);
		}
	} else {
		// check if the file was included before
		for (var i in blazegears._included_css) {
			if (blazegears._included_css[i] == filename) {
				included = true;
				break;
			}
		}
		
		// register the inclusion and create the element
		if (!included) {
			if (once) {
				blazegears._included_css.push(filename);
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

// Function: includeJs [Deprecated]
// This function is deprecated and its functionality will be completely removed. Generates the markup for including a JavaScript file and outputs it.
// 
// Arguments:
//   filename - The filename of the JavaScript file. Also accepts an array of filenames.
//   [once = true] - If it's true, the same file won't be included more than once.
blazegears.includeJs = function(filename, once) {
	if (!blazegears.is(once)) once = true;
	
	var included = false;
	
	if (blazegears.isArray(filename)) {
		// process the filenames if there's more than one
		for (var i in filename) {
			blazegears.includeJs(filename[i]);
		}
	} else {
		// check if the file was included before
		for (var i in blazegears._included_js) {
			if (blazegears._included_js[i] == filename) {
				included = true;
				break;
			}
		}
		
		// register the inclusion and create the element
		if (!included) {
			if (once) {
				blazegears._included_js.push(filename);
			}
			document.write("<script src='" + blazegears.escapeHtml(filename) + "' type='text/javascript'></script>");
		}
	}
}

// Function: is [Deprecated]
// This function is deprecated, use <isUndefined> instead. Determines if a variable is not undefined.
blazegears.is = function(variable) {
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
blazegears.isAnonymousObject = function(variable) {
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
blazegears.isArray = function(variable) {
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
blazegears.isBoolean = function(variable) {
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
blazegears.isDate = function(variable) {
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
blazegears.isFunction = function(variable) {
	return variable instanceof Function || typeof variable == "function";
}

// Function: isInArray [Deprecated]
// This function is deprecated and its functionality will be completely removed. Determines if a value can be found in an array using linear search.
// 
// Arguments:
//   needle - The value to look for.
//   haystack - The array to search in.
//   [recursion = true] - If it's true, the sub-arrays of the original one will also be searched.
// 
// Return Value:
//   Returns true if the value can be found in the array or one of its sub-arrays (if recursion is enabled), else false.
blazegears.isInArray = function(needle, haystack, recursion) {
	if (!blazegears.is(recursion)) recursion = true;
	
	var result = false;
	
	for (var i in haystack) {
		if ((blazegears.isArray(haystack[i]) && blazegears.isInArray(needle, haystack[i]) && recursion) || haystack[i] == needle) {
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
blazegears.isNumber = function(variable) {
	return variable instanceof Number || typeof variable == "number";
}

// Function: isObject [Deprecated]
// Alias for <isAnonymousObject>.
blazegears.isObject = function(variable) {
	return blazegears.isAnonymousObject(variable);
}

// Function: isRegExp
// Determines if a variable is a regular expression.
// 
// Arguments:
//   variable - The variable to be checked.
// 
// Return Value:
//   Returns true if the variable is a regular expression, else false.
blazegears.isRegExp = function(variable) {
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
blazegears.isString = function(variable) {
	return variable instanceof String || typeof variable == "string";
}

// Function: isUndefined
// Determines if a variable is undefined.
// 
// Arguments:
//   variable - The variable to be checked.
// 
// Return Value:
//   Returns true if the variable is undefined, else false.
blazegears.isUndefined = function(variable) {
	return typeof variable === "undefined";
}

// Function: renderFlash [Deprecated]
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
blazegears.renderFlash = function(id, filename, width, height, parameters) {
	if (!blazegears.is(parameters)) parameters = {};
	
	var result = "";
	
	result += "<!--[if !IE]>--><object data='" + filename + "' height='" + height + "' id='" + id + "' type='application/x-shockwave-flash' width='" + width + "'><!--<![endif]-->";
	result += "<!--[if IE]><object classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0' height='" + height + "' width='" + width + "' ><param name='movie' value='" + filename + "' /><![endif]-->";
	for (var i in parameters) {
		result += "<param name='" + i + "' value='" + parameters[i] + "' />";
	}
	result += "</object>";
	
	return result;
}

// Function: setEntityValue [Deprecated]
// This function is deprecated and its functionality will be completely removed. Sets the value of an entity created by <createEntity [Deprecated]>.
// 
// Arguments:
//   id - The ID of the entity.
// 
// Return Value:
//   Returns true if the entity with this ID was found, else false.
blazegears.setEntityValue = function(id, value) {
	var result = false;
	
	if (blazegears.is(blazegears._entities[id])) {
		blazegears._entities[id] = value;
		result = true;
	} else {
		blazegears.error("BlazeGears", "Entity doesn't exist!", id);
	}
	
	return result;
}

// Function: updateEntity [Deprecated]
// Alias for <setEntityValue [Deprecated]>.
blazegears.updateEntity = function(id, value) {
	return blazegears.setEntityValue(id, value);
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
		result = blazegears.isUndefined(default_value) ? 0 : default_value;
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

// Class: blazegears.Error
blazegears.Error = function(message, inner_error) {
	Error.call(this);
	this.message = blazegears.Error._composeMessage("An error occurred", message, inner_error);
	this.name = "blazegears.Error";
	this._inner_error = blazegears.isUndefined(inner_error) ? null : inner_error;
}
blazegears.Error.prototype = new Error();
blazegears.Error.prototype.constructor = blazegears.Error;

// Method: getInnerError
blazegears.Error.prototype.getInnerError = function() {
	return this._inner_error;
}

// composes the message for the error depending on if there's a message or inner error available
blazegears.Error._composeMessage = function(default_message, message, inner_error) {
	var result;
	
	if (blazegears.isUndefined(message) || message === null) {
		result = default_message;
		if (blazegears.isUndefined(inner_error) || inner_error === null) {
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

// Class: blazegears.ArgumentError
blazegears.ArgumentError = function(argument_name, message, inner_error) {
	blazegears.Error(this, message, inner_error);
	this.message = blazegears.Error._composeMessage("The <" + argument_name + "> argument is invalid", message, inner_error);
	this.name = "blazegears.ArgumentError";
	this._argument_name = argument_name;
}
blazegears.ArgumentError.prototype = new blazegears.Error();
blazegears.ArgumentError.prototype.constructor = blazegears.ArgumentError;

// Method: getArgumentName
blazegears.ArgumentError.prototype.getArgumentName = function() {
	return this._argument_name;
}

// generates the message for an invalid argument type
blazegears.ArgumentError._invalidArgumentType = function(argument_name, expected_type) {
	return new blazegears.ArgumentError(argument_name, "The <" + argument_name + "> argument is expected to be an instance of <" + expected_type + ">.");
}

// Class: blazegears.Event
blazegears.Event = function() {
	this._callbacks = [];
}

// Method: addCallback
blazegears.Event.prototype.addCallback = function(context, callback) {
	this._callbacks.push([context, callback]);
}

// Method: dispose
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

// Method: raise
blazegears.Event.prototype.raise = function() {
	var callbacks = this._callbacks;
	var callback_count = callbacks.length;
	var i;
	
	for (i = 0; i < callback_count; ++i) {
		callbacks[i][1].apply(callbacks[i][0], arguments);
	}
}

// Method: removeCallback
blazegears.Event.prototype.removeCallback = function(context, callback) {
	var callbacks = this._callbacks;
	var callback_count = callbacks.length;
	var i;
	
	for (i = 0; i < callback_count; ++i) {
		if (context === callbacks[i][0] && callback === callbacks[i][1]) {
			callbacks[i][0] = null;
			callbacks[i][1] = null;
			callbacks[i].length = 0;
			callbacks.splice(i, 1);
			break;
		}
	}
}

// Class: blazegears.NotOverriddenError
blazegears.NotOverriddenError = function(message, inner_error) {
	blazegears.Error(this, message, inner_error);
	this.message = blazegears.Error._composeMessage("This method has to be overridden by a child class", message, inner_error);
	this.name = "blazegears.NotOverriddenError";
	this._argument_name = argument_name;
}
blazegears.NotOverriddenError.prototype = new blazegears.Error();
blazegears.NotOverriddenError.prototype.constructor = blazegears.NotOverriddenError;

// Namespace: BlazeGears [Deprecated]
// Alias for <blazegears>.
BlazeGears = blazegears;

BlazeGears.StyleSheet("*[class|='BlazeGears'] .Clear", {
	clear: "both",
	height: "0px",
	overflow: "hidden"
});
