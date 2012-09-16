// Class: BlazeGears.Form.Field
// A class that represents a field of a form object.
// 
// Superclasses:
//   <BlazeGears.BaseClass>
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
	// 
	// See Also:
	//   <BlazeGears.BGTL>
	template: null,
	
	// Field: texts
	// The text collection of the field. If it's null, the field will use the text collection provided by the form object.
	texts: null,
	
	// Field: value
	// The default value of the field. Will be updated upon the validation of the form or calling <getValue>.
	// 
	// See Also:
	//   - <BlazeGears.Form.validate>
	//   - <getValue>
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
	//   - <BlazeGears.Form.Option>
	//   - <getOptions>
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
	// 
	// See Also:
	//   <BlazeGears.Form.validate>
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
	// 
	// See Also:
	//   <BlazeGears.Form.Option>
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
