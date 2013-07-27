module("blazegears");
blazegears.tests = (typeof blazegears.tests === "undefined") ? {} : blazegears.tests;

blazegears.tests.escapingTest = function() {
	var original_string = "<div title=\"'HTML' & 'UTF-8'\">J\u00f3 foxim \u00e9s don Quijote h\u00faszwattos l\u00e1mp\u00e1n\u00e1l \u00fclve egy p\u00e1r b\u0171v\u00f6s cip\u0151t k\u00e9sz\u00edt.</div>";
	
	// html
	var html_escaped_string = "&lt;div title=&quot;&#39;HTML&#39; &amp; &#39;UTF-8&#39;&quot;&gt;Jó foxim és don Quijote húszwattos lámpánál ülve egy pár bűvös cipőt készít.&lt;/div&gt;";
	strictEqual(blazegears.escape(original_string, "html"), html_escaped_string, "Escape the HTML control characters in the string.");
	
	// utf8
	var utf8_escaped_string = "&#60;div title=&#34;&#39;HTML&#39; &#38; &#39;UTF-8&#39;&#34;&#62;J&#243; foxim &#233;s don Quijote h&#250;szwattos l&#225;mp&#225;n&#225;l &#252;lve egy p&#225;r b&#369;v&#246;s cip&#337;t k&#233;sz&#237;t.&#60;/div&#62;";
	strictEqual(blazegears.escape(original_string, "utf-8"), utf8_escaped_string, "Escape all non-ASCII characters in the string.");
}
test("Escaping", blazegears.tests.escapingTest);

blazegears.tests.eventHandlingTest = function() {
	var context_value = 123;
	var argument_value = 456;
	var test_object;
	
	var EventClass = function(serial) {
		this.event = new blazegears.Event();
		this.serial = serial;
		this.event.addCallback(this, this.callback);
	}
	
	EventClass.prototype.callback = function(parameter) {
		strictEqual(this.serial, context_value, "Verify the context.");
		strictEqual(parameter, argument_value, "Verify the argument.");
	}
	
	EventClass.prototype.dispose = function() {
		this.event.dispose();
	}
	
	EventClass.prototype.raise = function() {
		this.event.raise(argument_value);
	}
	
	expect(2);
	test_object = new EventClass(context_value);
	test_object.raise();
	test_object.dispose();
}
test("Event Handling", blazegears.tests.eventHandlingTest);

blazegears.tests.typeDeterminationTest = function() {
	var control = new function() {
		var array_member = new Array();
		var boolean_member = new Boolean();
		var date_member = new Date();
		var function_member = new Function();
		var number_member = new Number();
		var object_member = new Object();
		var regexp_member = new RegExp();
		var string_member = new String();
	};
	
	// undefined
	var undefined_argument;
	ok(blazegears.isUndefined(undefined_argument), "Verify that the variable is undefined.");
	ok(!blazegears.isUndefined(null), "Verify that null is not undefined.");
	
	// anonymous object
	var constructed_object = new Object();
	var literal_object = {};
	ok(blazegears.isAnonymousObject(constructed_object), "Verify that the constructed variable is an anonymous object.");
	ok(blazegears.isAnonymousObject(literal_object), "Verify that the literal variable is an anonymous object.");
	ok(!blazegears.isAnonymousObject(control), "Verify that the control object is not an anonymous object.");
	ok(!blazegears.isAnonymousObject(null), "Verify that null is not an anonymous object.");
	
	// array
	var constructed_array = new Array();
	var literal_array = [];
	ok(blazegears.isArray(constructed_array), "Verify that the constructed variable is an array.");
	ok(blazegears.isArray(literal_array), "Verify that the literal variable is an array.");
	ok(!blazegears.isArray(control), "Verify that the control object is not an array.");
	ok(!blazegears.isArray(null), "Verify that null is not an array.");
	
	// boolean
	var constructed_boolean = new Boolean();
	var literal_boolean = true;
	ok(blazegears.isBoolean(constructed_boolean), "Verify that the constructed variable is a boolean.");
	ok(blazegears.isBoolean(literal_boolean), "Verify that the literal variable is a boolean.");
	ok(!blazegears.isBoolean(control), "Verify that the control object is not a boolean.");
	ok(!blazegears.isBoolean(null), "Verify that null is not a boolean.");
	
	// date
	var constructed_date = new Date();
	ok(blazegears.isDate(constructed_date), "Verify that the constructed variable is a date object.");
	ok(!blazegears.isDate(control), "Verify that the control object is not a date object.");
	ok(!blazegears.isDate(null), "Verify that null is not a date object.");
	
	// function
	var constructed_function = new Function();
	var literal_function = function() { };
	ok(blazegears.isFunction(constructed_function), "Verify that the constructed variable is a function.");
	ok(blazegears.isFunction(literal_function), "Verify that the literal variable is a function.");
	ok(!blazegears.isFunction(control), "Verify that the control object is not a function.");
	ok(!blazegears.isFunction(null), "Verify that null is not a function.");
	
	// number
	var constructed_number = new Number();
	var literal_number = 1.0;
	ok(blazegears.isNumber(constructed_number), "Verify that the constructed variable is a number.");
	ok(blazegears.isNumber(literal_number), "Verify that the literal variable is a number.");
	ok(!blazegears.isNumber(control), "Verify that the control object is not a number.");
	ok(!blazegears.isNumber(null), "Verify that null is not a number.");
	
	// regexp
	var constructed_regexp = new RegExp();
	var literal_regexp = /[a-z]/;
	ok(blazegears.isRegExp(constructed_regexp), "Verify that the constructed variable is a regular expression.");
	ok(blazegears.isRegExp(literal_regexp), "Verify that the literal variable is a regular expression.");
	ok(!blazegears.isRegExp(control), "Verify that the control object is not a regular expression.");
	ok(!blazegears.isRegExp(null), "Verify that null is not a regular expression.");
}
test("Type Determination", blazegears.tests.typeDeterminationTest);
