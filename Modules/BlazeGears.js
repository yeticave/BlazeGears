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
Class: BlazeGears

The main namespace that contains all the general BlazeGears functions.
*/
BlazeGears = new function() {
	var self = this;
	var entities = {};
	var included_css = [];
	var included_js = [];
	
	/*
	Variable: config
	
	The main configurational dictionary.
	
	Keys:
		display_errors - If it's true, <error> will display the messages on-screen. Defaults to false.
		entity_id_length - The length of the IDs used for entities. Defaults to 10.
		entity_id_prefix - This prefix will be applied to every entity ID to avoid clashes. It doesn't count towards the length of the ID. Defaults to "blazegears_entity_".
		escape_encoding - The default encoding used by <escapeString>. Defaults to "html".
	*/
	self.config = {
		display_errors: false,
		entity_id_length: 10,
		entity_id_prefix: "blazegears_entity_",
		escape_encoding: "html"
	};
	
	/*
	Function: Class
	
	A depreciated alias for <BlazeGears.Classes.declareClass>.
	*/
	self.Class = function() {
		return BlazeGears.Classes.declareClass.apply(self, arguments);
	}
	
	/*
	Function: Singleton
	
	A depreciated alias for <BlazeGears.Classes.declareSingleton>.
	*/
	self.Singleton = function() {
		return BlazeGears.Classes.declareSingleton.apply(self, arguments);
	}
	
	/*
	Function: StyleSheet
	
	Generates and outputs a style sheet.
	
	Arguments:
		selector - The selector of the style sheet. An array of selectors can also be provided.
		properties - A dictionary of properties.
		[media = "all"] - The media property of the style sheet.
	*/
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
	
	/*
	Function: cloneArray
	
	A depreciated alias for <cloneObject>.
	*/
	self.cloneArray = function(source) {
		return self.cloneObject(source);
	}
	
	/*
	Function: cloneObject
	
	Creates an exact copy of an object.
	
	Arguments:
		source - The object to be cloned.
	
	Return Value:
		Returns a reference to the newly created object.
	*/
	self.cloneObject = function(source) {
		var clone = self.isArray(source) ? [] : {};
		
		for (i in source) {
			if (source[i] && self.isObject(source[i]) && source[i] != null) {
				clone[i] = self.cloneObject(source[i]);
			} else {
				clone[i] = source[i];
			}
		}
		
		return clone;
	}
	
	/*
	Function: createEntity
	
	Creates a variable and stores it internally.
	
	Arguments:
		[value = null] - The value that initially will be associated with the entity.
		[id = null] - The suggested ID for the entity.
	
	Return Value:
		Returns the ID of the entity or null if the suggested ID is already in use.
	
	See Also:
		- <destroyEntity>
		- <getEntity>
		- <updateEntity>
		- <config>.entity_id_length
		- <config>.entity_id_prefix
	*/
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
	
	/*
	Function: createListener
	
	Creates a cross-browser event listener.
	
	Arguments:
		caller - The listener will be attached to this element.
		event - The name of the event without the "on" prefix.
		command - The command to be executed upon the event.
	
	See Also:
		<destroyListener>
	*/
	self.createListener = function(caller, event, command) {
		if (caller.addEventListener) {
			caller.addEventListener(event, command, false);
		} else if (caller.attachEvent) {
			caller.attachEvent("on" + event, command);
		} else {
			eval("caller.on" + event + " = command;");
		}
	}
	
	/*
	Function: destroyEntity
	
	Destroys a previously created entity.
	
	Arguments:
		id - The ID of the entity.
	
	Return Value:
		Returns true if the entity with this ID was found and destroyed, else false.
	
	See Also:
		- <createEntity>
		- <getEntity>
		- <updateEntity>
	*/
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
	
	/*
	Function: destroyListener
	
	Destroys an event listener.
	
	Arguments:
		All parameters must match the ones used to create the event listener.
	
	See Also:
		<createListener>
	*/
	self.destroyListener = function(caller, event, command) {
		if (caller.removeEventListener) {
			caller.removeEventListener(event, command, false);
		} else if (caller.detachEvent) {
			caller.detachEvent("on" + event, command);
		} else {
			eval("delete caller.on" + event + ";");
		}
	}
	
	/*
	Function: error
	
	Logs and/or displays an error message.
	
	Arguments:
		module - The name of the module that issues the error message.
		[message = null] - The message itself.
		[details = null] - Additional details.
	
	See Also:
		<config>.display_errors
	*/
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
	
	/*
	Function: escape
	
	A depreciated alias for <escapeString>.
	*/
	self.escape = function(text, encoding) {
		return self.escapeString(text, encoding);
	}
	
	/*
	Function: escapeString
	
	Escapes a string based on the selected encoding.
	
	Arguments:
		text - The string to be escaped.
		[encoding] - The encoding to be used. If not provided, <config>.escape_encoding will be used.
	
	Return Value:
		Returns the escaped string.
	
	Encodings:
		html - Only escapes HTML control characters.
		newlines - Only escapes the carriage return and new line characters.
		utf-8 - All non-ASCII and HTML control characters will be escaped.
	*/
	self.escapeString = function(text, encoding) {
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
			// select the encoding characters
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
			
			// check all the characters for match with the encoding array
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
	
	/*
	Function: generateFlash
	
	A depreciated alias for <renderFlash>.
	*/
	self.generateFlash = function(id, filename, width, height, parameters) {
		return self.renderFlash(id, filename, width, height, parameters);
	}
	
	/*
	Function: getEntity
	
	Returns the value associated with an entity.
	
	Arguments:
		id - The ID of the entity.
	
	Return Value:
		Returns the value of the entity, or null if the entity doesn't exist.
	
	See Also:
		- <createEntity>
		- <destroyEntity>
		- <updateEntity>
	*/
	self.getEntity = function(id) {
		if (self.is(entities[id])) {
			return entities[id];
		} else {
			return null;
		}
	}
	
	/*
	Function: includeCss
	
	Generates an element in the heading of the document for a CSS link.
	
	Arguments:
		filename - The filename of the CSS file. An array of filenames can also be provided.
		[media = "all"] - The media property of the CSS link.
		[once = true] - If it's true, the same filename won't be imported more than once.
	*/
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
	
	/*
	Function: includeJs
	
	Generates the HTML code for including a JavaScript file and outputs it.
	
	Arguments:
		filename - The filename of the JavaScript file. An array of filenames can also be provided.
		[once = true] - If it's true, the same filename won't be imported more than once.
	*/
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
				document.write("<script src='" + self.escapeString(filename) + "' type='text/javascript'></script>");
			}
		}
	}
	
	/*
	Function: is
	
	Checks if a variable is undefined.
	
	Arguments:
		variable - The variable to be checked.
	
	Return Value:
		Returns true if the variable is not undefined, else false.
	*/
	self.is = function(variable) {
		return typeof variable != "undefined";
	}
	
	/*
	Function: isArray
	
	Checks if a variable is an array.
	
	Arguments:
		variable - The variable to be checked.
	
	Return Value:
		Returns true if the the variable is an array, else false.
	*/
	self.isArray = function(variable) {
		return isConstructOf(variable, "Array");
	}
	
	/*
	Function: isDate
	
	Checks if a variable is a date object.
	
	Arguments:
		variable - The variable to be checked.
	
	Return Value:
		Returns true if the the variable is a date object, else false.
	*/
	self.isDate = function(variable) {
		return isConstructOf(variable, "Date");
	}
	
	/*
	Function: isFunction
	
	Checks if a variable is a function.
	
	Arguments:
		variable - The variable to be checked.
	
	Return Value:
		Returns true if the the variable is a function, else false.
	*/
	self.isFunction = function(variable) {
		return isConstructOf(variable, "Function");
	}
	
	/*
	Function: isInArray
	
	Recursively checks if a value exists in an array.
	
	Arguments:
		value - The value to look for.
		array - The array to search in.
		[recursion = true] - If it's true, the sub-arrays of the original one will also be searched.
	
	Return Value:
		Returns true if the value is the array or one of its' sub-arrays (if recursion is enabled), else false.
	*/
	self.isInArray = function(value, array, recursion) {
		if (!self.is(recursion)) recursion = true;
		
		var result = false;
		
		if (self.isArray(value) && recursion) {
			for (var i in value) {
				if (self.isInArray(value[i], array)) {
					result = true;
					break;
				}
			}
		} else {
			for (var i in array) {
				if (array[i] == value) {
					result = true;
					break;
				}
			}
		}
		
		return result;
	}
	
	/*
	Function: isNumber
	
	Checks if a variable is a number.
	
	Arguments:
		variable - The variable to be checked.
	
	Return Value:
		Returns true if the the variable is a number, else false.
	*/
	self.isNumber = function(variable) {
		return isConstructOf(variable, "Number");
	}
	
	/*
	Function: isObject
	
	Checks if a variable is an object.
	
	Arguments:
		variable - The variable to be checked.
	
	Return Value:
		Returns true if the the variable is an object, else false.
	*/
	self.isObject = function(variable) {
		return variable != null && isConstructOf(variable, "Object");
	}
	
	/*
	Function: isRegExp
	
	Checks if a variable is a regular expression.
	
	Arguments:
		variable - The variable to be checked.
	
	Return Value:
		Returns true if the the variable is a regular expression, else false.
	*/
	self.isRegExp = function(variable) {
		return isConstructOf(variable, "RegExp");
	}
	
	/*
	Function: isString
	
	Checks if a variable is a string.
	
	Arguments:
		variable - The variable to be checked.
	
	Return Value:
		Returns true if the the variable is a string, else false.
	*/
	self.isString = function(variable) {
		return isConstructOf(variable, "String");
	}
	
	/*
	Function: renderFlash
	
	Generates the cross-browser HTML code for a Flash application.
	
	Arguments:
		id - The ID value for the OBJECT tag of the application.
		filename - The filename of the application.
		width - The width of the application.
		height - The height of the application.
		[parameters = {}] - A dictionary that defines the parameters for the application. The keys will be used as the names of the parameters.
	
	Return Value:
		Returns the generated HTML code.
	*/
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
	
	/*
	Function: updateEntity
	
	Changes the value of an entity.
	
	Arguments:
		id - The ID of the entity.
	
	Return Value:
		Returns true if the entity with this ID was found and modified, else false.
	
	See Also:
		- <createEntity>
		- <destroyEntity>
		- <getEntity>
	*/
	self.updateEntity = function(id, value) {
		var result = false;
		
		if (self.is(entities[id])) {
			entities[id] = value;
			result = true;
		} else {
			self.error("BlazeGears", "Entity doesn't exist!", id);
		}
		
		return result;
	}
	
	var isConstructOf = function(variable, constructor) {
		var result = false;
		
		if (variable != null) {
			if (variable.constructor) {
				result = variable.constructor.toString().indexOf(constructor) != -1;
			} else if (typeof variable == constructor.toString().toLowerCase()) {
				result = true;
			}
		}
		
		return result;
	}
}

BlazeGears.StyleSheet("*[class|='BlazeGears'] .Clear", {
	clear: "both",
	height: "0px",
	overflow: "hidden"
});
