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

// Class: BlazeGears.BGTL.TemplateInterface
// Compiled template objects will implement this interface.
// 
// Notes:
//   This class has no actual functionality, it just being used for documentation.
// 
// See Also:
//   <BlazeGears.BGTL.compileTemplate>
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
