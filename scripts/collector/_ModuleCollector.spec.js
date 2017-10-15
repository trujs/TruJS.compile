/**[@test({ "title": "TruJS.compile.collector._ModuleCollector: default module file, w/ files parameter" })]*/
function testModuleCollector1(arrange, act, assert, promise, callback, module) {
  var moduleCollector, collector_collection, paths, moduleFileLoader, moduleFileProcessor, modulePathProcessor, base, entry, res;

  arrange(function () {
    paths = [
      "/base/test1.js"
      , "/base/test2.js"
    ];
    moduleFileLoader = callback(promise.resolve());
    moduleFileProcessor = callback(promise.resolve());
    modulePathProcessor = callback(promise.resolve(paths));
    collector_collection = callback(function (base, entry) {
      return promise.resolve(entry.files);
    });
    moduleCollector = module(["TruJS.compile.collector._ModuleCollector", [, collector_collection, , , , moduleFileLoader, moduleFileProcessor, modulePathProcessor]]);
    base = "/base";
    entry = {
      "files": [
        "/base/test3.js"
        , "+./*js"
      ]
    };
  });

  act(function (done) {
    moduleCollector(base, entry)
      .then(function (results) {
        res = results;
        done();
      })
  });

  assert(function (test) {
    test("There should be 10 paths")
      .value(res)
      .hasMemberCountOf(10);

    test("The 10th path should be")
      .value(res, "[9]")
      .equals("+./*js");

  });
}

/**[@test({ "title": "TruJS.compile.collector._ModuleCollector: moduleFile parameter" })]*/
function testModuleCollector2(arrange, act, assert, promise, callback, module) {
  var moduleCollector, moduleFileLoader, moduleFileProcessor, base, entry;

  arrange(function () {
    moduleFileLoader = callback(function (path) {
      return {};
    });
    moduleFileProcessor = callback(promise.reject());
    moduleCollector = module(["TruJS.compile.collector._ModuleCollector", [, , , , , moduleFileLoader, moduleFileProcessor]]);
    base = "/base";
    entry = {
      "moduleFile": "other-module.json"
    };
  });

  act(function (done) {
    moduleCollector(base, entry)
      .catch(function () {
        done();
      });
  });

  assert(function (test) {
    test("moduleFileLoader should be called with")
      .run(moduleFileLoader.getArgs, [0])
      .value("{value}", "[0]")
      .matches(/[/\\]base[/\\]other-module.json/);

  });
}

/**[@test({ "title": "TruJS.compile.collector._ModuleCollector: baseModule parameter" })]*/
function testModuleCollector3(arrange, act, assert, promise, callback, module) {
  var moduleCollector, moduleFileLoader, moduleFileProcessor, base, entry;

  arrange(function () {
    moduleFileLoader = callback(function (path) {
      if (moduleFileLoader.callbackCount === 1) {
        return { "test1" : "test1.1", "test2": "test2" };
      }
      else {
        return { "test1" : "test1.2", "test3": "test3" };
      }
    });
    moduleFileProcessor = callback(promise.reject());
    moduleCollector = module(["TruJS.compile.collector._ModuleCollector", [, , , , , moduleFileLoader, moduleFileProcessor]]);
    base = "/base";
    entry = {
      "baseModule": "{projects}/Other/other-module.json"
    };
  });

  act(function (done) {
    moduleCollector(base, entry)
      .catch(function () {
        done();
      });
  });

  assert(function (test) {
    test("moduleFileLoader should be called 2 times")
      .value(moduleFileLoader)
      .hasBeenCalled(2);

    test("moduleFileProcessor 2nd arg should have 3 properties")
      .run(moduleFileProcessor.getArgs, [0])
      .value("{value}", "[1]")
      .hasPropertyCountOf(3);

    test("moduleFileProcessor 2nd arg \"test1\" property should be")
      .run(moduleFileProcessor.getArgs, [0])
      .value("{value}", "[1].test1")
      .equals("test1.2");

  });
}

/**[@test({ "title": "TruJS.compile.collector._ModuleCollector: multiple baseModule parameter, no file name" })]*/
function testModuleCollector4(arrange, act, assert, promise, callback, module) {
  var moduleCollector, moduleFileLoader, moduleFileProcessor, base, entry;

  arrange(function () {
    moduleFileLoader = callback(function (path) {
      if (moduleFileLoader.callbackCount === 1) {
        return { "test1" : "test1.1", "test2": "test2" };
      }
      else {
        return { "test1" : "test1.2", "test3": "test3" };
      }
    });
    moduleFileProcessor = callback(promise.reject());
    moduleCollector = module(["TruJS.compile.collector._ModuleCollector", [, , , , , moduleFileLoader, moduleFileProcessor]]);
    base = "/base";
    entry = {
      "baseModule": [
        "{projects}/Other.proj"
        , "{projects}/Another/other-manifest.json"
      ]
    };
  });

  act(function (done) {
    moduleCollector(base, entry)
      .catch(function () {
        done();
      });
  });

  assert(function (test) {
    test("moduleFileLoader should be called 3 times")
      .value(moduleFileLoader)
      .hasBeenCalled(3);

    test("moduleFileLoader 1st call should have path")
      .run(moduleFileLoader.getArgs, [0])
      .value("{value}", "[0]")
      .endsWith("module.json");

    test("moduleFileLoader 2nd call should have path")
      .run(moduleFileLoader.getArgs, [1])
      .value("{value}", "[0]")
      .endsWith("other-manifest.json");

    test("moduleFileLoader 3rd call should have path")
      .run(moduleFileLoader.getArgs, [2])
      .value("{value}", "[0]")
      .endsWith("module.json");

  });
}

/**[@test({ "title": "TruJS.compile.collector._ModuleCollector: module parameter" })]*/
function testModuleCollector5(arrange, act, assert, promise, callback, module) {
  var moduleCollector, paths, curModule, entryModule, collector_collection, moduleFileLoader, moduleFileProcessor, modulePathProcessor, moduleMerger, base, entry, res;

  arrange(function () {
    paths = [
      "/base/test1.js"
      , "/base/test2.js"
    ];
    curModule = {};
    entryModule = {
      "test3": ["", []]
    };
    moduleFileLoader = callback(promise.resolve(curModule));
    moduleMerger = callback({});
    moduleFileProcessor = callback(promise.resolve());
    modulePathProcessor = callback(promise.resolve(paths));
    collector_collection = callback(promise.resolve());
    moduleCollector = module(["TruJS.compile.collector._ModuleCollector", [, collector_collection, , , , moduleFileLoader, moduleFileProcessor, modulePathProcessor,,moduleMerger]]);
    base = "/base";
    entry = {
      "module": entryModule
    };
  });

  act(function (done) {
    moduleCollector(base, entry)
      .then(function (results) {
        res = results;
        done();
      })
  });

  assert(function (test) {

    test("The moduleMerger callback should be called with 2 module objects")
      .run(moduleMerger.getArgs, [0])
      .value("{value}", "[0]")
      .hasMemberCountOf(2);

    test("The moduleMerger 1st module object should be")
      .run(moduleMerger.getArgs, [0])
      .value("{value}", "[0][0]")
      .equals(curModule);

    test("The moduleMerger 2nd module object should be")
      .run(moduleMerger.getArgs, [0])
      .value("{value}", "[0][1]")
      .equals(entryModule);

  });
}

/**[@test({ "title": "TruJS.compile.collector._ModuleCollector: module parameter, empty string moduleFile parameter" })]*/
function testModuleCollector6(arrange, act, assert, promise, callback, module) {
  var moduleCollector, paths, curModule, entryModule, collector_collection, moduleFileLoader, moduleFileProcessor, modulePathProcessor, moduleMerger, base, entry, res;

  arrange(function () {
    paths = [
      "/base/test1.js"
      , "/base/test2.js"
    ];
    curModule = {};
    entryModule = {
      "test3": ["", []]
    };
    moduleFileLoader = callback(promise.resolve(curModule));
    moduleMerger = callback({});
    moduleFileProcessor = callback(promise.resolve());
    modulePathProcessor = callback(promise.resolve(paths));
    collector_collection = callback(promise.resolve());
    moduleCollector = module(["TruJS.compile.collector._ModuleCollector", [, collector_collection, , , , moduleFileLoader, moduleFileProcessor, modulePathProcessor,,moduleMerger]]);
    base = "/base";
    entry = {
      "module": entryModule
      , "moduleFile": ""
    };
  });

  act(function (done) {
    moduleCollector(base, entry)
      .then(function (results) {
        res = results;
        done();
      })
  });

  assert(function (test) {

    test("The moduleFileLoader callback should not be called")
      .value(moduleFileLoader)
      .not()
      .hasBeenCalled();

    test("The moduleMerger callback should be called once")
      .value(moduleMerger)
      .hasBeenCalled(1);

  });
}
