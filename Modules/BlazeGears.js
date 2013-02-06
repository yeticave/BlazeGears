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
blazegears = new function() {
	var self = this;
	var entities = {}; // stores the declared entities
	var included_css = []; // stores the list of included css files
	var included_js = []; // stores the list of included javascript files
	
	// Variable: config [Deprecated]
	// This variable is deprecated and its functionality will be completely removed. The dictionary that's used for configuration.
	// 
	// Keys:
	//   display_errors - If it's true, <error [Deprecated]> will display an alert window whenever it's called. Defaults to false.
	//   entity_id_length - The length of the random IDs used for entities. Defaults to 10.
	//   entity_id_prefix - This prefix will be applied to every random entity ID to avoid clashes with other IDs. It doesn't count towards the length of the ID. Defaults to "blazegears_entity_".
	//   escape_encoding - The default escaping method used by <escapeHtml>. Defaults to "html".
	self.config = {
		display_errors: false,
		entity_id_length: 10,
		entity_id_prefix: "blazegears_entity_",
		escape_encoding: "html"
	};
	
	// Function: Class [Deprecated]
	// Alias for <BlazeGears.Classes [Deprecated].declareClass>.
	self.Class = function() {
		return BlazeGears.Classes.declareClass.apply(self, arguments);
	}
	
	// Function: Singleton [Deprecated]
	// Alias for <BlazeGears.Classes [Deprecated].declareSingleton>.
	self.Singleton = function() {
		return BlazeGears.Classes.declareSingleton.apply(self, arguments);
	}
	
	// Function: StyleSheet [Deprecated]
	// This function is deprecated and its functionality will be completely removed. Generates and outputs the markup for a style sheet.
	// 
	// Arguments:
	//   selector - The selector of the style sheet. Also accepts an array of selectors.
	//   properties - A dictionary where the keys are the CSS properties' names.
	//   [media = "all"] - The media attribute of the style sheet.
	self.StyleSheet = function(selector, properties, media) {
		if (!self.is(media)) media = "all";
		
		var result = "<style media='" + media + "' type='text/css'>";
		var selectors = "";
		
		if (self.isArray(selector)) {
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
	self.cloneArray = function(template) {
		return self.cloneObject(template);
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
	self.cloneObject = function(template) {
		var clone = self.isArray(template) ? [] : {};
		
		for (var i in template) {
			if (template[i] && self.isAnonymousObject(template[i]) && template[i] != null) {
				clone[i] = self.cloneObject(template[i]);
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
	self.createEntity = function(value, id) {
		if (!self.is(id)) id = null;
		if (!self.is(value)) value = null;
		
		var result = null;
		var unique;
		
		if (id == null) {
			do {
				id = "";
				unique = true;
				for (var i = 1; i <= self.config.entity_id_length; i++) {
					id += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
				}
				id = self.config.entity_id_prefix + id;
				if (self.is(entities[id]) || document.getElementById(id) != null) {
					unique = false;
				}
			} while (!unique);
			entities[id] = value;
			result = id;
		} else {
			if (!self.is(entities[id])) {
				entities[id] = value;
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
	self.createListener = function(caller, event, callback) {
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
	self.destroyEntity = function(id) {
		var result = false;
		
		if (self.is(entities[id])) {
			delete entities[id];
			result = true;
		} else {
			self.error("BlazeGears", "Entity doesn't exist!", id);
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
	self.destroyListener = function(caller, event, callback) {
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
	self.error = function(module, message, details) {
		if (!self.is(message)) message = null;
		if (!self.is(details)) details = null;
		
		if (self.config.display_errors) {
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
	self.escape = function(text, encoding) {
		return self.escapeHtml(text, encoding);
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
	self.escapeHtml = function(text, encoding) {
		if (!self.is(encoding)) encoding = self.config.escape_encoding;
		
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
				
				if (self.is(entities[code])) {
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
	self.generateFlash = function(id, filename, width, height, parameters) {
		return self.renderFlash(id, filename, width, height, parameters);
	}
	
	// Function: getEntity [Deprecated]
	// Alias for <getEntityValue [Deprecated]>.
	self.getEntity = function(id) {
		return self.getEntityValue(id);
	}
	
	// Function: getEntityValue [Deprecated]
	// This function is deprecated and its functionality will be completely removed. Returns the value of an entity created by <createEntity [Deprecated]>.
	// 
	// Arguments:
	//   id - The ID of the entity.
	// 
	// Return Value:
	//   Returns the value of the entity, or null, if the entity doesn't exist.
	self.getEntityValue = function(id) {
		if (self.is(entities[id])) {
			return entities[id];
		} else {
			return null;
		}
	}
	
	// Function: includeCss [Deprecated]
	// This function is deprecated and its functionality will be completely removed. Generates a link element in the head of the document for including a CSS file.
	// 
	// Arguments:
	//   filename - The file name of the CSS file. Also accepts an array of file names.
	//   [media = "all"] - The media attribute of the CSS link.
	//   [once = true] - If it's true, the same file won't be included more than once.
	self.includeCss = function(filename, media, once) {
		if (!self.is(media)) media = "all";
		if (!self.is(once)) once = true;
		
		var element;
		var head;
		var included = false;
		
		if (self.isArray(filename)) {
			// process the filenames if there's more than one
			for (var i in filename) {
				self.includeCss(filename[i], media, once);
			}
		} else {
			// check if the file was included before
			for (var i in included_css) {
				if (included_css[i] == filename) {
					included = true;
					break;
				}
			}
			
			// register the inclusion and create the element
			if (!included) {
				if (once) {
					included_css.push(filename);
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
	self.includeJs = function(filename, once) {
		if (!self.is(once)) once = true;
		
		var included = false;
		
		if (self.isArray(filename)) {
			// process the filenames if there's more than one
			for (var i in filename) {
				self.includeJs(filename[i]);
			}
		} else {
			// check if the file was included before
			for (var i in included_js) {
				if (included_js[i] == filename) {
					included = true;
					break;
				}
			}
			
			// register the inclusion and create the element
			if (!included) {
				if (once) {
					included_js.push(filename);
				}
				document.write("<script src='" + self.escapeHtml(filename) + "' type='text/javascript'></script>");
			}
		}
	}
	
	// Function: is [Deprecated]
	// Alias for <isDefined>.
	self.is = function(variable) {
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
	self.isAnonymousObject = function(variable) {
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
	self.isArray = function(variable) {
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
	self.isBoolean = function(variable) {
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
	self.isDate = function(variable) {
		return variable instanceof Date
	}
	
	// Function: isDefined
	// Determines if a variable is not undefined.
	// 
	// Arguments:
	//   variable - The variable to be checked.
	// 
	// Return Value:
	//   Returns true if the variable is not undefined, else false.
	self.isDefined = function(variable) {
		return typeof variable != "undefined";
	}
	
	// Function: isFunction
	// Determines if a variable is a function.
	// 
	// Arguments:
	//   variable - The variable to be checked.
	// 
	// Return Value:
	//   Returns true if the variable is a function, else false.
	self.isFunction = function(variable) {
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
	self.isInArray = function(needle, haystack, recursion) {
		if (!self.is(recursion)) recursion = true;
		
		var result = false;
		
		for (var i in haystack) {
			if ((self.isArray(haystack[i]) && self.isInArray(needle, haystack[i]) && recursion) || haystack[i] == needle) {
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
	self.isNumber = function(variable) {
		return variable instanceof Number || typeof variable == "number";
	}
	
	// Function: isObject [Deprecated]
	// Alias for <isAnonymousObject>.
	self.isObject = function(variable) {
		return self.isAnonymousObject(variable);
	}
	
	// Function: isRegExp
	// Determines if a variable is a regular expression.
	// 
	// Arguments:
	//   variable - The variable to be checked.
	// 
	// Return Value:
	//   Returns true if the variable is a regular expression, else false.
	self.isRegExp = function(variable) {
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
	self.isString = function(variable) {
		return variable instanceof String || typeof variable == "string";
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
	self.renderFlash = function(id, filename, width, height, parameters) {
		if (!self.is(parameters)) parameters = {};
		
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
	self.setEntityValue = function(id, value) {
		var result = false;
		
		if (self.is(entities[id])) {
			entities[id] = value;
			result = true;
		} else {
			self.error("BlazeGears", "Entity doesn't exist!", id);
		}
		
		return result;
	}
	
	// Function: updateEntity [Deprecated]
	// Alias for <setEntityValue [Deprecated]>.
	self.updateEntity = function(id, value) {
		return self.setEntityValue(id, value);
	}
}

// Class: blazegears.NotOverridenError
// The exception that will be thrown if a non-overridden abstract method gets called.
blazegears.NotOverridenError = function() {
	this.message = "This method has to be overridden by child class before it could be used.";
	this.name = "blazegears.NotOverridenError";
}
blazegears.NotOverridenError.prototype = new Error();
blazegears.NotOverridenError.prototype.constructor = blazegears.NotOverridenError;

// Namespace: BlazeGears [Deprecated]
// Alias for <blazegears>.
BlazeGears = blazegears;

BlazeGears.StyleSheet("*[class|='BlazeGears'] .Clear", {
	clear: "both",
	height: "0px",
	overflow: "hidden"
});
