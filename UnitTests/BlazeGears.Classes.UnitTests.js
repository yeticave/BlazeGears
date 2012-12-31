module("BlazeGears.Classes");
BlazeGears.Classes.UnitTests = {};
BlazeGears.Classes.UnitTests.Constants = {};

BlazeGears.Classes.UnitTests.Constants.GRAND_PARENT_FIELD = 1;
BlazeGears.Classes.UnitTests.Constants.GRAND_PARENT_STATIC_FIELD = 2;
BlazeGears.Classes.UnitTests.Constants.GRAND_PARENT_METHOD = 3;
BlazeGears.Classes.UnitTests.Constants.GRAND_PARENT_STATIC_METHOD = 4;
BlazeGears.Classes.UnitTests.Constants.GRAND_PARENT_OVERRIDDEN_METHOD = 5;
BlazeGears.Classes.UnitTests.Constants.GRAND_PARENT_OVERRIDDEN_STATIC_METHOD = 6;
BlazeGears.Classes.UnitTests.Constants.FIRST_PARENT_FIELD = 7;
BlazeGears.Classes.UnitTests.Constants.FIRST_PARENT_STATIC_FIELD = 8;
BlazeGears.Classes.UnitTests.Constants.FIRST_PARENT_METHOD = 9;
BlazeGears.Classes.UnitTests.Constants.FIRST_PARENT_STATIC_METHOD = 10;
BlazeGears.Classes.UnitTests.Constants.FIRST_PARENT_OVERRIDDEN_METHOD = 11;
BlazeGears.Classes.UnitTests.Constants.FIRST_PARENT_OVERRIDDEN_STATIC_METHOD = 12;
BlazeGears.Classes.UnitTests.Constants.SECOND_PARENT_FIELD = 13;
BlazeGears.Classes.UnitTests.Constants.SECOND_PARENT_STATIC_FIELD = 14;
BlazeGears.Classes.UnitTests.Constants.SECOND_PARENT_METHOD = 15;
BlazeGears.Classes.UnitTests.Constants.SECOND_PARENT_STATIC_METHOD = 16;
BlazeGears.Classes.UnitTests.Constants.SECOND_PARENT_OVERRIDDEN_METHOD = 17;
BlazeGears.Classes.UnitTests.Constants.SECOND_PARENT_OVERRIDDEN_STATIC_METHOD = 18;
BlazeGears.Classes.UnitTests.Constants.TEST_CLASS_FIELD = 19;
BlazeGears.Classes.UnitTests.Constants.TEST_CLASS_STATIC_FIELD = 20;
BlazeGears.Classes.UnitTests.Constants.TEST_CLASS_METHOD = 21;
BlazeGears.Classes.UnitTests.Constants.TEST_CLASS_STATIC_METHOD = 22;

BlazeGears.Classes.UnitTests.GrandParentClass = BlazeGears.Classes.declareClass({
	grand_parent_field: BlazeGears.Classes.UnitTests.Constants.GRAND_PARENT_FIELD,
	$grand_parent_static_field: BlazeGears.Classes.UnitTests.Constants.GRAND_PARENT_STATIC_FIELD,
	
	grandParentMethod: function(self) {
		return BlazeGears.Classes.UnitTests.Constants.GRAND_PARENT_METHOD;
	},
	
	$grandParentStaticMethod: function(self) {
		return BlazeGears.Classes.UnitTests.Constants.GRAND_PARENT_STATIC_METHOD;
	},
	
	grandParentOverriddenMethod: function(self) {
		return BlazeGears.Classes.UnitTests.Constants.GRAND_PARENT_OVERRIDDEN_METHOD;
	},
	
	$grandParentOverriddenStaticMethod: function(self) {
		return BlazeGears.Classes.UnitTests.Constants.GRAND_PARENT_OVERRIDDEN_STATIC_METHOD;
	}
});

BlazeGears.Classes.UnitTests.FirstParentClass = BlazeGears.Classes.declareClass(
	BlazeGears.Classes.UnitTests.GrandParentClass,
	{
		__init__: function(self, call_assertation) {
			if (!BlazeGears.is(call_assertation)) call_assertation = false
			
			if (call_assertation) {
				ok(true, "Call the constructor of the first parent class.");
			}
		},
		
		first_parent_field: BlazeGears.Classes.UnitTests.Constants.FIRST_PARENT_FIELD,
		$first_parent_static_field: BlazeGears.Classes.UnitTests.Constants.FIRST_PARENT_STATIC_FIELD,
		
		firstParentMethod: function(self) {
			return BlazeGears.Classes.UnitTests.Constants.FIRST_PARENT_METHOD;
		},
		
		$firstParentStaticMethod: function(self) {
			return BlazeGears.Classes.UnitTests.Constants.FIRST_PARENT_STATIC_METHOD;
		},
		
		firstParentOverriddenMethod: function(self) {
			return BlazeGears.Classes.UnitTests.Constants.FIRST_PARENT_OVERRIDDEN_METHOD;
		},
		
		$firstParentOverriddenStaticMethod: function(self) {
			return BlazeGears.Classes.UnitTests.Constants.FIRST_PARENT_OVERRIDDEN_STATIC_METHOD;
		}
	}
);

BlazeGears.Classes.UnitTests.SecondParentClass = BlazeGears.Classes.declareClass(
	BlazeGears.Classes.UnitTests.GrandParentClass,
	{
		second_parent_field: BlazeGears.Classes.UnitTests.Constants.SECOND_PARENT_FIELD,
		$second_parent_static_field: BlazeGears.Classes.UnitTests.Constants.SECOND_PARENT_STATIC_FIELD,
		
		secondParentMethod: function(self) {
			return BlazeGears.Classes.UnitTests.Constants.SECOND_PARENT_METHOD;
		},
		
		$secondParentStaticMethod: function(self) {
			return BlazeGears.Classes.UnitTests.Constants.SECOND_PARENT_STATIC_METHOD;
		},
		
		secondParentOverriddenMethod: function(self) {
			return BlazeGears.Classes.UnitTests.Constants.SECOND_PARENT_OVERRIDDEN_METHOD;
		},
		
		$secondParentOverriddenStaticMethod: function(self) {
			return BlazeGears.Classes.UnitTests.Constants.SECOND_PARENT_OVERRIDDEN_STATIC_METHOD;
		}
	}
);

BlazeGears.Classes.UnitTests.TestClass = BlazeGears.Classes.declareClass(
	BlazeGears.Classes.UnitTests.FirstParentClass, BlazeGears.Classes.UnitTests.SecondParentClass,
	{
		__init__: function(self, call_assertation) {
			if (!BlazeGears.is(call_assertation)) call_assertation = false;
			
			if (call_assertation) {
				ok(true, "Call the constructor of the class.");
			}
			self.__super__("__init__", call_assertation);
		},
		
		test_class_field: BlazeGears.Classes.UnitTests.Constants.TEST_CLASS_FIELD,
		$test_class_static_field: BlazeGears.Classes.UnitTests.Constants.TEST_CLASS_STATIC_FIELD,
		
		testClassMethod: function(self) {
			return BlazeGears.Classes.UnitTests.Constants.TEST_CLASS_METHOD;
		},
		
		$testClassStaticMethod: function(self) {
			return BlazeGears.Classes.UnitTests.Constants.TEST_CLASS_STATIC_METHOD;
		},
		
		firstParentOverriddenMethod: function(self) {
			return self.__super__("firstParentOverriddenMethod");
		},
		
		$firstParentOverriddenStaticMethod: function(self) {
			return self.__super__("firstParentOverriddenStaticMethod");
		},
		
		secondParentOverriddenMethod: function(self) {
			return self.__super__("secondParentOverriddenMethod");
		},
		
		$secondParentOverriddenStaticMethod: function(self) {
			return self.__super__("secondParentOverriddenStaticMethod");
		},
		
		grandParentOverriddenMethod: function(self) {
			return self.__super__("grandParentOverriddenMethod");
		},
		
		$grandParentOverriddenStaticMethod: function(self) {
			return self.__super__("grandParentOverriddenStaticMethod");
		}
	}
);

BlazeGears.Classes.UnitTests.constructorsTest = function() {
	var test_object = new BlazeGears.Classes.UnitTests.TestClass(true);
}
test("Constructors", 2, BlazeGears.Classes.UnitTests.constructorsTest);

BlazeGears.Classes.UnitTests.fieldsTest = function() {
	var constants = BlazeGears.Classes.UnitTests.Constants;
	var test_object = new BlazeGears.Classes.UnitTests.TestClass();
	var type = BlazeGears.Classes.UnitTests.TestClass;
	
	strictEqual(test_object.test_class_field, constants.TEST_CLASS_FIELD, "Access a field of the object.");
	strictEqual(type.test_class_static_field, constants.TEST_CLASS_STATIC_FIELD, "Access a static field of the class.");
	strictEqual(test_object.first_parent_field, constants.FIRST_PARENT_FIELD, "Access a field inherited from the first parent class.");
	strictEqual(type.first_parent_static_field, constants.FIRST_PARENT_STATIC_FIELD, "Access a static field inherited from the first parent class.");
	strictEqual(test_object.second_parent_field, constants.SECOND_PARENT_FIELD, "Access a field inherited from the second parent class.");
	strictEqual(type.second_parent_static_field, constants.SECOND_PARENT_STATIC_FIELD, "Access a static field inherited from the second parent class.");
	strictEqual(test_object.grand_parent_field, constants.GRAND_PARENT_FIELD, "Access a field inherited from the grand parent class.");
	strictEqual(type.grand_parent_static_field, constants.GRAND_PARENT_STATIC_FIELD, "Access a static field inherited from the grand parent class.");
}
test("Fields", BlazeGears.Classes.UnitTests.fieldsTest);

BlazeGears.Classes.UnitTests.methodsTest = function() {
	var constants = BlazeGears.Classes.UnitTests.Constants;
	var test_object = new BlazeGears.Classes.UnitTests.TestClass();
	var type = BlazeGears.Classes.UnitTests.TestClass;
	
	strictEqual(test_object.testClassMethod(), constants.TEST_CLASS_METHOD, "Call a method of the object.");
	strictEqual(type.testClassStaticMethod(), constants.TEST_CLASS_STATIC_METHOD, "Call a static method of the class.");
	strictEqual(test_object.firstParentMethod(), constants.FIRST_PARENT_METHOD, "Call a method inherited from the first parent class.");
	strictEqual(type.firstParentStaticMethod(), constants.FIRST_PARENT_STATIC_METHOD, "Call a static method inherited from the first parent class.");
	strictEqual(test_object.secondParentMethod(), constants.SECOND_PARENT_METHOD, "Call a method inherited from the second parent class.");
	strictEqual(type.secondParentStaticMethod(), constants.SECOND_PARENT_STATIC_METHOD, "Call a static method inherited from the second parent class.");
	strictEqual(test_object.grandParentMethod(), constants.GRAND_PARENT_METHOD, "Call a method inherited from the grand parent class.");
	strictEqual(type.grandParentStaticMethod(), constants.GRAND_PARENT_STATIC_METHOD, "Call a static method inherited from the grand parent class.");
}
test("Methods", BlazeGears.Classes.UnitTests.methodsTest);

BlazeGears.Classes.UnitTests.overriddenMethodsTest = function() {
	var constants = BlazeGears.Classes.UnitTests.Constants;
	var test_object = new BlazeGears.Classes.UnitTests.TestClass();
	var type = BlazeGears.Classes.UnitTests.TestClass;
	
	strictEqual(test_object.firstParentOverriddenMethod(), constants.FIRST_PARENT_OVERRIDDEN_METHOD, "Call an overridden method inherited from the first parent class.");
	strictEqual(type.firstParentOverriddenStaticMethod(), constants.FIRST_PARENT_OVERRIDDEN_STATIC_METHOD, "Call an overridden static method inherited from the first parent class.");
	strictEqual(test_object.secondParentOverriddenMethod(), constants.SECOND_PARENT_OVERRIDDEN_METHOD, "Call an overridden method inherited from the second parent class.");
	strictEqual(type.secondParentOverriddenStaticMethod(), constants.SECOND_PARENT_OVERRIDDEN_STATIC_METHOD, "Call an overridden static method inherited from the second parent class.");
	strictEqual(test_object.grandParentOverriddenMethod(), constants.GRAND_PARENT_OVERRIDDEN_METHOD, "Call an overridden method inherited from the grand parent class.");
	strictEqual(type.grandParentOverriddenStaticMethod(), constants.GRAND_PARENT_OVERRIDDEN_STATIC_METHOD, "Call an overridden static method inherited from the grand parent class.");
}
test("Overridden Methods", BlazeGears.Classes.UnitTests.overriddenMethodsTest);
