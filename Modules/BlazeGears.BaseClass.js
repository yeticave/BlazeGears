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

// Class: BlazeGears.BaseClass
// A class that wraps all the functions from the <BlazeGears> namespace into a class context.
BlazeGears.BaseClass = BlazeGears.Classes.declareClass({
	// Method: cloneArray
	cloneArray: function(self, source) {
		return BlazeGears.cloneArray(source);
	},
	
	// Method: cloneObject
	cloneObject: function(self, source) {
		return BlazeGears.cloneObject(source);
	},
	
	// Method: createEntity
	createEntity: function(self, value, id) {
		return BlazeGears.createEntity(value, id);
	},
	
	// Method: createListener
	createListener: function(self, caller, event, command) {
		BlazeGears.createListener(caller, event, command);
	},
	
	// Method: destroyEntity
	destroyEntity: function(self, id) {
		return BlazeGears.destroyEntity(id);
	},
	
	// Method: destroyListener
	destroyListener: function(self, caller, event, command) {
		BlazeGears.destroyListener(caller, event, command);
	},
	
	// Method: error
	error: function(self, module, message, details) {
		BlazeGears.error(module, message, details);
	},
	
	// Method: escape
	escape: function(self, text, encoding) {
		return BlazeGears.escape(text, encoding);
	},
	
	// Method: escapeString
	escapeString: function(self, text, encoding) {
		return BlazeGears.escapeString(text, encoding);
	},
	
	// Method: generateFlash
	generateFlash: function(self, id, filename, width, height, parameters) {
		return BlazeGears.generateFlash(id, filename, width, height, parameters);
	},
	
	// Method: getEntity
	getEntity: function(self, id) {
		return BlazeGears.getEntity(id);
	},
	
	// Method: includeCss
	includeCss: function(self, filename, media, once) {
		BlazeGears.includeCss(filename, media, once);
	},
	
	// Method: includeJs
	includeJs: function(self, filename, once) {
		BlazeGears.includeJs(filename, once);
	},
	
	// Method: is
	is: function(self, variable) {
		return BlazeGears.is(variable);
	},
	
	// Method: isArray
	isArray: function(self, variable) {
		return BlazeGears.isArray(variable);
	},
	
	// Method: isDate
	isDate: function(self, variable) {
		return BlazeGears.isDate(variable);
	},
	
	// Method: isFunction
	isFunction: function(self, variable) {
		return BlazeGears.isFunction(variable);
	},
	
	// Method: isInArray
	isInArray: function(self, value, array) {
		return BlazeGears.isInArray(value, array);
	},
	
	// Method: isNumber
	isNumber: function(self, variable) {
		return BlazeGears.isNumber(variable);
	},
	
	// Method: isObject
	isObject: function(self, variable) {
		return BlazeGears.isObject(variable);
	},
	
	// Method: isRegExp
	isRegExp: function(self, variable) {
		return BlazeGears.isRegExp(variable);
	},
	
	// Method: isString
	isString: function(self, variable) {
		return BlazeGears.isString(variable);
	},
	
	// Method: renderFlash
	renderFlash: function(self, id, filename, width, height, parameters) {
		return BlazeGears.renderFlash(id, filename, width, height, parameters);
	},
	
	// Method: updateEntity
	updateEntity: function(self, id, value) {
		BlazeGears.updateEntity(id, value);
	}
});
