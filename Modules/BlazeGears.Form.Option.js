/*
BlazeGears JavaScript Toolkit
Version 1.1.0-s, December 31st, 2012

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
