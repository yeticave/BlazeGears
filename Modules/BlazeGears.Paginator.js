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

// Class: BlazeGears.Paginator [Deprecated]
// This class is deprecated and its functionality will be completely removed. Represents a pagination control widget.
// 
// Superclasses:
//   <BlazeGears.BaseClass [Deprecated]>
// 
// Dependencies:
//   - <BlazeGears.BGTL [Deprecated]>
//   - <BlazeGears.FragVars [Deprecated]>
BlazeGears.Paginator = BlazeGears.Classes.declareClass(BlazeGears.BaseClass, {
	// Group: Variables
	
	// Field: element
	// The element which the widget will be injected into. It can be either an ID or a reference to an actual element.
	element: null,
	
	// Field: template
	// The BGTL template used for rendering.
	template: "<div class='BlazeGears-Paginator'> %if (getPages() > 1) {% %if (getPage() > 1) {% <div class='PreviousPage'><a href='javascript:;' onclick='BlazeGears.getEntityValue(&#39;{{getId()}}&#39;).previousPage();'>{{texts[0]}}</a></div> %} else {% <div class='PreviousPage' style='visibility: hidden;'>{{texts[0]}}</div> %}% <div class='CurrentPage'> {{texts[1]}} <select onchange='BlazeGears.getEntityValue(&#39;{{getId()}}&#39;).goToPage(this.value);'> %for (var i = 1; i <= getPages(); i++) {% %if (i == getPage()) {% <option selected='selected' value='{{i}}'>{{i}}</option> %} else {% <option value='{{i}}'>{{i}}</option> %}% %}% </select> / {{getPages()}} </div> %if (getPage() < getPages()) {% <div class='NextPage'><a href='javascript:;' onclick='BlazeGears.getEntityValue(&#39;{{getId()}}&#39;).nextPage();'>{{texts[2]}}</a></div> %} else {% <div class='NextPage' style='visibility: hidden;'>{{texts[2]}}</div> %}% <div class='Clear'></div> %}% </div>",
	
	// Field: texts
	// The text collection of the widget. It will be passed to the template for rendering.
	texts: ["Previous Page", "Page", "Next Page"],
	
	_bgtl: null,
	_fragvar: null,
	_page: 1,
	_pages: 1,
	
	// Group: Events
	
	// Method: onChange
	// Will be fired when the page number changes.
	onChange: function(self) {},
	
	// Group: Functions
	
	// Constructor: __init__
	// 
	// Arguments:
	//   fragvar - The ID of the FragVar that will store the page number.
	__init__: function(self, fragvar) {
		var fragvars = new BlazeGears.FragVars();
		
		self._bgtl = new BlazeGears.BGTL();
		self._fragvar = fragvars.createFragVar(fragvar);
		self._fragvar.onChange = self._update;
		self._id = self.createEntity(self);
	},
	
	// Method: generate [Deprecated]
	// Alias for <render>.
	generate: function(self) {
		return self.render();
	},
	
	// Method: getId
	// Returns the entity ID of the paginator.
	getId: function(self) {
		return self._id;
	},
	
	// Method: getPage
	// Returns the current page number.
	getPage: function(self) {
		return self._page;
	},
	
	// Method: getPages
	// Returns the total number of pages.
	// 
	// See Also:
	//   <setPages>
	getPages: function(self) {
		return self._pages;
	},
	
	// Method: goToPage
	// Sets the current page number.
	// 
	// Arguments:
	//   page - The page number to go to.
	goToPage: function(self, page) {
		if (page >= 1 && page <= self._pages) {
			self._fragvar.setValue(page);
		}
	},
	
	// Method: nextPage
	// Increases the current page number by one.
	nextPage: function(self) {
		self._fragvar.add(1, 1);
	},
	
	// Method: previousPage
	// Decreases the current page number by one.
	previousPage: function(self) {
		self._fragvar.add(-1, self._pages);
	},
	
	// Method: render
	// Renders the paginator and injects it into the target <element>, if there's one.
	// 
	// Return Value:
	//   Returns the markup for the paginator.
	render: function(self) {
		var element;
		var page;
		var result;
		
		// verify that the page number is correct
		page = self._fragvar.getValue();
		if (page == null) {
			self._page = 1;
		} else {
			self._page = parseInt(page);
		}
		if (self._page < 0 || isNaN(self._page)) {
			self._page = 1;
		}
		if (self._page > self._pages) {
			self._page = self._pages;
		}
		
		// render the template and update the elements
		result = self._bgtl.renderTemplate(self.template, self);
		if (self.element != null) {
			if (self.isArray(self.element)) {
				for (var i in self.element) {
					if (self.isString(self.element[i])) {
						element = document.getElementById(self.element[i]);
						if (element == null) {
							self.error("BlazeGears.Paginator", "Invalid element!", self.element[i]);
						} else {
							element.innerHTML = result;
						}
					} else {
						self.element[i].innerHTML = result;
					}
				}
			} else {
				if (self.isString(self.element)) {
					element = document.getElementById(self.element);
					if (element == null) {
						self.error("BlazeGears.Paginator", "Invalid element!", self.element);
					} else {
						element.innerHTML = result;
					}
				} else {
					self.element.innerHTML = result;
				}
			}
		}
		
		return result;
	},
	
	// Method: setPages
	// Sets the number of pages and re-renders the paginator.
	// 
	// Arguments:
	//   pages - The new number of pages.
	// 
	// Return Value:
	//   Returns the markup for the paginator.
	// 
	// See Also:
	//   - <getPages>
	//   - <render>
	setPages: function(self, pages) {
		self._pages = pages;
		
		return self.render();
	},
	
	// re-renders the paginator and fires the change event
	_update: function(self) {
		self.render();
		self.onChange.call(self, self);
	}
});

BlazeGears.StyleSheet(
	[
		".BlazeGears-Paginator .CurrentPage",
		".BlazeGears-Paginator .NextPage",
		".BlazeGears-Paginator .PreviousPage"
	],
	{
		"float": "left",
		"height": "30px",
		"line-height": "30px",
		"text-align": "center"
	}
);

BlazeGears.StyleSheet(".BlazeGears-Paginator .CurrentPage", {margin: "0 20px"});
