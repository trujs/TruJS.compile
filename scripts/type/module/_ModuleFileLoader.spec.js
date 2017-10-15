/**[@test({ "title": "TruJS.compile.type.module._ModuleFileLoader: " })]*/
function testModuleFileLoader1(arrange, act, assert, callback, module) {
  var moduleFileLoader, moduleObj, moduleFile, nodeFs, modulePath, res;

  arrange(function () {
    moduleObj = {
      "root": [{ "TruJS": ":TruJS" }]
      , "test1": ["TruJS._Test", []]
      , "test2": [{
        "sub1": ["TruJS.test._SubA", []]
        , "sub2": ["TruJS.test._SubB", []]
      }]
    };
    moduleFile = JSON.stringify(moduleObj);
    nodeFs = {
      "readFile": callback(function (path, frmt, cb) {
        cb(null, moduleFile);
      })
      , "stat": callback(function (path, cb) {
        cb();
      })
    };
    moduleFileLoader = module(["TruJS.compile.type.module._ModuleFileLoader", [, nodeFs]]);
    modulePath = "/base/module.js";
  });

  act(function (done) {
    moduleFileLoader(modulePath)
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
    test("res is not an error")
      .value(res)
      .not()
      .isError();

    test("nodeFs.readFile was called once")
      .value(nodeFs.readFile)
      .hasBeenCalled(1);
  });
}

/**[@test({ "title": "TruJS.compile.type.module._ModuleFileLoader: set moduleFile in entry, and readFile error" })]*/
function testModuleFileLoader2(arrange, act, assert, callback, module) {
  var moduleFileLoader, nodeFs, modulePath, res;

  arrange(function () {
    nodeFs = {
      "readFile": callback(function (path, frmt, cb) {
        cb({ "errno": -4058 });
      })
    };
    moduleFileLoader = module(["TruJS.compile.type.module._ModuleFileLoader", [, nodeFs]]);
    modulePath = "/base/module.js";
  });

  act(function (done) {
    moduleFileLoader(modulePath)
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

    test("res.message should be")
      .value(res, "message")
      .contains("ModuleFileNotFound");

    test("The nodeFs.readFile path arg should be")
      .value(nodeFs.readFile)
      .hasBeenCalledWithArg(0, 0, modulePath);
  });
}