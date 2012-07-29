/*
Class: BlazeGears.Form.Option

A class that represents an option of a field object.

This can either mean radio buttons, checkboxes, or select-list options.

Superclasses:
	<BlazeGears.BaseClass>
*/
BlazeGears.Form.Option = BlazeGears.Classes.declareClass(BlazeGears.BaseClass, {
	// Field: attribs
	// Each key of this dictionary will be an attribute of the option.
	attribs: {},
	
	// Field: events
	// Each key of this dictionary will be an event of the option. The "on" prefix will be applied to the keys automatically.
	events: {},
	
	// Field: label
	// The human-readable name of the option. Defaults to the ID of the option.
	label: null,
	
	// Field: selected
	// If it's true, the option will be marked as selected upon generation.
	selected: false,
	
	// Field: value
	// The value of the option. Defaults to the ID of the option.
	value: null,
	
	_id: null,
	_parent: null,
	
	/*
	Method: getElementId
	
	Return Value:
		Returns the ID of the option's input or option element.
	*/
	getElementId: function(self) {
		return self._parent.getElementId() + "_" + self._id;
	},
	
	/*
	Method: getId
	
	Return Value:
		Returns the ID of the option.
	*/
	getId: function(self) {
		return self._id;
	},
	
	__init__: function(self, parent, id) {
		if (!self.is(id)) id = null;
		
		self._id = id == null ? self._id = parent.createEntity() : id;
		self._parent = parent;
		self.value = self._id;
	}
});
