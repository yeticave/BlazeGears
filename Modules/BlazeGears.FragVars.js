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

// Namespace: blazegears.fragvars
// Deals with storing variables in the fragment part of the current URL.
var blazegears = blazegears || {};
blazegears.fragvars = blazegears.fragvars || {};

/*
Enum: blazegears.fragvars.HistoryMode
	Specifies the possible ways of handling browser history.

Values:
	AUTOMATIC - The appropriate history mode will be determined automatically. The functionality of this mode might change fundamentally between releases.
	NONE - The browser history won't be manipulated at all.
*/
blazegears.fragvars.HistoryMode = {
	AUTOMATIC: null,
	NONE: 0
};

// Class: blazegears.fragvars.FragVar
// Represents a signle variable stored in the fragment part of the current URL. Instances of this class shouldn't be created manually, but through the <Manager> class.
blazegears.fragvars.FragVar = function(id, value) {
	if (value === undefined) value = null;
	this._id = id;
	this._value = this.getValue();
	this._value_changed_event = new blazegears.Event();
}

// Method: getId
// Gets the ID of the FragVar as a *String*.
blazegears.fragvars.FragVar.prototype.getId = function() {
	return this._id;
}

// Method: getValue
// Gets the value of the FragVar as a *String*. Defaults to *null*.
blazegears.fragvars.FragVar.prototype.getValue = function() {
	var value = blazegears.fragvars.Manager.getFragVarValue(this._id)
	return value === undefined || value === null ? null : value.toString();
}

/*
Method: setValue
	Setter for <getValue>.

Arguments:
	value - (*String*) The new value. If it's *null*, the FragVar will be unset.

See Also:
	<getValueChangedEvent>
*/
blazegears.fragvars.FragVar.prototype.setValue = function(value) {
	if (value !== this._value) {
		this._value = value;
		blazegears.fragvars.Manager.setFragVarValue(this._id, value === undefined || value === null ? null : value.toString());
	}
}

// Method: getValueChangedEvent
// Gets the event that will be raised when <getValue> changes as an <Event>.
blazegears.fragvars.FragVar.prototype.getValueChangedEvent = function() {
	return this._value_changed_event;
}

blazegears.fragvars.FragVar.prototype._updateValue = function(value) {
	this._value_changed_event.raise(this);
}

// Class: blazegears.fragvars.Manager
// Manages FragVars stored in the fragment part of the current URL.
blazegears.fragvars.Manager = {};

blazegears.fragvars.Manager._fragvar_values = {};
blazegears.fragvars.Manager._fragvars = {};
blazegears.fragvars.Manager._history_mode = blazegears.fragvars.HistoryMode.NONE;
blazegears.fragvars.Manager._manager = null;

// Method: getHistoryMode
// Gets the method of handling browser history as a <blazegears.fragvars.HistoryMode>. Defaults to <blazegears.fragvars.HistoryMode>.NONE
blazegears.fragvars.Manager.getHistoryMode = function() {
	return blazegears.fragvars.Manager._history_mode;
}

/*
Method: setHistoryMode
	Setter for <getHistoryMode>.

Arguments:
	value - (<blazegears.fragvars.HistoryMode>) The new value.

Exceptions:
	blazegears.ArgumentError - *value* isn't an acceptable value for <blazegears.fragvars.HistoryMode>.
*/
blazegears.fragvars.Manager.setHistoryMode = function(value) {
	var HistoryMode = blazegears.fragvars.HistoryMode;
	var Manager = blazegears.fragvars.Manager;
	
	if (value === null || value === 0) {
		Manager._history_mode = value;
		if (Manager._manager !== null) {
			Manager._manager.ie_history = value === blazegears.fragvars.HistoryMode.AUTOMATIC;
		}
	} else {
		throw blazegears.ArgumentError._invalidEnumValue("value", "blazegears.fragvars.HistoryMode");
	}
}

/*
Method: createFragVar
	Tries to look up a <FragVar> by ID or creates a new one if it doesn't exist yet.

Arguments:
	id - (*String*) The ID of the <FragVar>.

Return Value:
	(<FragVar>) The <FragVar> with the matching ID, if it already exists, otherwise a new <FragVar>.
*/
blazegears.fragvars.Manager.createFragVar = function(id) {
	var Manager = blazegears.fragvars.Manager;
	var fragvar;
	var result;
	
	if (Manager._fragvars.hasOwnProperty(id)) {
		result = Manager._fragvars[id];
	} else {
		Manager._initialize();
		fragvar = Manager._manager.createFragVar(id);
		fragvar._internalOnChange = Manager._internalOnChange;
		result = new blazegears.fragvars.FragVar(id);
		Manager._fragvars[id] = result;
	}
	
	return result;
}

/*
Method: getFragVar
	Looks up a <FragVar> by ID.

Arguments:
	id - (*String*) The ID of the <FragVar>.

Return Value:
	(<FragVar>) The <FragVar> with the matching ID, if it already exists, otherwise *null*.
*/
blazegears.fragvars.Manager.getFragVar = function(id) {
	var fragvars = blazegears.fragvars.Manager._fragvars;
	var result = null;
	
	if (fragvars.hasOwnProperty(id)) {
		result = fragvars[id];
	}
	
	return result;
}

/*
Method: getFragVarValue
	Gets the value of a <FragVar>.

Arguments:
	id - (*String*) The ID of the <FragVar>.

Return Value:
	(*String*) The value of the <FragVar>, if it exists and has a value, otherwise *null*.
*/
blazegears.fragvars.Manager.getFragVarValue = function(id) {
	var values = blazegears.fragvars.Manager._manager.getFragVarValues();
	var result = null;
	
	if (values.hasOwnProperty(id)) {
		result = values[id].toString();
	}
	
	return result;
}

/*
Method: getFragVarValues
	Gets the values of all <FragVars>.

Return Value:
	(*Object*) A dictionary where the keys are the <FragVars>' IDs and values are the <FragVars>' values.
*/
blazegears.fragvars.Manager.getFragVarValues = function() {
	blazegears.fragvars.Manager._initialize();
	return blazegears.fragvars.Manager._manager.getFragVarValues();
}

/*
Method: setFragVarValue
	Sets the value of a <FragVar>.

Arguments:
	id - (*String*) The ID of the <FragVar>.
	value - (*String*) The new value of the <FragVar>.

Exceptions:
	blazegears.ArgumentError - *id* is *undefined* or *null*.
*/
blazegears.fragvars.Manager.setFragVarValue = function(id, value) {
	var values = {};
	
	if (!blazegears._isStringifyable(id)) {
		throw blazegears.ArgumentError._nulldefinedArgument("id");
	}
	values[id] = blazegears._forceParseString(value);
	blazegears.fragvars.Manager.setFragVarValues(values);
}

/*
Method: setFragVarValues
	Sets the values of a selection of <FragVars>.

Arguments:
	values - (*Object*) A dictionary where the keys are the <FragVars>' IDs and the values are the <FragVars>' new values.
*/
blazegears.fragvars.Manager.setFragVarValues = function(values) {
	var Manager = blazegears.fragvars.Manager;
	var i;
	
	Manager._initialize();
	for (i in values) {
		if (values.hasOwnProperty(i)) {
			Manager.createFragVar(i);
		}
	}
	Manager._manager.setFragVarValues(values);
}

blazegears.fragvars.Manager._initialize = function() {
	var Manager = blazegears.fragvars.Manager;
	if (Manager._manager === null) {
		Manager._manager = new BlazeGears.FragVars();
		Manager.setHistoryMode(Manager._history_mode);
	}
}

blazegears.fragvars.Manager._internalOnChange = function() {
	var fragvar = blazegears.fragvars.Manager.getFragVar(this._id);
	fragvar._updateValue(this.getValue());
}

/*
Class: BlazeGears.FragVars [Deprecated]
	This class has been deprecated, use <blazegears.fragvars.Manager> instead. A singleton class that handles variables stored in the fragment section of the current URL.

Superclasses:
	<BlazeGears.Styles [Deprecated]>

Remarks:
	FragVars are variables stored in the fragment section of the current URL. FragVars are stored as ID-value pairs, support event listeners, and still provide an interface to use URL fragments for their original purpose.

Examples:
	(code)
		<a name="my_anchor"></a>
		<script type="text/javascript">
			// <![CDATA[
			fragvars = new BlazeGears.FragVars();
			my_fragvar = fragvars.createFragVar("my_id");
			my_fragvar.onChange = function(self) {
				alert("My new value is: " + self.getValue());
			}
			// ]]>
		</script>
		<div><a href="javascript:;" onclick="my_fragvar.add(-1);">Decrease the Value</a></div>
		<div><a href="javascript:;" onclick="my_fragvar.setValue(0);">Reset the Value</a></div>
		<div><a href="javascript:;" onclick="my_fragvar.add(1);">Increase the Value</a></div>
		<div><a href="#my_anchor" onclick="return fragvars.goToAnchor(this);">Scroll to an Anchor</a></div>
	(end)
*/
BlazeGears.FragVars = BlazeGears.Classes.declareSingleton(BlazeGears.Styles, {
	// Field: ie_history
	// If it's true, upon updating the URL the changes will be saved to an iframe, so the the forward and back buttons will properly work under Internet Explorer.
	ie_history: true,
	
	// Field: redundant_events
	// If it's true, the same event callback functions can be called multiple times when the same callback is used by multiple FragVars, else they won't be called more than once.
	redundant_events: true,
	
	_fragvar_assigner: "=",
	_fragvar_separator: "/",
	_fragvar_starter: "!",
	_fragvars: [],
	_go_to_anchor: false,
	_iframe: null,
	_hash: "",
	_timer: null,
	
	// Method: createFragVar
	// Creates a FragVar object.
	// 
	// Arguments:
	//   id - The ID of the FragVar. Using characters other than letters, digits, and underscores isn't advised.
	// 
	// Return Value:
	//   Returns a new FragVar object, if this ID wasn't taken before, else the original instance.
	// 
	// See Also:
	//   <blazegears.fragvars.FragVar>
	createFragVar: function(self, id) {
		var result = self.getFragVar(id);
		
		if (result == null) {
			result = new BlazeGears.FragVars.FragVar(self, id);
			self._fragvars.push(result);
		}
		
		return result;
	},
	
	// Method: getFragVar
	// Finds a FragVar.
	// 
	// Arguments:
	//   id - The ID of the sought FragVar.
	// 
	// Return Value:
	//   Returns the FragVar object, if it exists, else null.
	getFragVar: function(self, id) {
		var result = null;
		
		for (var i in self._fragvars) {
			if (self._fragvars[i].getId() == id) {
				result = self._fragvars[i];
				break;
			}
		}
		
		return result;
	},
	
	// Method: getFragVarValues
	// Returns a dictionary where the keys are the FragVars' IDs and the values are the FragVars' values.
	getFragVarValues: function(self) {
		return self._parseHash().fragvars;
	},
	
	// Method: getFragVars [Deprecated]
	// Alias for <getFragVarValues>.
	getFragVars: function(self) {
		return self.getFragVarValues();
	},
	
	// Method: goToAnchor
	// Scrolls the page to an anchor without clashing with the FragVars in the URL.
	// 
	// Arguments:
	//   anchor - This must be either a string that matches the ID or name of the target anchor or a reference to an A element which refers to the anchor through its' href attribute.
	// 
	// Return Value:
	//   Always returns false.
	goToAnchor: function(self, anchor) {
		var id = "";
		var index;
		
		if (self.isString(anchor)) {
			id = anchor;
		} else {
			if(anchor.href) {
				index = anchor.href.indexOf("#");
				id = anchor.href.substr(index + 1);
			}
		}
		self._updateHash(id, self.getFragVarValues());
		self._go_to_anchor = true;
		
		return false;
	},
	
	// Method: setFragVarValues
	// Sets the values of some FragVars.
	// 
	// Arguments:
	//   fragvars - A dictionary where the keys are the FragVars' IDs and the values are the new values.
	setFragVarValues: function(self, new_fragvars) {
		var fragvars;
		var hash = self._parseHash();
		
		fragvars = hash.fragvars;
		for (var i in new_fragvars) {
			if (new_fragvars[i] == null) {
				delete fragvars[i];
			} else {
				fragvars[i] = new_fragvars[i];
			}
		}
		self._updateHash(hash.anchor, fragvars);
	},
	
	// Method: setFragVars [Deprecated]
	// Alias for <setFragVarValues>.
	setFragVars: function(self, new_fragvars) {
		self.setFragVarValues(new_fragvars);
	},
	
	// determines if it's necessary use an iframe for IE history
	__init__: function(self) {
		var anchor = self._parseHash().anchor;
		
		// find the history manipulating iframe
		self._iframe = document.getElementById("blazegears_fragvars_iframe");
		
		// enable the initial anchoring
		if (anchor.length > 0) {
			self._go_to_anchor = true;
		}
		
		// start the refresher
		self._refresh();
	},
	
	// parses the url fragment
	_parseHash: function(self, hash) {
		if (!self.is(hash)) hash = window.location.hash;
		
		var fragvar;
		var fragvars;
		var index;
		var result = {anchor: "", fragvars: {}};
		
		index = hash.indexOf(self._fragvar_starter);
		result.anchor = hash.substr(1, index - 1);
		hash = hash.substr(index + 1);
		if (hash.length > 0) {
			fragvars = hash.split(self._fragvar_separator)
			for (var i in fragvars) {
				fragvar = fragvars[i].split(self._fragvar_assigner);
				if (fragvar.length == 2) {
					result.fragvars[fragvar[0]] = decodeURIComponent(fragvar[1]);
				}
			}
		}
		
		return result;
	},
	
	// determines if the url fragment has changed since the last check and call the changed fragvars
	_refresh: function(self) {
		var callbacks = [];
		var callers = [];
		var element;
		var fragvars = self._parseHash(self._hash).fragvars;
		var hash = null;
		var links;
		var new_fragvars;
		
		// ie 7 history
		if (self.ie_history && self._iframe != null && self._iframe.title == "IE 7") {
			element = self._iframe.contentWindow.document.getElementById("hash");
			if (element != null && element.innerHTML != window.location.hash) {
				hash = self._parseHash(element.innerHTML);
				if (hash.anchor != self._parseHash().anchor) {
					self._go_to_anchor = true;
				}
				window.location.hash = element.innerHTML;
			}
		}
		
		if (hash == null) {
			hash = self._parseHash();
		}
		new_fragvars = hash.fragvars;
		
		// if there's any change in the hash, call the appropriate listeners
		if (self._hash != window.location.hash) {
			self._hash = window.location.hash;
			for (var i in self._fragvars) {
				if (new_fragvars[self._fragvars[i].getId()] != fragvars[self._fragvars[i].getId()]) {
					if (self.redundant_events) {
						self._fragvars[i].onChange.call(null, self._fragvars[i]);
					} else if (!self.isInArray(self._fragvars[i].onChange, callbacks)) {
						callbacks.push(self._fragvars[i].onChange);
						callers.push(self._fragvars[i]);
					}
					if (self._fragvars[i]._internalOnChange !== null) {
						self._fragvars[i]._internalOnChange.call(self._fragvars[i]);
					}
				}
			}
			for (var i in callbacks) {
				callbacks[i].call(null, callers[i]);
			}
		}
		
		// do the anchoring
		if (self._go_to_anchor) {
			if (hash.anchor.length > 0) {
				links = document.getElementsByTagName("a");
				for (var i = 0; i < links.length; i++) {
					if (links[i].id == hash.anchor || links[i].name == hash.anchor) {
						window.scroll(null, self.getPosition(links[i])[1]);
						self._go_to_anchor = false;
					}
				}
			} else {
				window.scroll(null, 0);
				self._go_to_anchor = false;
			}
		}
		
		// schedule the next refresh
		self._timer = setTimeout(self._refresh, 100);
	},
	
	// updates the url fragment and writes the change to the iframe, if necessary
	_updateHash: function(self, anchor, fragvars) {
		if (!self.is(anchor)) anchor = "";
		if (!self.is(fragvars)) fragvars = {};
		
		var hash;
		var element;
		var new_fragvars = [];
		
		// update the hash
		for (var i in fragvars) {
			new_fragvars.push(i + self._fragvar_assigner + encodeURIComponent(fragvars[i]));
		}
		hash = anchor + self._fragvar_starter + new_fragvars.join(self._fragvar_separator);
		if (hash != window.location.hash.substr(1)) {
			// save the new hash for ie
			if (self.ie_history && self._iframe != null) {
				switch (self._iframe.title) {
					case "IE 7":
						element = self._iframe.contentWindow.document.getElementById("hash");
						if (element == null) {
							self._iframe.contentWindow.document.open();
							self._iframe.contentWindow.document.write("<div id='hash'>" + window.location.hash + "</div>");
							self._iframe.contentWindow.document.close();
						}
						self._iframe.contentWindow.document.open();
						self._iframe.contentWindow.document.write("<div id='hash'>#" + hash + "</div>");
						self._iframe.contentWindow.document.close();
						break;
					
					default:
						self._iframe.contentWindow.document.close();
				}
			}
			
			window.location.hash = hash;
			clearTimeout(this._timer);
			this._refresh();
		}
	}
});

// create the ie iframe
document.write("<!--[if lte IE 7]><iframe id='blazegears_fragvars_iframe' title='IE 7' style='display: none;'></iframe><![endif]-->");
document.write("<!--[if gte IE 8]><iframe id='blazegears_fragvars_iframe' title='IE 8+' style='display: none;'></iframe><![endif]-->");

// Class: BlazeGears.FragVars.FragVar [Deprecated]
// This class has been deprecated, use <blazegears.fragvars.FragVar> instead. A class that represents a single FragVar.
// 
// Superclasses:
//   <BlazeGears.BaseClass [Deprecated]>
BlazeGears.FragVars.FragVar = BlazeGears.Classes.declareClass(BlazeGears.BaseClass, {
	_id: null,
	_parent: null,
	_internalOnChange: null,
	
	// Group: Events
	
	// Method: onChange
	// Will be fired when the value of the FragVar changes.
	onChange: function(self) {},
	
	// Group: Functions
	
	// Method: add
	// Increases the value of the FragVar.
	// 
	// Arguments:
	//   addend - The FragVar's value will be increased by this value.
	//   [default_value = 0] - If the value of the FragVar isn't a number, this will be used as the original value.
	add: function(self, addend, default_value) {
		if (!self.is(default_value)) default_value = 0;
		
		var value = self.getValue();
		
		if (value == null) {
			value = default_value;
		}
		value = parseFloat(value);
		if (isNaN(value)) {
			value = default_value;
		}
		value += addend;
		self.setValue(value);
	},
	
	// Method: getId
	// Returns the ID of the FragVar.
	getId: function(self) {
		return self._id;
	},
	
	// Method: getValue
	// Returns the value of the FragVar.
	getValue: function(self) {
		var fragvars = self._parent._parseHash().fragvars
		var result = self.is(fragvars[self._id]) ? fragvars[self._id] : null;
		
		return result;
	},
	
	// Method: setValue
	// Sets the value of the FragVar.
	// 
	// Arguments:
	//   value - The new value. Using characters other than letters, digits, and underscores isn't advised.
	setValue: function(self, value) {
		var fragvars = {};
		
		fragvars[self._id] = value;
		self._parent.setFragVarValues(fragvars);
	},
	
	// protected constructor
	__init__: function(self, parent, id) {
		self._id = id;
		self._parent = parent;
	}
});
