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
	// See Also: <BlazeGears.cloneArray>
	cloneArray: function(self, template) {
		return BlazeGears.cloneArray(template);
	},
	
	// Method: cloneObject
	// See Also: <BlazeGears.cloneObject>
	cloneObject: function(self, template) {
		return BlazeGears.cloneObject(template);
	},
	
	// Method: createEntity
	// See Also: <BlazeGears.createEntity>
	createEntity: function(self, value, id) {
		return BlazeGears.createEntity(value, id);
	},
	
	// Method: createListener
	// See Also: <BlazeGears.createListener>
	createListener: function(self, caller, event, callback) {
		BlazeGears.createListener(caller, event, callback);
	},
	
	// Method: destroyEntity
	// See Also: <BlazeGears.destroyEntity>
	destroyEntity: function(self, id) {
		return BlazeGears.destroyEntity(id);
	},
	
	// Method: destroyListener
	// See Also: <BlazeGears.destroyListener>
	destroyListener: function(self, caller, event, callback) {
		BlazeGears.destroyListener(caller, event, callback);
	},
	
	// Method: error
	// See Also: <BlazeGears.error>
	error: function(self, module, message, details) {
		BlazeGears.error(module, message, details);
	},
	
	// Method: escape
	// See Also: <BlazeGears.escape>
	escape: function(self, text, encoding) {
		return BlazeGears.escape(text, encoding);
	},
	
	// Method: escapeHtml
	// See Also: <BlazeGears.escapeHtml>
	escapeHtml: function(self, text, encoding) {
		return BlazeGears.escapeHtml(text, encoding);
	},
	
	// Method: generateFlash
	// See Also: <BlazeGears.generateFlash>
	generateFlash: function(self, id, filename, width, height, parameters) {
		return BlazeGears.generateFlash(id, filename, width, height, parameters);
	},
	
	// Method: getEntity
	// See Also: <BlazeGears.getEntity>
	getEntity: function(self, id) {
		return BlazeGears.getEntity(id);
	},
	
	// Method: getEntityValue
	// See Also: <BlazeGears.getEntityValue>
	getEntityValue: function(self, id) {
		return BlazeGears.getEntityValue(id);
	},
	
	// Method: includeCss
	// See Also: <BlazeGears.includeCss>
	includeCss: function(self, filename, media, once) {
		BlazeGears.includeCss(filename, media, once);
	},
	
	// Method: includeJs
	// See Also: <BlazeGears.includeJs>
	includeJs: function(self, filename, once) {
		BlazeGears.includeJs(filename, once);
	},
	
	// Method: is
	// See Also: <BlazeGears.is>
	is: function(self, variable) {
		return BlazeGears.is(variable);
	},
	
	// Method: isAnonymousObject
	// See Also: <BlazeGears.isAnonymousObject>
	isAnonymousObject: function(self, variable) {
		return BlazeGears.isAnonymousObject(variable);
	},
	
	// Method: isArray
	// See Also: <BlazeGears.isArray>
	isArray: function(self, variable) {
		return BlazeGears.isArray(variable);
	},
	
	// Method: isDate
	// See Also: <BlazeGears.isDate>
	isDate: function(self, variable) {
		return BlazeGears.isDate(variable);
	},
	
	// Method: isFunction
	// See Also: <BlazeGears.isFunction>
	isFunction: function(self, variable) {
		return BlazeGears.isFunction(variable);
	},
	
	// Method: isInArray
	// See Also: <BlazeGears.isInArray>
	isInArray: function(self, value, array) {
		return BlazeGears.isInArray(value, array);
	},
	
	// Method: isNumber
	// See Also: <BlazeGears.isNumber>
	isNumber: function(self, variable) {
		return BlazeGears.isNumber(variable);
	},
	
	// Method: isObject
	// See Also: <BlazeGears.isObject>
	isObject: function(self, variable) {
		return BlazeGears.isObject(variable);
	},
	
	// Method: isRegExp
	// See Also: <BlazeGears.isRegExp>
	isRegExp: function(self, variable) {
		return BlazeGears.isRegExp(variable);
	},
	
	// Method: isString
	// See Also: <BlazeGears.isString>
	isString: function(self, variable) {
		return BlazeGears.isString(variable);
	},
	
	// Method: renderFlash
	// See Also: <BlazeGears.renderFlash>
	renderFlash: function(self, id, filename, width, height, parameters) {
		return BlazeGears.renderFlash(id, filename, width, height, parameters);
	},
	
	// Method: setEntityValue
	// See Also: <BlazeGears.setEntityValue>
	setEntityValue: function(self, id, value) {
		BlazeGears.setEntityValue(id, value);
	},
	
	// Method: updateEntity
	// See Also: <BlazeGears.updateEntity>
	updateEntity: function(self, id, value) {
		BlazeGears.updateEntity(id, value);
	}
});
