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

// Class: BlazeGears.BGTL
// A singleton class that compiles HTML templates written in the BlazeGears Templating Language.
// 
// The language's syntax is based on a mix of JavaScript and <BottlePy's Simple Template at http://bottlepy.org/docs/dev/stpl.html>.
// 
// Superclasses:
//   <BlazeGears.BaseClass>
// 
// Control Tags:
//   There are three different control tags available:
//     - Statements are surround with percentage marks. (e.g. "%alert('This is a statement!');%")
//     - Escaped output is using the "{{" opening tag and the "}}" closing tag. (e.g. "{{escaped_output}}")
//     - Unescaped output is the same as the escaped one, but must have an exclamation mark in front of the input. (e.g. "{{!unescaped_output}}")
// 	
//   Apart from the closing tags, tags can be terminated by line breaks, too.
BlazeGears.BGTL = BlazeGears.Classes.declareSingleton(BlazeGears.BaseClass, {
	_parameters_var: "bgtl_parameters",
	_result_variable: "bgtl_result",
	
	// Method: compileTemplate
	// Compiles a string into a template object.
	// 
	// Parameters:
	//   template - The string to be parsed.
	// 
	// Return Value:
	//   Returns a template object, which implements the <BlazeGears.BGTL.TemplateInterface>.
	// 
	// See Also:
	//   <BlazeGears.BGTL.TemplateInterface>
	compileTemplate: function(self, template) {
		var breaker;
		var breakers;
		var config;
		var index;
		var length;
		var line_endings = ["\r\n", "\n", "\r"];
		var method;
		var new_index;
		var starters;
		var result;
		var script;
		
		config = {
			html: ["{{!", "}}"],
			statement: ["%", "%"],
			variable: ["{{", "}}"]
		};
		starters = {
			html: config.html[0],
			statement: config.statement[0],
			variable: config.variable[0]
		};
		
		// start declaring the object
		result = "new function() {";
		result += "this.render = function(" + self._parameters_var + ") {";
		result += "if (!BlazeGears.is(" + self._parameters_var + "))" + self._parameters_var + " = {};"
		result += "var " + self._result_variable + " = '';"
		result += "with (" + self._parameters_var + ") {";
		result += "try {";
		
		do {
			// find the nearest opening control tag
			index = -1;
			new_index = self._findNearest(template, starters);
			if (new_index != null) {
				method = new_index.method;
				index = new_index.index;
			}
			
			if (index != -1) {
				if ((index == 0 || template.charAt(index - 1) != "\\")) { // if it's not escaped
					// add all the prior text as escaped text
					if (index != 0) {
						result += self._result_variable + " += \"" + self._escape(template.substr(0, index)) + "\";";
					}
					
					// remove the opening tag
					template = template.substr(index + config[method][0].length);
					
					// find the nearest closing tag
					length = config[method][1].length;
					breakers = line_endings;
					if (length > 0) {
						breakers.push(config[method][1]);
					}
					breaker = self._findNearest(template, breakers);
					
					// there's none use the remaining text
					if (breaker == null) {
						index = template.length;
						length = 0;
					} else {
						index = breaker.index;
						length = breaker.value.length;
					}
					
					// handle the tag
					if (index != -1) {
						script = template.substr(0, index);
						template = template.substr(index + length);
						
						switch (method) {
							case "html":
								result += self._result_variable + " += " + script.replace() + ";";
								break;
							
							case "statement":
								result += script;
								break;
							
							case "variable":
								result += self._result_variable + " += BlazeGears.escapeHtml(" + script + ");";
								break;
						}
					}
				}
			}
		} while (index != -1);
		
		// add the rest as escaped text
		if (template.length > 0) {
			result += self._result_variable + "+=\"" + self._escape(template) + "\";";
		}
		
		// finish declaring the object
		result += "}";
		result += "catch (exception) {";
		result += "BlazeGears.error('BlazeGears.BGTL', exception);";
		result += "}";
		result += "}";
		result += "return " + self._result_variable + ";";
		result += "};";
		result += "this.execute = this.render;";
		result += "}";
		
		// try to compile the object
		try {
			result = eval(result)
		} catch (exception) {
			self.error("BlazeGears.BGTL", exception, result);
		}
		
		return result;
	},
	
	// Method: execute
	// Compiles, renders, and finally discards a template.
	// 
	// Arguments:
	//   template - The string to be compiled.
	//   [parameters = {}] - A dictionary where keys are the variables' names used for rendering.
	// 
	// Return Value:
	//   Returns the markup rendered by the template.
	// 
	// See Also:
	//   - <compileTemplate>
	//   - <BlazeGears.BGTL.TemplateInterface.execute>
	execute: function(self, template, parameters) {
		return self.renderTemplate(template, parameters);
	},
	
	// Method: parse
	// A deprecated alias for <compileTemplate>.
	parse: function(self, template) {
		return self.compileTemplate(template);
	},
	
	// escapes some characters that could cause some javascript syntax issues during compilation
	_escape: function(self, text) {
		return BlazeGears.escapeHtml(text, {9: "\\t", 10: "\\n", 13: "\\r", 34: "\\\"", 92: "\\"});
	},
	
	// finds the first occurrence of an array of strings (whichever is first)
	_findNearest: function(self, text, array) {
		var index;
		var result = null;
		
		for (var i in array) {
			index = text.indexOf(array[i]);
			if (index != -1 && (result == null || index < result.index)) {
				result = {index: index, method: i, value: array[i]};
			}
		}
		
		return result;
	}
});
