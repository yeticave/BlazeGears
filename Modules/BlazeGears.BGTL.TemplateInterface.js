/*
Class: BlazeGears.BGTL.TemplateInterface

Parsed templates will implement this interface. It's just being used for documentation and has no actual functionality.

See Also:
	<BlazeGears.BGTL.parseTemplate>
*/
BlazeGears.BGTL.TemplateInterface = new function()
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
