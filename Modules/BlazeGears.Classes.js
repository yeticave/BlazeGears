BlazeGears.Classes = new function() {
	var self = this;
	var bg = BlazeGears;
	
	/*
	Function: Class
	
	Declares a class.
	
	Arguments:
		This method handles arguments dynamically. The last argument must a dictionary, this will be the declaration, and all the prior ones will be the superclasses of the class.
	
	Return Value:
		Returns a reference to the declared class.
	
	Declaration Notes:
		- Each key of the declaration will be a member of the class.
		- Every key must be unique, not even keys of different types (public or static) are allowed to match. This doesn't effect magical keys, as they are special to begin with.
		- Every method must have "self" as their first argument. This will be used for self reference. It's not needed to provide this argument upon calling the method, since it will be applied automatically. This will refer to the instance for instance methods and the to the class for static methods.
		- Keys starting with the dollar sign (e.g. "$static") will be static members of the class.
		- Keys starting with an underscore (e.g. "_protected") will be considered protected/private. Members like these are not documented, meant to be used only internally, and might change without warning or notice.
		- Keys starting and ending with double underscores (e.g. the constructor) will be considered magical. Using keys like this is not advised, as they might become part of the special keys one day.
		- Objects should never be initialized in the declaration of the class, except if there are static.
	
	Optional Magic Keys:
		__init__ - The constructor of the class.
	
	Default Members:
		__class__ - Refers to the class itself.
		__super__ - Searches the superclasses for a method. Will throw an exception, if the sought method doesn't exist.
	*/
	self.declareClass = function() {
		if (arguments.length > 0) {
			arguments[arguments.length - 1].__singleton__ = false;
		}
		
		return declareClass.apply(self, arguments);
	}
	
	/*
	Function: declareSingleton
	
	Acts the same as <declareClass>, but upon trying to create a second instance of the class, it will return the reference for the first instance.
	*/
	self.declareSingleton = function() {
		if (arguments.length > 0) {
			arguments[arguments.length - 1].__singleton__ = true;
		}
		
		return declareClass.apply(self, arguments);
	}
	
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
				if (bg.is(declaration.static[key])) {
					delete declaration.static[key];
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
			instance.__method__ = function(name, arguments) {
				var new_arguments = [instance];
				
				for (var i = 0; i < arguments.length; i++) {
					new_arguments.push(arguments[i]);
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
					eval("instance[i] = function() {return instance.__method__('" + i + "', arguments);}");
				} else if (bg.isArray(blazegears_class.__declaration__.public[i]) || bg.isObject(blazegears_class.__declaration__.public[i])) {
					instance[i] = bg.cloneObject(blazegears_class.__declaration__.public[i]);
				} else {
					instance[i] = blazegears_class.__declaration__.public[i];
				}
			}
			
			// static methods
			for (var i in blazegears_class.__declaration__.static) {
				if (bg.isFunction(blazegears_class.__declaration__.static[i])) {
					eval("instance[i] = function() {return blazegears_class.__method__('" + i + "', arguments);}");
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
		blazegears_class.__method__ = function(name, arguments) {
			var new_arguments = [blazegears_class];
			
			for (var i = 0; i < arguments.length; i++) {
				new_arguments.push(arguments[i]);
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
				eval("blazegears_class[i] = function() {return blazegears_class.__method__('" + i + "', arguments);}");
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
