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

// Class: BlazeGears.Classes.ClassInterface
// Declared classes will implement this interface.
// 
// Notes:
//   This class has no actual functionality, it's just being used for documentation.
// 
// See Also:
//   <BlazeGears.Classes.SingletonInterface>
BlazeGears.Classes.ClassInterface = function() {
	var self = this;
	
	// Field: __class__
	// Points to the class itself.
	self.__class__ = null;
	
	// Method: __init__
	// The constructor of the class. By default it does nothing, but it can be overridden.
	self.__init__ = function(self) { }
	
	// Method: __super__
	// Searches the class' superclasses for a method and calls it.
	// 
	// Arguments:
	//   This method takes a variable amount of arguments. The first argument has to be the name of the sought method, the rest will be passed to the method, if it exists.
	// 
	// Exceptions:
	//   An Error will be thrown, if the sought method can't be found.
	// 
	// Return Value:
	//   Returns the return value of the sought method.
	self.__super__ = function(name) { }
	
	// Method: $__super__
	// The static version of the <__super__> method.
	self.$__super__ = function() { }
}
