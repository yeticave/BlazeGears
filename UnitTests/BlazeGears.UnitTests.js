module("BlazeGears");
BlazeGears.UnitTests = {};

BlazeGears.UnitTests.cloningTest = function() {
	var clone_array;
	var clone_object;
	var template_array = [1, 2, 3];
	var template_object = { a: 1, b: 2, c: 3 };
	var nested_clone_array;
	var nested_template_array = [[1, 2, 3], [1, 2, 3]];
	var nested_clone_object;
	var nested_template_object = { a: { a1: 1, a2: 2, a3: 3 }, b: { b1: 1, b2: 2, b3: 3 } };
	
	// array cloning
	clone_array = BlazeGears.cloneObject(template_array);
	ok(true, "Clone an array.");
	notStrictEqual(clone_array, template_array, "Compare the cloned array's pointer to the template's.");
	deepEqual(clone_array, template_array, "Compare the cloned array's content to the template's.");
	
	// nested array cloning
	nested_clone_array = BlazeGears.cloneObject(nested_template_array);
	ok(true, "Clone an array with nested arrays.");
	notStrictEqual(nested_clone_array, nested_template_array, "Compare the cloned array's pointer to the template's.");
	deepEqual(nested_clone_array, nested_template_array, "Compare the cloned array's content to the template's.");
	
	// object literal cloning
	clone_object = BlazeGears.cloneObject(template_object);
	ok(true, "Clone an object literal.");
	notStrictEqual(clone_object, template_object, "Compare the cloned object's pointer to the template's.");
	deepEqual(clone_object, template_object, "Compare the cloned object's content to the template's.");
	
	// nested object literal cloning
	nested_clone_object = BlazeGears.cloneObject(nested_template_object);
	ok(true, "Clone an object literal with nested object literals.");
	notStrictEqual(nested_clone_object, nested_template_object, "Compare the cloned object's pointer to the template's.");
	deepEqual(nested_clone_object, nested_template_object, "Compare the cloned object's content to the template's.");
	notStrictEqual(nested_clone_object.a, nested_template_object.a, "Compare a cloned nested object's pointer to a template nested object's.");
}
test("Cloning", BlazeGears.UnitTests.cloningTest);

BlazeGears.UnitTests.entitiesTest = function() {
	var entity_id = "entity id";
	var entity_value;
	var new_entity_value = "b";
	var new_random_entity_value = "b";
	var initial_entity_value = "a";
	var initial_random_entity_value = "a";
	var invalid_entity_id = "invalid id";
	var invalid_entity_value;
	var random_entity_id;
	var random_entity_value;
	
	// fixed id entity
	notStrictEqual(BlazeGears.createEntity(initial_entity_value, entity_id), null, "Create an entity with a fixed ID.");
	entity_value = BlazeGears.getEntityValue(entity_id);
	notStrictEqual(entity_value, null, "Access the entity's value.");
	strictEqual(entity_value, initial_entity_value, "Compare the entity's value to the initial value.");
	ok(BlazeGears.setEntityValue(entity_id, new_entity_value), "Update the entity's value.");
	entity_value = BlazeGears.getEntityValue(entity_id);
	strictEqual(entity_value, new_entity_value, "Compare the entity's value to the new value.");
	ok(BlazeGears.destroyEntity(entity_id), "Destroy the entity.");
	
	// random id entity
	random_entity_id = BlazeGears.createEntity(initial_random_entity_value);
	notStrictEqual(random_entity_id, null, "Create an entity with a random ID.");
	random_entity_value = BlazeGears.getEntityValue(random_entity_id);
	notStrictEqual(random_entity_value, null, "Access the entity's value.");
	strictEqual(random_entity_value, initial_random_entity_value, "Compare the entity's value to the initial value.");
	ok(BlazeGears.setEntityValue(random_entity_id, new_random_entity_value), "Update the entity's value.");
	ok(BlazeGears.destroyEntity(random_entity_id), "Destroy the entity.");
	
	// invalid entity
	invalid_entity_value = BlazeGears.getEntityValue(invalid_entity_id);
	strictEqual(invalid_entity_value, null, "Try to access an invalid entity's value.");
	ok(!BlazeGears.setEntityValue(invalid_entity_id, invalid_entity_value), "Try to update an invalid entity's value.");
}
test("Entities", BlazeGears.UnitTests.entitiesTest);

BlazeGears.UnitTests.escapingTest = function() {
	var original_string = "<div title=\"'HTML' & 'UTF-8'\">Jó foxim és don Quijote húszwattos lámpánál ülve egy pár bűvös cipőt készít.</div>";
	var html_escaped_string = "&lt;div title=&quot;&#39;HTML&#39; &amp; &#39;UTF-8&#39;&quot;&gt;Jó foxim és don Quijote húszwattos lámpánál ülve egy pár bűvös cipőt készít.&lt;/div&gt;";
	var utf8_escaped_string = "&#60;div title=&#34;&#39;HTML&#39; &#38; &#39;UTF-8&#39;&#34;&#62;J&#243; foxim &#233;s don Quijote h&#250;szwattos l&#225;mp&#225;n&#225;l &#252;lve egy p&#225;r b&#369;v&#246;s cip&#337;t k&#233;sz&#237;t.&#60;/div&#62;";
	
	strictEqual(BlazeGears.escape(original_string, "html"), html_escaped_string, "Escape the HTML control characters in the string.");
	strictEqual(BlazeGears.escape(original_string, "utf-8"), utf8_escaped_string, "Escape all non-ASCII characters in the string.");
}
test("Escaping", BlazeGears.UnitTests.escapingTest);

BlazeGears.UnitTests.typeDeterminationTest = function() {
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
	
	var undefined_argument;
	var constructed_object = new Object();
	var literal_object = {};
	var constructed_array = new Array();
	var literal_array = [];
	var constructed_boolean = new Boolean();
	var literal_boolean = true;
	var constructed_date = new Date();
	var constructed_function = new Function();
	var literal_function = function() { };
	var constructed_number = new Number();
	var literal_number = 1.0;
	var constructed_regexp = new RegExp();
	var literal_regexp = /[a-z]/;
	
	// undefined
	ok(!BlazeGears.is(undefined_argument), "Verify that the variable is undefined.");
	
	// anonymous object
	ok(BlazeGears.isAnonymousObject(constructed_object), "Verify that the constructed variable is an anonymous object or object literal.");
	ok(BlazeGears.isAnonymousObject(literal_object), "Verify that the literal variable is an anonymous object or object literal.");
	ok(!BlazeGears.isAnonymousObject(control), "Verify that the control object is not an anonymous object or object literal.");
	
	// array
	ok(BlazeGears.isArray(constructed_array), "Verify that the constructed variable is an array.");
	ok(BlazeGears.isArray(literal_array), "Verify that the literal variable is an array.");
	ok(!BlazeGears.isArray(control), "Verify that the control object is not an array.");
	
	// boolean
	ok(BlazeGears.isBoolean(constructed_boolean), "Verify that the constructed variable is a boolean.");
	ok(BlazeGears.isBoolean(literal_boolean), "Verify that the literal variable is a boolean.");
	ok(!BlazeGears.isBoolean(control), "Verify that the control object is not a boolean.");
	
	// date
	ok(BlazeGears.isDate(constructed_date), "Verify that the constructed variable is a date object.");
	ok(!BlazeGears.isDate(control), "Verify that the control object is not a date object.");
	
	// function
	ok(BlazeGears.isFunction(constructed_function), "Verify that the constructed variable is a function.");
	ok(BlazeGears.isFunction(literal_function), "Verify that the literal variable is a function.");
	ok(!BlazeGears.isFunction(control), "Verify that the control object is not a function.");
	
	// number
	ok(BlazeGears.isNumber(constructed_number), "Verify that the constructed variable is a number.");
	ok(BlazeGears.isNumber(literal_number), "Verify that the literal variable is a number.");
	ok(!BlazeGears.isNumber(control), "Verify that the control object is not a number.");
	
	// regexp
	ok(BlazeGears.isRegExp(constructed_regexp), "Verify that the constructed variable is a regular expression.");
	ok(BlazeGears.isRegExp(literal_regexp), "Verify that the literal variable is a regular expression.");
	ok(!BlazeGears.isRegExp(control), "Verify that the control object is not a regular expression.");
}
test("Type Determination", BlazeGears.UnitTests.typeDeterminationTest);

BlazeGears.UnitTests.searchingTest = function() {
	var haystack = [1, 2, 3, [4, 5, 6]];
	ok(BlazeGears.isInArray(1, haystack, false), "Shallow search for an exisiting needle in the haystack.");
	ok(!BlazeGears.isInArray(7, haystack, false), "Shallow search for a non-existing needle in the haystack.");
	ok(!BlazeGears.isInArray(4, haystack, false), "Shallow search for a needle that exists in a nested array.");
	ok(BlazeGears.isInArray(4, haystack), "Deep search for a needle that exists in a nested array.");
}
test("Searching", BlazeGears.UnitTests.searchingTest);
