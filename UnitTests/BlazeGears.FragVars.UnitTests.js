module("BlazeGears.FragVars");
BlazeGears.FragVars.UnitTests = {};

BlazeGears.FragVars.UnitTests.operationsTest = function() {
	var fragvars = new BlazeGears.FragVars();
    var fragvar_a = fragvars.createFragVar("fragvar_a");
	var fragvar_a_value = "a";
    var fragvar_b = fragvars.createFragVar("fragvar_b");
	var fragvar_b_value = "b";
	var fragvar_increment = 3;
	var new_fragvar_value = "5";
	var success;
	var values;
	
	// multiple fragvars
	ok(true, "Declare a pair of FragVars.");
	fragvars.setFragVars({ fragvar_a: fragvar_a_value, fragvar_b: fragvar_b_value });
	ok(true, "Update the values of the FragVars.");
	values = fragvars.getFragVars();
	success = values.fragvar_a == fragvar_a_value && values.fragvar_b == fragvar_b_value;
	ok(success, "Access the values of the FragVars.");
	
	// single fragvar
	fragvar_a.setValue(new_fragvar_value);
	ok(true, "Update the value of a single FragVar.");
	strictEqual(fragvar_a.getValue(), new_fragvar_value, "Access the value of the FragVar.");
	fragvar_a.add(fragvar_increment);
	strictEqual(parseInt(fragvar_a.getValue()), parseInt(new_fragvar_value) + fragvar_increment, "Increment the value of the FragVar.");
	
	// cleanup
	fragvar_a.setValue(null);
	fragvar_b.setValue(null);
	values = fragvars.getFragVars();
	success = typeof values.fragvar_a == "undefined" && typeof values.fragvar_b == "undefined";
	ok(success, "Unset the FragVars.");
}
test("Operations", BlazeGears.FragVars.UnitTests.operationsTest);

BlazeGears.FragVars.UnitTests.callbacksTest = function() {
	var self = this;
	var fragvars = new BlazeGears.FragVars();
	var fragvar = fragvars.createFragVar("fragvar");
	var value = "5";
	
	fragvar.onChange = function(self) {
		ok(true, "Raise the FragVar change event callback.");
		strictEqual(self.getValue(), value, "Verify that the value was updated properly.");
		start();
		fragvar.onChange = function() { };
		fragvar.setValue(null);
	};
	fragvar.setValue(value);
}
asyncTest("Callbacks", 2, BlazeGears.FragVars.UnitTests.callbacksTest);

BlazeGears.FragVars.UnitTests.historyTest = function() {
	var self = this;
	var fragvars = new BlazeGears.FragVars();
	var fragvar = fragvars.createFragVar("fragvar");
	var original_value = "a";
	var new_value = "b";
	
	fragvar.setValue(original_value);
	setTimeout(
		function() {
			fragvar.setValue(new_value);
			setTimeout(
				function() {
					fragvar.onChange = function(self) {
						ok(true, "Raise the FragVar change event callback upon going back in history.");
						strictEqual(self.getValue(), original_value, "Verify that the value was restored properly.");
						start();
						fragvar.onChange = function() { };
						fragvar.setValue(null);
					};
					
					setTimeout(
						function() {
							window.history.back();
						},
						200
					);
				},
				200
			);
		},
		200
	);
}
asyncTest("History", 2, BlazeGears.FragVars.UnitTests.historyTest);
