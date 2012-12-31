module("BlazeGears.BGTL");
BlazeGears.BGTL.UnitTests = {};

BlazeGears.BGTL.UnitTests.parsingAndExecutingTest = function()
{
	var bgtl = new BlazeGears.BGTL();
	var result;
	var template = bgtl.parse("{{!b}}%for (var i = 1; i <= a; ++i) {%{{b}}%}%");
	
	ok(true, "Parse the template.");
	result = template.render({ a: 1, b: "<span>b</span>" });
	ok(true, "Render the template.");
	strictEqual(result, "<span>b</span>&lt;span&gt;b&lt;/span&gt;", "Verify that the template was rendered properly.");
}
test("Parsing and Rendering", BlazeGears.BGTL.UnitTests.parsingAndExecutingTest);
