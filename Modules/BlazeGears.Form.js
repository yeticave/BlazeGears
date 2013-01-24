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

// Class: BlazeGears.Form [Deprecated]
// This function is deprecated and its functionality will be completely removed. Represents an HTML form in an object-oriented way.
// 
// Superclasses:
//   <BlazeGears.BaseClass [Deprecated]>
// 
// Dependencies:
//   <BlazeGears.BGTL [Deprecated]>
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
	//   checks - A group of checkboxes. Uses <BlazeGears.Form.Field [Deprecated].createOption>.
	//   hidden - Hidden input field.
	//   radios - A group of radio buttons. Uses <BlazeGears.Form.Field [Deprecated].createOption>.
	//   select - Select list. Uses <BlazeGears.Form.Field [Deprecated].createOption>.
	//   submit - Center aligned submit button without a label.
	//   text - Single-line textbox.
	//   textarea - Multiline textbox.
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
	
	// Method: generate [Deprecated]
	// Alias for <render>.
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

// Class: BlazeGears.Form.Field [Deprecated]
// This class is deprecated and its functionality will be completely removed. Represents a field of a form object.
// 
// Superclasses:
//   <BlazeGears.BaseClass [Deprecated]>
BlazeGears.Form.Field = BlazeGears.Classes.declareClass(BlazeGears.BaseClass, {
	// Field: attribs
	// A dictionary where the keys will be HTML attributes of the field.
	attribs: {},
	
	// Field: columns
	// The horizontal dimension of the field's textbox. This is only applicable to fields that use a textarea as their input.
	columns: 25,
	
	// Field: events
	// A dictionary where the keys will be events of the field. The "on" prefix will be applied to the keys automatically.
	events: {},
	
	// Field: label
	// The human-readable name of the field. Defaults to the ID of the field.
	label: null,
	
	// Field: rows
	// The vertical dimension of the field's textbox. This is only applicable to fields that use a textarea as their input.
	rows: 5,
	
	// Field: template
	// The BGTL template of the field. If it's null, the field will use the template provided by the form object.
	// 
	// Notes:
	//   The field's attributes, events, and text collection will be passed to the template during rendering.
	template: null,
	
	// Field: texts
	// The text collection of the field. If it's null, the field will use the text collection provided by the form object.
	texts: null,
	
	// Field: value
	// The default value of the field. Will be updated upon the validation of the form or calling <getValue>.
	// 
	// See Also:
	//   <getValue>
	value: null,
	
	_id: null,
	_options: [],
	_parent: null,
	_rules: [],
	_type: null,
	
	// Method: createOption
	// Adds an option to the field. This is only applicable to fields that use some kind of option selection method, like select lists, radio buttons, or checkboxes.
	// 
	// Arguments:
	//   [id = null] - The ID of the option. If not provided, a random one will be generated. This is important for checkboxes, since their IDs will be their names.
	// 
	// Return Value:
	//   Returns option object.
	// 
	// See Also:
	//   <getOptions>
	createOption: function(self, id) {
		var option = new BlazeGears.Form.Option(self, id);
		
		self._options.push(option);
		
		return option;
	},
	
	// Method: createRule
	// Attaches a rule to the field. Upon validation the field must meet the criteria dictated by these rules or the validation of the field will fail.
	// 
	// Arguments:
	//   rule - The rule can be either a regular expression or a callback function. If it's a regular expression, it will be tested against the value of the field. If it's a callback function, it will be called with a reference to the field as its first argument. If the callback function returns true, the field will pass this rule.
	//   [invalid = null] - This message will be displayed if the field fails this rule.
	//   [valid = null] - This message will be displayed if the field passes this rule.
	createRule: function(self, rule, invalid, valid) {
		if (!self.is(invalid)) invalid = null;
		if (!self.is(valid)) valid = null;
		
		var type = null;
		
		if (self.isFunction(rule)) {
			type = "function";
		} else if (self.isRegExp(rule)) {
			type = "regexp";
		}
		if (type != null) {
			self._rules.push([type, rule, invalid, valid]);
		} else {
			self.error("BlazeGears.Form.Field", "Unsupported rule type!");
		}
	},
	
	// Method: getElementId
	// Returns the ID of the field's input element or null if the field doesn't have an input field.
	getElementId: function(self) {
		return self._parent._id + "_" + self._id;
	},
	
	// Method: getId
	// Returns the ID of the field.
	getId: function(self) {
		return self._id;
	},
	
	// Method: getOptions
	// Returns an array of the field's option objects.
	getOptions: function(self) {
		return self._options;
	},
	
	// Method: getValue
	// Updates the field's <value>.
	//
	// Return Value:
	//   Returns the updated value.
	// 
	// See Also:
	//   <value>
	getValue: function(self) {
		var element = document.getElementById(self.getElementId());
		var result = null;
		
		if (element != null && self.is(element.value)) {
			result = element.value;
			self.value = result;
		}
		
		return result;
	},
	
	// protected constructor
	__init__: function(self, parent, id, type) {
		self._id = id;
		self._parent = parent;
		self._type = type;
	},
	
	// renders the field's template
	_render: function(self) {
		var result = null;
		var template;
		
		if (self.texts == null && self.is(self._parent.texts[self._type])) {
			self.texts = self._parent.texts[self._type];
		}
		if (self.template != null) {
			template = self._parent._bgtl.compileTemplate(self.template);
			result = template.render(self);
		} else if (self.is(self._parent._templates[self._type])) {
			result = self._parent._templates[self._type].render(self);
		}
		
		return result;
	},
	
	// validates the field against its' rules
	_validate: function(self) {
		var element = document.getElementById(self.getElementId());
		var invalid_content = "";
		var invalid_element = document.getElementById(self._parent._id + "_" + self._id + "_invalid");
		var result = true;
		var rule_result;
		var valid_content = "";
		var valid_element = document.getElementById(self._parent._id + "_" + self._id + "_valid");
		
		self.getValue();
		for (var i in self._rules) {
			rule_result = true;
			switch (self._rules[i][0]) {
				case "function":
					if (!self._rules[i][1].call(self, self)) {
						rule_result = false;
					}
					break;
				
				case "regexp":
					if (element != null && !self._rules[i][1].test(self.value)) {
						rule_result = false;
					}
					break;
			}
			if (!rule_result) {
				if (self._rules[i][2] != null) {
					invalid_content += "<div>" + self.escapeHtml(self._rules[i][2]) +  "</div>";
				}
				result = false;
			} else if (self._rules[i][3] != null) {
				valid_content += "<div>" + self.escapeHtml(self._rules[i][3]) +  "</div>";
			}
			if (invalid_element != null) {
				if (invalid_content.length > 0) {
					invalid_element.innerHTML = invalid_content;
				} else {
					invalid_element.innerHTML = "<div class='Clear'></div>";
				}
			}
			if (valid_element != null) {
				if (valid_content.length > 0) {
					valid_element.innerHTML = valid_content;
				} else {
					valid_element.innerHTML = "<div class='Clear'></div>";
				}
			}
		}
		
		return result;
	}
});

// Class: BlazeGears.Form.Option [Deprecated]
// This class is deprecated and its functionality will be completely removed. Represents an option of a field object, like radio buttons, checkboxes, and select-list options.
// 
// Superclasses:
//   <BlazeGears.BaseClass [Deprecated]>
BlazeGears.Form.Option = BlazeGears.Classes.declareClass(BlazeGears.BaseClass, {
	// Field: attribs
	// A dictionary where the keys will be HTML attributes of the option.
	attribs: {},
	
	// Field: events
	// A dictionary where the keys will be events of the option. The "on" prefix will be applied to the keys automatically.
	events: {},
	
	// Field: label
	// The human-readable name of the option. Defaults to the ID of the option.
	label: null,
	
	// Field: selected
	// If it's true, the option will be marked as selected/checked during rendering.
	selected: false,
	
	// Field: value
	// The value of the option. Defaults to the ID of the option.
	value: null,
	
	_id: null,
	_parent: null,
	
	// Method: getElementId
	// Returns the ID of the option's input or option element.
	getElementId: function(self) {
		return self._parent.getElementId() + "_" + self._id;
	},
	
	// Method: getId
	// Returns the ID of the option.
	getId: function(self) {
		return self._id;
	},
	
	// protected constructor
	__init__: function(self, parent, id) {
		if (!self.is(id)) id = null;
		
		self._id = id == null ? self._id = parent.createEntity() : id;
		self._parent = parent;
		self.value = self._id;
	}
});
