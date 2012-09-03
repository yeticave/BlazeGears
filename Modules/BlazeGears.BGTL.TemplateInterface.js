// Class: BlazeGears.BGTL.TemplateInterface
// Compiled template objects will implement this interface.
// 
// Notes:
//   This class has no actual functionality, it just being used for documentation.
// 
// See Also:
//   <BlazeGears.BGTL.parseTemplate>
BlazeGears.BGTL.TemplateInterface = function()
{
	var self = this;
	
	// Method: execute
	// A deprecated alias for <render>.
	self.execute = function(parameters) { }
	
	// Method: render
	// Renders the template.
	// 
	// Arguments:
	//   parameters - A dictionary of variables used for rendering where the keys are the variables' names.
	// 
	// Return Value:
	//   Returns the markup rendered by the template.
	self.render = function(parameters) { }
}
