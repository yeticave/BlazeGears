/*
Class: BlazeGears.FragVars.FragVar

A class that represents a single FragVar.

Superclasses:
	<BlazeGears.BaseClass>
*/
BlazeGears.FragVars.FragVar = BlazeGears.Classes.declareClass(BlazeGears.BaseClass, {
	_id: null,
	_parent: null,
	
	// Group: Event Listeners
	
	/*
	Method: onChange
	
	Will be called when the value of the FragVar changes.
	*/
	onChange: function(self) {},
	
	// Group: Functions
	
	/*
	Method: add
	
	Increases the value of the FragVar.
	
	Arguments:
		addend - The FragVar's value will be increased by this value.
		[base = 0] - If the value of the FragVar isn't a number, this will be treated as the original value.
	*/
	add: function(self, addend, base) {
		if (!self.is(base)) base = 0;
		
		var value = self.getValue();
		
		if (value == null) {
			value = base;
		}
		value = parseFloat(value);
		if (isNaN(value)) {
			value = base;
		}
		value += addend;
		self.setValue(value);
	},
	
	/*
	Method: getId
	
	Return Value:
		Returns the ID of the FragVar.
	*/
	getId: function(self) {
		return self._id;
	},
	
	/*
	Method: getValue
	
	Return Value:
		Returns the value of the FragVar.
	*/
	getValue: function(self) {
		var fragvars = self._parent._parseHash().fragvars
		var result = self.is(fragvars[self._id]) ? fragvars[self._id] : null;
		
		return result;
	},
	
	/*
	Method: setValue
	
	Sets the value of the FragVar.
	
	Arguments:
		value - The new value. Using characters other than letters, digits, and underscores isn't advised.
	*/
	setValue: function(self, value) {
		var fragvars = {};
		
		fragvars[self._id] = value;
		self._parent.setFragVars(fragvars);
	},
	
	__init__: function(self, parent, id) {
		self._id = id;
		self._parent = parent;
	}
});
