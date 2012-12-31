module("BlazeGears.BGTL");
BlazeGears.BGTL.UnitTests = {};

BlazeGears.BGTL.UnitTests.compilingAndExecutingTest = function()
{
	var bgtl = new BlazeGears.BGTL();
	var result;
	var template = bgtl.compileTemplate("{{!b}}%for (var i = 1; i <= a; ++i) {%{{b}}%}%");
	
	ok(true, "Compile the template.");
	result = template.render({ a: 1, b: "<span>b</span>" });
	strictEqual(result, "<span>b</span>&lt;span&gt;b&lt;/span&gt;", "Render the template.");
}
test("Compiling and Rendering", BlazeGears.BGTL.UnitTests.compilingAndExecutingTest);
