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

// Class: BlazeGears.Classes [Deprecated]
// This namespace is deprecated and its functionality will be completely removed. Contains the functions and interfaces that can be used declare classes that has some advantages (and some drawbacks) over regular JavaScript classes.
// 
// The declaration of a class is being done by passing an object to one of the class declaring functions. 
// 
// Declaration Object Notes:
//   - Each key of the object will be a member of the class.
//   - Every key must be unique, not even keys of different types (public or static) are allowed to match. This doesn't effect magical keys, as they are special to begin with.
//   - Every method must have "self" as their first argument. This argument will be pushed to the front of the argument list, and it's guaranteed, that it will point either to the instance for instance methods or to the class for static methods.
//   - Keys starting with the dollar sign (e.g. "$static") are created as static members of the class.
//   - Keys starting with an underscore (e.g. "_protected") are considered protected by convention. Members like these in BlazeGears are not documented, meant to be used only internally, and might change without warning or notice.
//   - Keys starting and ending with double underscores (e.g. the constructor) are considered magical. Using keys like these for declaring your own functionality is not advised.
//   - Objects should never be initialized in the declaration of the class, as the constructor will try to create a copy of every object member.
BlazeGears.Classes = new function() {
	var self = this;
	var bg = BlazeGears;
	
	// Function: declareClass
	// Declares a class.
	// 
	// Arguments:
	//   This method takes a variable amount of arguments. The last argument must be the declaration object and all the prior ones will be the superclasses of the class.
	//
	//Return Value:
	//   Returns the declared class, which implements the <BlazeGears.Classes.ClassInterface [Deprecated]>.
	self.declareClass = function() {
		if (arguments.length > 0) {
			arguments[arguments.length - 1].__singleton__ = false;
		}
		
		return declareClass.apply(self, arguments);
	}
	
	// Function: declareSingleton
	// Declares a singleton.
	// 
	// Arguments:
	//   This method takes a variable amount of arguments. The last argument must be the declaration object and all the prior ones will be the superclasses of the class.
	// 
	// Return Value:
	//   Returns the declared class, which implements the <BlazeGears.Classes.SingletonInterface [Deprecated]>.
	self.declareSingleton = function() {
		if (arguments.length > 0) {
			arguments[arguments.length - 1].__singleton__ = true;
		}
		
		return declareClass.apply(self, arguments);
	}
	
	// does all the class declaring work
	var declareClass = function() {
		var blazegears_class;
		var declaration = {"magic": {}, "public": {}, "static": {}};
		var key;
		var parents = [];
		var raw_declaration = {};
		
		// find the superclasses
		for (var i = 0; i < arguments.length - 1; i++) {
			parents.push(arguments[i]);
		}
		
		// find the declaration object
		if (arguments.length > 0) {
			raw_declaration = arguments[arguments.length - 1];
		}
		
		// inherit from the superclasses
		for (var i = parents.length - 1; i >= 0; i--) {
			for (var j in parents[i].__declaration__) {
				for (var k in parents[i].__declaration__[j]) {
					declaration[j][k] = parents[i].__declaration__[j][k]
				}
			}
		}
		
		// regroup the keys of the declaration
		for (var i in raw_declaration) {
			if (i == "__init__") {
				declaration.public.__init__ = raw_declaration.__init__;
			} else if (i.substr(0, 2) == "__" && i.substr(i.length - 2, 2) == "__") {
				declaration.magic[i.substr(0, i.length - 2).substr(2)] = raw_declaration[i];
			} else if (i.substr(0, 1) == "$") {
				key = i.substr(1);
				if (bg.is(declaration.public[key])) {
					delete declaration.public[key];
				}
				declaration.static[key] = raw_declaration[i];
			} else {
				if (bg.is(declaration.static[i])) {
					delete declaration.static[i];
				}
				declaration.public[i] = raw_declaration[i];
			}
		}
		declaration.magic.parents = parents;
		
		// start declaring the class
		blazegears_class = function() {
			var instance = this; // self reference
			var constructor_arguments;
			
			// if the class is a singleton and it's already initialized, just return the reference to the previous one
			if (blazegears_class.__declaration__.magic.singleton) {
				if (blazegears_class.__singleton__ == null) {
					blazegears_class.__singleton__ = instance;
				} else {
					return blazegears_class.__singleton__;
				}
			}
			
			instance.__class__ = blazegears_class; // self reference for the class
			
			// applies the self reference to the public methods
			instance.__method__ = function(name, parameters) {
				var new_arguments = [instance];
				
				for (var i = 0; i < parameters.length; i++) {
					new_arguments.push(parameters[i]);
				}
				
				return blazegears_class.__declaration__.public[name].apply(instance, new_arguments);
			}
			
			// searches the superclasses for a method
			instance.__super__ = function(name) {
				var done = false;
				var functions;
				var new_name = name;
				var parents = blazegears_class.__declaration__.magic.parents;
				var result;
				
				// search for a public member
				for (var i in parents) {
					if(bg.is(parents[i].__declaration__.public[name])) {
						arguments[0] = instance;
						result = parents[i].__declaration__.public[new_name].apply(instance, arguments);
						done = true;
						break;
					}
				}
				
				// search for a static member
				if (!done) {
					for (var i in parents) {
						if(bg.is(parents[i].__declaration__.static[name])) {
							arguments[0] = blazegears_class;
							result = parents[i].__declaration__.static[new_name].apply(blazegears_class, arguments);
							done = true;
							break;
						}
					}
				}
				
				// member not found, throw an error
				if (!done) {
					throw new Error("Member not found.");
				}
				
				return result;
			}
			
			// public members
			for (var i in blazegears_class.__declaration__.public) {
				if (bg.isFunction(blazegears_class.__declaration__.public[i])) {
					with ({memberName: i}) {
						instance[memberName] = function() {
							return instance.__method__(memberName, arguments);
						}
					}
				} else if (bg.isArray(blazegears_class.__declaration__.public[i]) || bg.isObject(blazegears_class.__declaration__.public[i])) {
					instance[i] = bg.cloneObject(blazegears_class.__declaration__.public[i]);
				} else {
					instance[i] = blazegears_class.__declaration__.public[i];
				}
			}
			
			// static methods for instances
			for (var i in blazegears_class.__declaration__.static) {
				if (bg.isFunction(blazegears_class.__declaration__.static[i])) {
					with ({memberName: i}) {
						instance[memberName] = function() {
							return blazegears_class.__method__(memberName, arguments);
						}
					}
				}
			}
			
			// calls the constructor if there's one
			if (bg.is(blazegears_class.__declaration__.public.__init__)) {
				constructor_arguments = [instance];
				for (var i = 0; i < arguments.length; i++) {
					constructor_arguments.push(arguments[i]);
				}
				blazegears_class.__declaration__.public.__init__.apply(instance, constructor_arguments);
			}
			
			return instance;
		}
		
		// applies the self reference to the static methods
		blazegears_class.__method__ = function(name, parameters) {
			var new_arguments = [blazegears_class];
			
			for (var i = 0; i < parameters.length; i++) {
				new_arguments.push(parameters[i]);
			}
			
			return blazegears_class.__declaration__.static[name].apply(blazegears_class, new_arguments);
		}
		
		// searches the superclasses for a static method
		blazegears_class.__super__ = function(name) {
			var done = false;
			var functions;
			var new_name = name;
			var parents = blazegears_class.__declaration__.magic.parents;
			var result;
			
			for (var i in parents) {
				if(bg.is(parents[i].__declaration__.static[name])) {
					arguments[0] = blazegears_class;
					result = parents[i].__declaration__.static[new_name].apply(blazegears_class, arguments);
					done = true;
					break;
				}
			}
			
			if (!done) {
				throw new Error("Member not found.");
			}
			
			return result;
		}
		
		// static members
		for (var i in declaration.static) {
			if (bg.isFunction(declaration.static[i])) {
				with ({memberName: i}) {
					blazegears_class[memberName] = function() {
						return blazegears_class.__method__(memberName, arguments);
					}
				}
			} else if (bg.isArray(declaration.static[i]) || bg.isObject(declaration.static[i])) {
				blazegears_class[i] = bg.cloneObject(declaration.static[i]);
			} else {
				blazegears_class[i] = declaration.static[i];
			}
		}
		blazegears_class.__declaration__ = declaration;
		blazegears_class.__singleton__ = null;
		
		return blazegears_class;
	}
}

// Class: BlazeGears.Classes.ClassInterface [Deprecated]
// Declared classes will implement this interface.
// 
// Notes:
//   This class has no actual functionality, it's just being used for documentation.
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

// Class: BlazeGears.Classes.SingletonInterface [Deprecated]
// Declared singletons will implement this interface besides the <BlazeGears.Classes.ClassInterface [Deprecated]>.
// 
// Notes:
//   This class has no actual functionality, it's just being used for documentation.
BlazeGears.Classes.SingletonInterface = function() { }
