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

// Class: BlazeGears.BaseClass [Deprecated]
// This class is deprecated and its functionality will be completely removed. Wraps all the functions from the <blazegears> namespace into a class context.
BlazeGears.BaseClass = BlazeGears.Classes.declareClass({
	// Method: cloneArray
	// See Also: <blazegears.cloneArray [Deprecated]>
	cloneArray: function(self, template) {
		return BlazeGears.cloneArray(template);
	},
	
	// Method: cloneObject
	// See Also: <blazegears.cloneObject [Deprecated]>
	cloneObject: function(self, template) {
		return BlazeGears.cloneObject(template);
	},
	
	// Method: createEntity
	// See Also: <blazegears.createEntity [Deprecated]>
	createEntity: function(self, value, id) {
		return BlazeGears.createEntity(value, id);
	},
	
	// Method: createListener
	// See Also: <blazegears.createListener [Deprecated]>
	createListener: function(self, caller, event, callback) {
		BlazeGears.createListener(caller, event, callback);
	},
	
	// Method: destroyEntity
	// See Also: <blazegears.destroyEntity [Deprecated]>
	destroyEntity: function(self, id) {
		return BlazeGears.destroyEntity(id);
	},
	
	// Method: destroyListener
	// See Also: <blazegears.destroyListener [Deprecated]>
	destroyListener: function(self, caller, event, callback) {
		BlazeGears.destroyListener(caller, event, callback);
	},
	
	// Method: error
	// See Also: <blazegears.error [Deprecated]>
	error: function(self, module, message, details) {
		BlazeGears.error(module, message, details);
	},
	
	// Method: escape
	// See Also: <blazegears.escape [Deprecated]>
	escape: function(self, text, encoding) {
		return BlazeGears.escape(text, encoding);
	},
	
	// Method: escapeHtml
	// See Also: <blazegears.escapeHtml>
	escapeHtml: function(self, text, encoding) {
		return BlazeGears.escapeHtml(text, encoding);
	},
	
	// Method: generateFlash
	// See Also: <blazegears.generateFlash [Deprecated]>
	generateFlash: function(self, id, filename, width, height, parameters) {
		return BlazeGears.generateFlash(id, filename, width, height, parameters);
	},
	
	// Method: getEntity
	// See Also: <blazegears.getEntity [Deprecated]>
	getEntity: function(self, id) {
		return BlazeGears.getEntity(id);
	},
	
	// Method: getEntityValue
	// See Also: <blazegears.getEntityValue [Deprecated]>
	getEntityValue: function(self, id) {
		return BlazeGears.getEntityValue(id);
	},
	
	// Method: includeCss
	// See Also: <blazegears.includeCss [Deprecated]>
	includeCss: function(self, filename, media, once) {
		BlazeGears.includeCss(filename, media, once);
	},
	
	// Method: includeJs
	// See Also: <blazegears.includeJs [Deprecated]>
	includeJs: function(self, filename, once) {
		BlazeGears.includeJs(filename, once);
	},
	
	// Method: is
	// See Also: <blazegears.is [Deprecated]>
	is: function(self, variable) {
		return BlazeGears.is(variable);
	},
	
	// Method: isAnonymousObject
	// See Also: <blazegears.isAnonymousObject>
	isAnonymousObject: function(self, variable) {
		return BlazeGears.isAnonymousObject(variable);
	},
	
	// Method: isArray
	// See Also: <blazegears.isArray>
	isArray: function(self, variable) {
		return BlazeGears.isArray(variable);
	},
	
	// Method: isDate
	// See Also: <blazegears.isDate>
	isDate: function(self, variable) {
		return BlazeGears.isDate(variable);
	},
	
	// Method: isFunction
	// See Also: <blazegears.isFunction>
	isFunction: function(self, variable) {
		return BlazeGears.isFunction(variable);
	},
	
	// Method: isInArray
	// See Also: <blazegears.isInArray [Deprecated]>
	isInArray: function(self, value, array) {
		return BlazeGears.isInArray(value, array);
	},
	
	// Method: isNumber
	// See Also: <blazegears.isNumber>
	isNumber: function(self, variable) {
		return BlazeGears.isNumber(variable);
	},
	
	// Method: isObject
	// See Also: <blazegears.isObject [Deprecated]>
	isObject: function(self, variable) {
		return BlazeGears.isObject(variable);
	},
	
	// Method: isRegExp
	// See Also: <blazegears.isRegExp>
	isRegExp: function(self, variable) {
		return BlazeGears.isRegExp(variable);
	},
	
	// Method: isString
	// See Also: <blazegears.isString>
	isString: function(self, variable) {
		return BlazeGears.isString(variable);
	},
	
	// Method: renderFlash
	// See Also: <blazegears.renderFlash [Deprecated]>
	renderFlash: function(self, id, filename, width, height, parameters) {
		return BlazeGears.renderFlash(id, filename, width, height, parameters);
	},
	
	// Method: setEntityValue
	// See Also: <blazegears.setEntityValue [Deprecated]>
	setEntityValue: function(self, id, value) {
		BlazeGears.setEntityValue(id, value);
	},
	
	// Method: updateEntity
	// See Also: <blazegears.updateEntity [Deprecated]>
	updateEntity: function(self, id, value) {
		BlazeGears.updateEntity(id, value);
	}
});
