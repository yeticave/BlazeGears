module("blazegears.bgtl");
var blazegears = (typeof blazegears === "undefined") ? {} : blazegears;
blazegears.bgtl = (typeof blazegears.bgtl === "undefined") ? {} : blazegears.bgtl;
blazegears.bgtl.tests = (typeof blazegears.bgtl.tests === "undefined") ? {} : blazegears.bgtl.tests;

blazegears.bgtl.tests.compilerAndTemplateTest = function() {
	var compiler = new blazegears.bgtl.Compiler();
	var template;
	
	// markup
	var markup = "<div>test</div>";
	template = compiler.buildTemplate(markup);
	strictEqual(template.render(), markup, "Render some HTML markup.");
	
	// zalgo'd markup
	var zalgod_markup = "<div>T͡o͏ invo̴k̸e͟ the hi͘ve-min͏d rep͏r̷es͞entin͝g ̵ch͏aos.</div>";
	template = compiler.buildTemplate(zalgod_markup);
	strictEqual(template.render(), zalgod_markup, "Render some Zalgo'd HTML markup.");
	
	// escaped variable
	template = compiler.buildTemplate("begin {{this}} end");
	strictEqual(template.render("<div>test</div>"), "begin &lt;div&gt;test&lt;/div&gt; end", "Render an escaped variable.");
	
	// zalgo'd variable
	template = compiler.buildTemplate("begin {{this}} end");
	strictEqual(template.render("<div>T͡o͏ invo̴k̸e͟ the hi͘ve-min͏d rep͏r̷es͞entin͝g ̵ch͏aos.</div>"), "begin &lt;div&gt;T͡o͏ invo̴k̸e͟ the hi͘ve-min͏d rep͏r̷es͞entin͝g ̵ch͏aos.&lt;/div&gt; end", "Render a Zalgo'd variable.");
	
	// string literal with a variable closing delimiter
	template = compiler.buildTemplate("{{\"begin }} end\"}}");
	strictEqual(template.render(), "begin }} end", "Render a string literal that contains a variable closing delimiter.");
	
	// string literal with an escaped apostrophe
	template = compiler.buildTemplate("{{'begin it\\'s end'}}");
	strictEqual(template.render(), "begin it&#39;s end", "Render a string literal that contains an escaped apostrophe.");
	
	// string literal with an escaped quotation mark
	template = compiler.buildTemplate("{{\"begin \\\" end\"}}");
	strictEqual(template.render(), "begin &quot; end", "Render a string literal that contains an escaped quotation mark.");
	
	// raw construct
	var raw_variable = "<div>test</div>";
	template = compiler.buildTemplate("{%raw(this)%}");
	strictEqual(template.render(raw_variable), raw_variable, "Render a raw construct.");
	
	// construct with a command closing delimiter
	template = compiler.buildTemplate("{%raw(\"begin %} end\")%}");
	strictEqual(template.render(raw_variable), "begin %} end", "Render a command with a string literal argument that contains a construct closing delimiter.");
	
	// construct with a closing parenthesis
	template = compiler.buildTemplate("{%raw(\"begin ) end\")%}");
	strictEqual(template.render(raw_variable), "begin ) end", "Render a command with a string literal argument that contains a closing parenthesis.");
	
	// construct with a parentheses in the argument
	template = compiler.buildTemplate("begin {%raw(this.getValue().toString())%} end");
	strictEqual(template.render({getValue: function() {return "test";}}), "begin test end", "Render a command with an argument that contains parenthesised expressions.");
	
	// construct with an escaped apostrophe
	template = compiler.buildTemplate("{%raw('begin \\' end')%}");
	strictEqual(template.render(raw_variable), "begin ' end", "Render a command with a string literal argument that contains an escaped apostrophe.");
	
	// construct with an escaped quotation mark
	template = compiler.buildTemplate("{%raw(\"begin \\\" end\")%}");
	strictEqual(template.render(raw_variable), "begin \" end", "Render a command with a string literal argument that contains an escaped quotation mark.");
	
	// if construct
	template = compiler.buildTemplate("begin {%if (this.value)%}test{%end%} end");
	strictEqual(template.render({value: true}), "begin test end", "Render an if construct for the true condition.");
	strictEqual(template.render({value: false}), "begin  end", "Render an if construct for the false condition.");
	
	// if-elif construct
	template = compiler.buildTemplate("begin {%if (this.value === 1)%}a{%elif (this.value === 2)%}b{%end%} end");
	strictEqual(template.render({value: 1}), "begin a end", "Render an if-elif construct for the if branch.");
	strictEqual(template.render({value: 2}), "begin b end", "Render an if-elif construct for the elif branch.");
	strictEqual(template.render({value: 3}), "begin  end", "Render an if-elif construct for the false branch.");
	
	// if-else
	template = compiler.buildTemplate("begin {%if (this.value)%}a{%else%}b{%end%} end");
	strictEqual(template.render({value: true}), "begin a end", "Render an if-else construct for the true condition.");
	strictEqual(template.render({value: false}), "begin b end", "Render an if-else construct for the false condition.");
	
	// if-elif-else construct
	template = compiler.buildTemplate("begin {%if (this.value === 1)%}a{%elif (this.value === 2)%}b{%else%}c{%end%} end");
	strictEqual(template.render({value: 1}), "begin a end", "Render an if-elif-else construct for the if branch.");
	strictEqual(template.render({value: 2}), "begin b end", "Render an if-elif-else construct for the elif branch.");
	strictEqual(template.render({value: 3}), "begin c end", "Render an if-elif-else construct for the else branch.");
	
	// nested conditional constructs
	template = compiler.buildTemplate("begin {%if (this.a === 1)%}{%if (this.b === 1)%}1a{%elif (this.b === 2)%}1b{%else%}1c{%end%}{%elif (this.a === 2)%}{%if (this.b === 1)%}2a{%elif (this.b === 2)%}2b{%else%}2c{%end%}{%else%}{%if (this.b === 1)%}3a{%elif (this.b === 2)%}3b{%else%}3c{%end%}{%end%} end");
	strictEqual(template.render({a: 1, b: 1}), "begin 1a end", "Render a structure of nested conditional constructs for the if-if branch.");
	strictEqual(template.render({a: 1, b: 2}), "begin 1b end", "Render a structure of nested conditional constructs for the if-elif branch.");
	strictEqual(template.render({a: 1, b: 3}), "begin 1c end", "Render a structure of nested conditional constructs for the if-else branch.");
	strictEqual(template.render({a: 2, b: 1}), "begin 2a end", "Render a structure of nested conditional constructs for the elif-if branch.");
	strictEqual(template.render({a: 2, b: 2}), "begin 2b end", "Render a structure of nested conditional constructs for the elif-elif branch.");
	strictEqual(template.render({a: 2, b: 3}), "begin 2c end", "Render a structure of nested conditional constructs for the else-else branch.");
	strictEqual(template.render({a: 3, b: 1}), "begin 3a end", "Render a structure of nested conditional constructs for the else-if branch.");
	strictEqual(template.render({a: 3, b: 2}), "begin 3b end", "Render a structure of nested conditional constructs for the else-elif branch.");
	strictEqual(template.render({a: 3, b: 3}), "begin 3c end", "Render a structure of nested conditional constructs for the else-else branch.");
	
	// foreach-as construct
	template = compiler.buildTemplate("begin {%foreach (var entry as this)%}{{entry}}{%end%} end");
	strictEqual(template.render([1, 2, 3]), "begin 123 end", "Render a foreach-as construct for an array.");
	strictEqual(template.render({a: 1, b: 2, c: 3}), "begin 123 end", "Render a foreach-as construct for an object.");
	
	// foreach-in construct
	template = compiler.buildTemplate("begin {%foreach (var i in this)%}|{{i}}:{{this[i]}}|{%end%} end");
	strictEqual(template.render(["a", "b", "c"]), "begin |0:a||1:b||2:c| end", "Render a foreach-in construct for an array.");
	strictEqual(template.render({a: 1, b: 2, c: 3}), "begin |a:1||b:2||c:3| end", "Render a foreach-in construct for an object.");
	
	// foreach-as with embedded foreach-as
	template = compiler.buildTemplate("begin {%foreach (var entry as this)%}{%foreach (var sub_entry as entry)%}{{sub_entry}}{%end%}{%end%} end");
	strictEqual(template.render([[1, 2, 3], [4, 5, 6], [7, 8, 9]]), "begin 123456789 end", "Render a foreach-as construct with an embedded foreach-as construct for an array of arrays.");
	strictEqual(template.render([{a: 1, b: 2, c: 3}, {d: 4, e: 5, f: 6}, {g: 7, h: 8, i: 9}]), "begin 123456789 end", "Render a foreach-as construct with an embedded foreach-as construct for an array of objects.");
	strictEqual(template.render({a: [1, 2, 3], b: [4, 5, 6], c: [7, 8, 9]}), "begin 123456789 end", "Render a foreach-as construct with an embedded foreach-as construct for an object of arrays.");
	strictEqual(template.render({x: {a: 1, b: 2, c: 3}, y: {d: 4, e: 5, f: 6}, z: {g: 7, h: 8, i: 9}}), "begin 123456789 end", "Render a foreach-as construct with an embedded foreach-as construct for an object of objects.");
	
	// foreach-as with embedded foreach-in
	template = compiler.buildTemplate("begin {%foreach (var entry as this)%}{%foreach (var i in entry)%}|{{i}}:{{entry[i]}}|{%end%}{%end%} end");
	strictEqual(template.render([[1, 2, 3], [4, 5, 6], [7, 8, 9]]), "begin |0:1||1:2||2:3||0:4||1:5||2:6||0:7||1:8||2:9| end", "Render a foreach-as construct with an embedded foreach-in construct for an array of arrays.");
	strictEqual(template.render([{a: 1, b: 2, c: 3}, {d: 4, e: 5, f: 6}, {g: 7, h: 8, i: 9}]), "begin |a:1||b:2||c:3||d:4||e:5||f:6||g:7||h:8||i:9| end", "Render a foreach-as construct with an embedded foreach-in construct for an array of objects.");
	strictEqual(template.render({a: [1, 2, 3], b: [4, 5, 6], c: [7, 8, 9]}), "begin |0:1||1:2||2:3||0:4||1:5||2:6||0:7||1:8||2:9| end", "Render a foreach-as construct with an embedded foreach-in construct for an object of arrays.");
	strictEqual(template.render({x: {a: 1, b: 2, c: 3}, y: {d: 4, e: 5, f: 6}, z: {g: 7, h: 8, i: 9}}), "begin |a:1||b:2||c:3||d:4||e:5||f:6||g:7||h:8||i:9| end", "Render a foreach-in construct with an embedded foreach-as construct for an object of objects.");
	
	// foreach-in with embedded foreach-as
	template = compiler.buildTemplate("begin {%foreach (var i in this)%}{%foreach (var entry as this[i])%}{{entry}}{%end%}{%end%} end");
	strictEqual(template.render([[1, 2, 3], [4, 5, 6], [7, 8, 9]]), "begin 123456789 end", "Render a foreach-in construct with an embedded foreach-as construct for an array of arrays.");
	strictEqual(template.render([{a: 1, b: 2, c: 3}, {d: 4, e: 5, f: 6}, {g: 7, h: 8, i: 9}]), "begin 123456789 end", "Render a foreach-in construct with an embedded foreach-as construct for an array of objects.");
	strictEqual(template.render({a: [1, 2, 3], b: [4, 5, 6], c: [7, 8, 9]}), "begin 123456789 end", "Render a foreach-in construct with an embedded foreach-as construct for an object of arrays.");
	strictEqual(template.render({x: {a: 1, b: 2, c: 3}, y: {d: 4, e: 5, f: 6}, z: {g: 7, h: 8, i: 9}}), "begin 123456789 end", "Render a foreach-in construct with an embedded foreach-as construct for an object of objects.");
	
	// foreach-in with embedded foreach-in
	template = compiler.buildTemplate("begin {%foreach (var i in this)%}{%foreach (var j in this[i])%}|{{i}}:{{j}}:{{this[i][j]}}|{%end%}{%end%} end");
	strictEqual(template.render([[1, 2, 3], [4, 5, 6], [7, 8, 9]]), "begin |0:0:1||0:1:2||0:2:3||1:0:4||1:1:5||1:2:6||2:0:7||2:1:8||2:2:9| end", "Render a foreach-in construct with an embedded foreach-in construct for an array of arrays.");
	strictEqual(template.render([{a: 1, b: 2, c: 3}, {d: 4, e: 5, f: 6}, {g: 7, h: 8, i: 9}]), "begin |0:a:1||0:b:2||0:c:3||1:d:4||1:e:5||1:f:6||2:g:7||2:h:8||2:i:9| end", "Render a foreach-in construct with an embedded foreach-in construct for an array of objects.");
	strictEqual(template.render({a: [1, 2, 3], b: [4, 5, 6], c: [7, 8, 9]}), "begin |a:0:1||a:1:2||a:2:3||b:0:4||b:1:5||b:2:6||c:0:7||c:1:8||c:2:9| end", "Render a foreach-in construct with an embedded foreach-in construct for an object of arrays.");
	strictEqual(template.render({x: {a: 1, b: 2, c: 3}, y: {d: 4, e: 5, f: 6}, z: {g: 7, h: 8, i: 9}}), "begin |x:a:1||x:b:2||x:c:3||y:d:4||y:e:5||y:f:6||z:g:7||z:h:8||z:i:9| end", "Render a foreach-in construct with an embedded foreach-in construct for an object of objects.");
	
	var verifyError = function(compiler, lexeme, context, line_number, column_number, error_type, error_name, error_reason) {
		var caught_error;
		var is_error_caught = false;
		var is_instance_of;
		
		compiler.enableDebugMode(true);
		try {
			template = compiler.buildTemplate(lexeme);
			if (typeof context !== "undefined") {
				template.render(context);
			}
		} catch (error) {
			is_error_caught = true;
			caught_error = error;
		}
		ok(is_error_caught, error_reason);
		if (is_error_caught) {
			is_instance_of = caught_error instanceof error_type;
			ok(is_instance_of, "Verify that the last thrown error is an instance of " + error_name + ".");
			
			if (is_instance_of) {
				strictEqual(caught_error.getLineNumber(), line_number, "Verify that the last thrown error is mapped to the correct line number.");
				strictEqual(caught_error.getColumnNumber(), column_number, "Verify that the last thrown error is mapped to the correct column number.");
			}
		}
	};
	
	// escaped command
	template = compiler.buildTemplate("begin \\{{this}} end");
	strictEqual(template.render("test"), "begin \\test end", "Render a variable prefixed with a slash.");
	
	// invalid keyword
	verifyError(compiler, "\n\n    {%test%}", undefined, 3, 5, blazegears.bgtl.LexingError, "LexingError", "Verify that an invalid keyword causes an error.");
	
	// unmatched apostrophe
	verifyError(compiler, "\n\n    {%raw(')%}", undefined, 3, 5, blazegears.bgtl.LexingError, "LexingError", "Verify that an unmatched apostrophe causes an error.");
	
	// unmatched quotation mark
	verifyError(compiler, "\n\n    {%raw(\")%}", undefined, 3, 5, blazegears.bgtl.LexingError, "LexingError", "Verify that an unmatched quotation mark causes an error.");
	
	// missing construct closing delimiter
	verifyError(compiler, "\n\n    {%raw", undefined, 3, 5, blazegears.bgtl.LexingError, "LexingError", "Verify that a missing construct closing delimiter causes an error.");
	
	// missing argument
	verifyError(compiler, "\n\n    {%raw%}", undefined, 3, 5, blazegears.bgtl.LexingError, "LexingError", "Verify that a missing argument causes an error.");
	
	// missing argument closing parenthesis
	verifyError(compiler, "\n\n    {%raw(%}", undefined, 3, 5, blazegears.bgtl.LexingError, "LexingError", "Verify that a missing argument closing parenthesis causes an error.");
	
	// invalid content after argument
	verifyError(compiler, "\n\n    {%raw()test%}", undefined, 3, 5, blazegears.bgtl.LexingError, "LexingError", "Verify that some content after the construct's argument causes an error.");
	
	// missing closing construct
	verifyError(compiler, "\n\n    {%if (true)%}test", undefined, 3, 5, blazegears.bgtl.LexingError, "LexingError", "Verify that a missing closing construct causes an error.");
	
	// invalid syntax
	verifyError(compiler, "\n\n    {%if (*)%}test{%end%}", undefined, 3, 5, blazegears.bgtl.CompilingError, "CompilingError", "Verify that an invalid piece of lexeme causes an error.");
	
	// invalid construct
	compiler._lexer.createKeyword("test");
	
	// invalid arguments
	verifyError(compiler, "\n\n    {{this.error()}}", null, 3, 5, blazegears.bgtl.RenderingError, "RenderingError", "Verify that an invalid variable causes an error.");
	verifyError(compiler, "\n\n    {%raw(this.error())%}", null, 3, 5, blazegears.bgtl.RenderingError, "RenderingError", "Verify that an invalid raw construct argument causes an error.");
	verifyError(compiler, "\n\n    {%if (this.error())%}test{%end%}", null, 3, 5, blazegears.bgtl.RenderingError, "RenderingError", "Verify that an invalid if construct argument causes an error.");
	verifyError(compiler, "\n\n{%if (false)%}{%elif (this.error())%}test{%end%}", null, 3, 15, blazegears.bgtl.RenderingError, "RenderingError", "Verify that an invalid elif construct argument causes an error.");
	verifyError(compiler, "\n\n    {%foreach (var i as this.error())%}test{%end%}", null, 3, 5, blazegears.bgtl.RenderingError, "RenderingError", "Verify that an invalid foreach-as construct argument causes an error.");
	verifyError(compiler, "\n\n    {%foreach (var i in this.error())%}test{%end%}", null, 3, 5, blazegears.bgtl.RenderingError, "RenderingError", "Verify that an invalid foreach-in construct argument causes an error.");
}
test("Compiler & Template", blazegears.bgtl.tests.compilerAndTemplateTest);
