// Class: BlazeGears.Form.Option
// A class that represents an option of a field object, like radio buttons, checkboxes, and select-list options.
// 
// Superclasses:
//   <BlazeGears.BaseClass>
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
