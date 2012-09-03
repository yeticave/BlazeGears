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
