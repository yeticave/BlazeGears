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

// Class: BlazeGears.FragVars
// A singleton class that handles variables stored in the fragment section of the current URL.
// 
// Superclasses:
//   <BlazeGears.Styles>
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
	//   <BlazeGears.FragVars.FragVar>
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
	
	// Method: getFragVars
	// A deprecated alias for <BlazeGears.FragVars.getFragVarValues>.
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
	
	// Method: setFragVars
	// A deprecated alias for <BlazeGears.FragVars.setFragVarValues>.
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
		}
	}
});

// create the ie iframe
document.write("<!--[if lte IE 7]><iframe id='blazegears_fragvars_iframe' title='IE 7' style='display: none;'></iframe><![endif]-->");
document.write("<!--[if gte IE 8]><iframe id='blazegears_fragvars_iframe' title='IE 8+' style='display: none;'></iframe><![endif]-->");
