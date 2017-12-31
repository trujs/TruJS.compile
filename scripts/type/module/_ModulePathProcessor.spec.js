/**[@test({ "title": "TruJS.compile.type.module._ModulePathProcessor: all entries resolve"})]*/
function testModulePathProcessor1(arrange, act, assert, callback, promise, module) {
  var modulePathProcessor, modulePathFinder, scriptsPath, pathsObj, res;

  arrange(function () {
    modulePathFinder = callback(promise.resolve());
    modulePathProcessor = module([
        "TruJS.compile.type.module._ModulePathProcessor"
        , [, , modulePathFinder]
    ]);
    scriptsPath = "/base/scripts";
    pathsObj = {
      "TruJS.test._TestFactory1": "_TestFactory1",
      "TruJS._TestFactory2": "{projects}\\TruJS\\_TestFactory2",
      "TruJS.test.TestObj.testMethod": "TestObj\\testMethod", //this will be tried 3 times, 1 as .js, 1 as .json and the final without "testMethod"
      "TruJS.test._TestFactory5": "_TestFactory5"
    };
  });

  act(function (done) {
    modulePathProcessor(scriptsPath, pathsObj)
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

    test("The modulePathFinder callback should be called 4 times")
      .value(modulePathFinder)
      .hasBeenCalled(4);

    test("res should have 4 members")
      .value(res)
      .hasMemberCountOf(4);
  });
}

/**[@test({ "title": "TruJS.compile.type.module._ModulePathProcessor: empty pathsObj"})]*/
function testModulePathProcessor2(arrange, act, assert, callback, promise, module) {
  var modulePathProcessor, modulePathFinder, scriptsPath, pathsObj, res;

  arrange(function () {
    modulePathFinder = callback(promise.resolve());
    modulePathProcessor = module([
        "TruJS.compile.type.module._ModulePathProcessor"
        , [, , modulePathFinder]
    ]);
    scriptsPath = "/base/scripts";
    pathsObj = {};
  });

  act(function (done) {
    modulePathProcessor(scriptsPath, pathsObj)
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

    test("res should be empty")
      .value(res)
      .isEmpty();

  });
}