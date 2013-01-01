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

// Class: BlazeGears.Form
// A class that represents an HTML form in an object-oriented way.
// 
// Superclasses:
//   <BlazeGears.BaseClass>
// 
// Dependencies:
//   <BlazeGears.BGTL>
BlazeGears.Form = BlazeGears.Classes.declareClass(BlazeGears.BaseClass, {
	// Field: action
	// The action attribute of the form.
	action: "",
	
	// Field: attribs
	// A dictionary where the keys will be HTML attributes of the form.
	attribs: {
		"class": "BlazeGears-Form",
		"method": "post"
	},
	
	// Field: element
	// The element which the form will be injected into. It can be either an ID or a reference to an actual element.
	element: null,
	
	// Field: events
	// A dictionary where the keys will be events of the form. The "on" prefix will be applied to the keys automatically.
	events: {},
	
	// Field: templates
	// A dictionary where the keys are the name of the templates and the values are the BGTL templates for the fields whose type matches the key.
	// 
	// Notes:
	//   The form's attributes, events, and text collection will be passed to the template during rendering.
	// 
	// See Also:
	//   <BlazeGears.BGTL>
	templates: {button: "...", hidden: "...", password: "...", radios: "...", select: "...", submit: "...", text: "...", textarea: "..."},
	
	// Field: texts
	// A dictionary where the keys are the name of the text collections and the values are the text collections for the fields whose type matches the key.
	texts: {},
	
	// having all this text in the documentation would have been pretty ugly, this way the shorter version will be displayed, while the correct version will be used
	templates: {
		button: "<div class='Field'> <div class='Button'> <input id='{{getElementId()}}' name='{{getId()}}' type='button' value='{{value}}' %for (var i in attribs) {% {{i}}='{{attribs[i]}}' %}% %for (var i in events) {% on{{i}}='{{events[i]}}' %}% /> </div> </div>",
		checks: "<div class='Field'> <div class='Valid' id='{{getElementId()}}_valid'></div> <div class='Invalid' id='{{getElementId()}}_invalid'></div> <label class='Label' for='{{getElementId()}}'>{{label}}</label> <div class='Input'> %var options = getOptions();% %for (var i in options) {% <div> <input id='{{options[i].getElementId()}}' name='{{options[i].getId()}}' type='checkbox' value='{{options[i].value}}' %if (options[i].selected || options[i].value == value) {% checked='checked' %}% %for (var j in options[i].attribs) {% {{j}}='{{options[i].attribs[j]}}' %}% %for (var j in options[i].events) {% on{{j}}='{{options[i].events[j]}}' %}% /> <label for='{{options[i].getElementId()}}'>{{options[i].label}}</label> </div> %}% </div> <div class='Clear'></div> </div>",
		hidden: "<div><input id='{{getElementId()}}' name='{{getId()}}' value='{{value}}' type='hidden' /></div>",
		password: "<div class='Field'> <div class='Valid' id='{{getElementId()}}_valid'></div> <div class='Invalid' id='{{getElementId()}}_invalid'></div> <label class='Label' for='{{getElementId()}}'>{{label}}</label> <div class='Input'> <input id='{{getElementId()}}' name='{{getId()}}' type='password' value='{{value}}' %for (var i in attribs) {% {{i}}='{{attribs[i]}}' %}% %for (var i in events) {% on{{i}}='{{events[i]}}' %}% /> </div> <div class='Clear'></div> </div>",
		radios: "<div class='Field'> <div class='Valid' id='{{getElementId()}}_valid'></div> <div class='Invalid' id='{{getElementId()}}_invalid'></div> <label class='Label' for='{{getElementId()}}'>{{label}}</label> <div class='Input'> %var options = getOptions();% %for (var i in options) {% <div> <input id='{{options[i].getElementId()}}' name='{{getId()}}' type='radio' value='{{options[i].value}}' %if (options[i].selected || options[i].value == value) {% checked='checked' %}% %for (var j in options[i].attribs) {% {{j}}='{{options[i].attribs[j]}}' %}% %for (var j in options[i].events) {% on{{j}}='{{options[i].events[j]}}' %}% /> <label for='{{options[i].getElementId()}}'>{{options[i].label}}</label> </div> %}% </div> <div class='Clear'></div> </div>",
		select: "<div class='Field'> <div class='Valid' id='{{getElementId()}}_valid'></div> <div class='Invalid' id='{{getElementId()}}_invalid'></div> <label class='Label' for='{{getElementId()}}'>{{label}}</label> <div class='Input'> <select id='{{getElementId()}}' name='{{getId()}}' %for (var i in attribs) {% {{i}}='{{attribs[i]}}' %}% %for (var i in events) {% on{{i}}='{{events[i]}}' %}% > %var options = getOptions();% %for (var i in options) {% <option id='{{options[i].getElementId()}}' value='{{options[i].value}}' %if (options[i].selected || options[i].value == value) {% selected='selected' %}% %for (var j in options[i].attribs) {% {{j}}='{{options[i].attribs[j]}}' %}% %for (var j in options[i].events) {% on{{j}}='{{options[i].events[j]}}' %}% > {{options[i].label}} </option> %}% </select> </div> <div class='Clear'></div> </div>",
		submit: "<div class='Field'> <div class='Button'> <input id='{{getElementId()}}' name='{{getId()}}' type='submit' value='{{value}}' %for (var i in attribs) {% {{i}}='{{attribs[i]}}' %}% %for (var i in events) {% on{{i}}='{{events[i]}}' %}% /> </div> </div>",
		text: "<div class='Field'> <div class='Valid' id='{{getElementId()}}_valid'></div> <div class='Invalid' id='{{getElementId()}}_invalid'></div> <label class='Label' for='{{getElementId()}}'>{{label}}</label> <div class='Input'> <input id='{{getElementId()}}' name='{{getId()}}' type='text' value='{{value}}' %for (var i in attribs) {% {{i}}='{{attribs[i]}}' %}% %for (var i in events) {% on{{i}}='{{events[i]}}' %}% /> </div> <div class='Clear'></div> </div>",
		textarea: "<div class='Field'> <div class='Valid' id='{{getElementId()}}_valid'></div> <div class='Invalid' id='{{getElementId()}}_invalid'></div> <label class='Label' for='{{getElementId()}}'>{{label}}</label> <div class='Input'> <textarea cols='{{columns}}' id='{{getElementId()}}' name='{{getId()}}' rows='{{rows}}' type='text' %for (var i in attribs) {% {{i}}='{{attribs[i]}}' %}% %for (var i in events) {% on{{i}}='{{events[i]}}' %}% >{{value}}</textarea> </div> <div class='Clear'></div> </div>"
	},
	
	_bgtl: null,
	_fields: [],
	_id: null,
	_templates: {},
	
	// Method: createField
	// Adds a field to the form.
	// 
	// Arguments:
	//   id - The ID and name of the field. This must be an unique value for this form.
	//   [type = "text"] - Decides which keys the field will try to use from the <templates> and <texts> dictionaries upon generation.
	// 
	// Return Value:
	//   Returns the field object, if it was successfully created, else null.
	// 
	// Field Types:
	//   button - Center aligned button without a label.
	//   checks - A group of checkboxes. Uses <BlazeGears.Form.Field.createOption>.
	//   hidden - Hidden input field.
	//   radios - A group of radio buttons. Uses <BlazeGears.Form.Field.createOption>.
	//   select - Select list. Uses <BlazeGears.Form.Field.createOption>.
	//   submit - Center aligned submit button without a label.
	//   text - Single-line textbox.
	//   textarea - Multiline textbox.
	// 
	// See Also:
	//   <BlazeGears.Form.Field>
	createField: function(self, id, type) {
		if (!self.is(type)) type = "text";
		
		var result = null;
		
		if (self.getField(id) == null) {
			result = new BlazeGears.Form.Field(self);
			result.label = id;
			result._id = id;
			result._type = type;
			self._fields.push(["field", id, result]);
		} else {
			self.error("BlazeGears.Form", "Field ID already in use!", id);
		}
		
		return result;
	},
	
	// Method: createHtml
	// Adds a chunk of unescaped HTML to the form.
	// 
	// Arguments:
	//   content - The HTML to be added.
	createHtml: function(self, content) {
		self._fields.push(["html", content]);
	},
	
	// Method: generate
	// A deprecated alias for <render>.
	generate: function(self) {
		return self.render();
	},
	
	// Method: getField
	// Finds a field in the form.
	// 
	// Arguments:
	//   id - The ID of the sought field.
	// 
	// Return Value:
	//   Returns the field, if it exists, else null.
	// 
	// See Also:
	//   <BlazeGears.Form.Field>
	getField: function(self, id) {
		var result = null;
		
		for (var i in self._fields) {
			if (self._fields[i][0] == "field" && self._fields[i][1] == id) {
				result = self._fields[i][2];
				break;
			}
		}
		
		return result;
	},
	
	// Method: getId
	// Returns the ID of the form.
	getId: function(self) {
		return self._id;
	},
	
	// Method: render
	// Renders the form and injects it into the target <element>, if there's one.
	// 
	// Return Value:
	//   Returns the markup for the form.
	render: function(self) {
		var element;
		var result;
		
		// render the opening of the form
		if (!self.is(self.events.submit)) {
			self.events.submit = "";
		}
		result = "<form action='" + self.action + "' id='" + self._id + "'";
		for (var i in self.attribs) {
			result += " " + i + "='" + self.escapeHtml(self.attribs[i]) + "'";
		}
		for (var i in self.events) {
			result += " on" + i + "='" + self.escapeHtml(self.events[i]);
			if (i == "submit") {
				result += "; return BlazeGears.getEntityValue(\"" + self._id + "\")._submit();";
			}
			result += "'";
		}
		result += ">";
		
		// compile the templates
		for (var i in self.templates) {
			self._templates[i] = self._bgtl.compileTemplate(self.templates[i]);
		}
		
		// render the fields and add the html chunks
		for (var i in self._fields) {
			if (self._fields[i][0] == "field") {
				result += self._fields[i][2]._render();
			} else if (self._fields[i][0] == "html") {
				result += self._fields[i][1];
			}
		}
		result += "</form>";
		
		// output the form into the target element, if there's any
		if (self.element != null && self.isString(self.element)) {
			element = document.getElementById(self.element);
		} else {
			element = self.element;
		}
		if (element != null) {
			element.innerHTML = result;
		}
		
		return result;
	},
	
	// Method: validate
	// Determines if the form passes validation.
	// 
	// Return Value:
	//   Returns true if all fields of the form passes validation.
	// 
	// See Also:
	//   <BlazeGears.Form.Field.createRule>
	validate: function(self) {
		var element;
		var result = true;
		
		for (var i in self._fields) {
			if (self._fields[i][0] == "field" && !self._fields[i][2]._validate()) {
				result = false;
			}
		}
		
		return result;
	},
	
	// currently protected constructor
	__init__: function(self, id) {
		self._bgtl = new BlazeGears.BGTL();
		self._id = self.createEntity(self);
	},
	
	// will be called when the form is submitted
	_submit: function(self) {
		var element;
		var result = self.validate();
		
		return result;
	}
});

BlazeGears.StyleSheet(".BlazeGears-Form .Field", {"margin-bottom": "10px"});

BlazeGears.StyleSheet(".BlazeGears-Form .Field .Button", {"text-align": "center"});
	
BlazeGears.StyleSheet(".BlazeGears-Form .Field .Input", {
	"float": "left",
	"line-height": "30px",
	"width": "60%"
});

BlazeGears.StyleSheet(".BlazeGears-Form .Field .Invalid", {color: "red"});

BlazeGears.StyleSheet(".BlazeGears-Form .Field .Label", {
	"display": "block",
	"float": "left",
	"height": "30px",
	"line-height": "30px",
	"width": "40%"
});

BlazeGears.StyleSheet(".BlazeGears-Form .Field .Valid", {color: "green"});
