/*
Class: BlazeGears.Classes.ClassInterface

Declared classes will implement this interface.

Note:
	This class has no actual functionality, it just being used for documentation.

See Also:
	<BlazeGears.Classes.SingletonInterface>
*/
BlazeGears.Classes.ClassInterface = function() {
	var self = this;
	
	// Field: __class__
	// Points to the class itself.
	self.__class__ = null;
	
	/*
	Method: __init__
	
	The constructor of the class. By default it does nothing, but it can be overwritten.
	*/
	self.__init__ = function(self) { }
	
	/*
	Method: __super__
	
	Searches the class' superclasses for
	
	Arguments:
		This method takes a variable amount of arguments. The first argument has to be the name of the sought method, the rest will be passed to this method.
	
	Exceptions:
		An Error will be thrown, if the sought method can't be found.
	
	Return Value:
		Returns the return value of the sought method.
	*/
	self.__super__ = function(name) { }
	
	// Method: $__super__
	// The static version of the <__super__> method.
	self.$__super__ = function() { }
}
