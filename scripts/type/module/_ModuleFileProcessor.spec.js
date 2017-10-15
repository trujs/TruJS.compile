/**[@test({ "title": "TruJS.compile.type.module._ModuleFileProcessor: w/o project hint" })]*/
function testModuleProcessor1(arrange, act, assert, module) {
  var moduleFileProcessor, entry, moduleObj, res;

  arrange(function () {
    moduleFileProcessor = module(["TruJS.compile.type.module._ModuleFileProcessor", []]);
    moduleObj = {
      "root": [{ "TruJS": ":TruJS" }]
      , "test1": ["TruJS.test._TestFactory1", []]
      , "test2": ["TruJS._TestFactory2", []]
      , "test3": ["TruJS.test.TestObj.testMethod", []]
      , "test4": [".test3"]
    };
    entry = {
      "name": "TruJS.test"
      , "hints": {
        "TruJS": "./{projects}/TruJS"
      }
    };
  });

  act(function (done) {
    moduleFileProcessor(entry, moduleObj)
      .then(function (results) {
        res = results;
        done();
      })
      .catch(function (err) {
        res = err;
        done();
      });
  });

  assert(function (test) {
    test("res should not be an error")
      .value(res)
      .not()
      .isError();

    test("entry.hints should have 2 properties")
      .value(entry, "hints")
      .hasPropertyCountOf(2);

    test("entry.hints[TruJS.test] should be")
      .value(entry, "hints")
      .stringify()
      .equals("{\"TruJS.test\":\"./\",\"TruJS\":\"./{projects}/TruJS\"}");

    test("moduleObj should have 5 properties")
      .value(moduleObj)
      .hasPropertyCountOf(5);

    test("res should have 3 properties")
      .value(res)
      .hasPropertyCountOf(3);

    test("res keys should be")
      .value(res)
      .getKeys()
      .toString()
      .equals("TruJS.test._TestFactory1,TruJS._TestFactory2,TruJS.test.TestObj.testMethod");

  });
}

/**[@test({ "title": "TruJS.compile.type.module._ModuleFileProcessor: missing hint" })]*/
function testModuleProcessor2(arrange, act, assert, module) {
  var moduleFileProcessor, entry, moduleObj, res;

  arrange(function () {
    moduleFileProcessor = module(["TruJS.compile.type.module._ModuleFileProcessor", []]);
    moduleObj = {
      "root": [{ "TruJS": ":TruJS" }]
      , "test2": ["TruJS._TestFactory2", []]
    };
    entry = {
      "name": "TruJS.test"
    };
  });

  act(function (done) {
    moduleFileProcessor(entry, moduleObj)
      .then(function (results) {
        res = results;
        done();
      })
      .catch(function (err) {
        res = err;
        done();
      });
  });

  assert(function (test) {
    test("res should be an error")
      .value(res)
      .isError();

  });
}