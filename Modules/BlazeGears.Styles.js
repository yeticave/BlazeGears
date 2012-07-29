/*
BlazeGears JavaScript Toolkit
Version 1.0.3-s, July 21st, 2012

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

/*
Class: BlazeGears.Styles

A singleton class that performs some common CSS and other visual tasks.

Superclasses:
	<BlazeGears.BaseClass>
*/
BlazeGears.Styles = BlazeGears.Classes.declareSingleton(BlazeGears.BaseClass, {
	/*
	Method: alignElements
	
	Aligns an absolutely positioned element to another element.
	
	Arguments:
		element - The absolutely positioned element. It can be either an ID or a reference to an actual element.
		vertical_element_pivot - The vertical pivot point of the element. The usable values are "top", "bottom", "middle", and null. When it's null, the X coordinate won't be modified.
		horizontal_element_pivot - The horizontal pivot point of the element. The usable values are "left", "right", "center", and null. When it's null, the Y coordinate won't be modified.
		target - The target element. It can be either an ID or a reference to an actual element.
		[vertical_target_pivot = "top"] - The vertical pivot point of the target. The usable values are "top", "bottom", and "middle".
		[horizontal_target_pivot = "left"] - The horizontal pivot point of the target. The usable values are "left", "right", and "center"
	
	See Also:
		- <getPosition>
		- <setPosition>
	*/
	alignElements: function(self, element, vertical_element_pivot, horizontal_element_pivot, target, vertical_target_pivot, horizontal_target_pivot) {
		if (!self.is(horizontal_target_pivot)) horizontal_target_pivot = "left";
		if (!self.is(vertical_target_pivot)) vertical_target_pivot = "top";
		
		var position = self.getPosition(target, vertical_target_pivot, horizontal_target_pivot);
		
		self.setPosition(element, vertical_element_pivot, horizontal_element_pivot, position[0], position[1]);
	},
	
	/*
	Method: display
	
	Changes the display style of an element.
	
	Arguments:
		element - The element. It can be either an ID or a reference to an actual element.
		[method = null] - If it's true, the new style value will be "block", else "none". If it's null the current value will be flipped, if possible.
	*/
	display: function(self, element, method) {
		self._flipStyle(element, method, "display", ["block", "none"]);
	},
	
	/*
	Method: getPosition
	
	Calculates the absolute position of an element.
	
	Arguments:
		element - The element. It can be either an ID or a reference to an actual element.
		[vertical_pivot = "left"] - The vertical pivot point of the element. The usable values are "top", "bottom", and "middle".
		[horizontal_pivot = "top"] - The horizontal pivot point of the element. The usable values are "left", "right", and "center".
	
	Return Value:
		Retuns an array, which will have the X coordinate as its first index, and the Y coordinate as its second index. If the element doesn't exist, it will return null.
	*/
	getPosition: function(self, element, vertical_pivot, horizontal_pivot) {
		if (!self.is(horizontal_pivot)) horizontal_pivot = "left";
		if (!self.is(vertical_pivot)) vertical_pivot = "top";
		
		var id = element
		var result = null;
		var x;
		var y;
		
		if (self.isString(element)) {
			element = document.getElementById(element);
			id = element.id;
		}
		
		if (element != null) {
			result = [0, 0];
			if (horizontal_pivot == "right") {
				result[0] += element.offsetWidth;
			} else if (horizontal_pivot == "center") {
				result[0] += element.offsetWidth / 2;
			}
			if (vertical_pivot == "bottom") {
				result[1] += element.offsetHeight;
			} else if (vertical_pivot == "middle") {
				result[1] += element.offsetHeight / 2;
			}
			
			if (element.offsetParent) {
				for (x = 0, y = 0; element.offsetParent; element = element.offsetParent) {
					x += element.offsetLeft;
					y += element.offsetTop;
				}
				result[0] += x;
				result[1] += y;
			} else {
				result[0] += element.x;
				result[1] += element.y;
			}
		} else {
			self.error("BlazeGears.Styles", "Invalid element!", id);
		}
		
		return result;
	},
	
	/*
	Method: setPosition
	
	Sets the position of an absolutely positioned element.
	
	Arguments:
		element - The absolutely positioned element. It can be either an ID or a reference to an actual element.
		[vertical_pivot = null] - The vertical pivot point of the target. The usable values are "left", "right", "center", and null. When it's null, the X coordinate won't be modified.
		[horizontal_pivot = null] - The horizontal pivot point of the target. The usable values are "left", "right", "center", and null. When it's null, the Y coordinate won't be modified.
		[x = 0] - The X coordinate.
		[y = 0] - The X coordinate.
	*/
	setPosition: function(self, element, vertical_pivot, horizontal_pivot, x, y) {
		if (!self.is(horizontal_pivot)) horizontal_pivot = null;
		if (!self.is(vertical_pivot)) vertical_pivot = null;
		if (!self.is(x)) x = 0;
		if (!self.is(y)) y = 0;
		
		var id = element;
		
		if (self.isString(element)) {
			element = document.getElementById(element);
			id = element.id;
		}
		
		if (element != null) {
			if (horizontal_pivot == "right") {
				x -= element.offsetWidth;
			} else if (horizontal_pivot == "center") {
				x -= element.offsetWidth / 2;
			} else if (horizontal_pivot != "left") {
				x = null;
			}
			
			if (vertical_pivot == "bottom") {
				y -= element.offsetHeight;
			} else if (vertical_pivot == "middle") {
				y -= element.offsetHeight / 2;
			} else if (vertical_pivot != "top") {
				y = null;
			}
			
			if (x != null) {
				element.style.left = x + "px";
			}
			if (y != null) {
				element.style.top = y + "px";
			}
		} else {
			self.error("BlazeGears.Styles", "Invalid element!", id);
		}
	},
	
	/*
	Method: visibility
	
	Changes the visibility style of an element.
	
	Arguments:
		element - The element. It can be either an ID or a reference to an actual element.
		[method = null] - If it's true, the new style value will be "visible", else "hidden". If it's null the current value will be flipped, if possible.
	*/
	visibility: function(self, element, method) {
		self._flipStyle(element, method, "display", ["visible", "hidden"]);
	},
	
	_flipStyle: function(self, element, method, style, values) {
		if (!self.is(method)) method = null;
		
		var id = element;
		
		if (self.isString(element)) {
			element = document.getElementById(element);
			id = element.id;
		}
		if (element != null) {
			if (method == null) {
				element.style[style] = element.style[style] == values[1] ? values[0] : values[1];
			} else {
				element.style[style] = method ? values[0] : values[1];
			}
		} else {
			self.error("BlazeGears.Styles", "Invalid element!", id);
		}
	}
});
