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

// Namespace: blazegears.bgtl
// Deals with HTML templating.
var blazegears = blazegears || {};
blazegears.bgtl = blazegears.bgtl || {};

/*
Class: blazegears.bgtl.Compiler
	Builds <Templates> from BlazeGears Templating Language v2 code.

Remarks:
	There are a few quirks that should be kept in mind while writing BGTLv2 templates:
		- Building a template while debug mode is enabled will add a lot of error catching logic, thus it's really important to disable it in production.
		- While templates are currently not sandboxed, it's unadvised to access variables other than what's available in the template's context.
		- Writing regular expressions in their literal form is not supported. The RegExp constructor does work.
		- At the time of writing this documentation the only browser that's capable of detecting the number of the line that caused the failure in an eval'd statement is <Mozilla Firefox at http://www.mozilla.org/en-US/firefox>, the rest of the browsers won't properly report error line numbers.

Syntax:
	BGTLv2 supports two kinds of tags, variable tags and construct tags:
		- Variable tags are enclosed by the {{ and }} delimiters. The expression between the two delimiters will be evaluated and the result will be stringified, HTML encoded, and added to the output.
		- Construct tags are enclosed by the {% and %} delimiters. Please see below the available constructs.

Constructs:
	if - Takes one argument, the *condition*. Evaluates the *condition* and if it's *true*, the block it encloses will be rendered, otherwise it will be ignored. Needs to be closed with an *elif*, *else*, or *end* construct.
	elif - Takes one argument, the *condition*. Must be preceded by an *if* or *elif* construct. If the preceding *if* and *elif* constructs were ignored, it evaluates the *condition* and if it's *true*, the block it encloses will be rendered, otherwise it will be ignored. Needs to be closed with an *elif*, *else*, or *end* construct.
	else - Must be preceded by an *if* or *elif* construct. If the preceding *if* and *elif* constructs were ignored, the block it encloses will be rendered, otherwise it will be ignored. Needs to be closed with an *end* construct.
	foreach-as - Takes two arguments, the *iterator* and the *iteratee*, separated by the *as* keyword. Iterates through every owned property of the *iteratee*. For each owned property the property's value will be assingned to the *iterator* and the enclosed block will be rendered. Needs to be closed with an *end* construct.
	foreach-in - Takes two arguments, the *iterator* and the *iteratee*, separated by the *in* keyword. Iterates through every owned property of the *iteratee*. For each owned property the property's key will be assingned to the *iterator* and the enclosed block will be rendered. Needs to be closed with an *end* construct.
	raw - Works similarly to a variable tag, but it doesn't do any HTML encoding on the result.
	end - Used for closing blocks started by other constructs.

Examples:
	The basic usage of the constructs:
	(begin code)
		var compiler = new blazegears.bgtl.Compiler();
		var lexeme;
		var template;
		
		// if/elif/else constructs:
		lexeme = "{%if (this.value === 1)%}if-branch";
		lexeme += "{%elif (this.value === 2)%}elif-branch";
		lexeme += "{%else%}else-branch{%end%}";
		template = compiler.buildTemplate(lexeme);
		template.render({ value: 1 }); // if-branch
		template.render({ value: 2 }); // elif-branch
		template.render({ value: 0 }); // else-branch
		
		// foreach-as
		lexeme = "{%foreach (var item as this)%}{{item}}{%end%}";
		template = compiler.buildTemplate(lexeme);
		template.render(["A", "&", "B"]); // A&amp;B
		
		// foreach-in
		lexeme = "{%foreach (var item in this)%}{{this[item]}}{%end%}";
		template = compiler.buildTemplate(lexeme);
		template.render(["A", "&", "B"]); // A&amp;B
		
		// raw
		lexeme = "{%raw(this.value)%}";
		template = compiler.buildTemplate(lexeme);
		template.render({ value: "<h1>A&B</h1>" }); // <h1>A&B</h1>
	(end)
	A more complex example:
	(begin code)
		<div id="outputContainer"></div>
		<script id="lexemeContainer" type="text/bgtl">
			<ul>
				{%foreach (var item as this)%}
					<li>
						{%if (item.link === undefined)%}
							{{item.title}}
						{%else%}
							<a href="{{item.link}}">{{item.title}}</a>
						{%end%}
					</li>
				{%end%}
			</ul>
		</script>
		<script type="text/javascript">
			var compiler = new blazegears.bgtl.Compiler();
			var lexeme = document.getElementById("lexemeContainer").innerHTML;
			var template = compiler.buildTemplate(lexeme);
			
			var items = [
				{ title: "Lorem Ipsum", link: "http://www.example.com" },
				{ title: "Dolor Sit Amet" },
				{ title: "Consectetur Adipiscing Elit" }
			];
			
			document.getElementById("outputContainer").innerHTML = template.render(items);
		</script>
	(end)
*/
blazegears.bgtl.Compiler = function() {
	var Compiler = blazegears.bgtl.Compiler;
	this._constructs = [];
	this._is_debug_mode_enabled = false;
	this._lexer = new blazegears.bgtl._Lexer();
	this._createConstruct("elif", Compiler._generateElifConstruct);
	this._createConstruct("else", Compiler._generateElseConstruct);
	this._createConstruct("end", Compiler._generateEndConstruct);
	this._createConstruct("foreach", Compiler._generateForeachConstruct);
	this._createConstruct("if", Compiler._generateIfConstruct);
	this._createConstruct("raw", Compiler._generateRawConstruct);
}

/*
Method: isDebugModeEnabled
	Determines if debug mode is enabled. Defaults to *false*.

Return Value:
	(*Boolean*) *true* if debug mode is enabled, otherwise *false*.
*/
blazegears.bgtl.Compiler.prototype.isDebugModeEnabled = function() {
	return this._is_debug_mode_enabled;
}

/*
Method: enableDebugMode
	Setter for <isDebugModeEnabled>

Arguments:
	[enable = false] - (*Boolean*) The new value.
*/
blazegears.bgtl.Compiler.prototype.enableDebugMode = function(enable) {
	this._is_debug_mode_enabled = Boolean(enable);
}

/*
Method: buildTemplate
	Builds a <Template> from BGTLv2 code.

Arguments:
	[lexeme = ""] - (*String*) The code to build the template from.

Exceptions:
	blazegears.bgtl.CompilingError - An error occurred during the compiling of the template.
	blazegears.bgtl.LexingError - An error occurred during the lexical parsing of the template.
*/
blazegears.bgtl.Compiler.prototype.buildTemplate = function(lexeme) {
	var column_number;
	var code_collection;
	var error_copy;
	var error_line_number;
	var error_token;
	var line_number;
	var result;
	var result = new blazegears.bgtl.Template();
	var tokens;
	
	tokens = this._lexer.tokenizeLexeme(blazegears._forceParseString(lexeme));
	code_collection = this._compileTemplate(tokens);
	try {
		result._render_callback = new Function(code_collection.toString());
	} catch (error) {
		// hack: determine which line caused the exception, only works in firefox
		try {
			eval("var testEval = function() { " + code_collection.toString() + " };");
		} catch (error) {
			try {
				error_copy = error.constructor();
				error_line_number = error.lineNumber - error_copy.lineNumber + 4;
				error_token = code_collection.getTokenOnLine(error_line_number);
				column_number = error_token.column_number;
				line_number = error_token.line_number;
			} catch (error) {
				column_number = 0;
				line_number = 0;
			}
		}
		throw new blazegears.bgtl.CompilingError(line_number, column_number, null, error);
	}
	
	return result;
}

// the name of the variable that will be returned by the rendering method
blazegears.bgtl.Compiler._RESULT_VARIABLE_NAME = "_bgtl_result";

// starts generating the code for the tokens
blazegears.bgtl.Compiler.prototype._compileTemplate = function(tokens) {
	var indentation = this._generateIndentation(1);
	var indentation2 = this._generateIndentation(2);
	var indentation3 = this._generateIndentation(3);
	var result = new blazegears.bgtl._CodeCollection(this._is_debug_mode_enabled);
	var result_variable_name = this.constructor._RESULT_VARIABLE_NAME;
	
	result.addCode(null, indentation + "try {");
	result.addCode(null, indentation2 + "var " + result_variable_name + " = \"\";");
	result.addCode(null, indentation2);
	this._generateToken(result, tokens, 2);
	result.addCode(null, indentation2);
	result.addCode(null, indentation2 + "return " + result_variable_name + ";");
	result.addCode(null, indentation + "} catch (error) {");
	result.addCode(null, indentation2 + "if (error instanceof blazegears.bgtl.RenderingError) {");
	result.addCode(null, indentation3 + "throw error;");
	result.addCode(null, indentation2 + "} else {");
	result.addCode(null, indentation3 + "throw blazegears.bgtl.RenderingError._renderingFailed(error);");
	result.addCode(null, indentation2 + "}");
	result.addCode(null, indentation + "}");
	
	return result;
}

// creates a new code generator callback that corresponds to a token keyword
blazegears.bgtl.Compiler.prototype._createConstruct = function(name, callback) {
	this._constructs.push(new blazegears.bgtl._Construct(name, callback));
}

// escapes the characters that should be avoided in a javascript string literal
blazegears.bgtl.Compiler.prototype._escapeLiteral = function(literal) {
	var code;
	var i;
	var result = "";
	
	literal = literal.toString();
	for (i = 0; i < literal.length; i++) {
		code = literal.charCodeAt(i);
		if (code === 10) {
			result += "\\n";
		} else if (code === 13) {
			result += "\\r";
		} else if (code === 34) {
			result += "\\\"";
		} else if (code === 92) {
			result += "\\\\";
		} else if (code < 32 || code > 127) {
			result += "\\u" + blazegears._padStringLeft(code.toString(16), "0", 4);
		} else {
			result += literal.charAt(i);
		}
	}
	
	return result;
}

// generates a string literal of tabs
blazegears.bgtl.Compiler.prototype._generateIndentation = function(level) {
	var i;
	var result = "";
	
	for (i = 0; i < level; ++i) {
		result += "\t";
	}
	
	return result;
}

// generates the code for a token
blazegears.bgtl.Compiler.prototype._generateToken = function(result, token, level) {
	var TokenType = blazegears.bgtl._TokenType;
	var construct;
	var i;
	var indentation;
	var indentation2;
	var result_variable_name = this.constructor._RESULT_VARIABLE_NAME;
	var token_count;
	var tokens;
	
	if (token instanceof blazegears.bgtl._TokenCollection) {
		tokens = token.getTokens();
		token_count = tokens.length;
		for (i = 0; i < token_count; ++i) {
			this._generateToken(result, tokens[i], level);
		}
	} else {
		indentation = this._generateIndentation(level);
		indentation2 = this._generateIndentation(level + 1);
		switch (token.type) {
			case TokenType.CONSTRUCT:
				construct = this._getConstruct(token);
				construct.callback.call(this, result, token, level);
				break;
			
			case TokenType.MARKUP:
				if (this._is_debug_mode_enabled) {
					result.addCode(token, indentation + "try {");
					result.addCode(token, indentation2 + result_variable_name + " += \"" + this._escapeLiteral(token.value) + "\";");
					result.addCode(token, indentation + "} catch (error) {");
					result.addCode(token, indentation2 + "throw blazegears.bgtl.RenderingError._markupRenderingFailed(" + token.line_number + ", " + token.column_number + ", error);");
					result.addCode(token, indentation + "}");
				} else {
					result.addCode(token, indentation + result_variable_name + " += \"" + this._escapeLiteral(token.value) + "\";");
				}
				break;
			
			case TokenType.VARIABLE:
				if (this._is_debug_mode_enabled) {
					result.addCode(token, indentation + "try {");
					result.addCode(token, indentation2 + result_variable_name + " += BlazeGears.escapeHtml(" + token.value + ");");
					result.addCode(token, indentation + "} catch (error) {");
					result.addCode(token, indentation2 + "throw blazegears.bgtl.RenderingError._variableRenderingFailed(" + token.line_number + ", " + token.column_number + ", error);");
					result.addCode(token, indentation + "}");
				} else {
					result.addCode(token, indentation + result_variable_name + " += BlazeGears.escapeHtml(" + token.value + ");");
				}
				break;
		}
	}
}

// searches for a construct by its name
blazegears.bgtl.Compiler.prototype._getConstruct = function(token) {
	var i;
	var constructs = this._constructs;
	var construct_count = constructs.length;
	var result = null;
	
	for (i = 0; i < construct_count; ++i) {
		if (constructs[i].name === token.value) {
			result = constructs[i];
			break;
		}
	}
	if (result === null) {
		throw blazegears.bgtl.CompilingError._invalidConstruct(token);
	}
	
	return result;
}

// generates the code for an elif construct token
blazegears.bgtl.Compiler._generateElifConstruct = function(result, token, level) {
	var indentation = this._generateIndentation(level);
	
	if (this._is_debug_mode_enabled) {
		result.addCode(token, indentation + "else if ((function() { try { return " + token.argument + "; } catch (error) { throw blazegears.bgtl.RenderingError._elifRenderingFailed(" + token.line_number + ", " + token.column_number + ", error); } })()) {");
	} else {
		result.addCode(token, indentation + "else if (" + token.argument + ") {");
	}
	this._generateToken(result, token.children, level + 1);
	result.addCode(token, indentation + "}");
}

// generates the code for an else construct token
blazegears.bgtl.Compiler._generateElseConstruct = function(result, token, level) {
	var indentation = this._generateIndentation(level);
	
	result.addCode(token, indentation + "else {");
	this._generateToken(result, token.children, level + 1);
	result.addCode(token, indentation + "}");
}

// generates the code for an end construct token
blazegears.bgtl.Compiler._generateEndConstruct = function(result, token, level) { }

// generates the code for a foreach construct token
blazegears.bgtl.Compiler._generateForeachConstruct = function(result, token, level) {
	var argument_parts;
	var argument_syntax = /^((\s*var\s+)?[A-Za-z_$]+)\s+(as|in)\s+(.+)\s*$/;
	var indentation = this._generateIndentation(level);
	var indentation2 = this._generateIndentation(level + 1);
	var indentation3 = this._generateIndentation(level + 2);
	var indentation4 = this._generateIndentation(level + 3);
	var is_in;
	var iteratee;
	var iterator;
	
	try {
		argument_parts = argument_syntax.exec(token.argument);
		iterator = argument_parts[1];
		is_in = argument_parts[3] === "in";
		iteratee = argument_parts[4];
	} catch (error) {
		throw blazegears.bgtl.CompilingError._invalidArgument(token);
	}
	
	result.addCode(token, indentation + "var _bgtl_closure = function() {");
	this._generateToken(result, token.children, level + 1);
	result.addCode(token, indentation + "}");
	
	if (this._is_debug_mode_enabled) {
		result.addCode(token, indentation + "try {");
		result.addCode(token, indentation2 + "var _bgtl_iteratee = " + iteratee + ";");
		result.addCode(token, indentation + "} catch (error) {");
		result.addCode(token, indentation2 + "throw blazegears.bgtl.RenderingError._foreachRenderingFailed(" + token.line_number + ", " + token.column_number + ", error);");
		result.addCode(token, indentation + "}");
	} else {
		result.addCode(token, indentation + "var _bgtl_iteratee = " + iteratee + ";");
	}
	
	result.addCode(token, indentation + "var _bgtl_iterator;");
	result.addCode(token, indentation + "if (BlazeGears.isArray(_bgtl_iteratee)) {");
	result.addCode(token, indentation2 + "for (_bgtl_iterator = 0; _bgtl_iterator < _bgtl_iteratee.length; ++_bgtl_iterator) {");
	if (is_in) {
		result.addCode(token, indentation3 + iterator + " = _bgtl_iterator;");
	} else {
		result.addCode(token, indentation3 + iterator + " = _bgtl_iteratee[_bgtl_iterator];");
	}
	result.addCode(token, indentation3 + "_bgtl_closure.call(this);");
	result.addCode(token, indentation2 + "}");
	result.addCode(token, indentation + "}");
	
	result.addCode(token, indentation + "else {");
	result.addCode(token, indentation2 + "for (_bgtl_iterator in _bgtl_iteratee) {");
	result.addCode(token, indentation3 + "if (_bgtl_iteratee.hasOwnProperty(_bgtl_iterator)) {");
	if (is_in) {
		result.addCode(token, indentation4 + iterator + " = _bgtl_iterator;");
	} else {
		result.addCode(token, indentation4 + iterator + " = _bgtl_iteratee[_bgtl_iterator];");
	}
	result.addCode(token, indentation4 + "_bgtl_closure.call(this);");
	result.addCode(token, indentation3 + "}");
	result.addCode(token, indentation2 + "}");
	result.addCode(token, indentation + "}");
}

// generates the code for an if construct token
blazegears.bgtl.Compiler._generateIfConstruct = function(result, token, level) {
	var indentation = this._generateIndentation(level);
	var indentation2 = this._generateIndentation(level + 1);
	
	if (this._is_debug_mode_enabled) {
		result.addCode(token, indentation + "try {");
		result.addCode(token, indentation2 + "var _bgtl_conditional = (" + token.argument + ");");
		result.addCode(token, indentation + "} catch (error) {");
		result.addCode(token, indentation2 + "throw blazegears.bgtl.RenderingError._ifRenderingFailed(" + token.line_number + ", " + token.column_number + ", error);");
		result.addCode(token, indentation + "}");
	} else {
		result.addCode(token, indentation + "var _bgtl_conditional = (" + token.argument + ");");
	}
	result.addCode(token, indentation + "if (_bgtl_conditional) {");
	this._generateToken(result, token.children, level + 1);
	result.addCode(token, indentation + "}");
}

// generates the code for a raw construct token
blazegears.bgtl.Compiler._generateRawConstruct = function(result, token, level) {
	var i;
	var indentation = this._generateIndentation(level);
	var indentation2 = this._generateIndentation(level + 1);
	
	if (this._is_debug_mode_enabled) {
		result.addCode(token, indentation + "try {");
		result.addCode(token, indentation2 + this.constructor._RESULT_VARIABLE_NAME + " += " + token.argument + ";");
		result.addCode(token, indentation + "} catch (error) {");
		result.addCode(token, indentation2 + "throw blazegears.bgtl.RenderingError._rawRenderingFailed(" + token.line_number + ", " + token.column_number + ", error);");
		result.addCode(token, indentation + "}");
	} else {
		result.addCode(token, indentation + this.constructor._RESULT_VARIABLE_NAME + " += " + token.argument + ";");
	}
}

// represents a collection of lines of codes associated with the tokens they were generated from
blazegears.bgtl._CodeCollection = function(is_debug_mode_enabled) {
	this._is_debug_mode_enabled = is_debug_mode_enabled;
	this._lines = [];
	this._tokens = [];
}

// adds a new line of code
blazegears.bgtl._CodeCollection.prototype.addCode = function(token, code) {
	this._lines.push(code);
	if (this._is_debug_mode_enabled) {
		this._tokens.push(token);
	}
}

// gets the token that generated a specific line
blazegears.bgtl._CodeCollection.prototype.getTokenOnLine = function(line) {
	var result = null;
	
	--line;
	if (line < this._tokens.length) {
		result = this._tokens[line];
	}
	
	return result;
}

// unites all the lines of codes into a complete script
blazegears.bgtl._CodeCollection.prototype.toString = function() {
	return this._lines.join("\n");
}

// stores the code generator callback for a construct token
blazegears.bgtl._Construct = function(name, callback) {
	this.callback = callback;
	this.name = name;
}

// represents a sought delimiter in a lexeme
blazegears.bgtl._DelimiterMatch = function(delimiter, offset) {
	this.delimiter = delimiter;
	this.offset = offset;
}

// represents a lexer keyword
blazegears.bgtl._Keyword = function(name, requires_argument, is_block, end_keyword) {
	if (end_keyword === undefined) end_keyword = null;
	if (is_block === undefined) is_block = false;
	if (requires_argument === undefined) requires_argument = false;
	this.end_keyword = end_keyword;
	this.is_block = is_block;
	this.name = name;
	this.requires_argument = requires_argument;
}

// the default lexical parser for bgtl
blazegears.bgtl._Lexer = function() {
	this._keywords = [];
	this.createKeyword("elif", true, true, ["end", "elif", "else"]);
	this.createKeyword("else", false, true, "end");
	this.createKeyword("end");
	this.createKeyword("foreach", true, true, "end");
	this.createKeyword("if", true, true, ["end", "elif", "else"]);
	this.createKeyword("raw", true);
}

// creates a new keyword
blazegears.bgtl._Lexer.prototype.createKeyword = function(name, requires_argument, is_block, end_keyword) {
	this._keywords.push(new blazegears.bgtl._Keyword(name, requires_argument, is_block, end_keyword));
}

// finds the next subtring that isn't preceded with a backslash
blazegears.bgtl._Lexer.prototype.findNextDelimiter = function(needles, haystack, offset, must_find, line_number, column_number, is_escapeable, ignore_strings, ignore_parenthesised) {
	if (must_find === undefined) { must_find = false; }
	if (is_escapeable === undefined) { is_escapeable = true; }
	if (ignore_parenthesised === undefined) { ignore_parenthesised = true; }
	if (ignore_strings === undefined) { ignore_strings = true; }
	
	var DelimiterMatch = blazegears.bgtl._DelimiterMatch;
	var current_offset;
	var haystack_length = haystack.length;
	var i;
	var is_best_match;
	var is_escaped;
	var literal_closing;
	var needle;
	var needle_count;
	var original_needles;
	var result = null;
	
	// if string literals or parenthesised content is ignored we also need to search for those while keeping track of the original needles
	if (!ignore_parenthesised || !ignore_strings) {
		original_needles = needles.slice();
		if (!ignore_parenthesised) {
			needles.push("(");
		}
		if (!ignore_strings) {
			needles.push("\"");
			needles.push("'");
		}
	}
	needle_count = needles.length;
	
	for (i = 0; i < needle_count; ++i) {
		needle = needles[i];
		current_offset = offset;
		
		do {
			current_offset = haystack.indexOf(needle, current_offset);
			is_escaped = is_escapeable && current_offset > 0 && haystack.charAt(current_offset - 1) === "\\";
			
			if (!is_escaped) {
				is_best_match = current_offset > -1 && (result === null || current_offset < result.offset);
				if (is_best_match) {
					result = new DelimiterMatch(needle, current_offset);
				}
			} else {
				++current_offset;
			}
		} while (is_escaped && current_offset < haystack_length);
	}
	
	// the match was within a string literal or parenthesised content, so we must find the end of it, and continue the search from there
	if (result !== null) {
		if (!ignore_parenthesised && result.delimiter === "(") {
			literal_closing = this.findNextDelimiter([")"], haystack, result.offset + 1, true, line_number, column_number, true, false, false);
			result = this.findNextDelimiter(original_needles, haystack, literal_closing.offset + 1, must_find, line_number, column_number, is_escapeable, ignore_strings, false);
		}
		if (!ignore_strings && (result.delimiter === "\"" || result.delimiter === "'")) {
			literal_closing = this.findNextDelimiter([result.delimiter], haystack, result.offset + 1, true, line_number, column_number);
			result = this.findNextDelimiter(original_needles, haystack, literal_closing.offset + 1, must_find, line_number, column_number, is_escapeable, false, ignore_parenthesised);
		}
	} else if (must_find) {
		throw blazegears.bgtl.LexingError._missingDelimiter(needles[0], line_number, column_number);
	}
	
	return result;
}

// finds the next tag
blazegears.bgtl._Lexer.prototype.findNextTag = function(lexeme, offset) {
	var TokenType = blazegears.bgtl._TokenType;
	var argument_opening;
	var argument_closing;
	var closing_delimiter;
	var construct_tag_closing_delimiter = "%}";
	var construct_tag_opening_delimiter = "{%";
	var construct_tag_parts;
	var construct_tag_syntax = /^\s*([A-Za-z0-9_]+)(\s*\(\s*(.+)\s*\))?\s*$/;
	var result = null;
	var tag_body;
	var tag_closing;
	var tag_opening;
	var variable_tag_closing_delimiter = "}}";
	var variable_tag_opening_delimiter = "{{";
	
	tag_opening = this.findNextDelimiter([variable_tag_opening_delimiter, construct_tag_opening_delimiter], lexeme, offset, false, 0, 0, false);
	if (tag_opening !== null) {
		result = new blazegears.bgtl._TagMatch(tag_opening.offset);
		if (tag_opening.delimiter === variable_tag_opening_delimiter) {
			closing_delimiter = variable_tag_closing_delimiter;
			result.type = TokenType.VARIABLE;
		} else {
			closing_delimiter = construct_tag_closing_delimiter;
			result.type = TokenType.CONSTRUCT;
		}
		result.column_number = blazegears._getColumnNumber(lexeme, result.offset);
		result.line_number = blazegears._getLineNumber(lexeme, result.offset);
		
		tag_closing = this.findNextDelimiter([closing_delimiter], lexeme, tag_opening.offset + 2, true, result.line_number, result.column_number, false, false);
		tag_body = lexeme.substr(tag_opening.offset + tag_opening.delimiter.length, tag_closing.offset - tag_closing.delimiter.length - tag_opening.offset);
		result.length = tag_closing.offset + tag_closing.delimiter.length - tag_opening.offset;
		
		if (result.type == TokenType.CONSTRUCT) {
			construct_tag_parts = construct_tag_syntax.exec(tag_body);
			if (construct_tag_parts !== null && construct_tag_parts.length >= 2) {
				result.value = construct_tag_parts[1];
			} else {
				throw blazegears.bgtl.LexingError._invalidConstructSyntax(result.line_number, result.column_number);
			}
			result.keyword = this.getKeyword(result);
			
			if (construct_tag_parts.length >= 4 && construct_tag_parts[3] !== undefined && construct_tag_parts[3].length > 0) {
				argument_opening = this.findNextDelimiter(["("], tag_body, 0, false, result.line_number, result.column_number, false);
				argument_closing = this.findNextDelimiter([")"], tag_body, argument_opening.offset + 1, true, result.line_number, result.column_number, true, false, false);
				result.argument = tag_body.substr(argument_opening.offset + 1, argument_closing.offset - 1 - argument_opening.offset);
			} else if (result.keyword.requires_argument) {
				throw blazegears.bgtl.LexingError._missingArgument(result.line_number, result.column_number);
			}
		} else {
			result.value = tag_body;
		}
	}
	
	return result;
}

// searches for a keyword by its name
blazegears.bgtl._Lexer.prototype.getKeyword = function(token) {
	var i;
	var keywords = this._keywords;
	var keyword_count = keywords.length;
	var result = null;
	
	for (i = 0; i < keyword_count; ++i) {
		if (keywords[i].name === token.value) {
			result = keywords[i];
			break;
		}
	}
	if (result === null) {
		throw blazegears.bgtl.LexingError._invalidKeyword(token.value, token.line_number, token.column_number);
	}
	
	return result;
}

// parses a lexeme and converts it into a token collection
blazegears.bgtl._Lexer.prototype.tokenizeLexeme = function(lexeme, offset, closing_keyword) {
	if (closing_keyword === undefined) closing_keyword = null;
	if (offset === undefined) offset = 0;
	
	var Token = blazegears.bgtl._Token;
	var TokenType = blazegears.bgtl._TokenType;
	var child_closing_offset = 0;
	var children;
	var last_child;
	var lexeme_length;
	var next_tag;
	var relative_tag_offset;
	var result = new blazegears.bgtl._TokenCollection();
	var token;
	var token_type;
	
	lexeme = lexeme.toString();
	lexeme_length = lexeme.length;
	while (offset < lexeme_length) {
		next_tag = this.findNextTag(lexeme, offset);
		if (next_tag !== null) {
			// anything before the tag is considered markup
			relative_tag_offset = next_tag.offset - offset;
			if (relative_tag_offset > 0) {
				result.addToken(this.tokenizeLiteralMarkup(lexeme, offset, relative_tag_offset));
			}
			
			offset = next_tag.offset + next_tag.length;
			token = new Token(next_tag.type, next_tag.value, next_tag.offset, next_tag.length, next_tag.line_number, next_tag.column_number);
			if (token.type === TokenType.CONSTRUCT) {
				// if the found tag is a closing tag to the current block tag, drop back one level
				if (closing_keyword !== null && token.offset >= child_closing_offset) {
					if (closing_keyword === token.value || (BlazeGears.isArray(closing_keyword) && BlazeGears.isInArray(token.value, closing_keyword))) {
						return result;
					}
				}
				
				token.argument = next_tag.argument;
				if (next_tag.keyword.is_block) {
					token.children = this.tokenizeLexeme(lexeme, offset, next_tag.keyword.end_keyword);
					children = token.children.getTokens();
					if (children.length > 0) {
						last_child = children[children.length - 1];
						offset = last_child.offset + last_child.length;
						
						// make sure the child's closing tag won't be recognised as the parent's closing tag
						next_tag = this.findNextTag(lexeme, offset);
						if (next_tag !== null) {
							child_closing_offset = next_tag.offset + next_tag.length;
						} else {
							// if we couldn't find a tag after the last child, it means that the block closing was missing
							throw blazegears.bgtl.LexingError._missingClosingConstruct(token.line_number, token.column_number);
						}
					}
				}
			}
			result.addToken(token);
		} else {
			result.addToken(this.tokenizeLiteralMarkup(lexeme, offset, lexeme_length - offset));
			offset = lexeme_length;
		}
	}
	
	return result;
}

// creates a markup token
blazegears.bgtl._Lexer.prototype.tokenizeLiteralMarkup = function(lexeme, offset, length) {
	var Token = blazegears.bgtl._Token;
	var TokenType = blazegears.bgtl._TokenType;
	var column_number = blazegears._getColumnNumber(lexeme, offset);
	var line_number = blazegears._getLineNumber(lexeme, offset);
	var literal_markup = lexeme.substr(offset, length);
	var result = new Token(TokenType.MARKUP, literal_markup, offset, length, line_number, column_number)
	return result;
}

// represents a sought tag in a lexeme
blazegears.bgtl._TagMatch = function(offset) {
	this.argument = null;
	this.column_number = 0;
	this.keyword = null;
	this.length = 0;
	this.line_number = 0;
	this.offset = offset;
	this.type = blazegears.bgtl._TokenType.UNKNOWN;
	this.value = null;
}

// represents a parsed token
blazegears.bgtl._Token = function(type, value, offset, length, line_number, column_number) {
	this.argument = null;
	this.children = new blazegears.bgtl._TokenCollection();
	this.column_number = column_number;
	this.offset = offset;
	this.length = length;
	this.line_number = line_number;
	this.type = type;
	this.value = value;
}

// enumeration for token types
blazegears.bgtl._TokenType = {
	UNKNOWN: "UNKNOWN",
	CONSTRUCT: "CONSTRUCT",
	MARKUP: "MARKUP",
	VARIABLE: "VARIABLE"
};

// a collection of tokens
blazegears.bgtl._TokenCollection = function() {
	this._tokens = [];
}

// adds a new token to the collection
blazegears.bgtl._TokenCollection.prototype.addToken = function(token) {
	this._tokens.push(token);
}

// returns a shallow clone of the token collection array
blazegears.bgtl._TokenCollection.prototype.getTokens = function() {
	return this._tokens.slice();
}

/*
Class: blazegears.bgtl.Error
	The exception that will be thrown when an error occurs during the building or the rendering of a template.

Parent Class:
	<Error>

Arguments:
	[line_number = 0] - (*Number*) Setter for <getLineNumber>.
	[column_number = 0] - (*Number*) Setter for <getColumnNumber>.
	[message = null] - (*String*) Will be chained to <Error>'s constructor.
	[inner_error = null] - (*Error*) Will be chained to <Error>'s constructor.

Exceptions:
	blazegears.ArgumentError - *inner_error* isn't an instance of *Error* or *null*.
*/
blazegears.bgtl.Error = function(line_number, column_number, message, inner_error) {
	blazegears.Error.call(this, message, inner_error);
	this._column_number = blazegears._forceParseInt(column_number);
	this._line_number = blazegears._forceParseInt(line_number);
	this.message = blazegears.Error._composeMessage("Templating failed on line " + this._line_number + " at column " + this._column_number, message, inner_error);
	this.name = "blazegears.bgtl.Error";
}
blazegears.bgtl.Error.prototype = new blazegears.Error();
blazegears.bgtl.Error.prototype.constructor = blazegears.bgtl.Error;

// Method: getColumnNumber
// Gets the number of the column where the error occured as a *Number*.
blazegears.bgtl.Error.prototype.getColumnNumber = function() {
	return this._column_number;
}

// Method: getLineNumber
// Gets number of the line that caused the error as a *Number*.
blazegears.bgtl.Error.prototype.getLineNumber = function() {
	return this._line_number;
}

/*
Class: blazegears.bgtl.CompilingError
	The exception that will be thrown when an error occurs during the compilation of a template.

Parent Class:
	<bgtl.Error>

Arguments:
	[line_number = 0] - (*Number*) Will be chained to <bgtl.Error>'s constructor.
	[column_number = 0] - (*Number*) Will be chained to <bgtl.Error>'s constructor.
	[message = null] - (*String*) Will be chained to <bgtl.Error>'s constructor.
	[inner_error = null] - (*Error*) Will be chained to <bgtl.Error>'s constructor.

Exceptions:
	blazegears.ArgumentError - *inner_error* isn't an instance of *Error* or *null*.
*/
blazegears.bgtl.CompilingError = function(line_number, column_number, message, inner_error) {
	blazegears.bgtl.Error.call(this, line_number, column_number, message, inner_error);
	this.message = blazegears.Error._composeMessage("Compilation failed on line " + this._line_number + " at column " + this._column_number, message, inner_error);
	this.name = "blazegears.bgtl.CompilingError";
}
blazegears.bgtl.CompilingError.prototype = new blazegears.bgtl.Error();
blazegears.bgtl.CompilingError.prototype.constructor = blazegears.bgtl.CompilingError;

// generates the message for an invalid argument
blazegears.bgtl.CompilingError._invalidArgument = function(token) {
	var message = blazegears.Error._composeMessage("Invalid construct argument on line " + token.line_number + " at column " + token.column_number, null, token.argument);
	return new blazegears.bgtl.CompilingError(token.line_number, token.column_number, message);
}

// generates the message for an invalid construct
blazegears.bgtl.CompilingError._invalidConstruct = function(token) {
	var message = "Invalid construct on line " + token.line_number + " at column " + token.column_number + ".";
	return new blazegears.bgtl.CompilingError(token.line_number, token.column_number, message);
}

/*
Class: blazegears.bgtl.LexingError
	The exception that will be thrown when an error occurs during the lexical parsing of a template.

Parent Class:
	<bgtl.Error>

Arguments:
	[line_number = 0] - (*Number*) Will be chained to <bgtl.Error>'s constructor.
	[column_number = 0] - (*Number*) Will be chained to <bgtl.Error>'s constructor.
	[message = null] - (*String*) Will be chained to <bgtl.Error>'s constructor.
	[inner_error = null] - (*Error*) Will be chained to <bgtl.Error>'s constructor.

Exceptions:
	blazegears.ArgumentError - *inner_error* isn't an instance of *Error* or *null*.
*/
blazegears.bgtl.LexingError = function(line_number, column_number, message, inner_error) {
	blazegears.bgtl.Error.call(this, line_number, column_number, message, inner_error);
	this.message = blazegears.Error._composeMessage("Lexing failed on line " + this._line_number + " at column " + this._column_number, message, inner_error);
	this.name = "blazegears.bgtl.LexingError";
}
blazegears.bgtl.LexingError.prototype = new blazegears.bgtl.Error();
blazegears.bgtl.LexingError.prototype.constructor = blazegears.bgtl.LexingError;

// generates the message for an invalid construct syntax
blazegears.bgtl.LexingError._invalidConstructSyntax = function(line_number, column_number) {
	var message = "Invalid construct syntax on line " + line_number + " at column " + column_number + ".";
	return new blazegears.bgtl.LexingError(line_number, column_number, message);
}

// generates the message for an invalid keyword
blazegears.bgtl.LexingError._invalidKeyword = function(keyword, line_number, column_number) {
	var message = "Invalid keyword on line " + line_number + " at column " + column_number + ": " + keyword;
	return new blazegears.bgtl.LexingError(line_number, column_number, message);
}

// generates the message for a missing argument
blazegears.bgtl.LexingError._missingArgument = function(line_number, column_number) {
	var message = "Missing argument on line " + line_number + " at column " + column_number + ".";
	return new blazegears.bgtl.LexingError(line_number, column_number, message);
}

// generates the message for a missing closing construct
blazegears.bgtl.LexingError._missingClosingConstruct = function(line_number, column_number) {
	var message = "Missing closing construct on line " + line_number + " at column " + column_number + ".";
	return new blazegears.bgtl.LexingError(line_number, column_number, message);
}

// generates the message for a missing delimiter
blazegears.bgtl.LexingError._missingDelimiter = function(delimiter, line_number, column_number) {
	var message = "Missing " + delimiter + " on line " + line_number + " at column " + column_number + ".";
	return new blazegears.bgtl.LexingError(line_number, column_number, message);
}

/*
Class: blazegears.bgtl.RenderingError
	The exception that will be thrown when an error occurs during the rendering of a template.

Parent Class:
	<bgtl.Error>

Arguments:
	[line_number = 0] - (*Number*) Will be chained to <bgtl.Error>'s constructor.
	[column_number = 0] - (*Number*) Will be chained to <bgtl.Error>'s constructor.
	[message = null] - (*String*) Will be chained to <bgtl.Error>'s constructor.
	[inner_error = null] - (*Error*) Will be chained to <bgtl.Error>'s constructor.

Exceptions:
	blazegears.ArgumentError - *inner_error* isn't an instance of *Error* or *null*.
*/
blazegears.bgtl.RenderingError = function(line_number, column_number, message, inner_error) {
	blazegears.bgtl.Error.call(this, line_number, column_number, message, inner_error);
	this.message = blazegears.Error._composeMessage("Rendering failed on line " + this._line_number + " at column " + this._column_number, message, inner_error);
	this.name = "blazegears.bgtl.RenderingError";
}
blazegears.bgtl.RenderingError.prototype = new blazegears.bgtl.Error();
blazegears.bgtl.RenderingError.prototype.constructor = blazegears.bgtl.RenderingError;

// generates the message for a failed elif rendering
blazegears.bgtl.RenderingError._elifRenderingFailed = function(line_number, column_number, inner_error) {
	var message = blazegears.Error._composeMessage("Elif rendering failed on line " + line_number + " at column " + column_number, null, inner_error);
	return new blazegears.bgtl.RenderingError(line_number, column_number, message, inner_error);
}

// generates the message for a failed foreach rendering
blazegears.bgtl.RenderingError._foreachRenderingFailed = function(line_number, column_number, inner_error) {
	var message = blazegears.Error._composeMessage("Foreach rendering failed on line " + line_number + " at column " + column_number, null, inner_error);
	return new blazegears.bgtl.RenderingError(line_number, column_number, message, inner_error);
}

// generates the message for a failed if rendering
blazegears.bgtl.RenderingError._ifRenderingFailed = function(line_number, column_number, inner_error) {
	var message = blazegears.Error._composeMessage("If rendering failed on line " + line_number + " at column " + column_number, null, inner_error);
	return new blazegears.bgtl.RenderingError(line_number, column_number, message, inner_error);
}

// generates the message for a failed raw rendering
blazegears.bgtl.RenderingError._rawRenderingFailed = function(line_number, column_number, inner_error) {
	var message = blazegears.Error._composeMessage("Raw rendering failed on line " + line_number + " at column " + column_number, null, inner_error);
	return new blazegears.bgtl.RenderingError(line_number, column_number, message, inner_error);
}

// generates the message for a failed rendering
blazegears.bgtl.RenderingError._renderingFailed = function(inner_error) {
	var message = blazegears.Error._composeMessage("Rendering failed", null, inner_error);
	return new blazegears.bgtl.RenderingError(0, 0, message, inner_error);
}

// generates the message for a failed markup rendering
blazegears.bgtl.RenderingError._markupRenderingFailed = function(line_number, column_number, inner_error) {
	var message = blazegears.Error._composeMessage("Markup rendering failed on line " + line_number + " at column " + column_number, null, inner_error);
	return new blazegears.bgtl.RenderingError(line_number, column_number, message, inner_error);
}

// generates the message for a failed variable rendering
blazegears.bgtl.RenderingError._variableRenderingFailed = function(line_number, column_number, inner_error) {
	var message = blazegears.Error._composeMessage("Variable rendering failed on line " + line_number + " at column " + column_number, null, inner_error);
	return new blazegears.bgtl.RenderingError(line_number, column_number, message, inner_error);
}

// Class: blazegears.bgtl.Template
// Represents a renderable template.
blazegears.bgtl.Template = function() {
	this._render_callback = blazegears.bgtl.Template._default_render_callback;
}

/*
Method: render
	Renders the template as a *String*.

Arguments:
	context - (*Object*) The object that will be assigned to *this* when rendering the template. Primitive objects will be boxed.

Exceptions:
	blazegears.bgtl.RenderingError - The rendering of the template failed.
*/
blazegears.bgtl.Template.prototype.render = function(context) {
	return this._render_callback.call(context);
}

// the default rendering callback to avoid null errors on manually created templates
blazegears.bgtl.Template._default_render_callback = function() {
	return "";
}

/*
Class: BlazeGears.BGTL [Deprecated]
	This class has been deprecated, use <blazegears.bgtl.Compiler> instead. A singleton class that compiles HTML templates written in the BlazeGears Templating Language.
	
	The language's syntax is based on a mix of JavaScript and <BottlePy's Simple Template at http://bottlepy.org/docs/dev/stpl.html>.

Superclasses:
	<BlazeGears.BaseClass>

Control Tags:
	There are three different control tags available:
		- Statements are surround with percentage marks. (e.g. "%alert('This is a statement!');%")
		- Escaped output is using the "{{" opening tag and the "}}" closing tag. (e.g. "{{escaped_output}}")
		- Unescaped output is the same as the escaped one, but must have an exclamation mark in front of the input. (e.g. "{{!unescaped_output}}")
	  
	Apart from the closing tags, tags can be terminated by line breaks, too.

HTML Templating:
	The HTML templating class uses the BlazeGears Templating Language, which is based on a mix of JavaScript and <BottlePy's Simple Template at http://bottlepy.org/docs/dev/stpl.html>. Parsing a BGTL template will return an object, which can be rendered with some provided data.
	
	There are three different control tags available: statements, escaped output, and unescaped output. Each of these has an opening and a closing tag, but the closing tags can be replaced by line breaks.
	
	The example below uses both the opening and closing tags for all three control tags.
	
	(code)
		bgtl = new BlazeGears.BGTL();
		
		template = "%for (var i in entries) {%"; // statement
		template += "<h1>{{entries[i].title}}</h1>"; // escaped output
		template += "<p>{{!entries[i].content}}</p>"; // unescaped output
		template += "%}%";
		
		entries = [
			{title: "Entry #1", content: "This is some plain text content."},
			{title: "Entry #2", content: "This is some content with a <a href='http://www.blazegears.com'>link</a>."}
		];
		
		parsed_template = bgtl.compileTemplate(template);
		alert(parsed_template.render(entries));
	(end)
	
	Templates can be parsed and rendered in a single command, too, but this is only useful for templates that are going to be rendered only once.
*/
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
	
	// Method: parse [Deprecated]
	// Alias for <compileTemplate>.
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

// Class: BlazeGears.BGTL.TemplateInterface [Deprecated]
// Compiled template objects will implement this interface.
// 
// Notes:
//   This class has no actual functionality, it just being used for documentation.
BlazeGears.BGTL.TemplateInterface = function()
{
	var self = this;
	
	// Method: execute [Deprecated]
	// Alias for <render>.
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
