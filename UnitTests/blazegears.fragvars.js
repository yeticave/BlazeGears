module("blazegears.fragvars");
var blazegears = (typeof blazegears === "undefined") ? {} : blazegears;
blazegears.fragvars = (typeof blazegears.fragvars === "undefined") ? {} : blazegears.fragvars;
blazegears.fragvars.tests = (typeof blazegears.fragvars.tests === "undefined") ? {} : blazegears.fragvars.tests;

blazegears.fragvars.tests.managerTest = function() {
	var FragVar = blazegears.fragvars.FragVar;
	var Manager = blazegears.fragvars.Manager;
	var fragvar;
	var fragvar_id = "fragvar";
	var fragvar_value = "value";
	var fragvar_values = { a: "x", b: "y", c: "z" };
	
	// single fragvar
	window.location.hash = "";
	fragvar = Manager.createFragVar(fragvar_id);
	ok(fragvar instanceof FragVar, "Create a FragVar.");
	strictEqual(Manager.getFragVar(fragvar_id).getId(), fragvar_id, "Verify that the FragVar can be retrieved.");
	Manager.setFragVarValue(fragvar_id, null);
	Manager.setFragVarValue(fragvar_id, fragvar_value);
	strictEqual(Manager.getFragVarValue(fragvar_id), fragvar_value, "Set the value of the FragVar.");
	Manager.setFragVarValue(fragvar_id, null);
	strictEqual(Manager.getFragVarValue(fragvar_id), null, "Unset the FragVar.");
	
	// multi fragvars
	Manager.setFragVarValues(fragvar_values);
	deepEqual(Manager.getFragVarValues(), fragvar_values, "Set the values of a batch FragVars.");
	Manager.setFragVarValues({ a: null, b: null, c: null });
	deepEqual(Manager.getFragVarValues(), {}, "Unset the FragVars.");
	ok(Manager.getFragVar("a") instanceof FragVar, "Verify that the batch-set created the FragVar object.");
}
test("Management", blazegears.fragvars.tests.managerTest);

blazegears.fragvars.tests.fragvarTest = function() {
	var FragVar = blazegears.fragvars.FragVar;
	var Manager = blazegears.fragvars.Manager;
	var dispose_test;
	var history_forward_test;
	var fragvar;
	var fragvar_id = "fragvar";
	var fragvar_value = "value";
	
	// setup
	expect(8)
	window.location.hash = "";
	Manager.setHistoryMode(blazegears.fragvars.HistoryMode.AUTOMATIC);
	strictEqual(Manager.getHistoryMode(), blazegears.fragvars.HistoryMode.AUTOMATIC, "Enable the automatic history mode.");
	fragvar = Manager.createFragVar(fragvar_id);
	ok(fragvar instanceof FragVar, "Create a FragVar.");
	strictEqual(fragvar.getId(), fragvar_id, "Verify the FragVar's ID.");
	
	// set / unset
	fragvar.getValueChangedEvent().addCallback(
		null,
		function(self) {
			strictEqual(self.getValue(), fragvar_value, "Set the FragVar's value.");
		}
	);
	fragvar.setValue(fragvar_value);
	fragvar.getValueChangedEvent().dispose();
	fragvar.getValueChangedEvent().addCallback(
		null,
		function(self) {
			strictEqual(self.getValue(), null, "Unset the FragVar.");
		}
	);
	fragvar.setValue(null);
	fragvar.getValueChangedEvent().dispose();
	
	// history / dispose
	history_forward_test = function() {
		fragvar.getValueChangedEvent().addCallback(
			null,
			function(self) {
				strictEqual(self.getValue(), null, "Go forward in history.");
				self.getValueChangedEvent().dispose();
				dispose_test();
			}
		);
		window.history.forward();
	};
	
	dispose_test = function() {
		fragvar.getValueChangedEvent().dispose();
		Manager.setHistoryMode(blazegears.fragvars.HistoryMode.NONE);
		strictEqual(Manager.getHistoryMode(), blazegears.fragvars.HistoryMode.NONE, "Disable the automatic history mode.");
		start();
	};
	
	fragvar.getValueChangedEvent().addCallback(
		null,
		function(self) {
			strictEqual(self.getValue(), fragvar_value, "Go back in history.");
			self.getValueChangedEvent().dispose();
			history_forward_test();
		}
	);
	window.history.back();	
}
asyncTest("FragVars", blazegears.fragvars.tests.fragvarTest);
