/*
Class: BlazeGears.BGTL.TemplateInterface

Parsed templates will implement this interface.

Note:
	This class has no actual functionality, it just being used for documentation.

See Also:
	<BlazeGears.BGTL.parseTemplate>
*/
BlazeGears.BGTL.TemplateInterface = function()
{
	var self = this;
	
	/*
	Method: execute
	
	A depreciated alias for <render>.
	*/
	self.execute = function(parameters) { }
	
	/*
	Method: render
	
	Renders the template.
	
	Paremeters:
		parameters - The content of this dictionary will be converted to variables for the template, using its' keys as variable names.
	
	Return Value:
		Returns the rendered template.
	*/
	self.render = function(parameters) { }
}
