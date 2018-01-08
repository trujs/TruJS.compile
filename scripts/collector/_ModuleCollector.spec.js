/**[@test({ "title": "TruJS.compile.collector._ModuleCollector: default module file, w/ files parameter" })]*/
function testModuleCollector1(arrange, act, assert, promise, callback, module) {
  var moduleCollector, checkoutRepositories, moduleFileLoader
  , moduleMerger, filePicker, base, entry, res, err;

  arrange(function () {
    checkoutRepositories = callback(promise.resolve());
    moduleFileLoader = callback(promise.resolve());
    moduleMerger = callback(promise.resolve());
    filePicker = callback(promise.resolve());

    moduleCollector = module([
        "TruJS.compile.collector._ModuleCollector"
        , [, , , , , checkoutRepositories, moduleFileLoader, moduleMerger, filePicker]
    ]);
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
      .catch(function (error) {
          err = error;
          done();
      });
  });

  assert(function (test) {
    test("err should be undef")
    .value(err)
    .isUndef();

    test("checkoutRepositories should be called once")
    .value(checkoutRepositories)
    .hasBeenCalled(1);

    test("moduleFileLoader should be called once")
    .value(moduleFileLoader)
    .hasBeenCalled(1);

    test("moduleFileLoader should be called with")
    .value(moduleFileLoader)
    .getCallbackArg(0, 0)
    .matches(/[/\\]base[/\\]module[.]json/);

    test("moduleMerger should be called once")
    .value(moduleMerger)
    .hasBeenCalled(1);

    test("filePicker should be called once")
    .value(filePicker)
    .hasBeenCalled(1);

  });
}

/**[@test({ "title": "TruJS.compile.collector._ModuleCollector: moduleFile parameter" })]*/
function testModuleCollector2(arrange, act, assert, promise, callback, module) {
  var moduleCollector, checkoutRepositories, moduleFileLoader
  , moduleMerger, filePicker, base, entry, res, err;

  arrange(function () {
    checkoutRepositories = callback(promise.resolve());
    moduleFileLoader = callback(promise.resolve());
    moduleMerger = callback(promise.resolve());
    filePicker = callback(promise.resolve());

    moduleCollector = module([
        "TruJS.compile.collector._ModuleCollector"
        , [, , , , , checkoutRepositories, moduleFileLoader, moduleMerger, filePicker]
    ]);
    base = "/base";
    entry = {
      "files": [
        "/base/test3.js"
        , "+./*js"
      ]
      , "moduleFile": "server.module.json"
    };
  });

  act(function (done) {
    moduleCollector(base, entry)
      .then(function (results) {
        res = results;
        done();
      })
      .catch(function (error) {
          err = error;
          done();
      });
  });

  assert(function (test) {
    test("err should be undef")
    .value(err)
    .isUndef();

    test("moduleFileLoader should be called with")
    .value(moduleFileLoader)
    .getCallbackArg(0, 0)
    .matches(/[/\\]base[/\\]server[.]module[.]json/);

  });
}

/**[@test({ "title": "TruJS.compile.collector._ModuleCollector: baseModule parameter" })]*/
function testModuleCollector3(arrange, act, assert, promise, callback, module) {
  var moduleCollector, checkoutRepositories, modules, moduleFileLoader
  , moduleMerger, filePicker, base, entry, res, err;

  arrange(function () {
    modules = [{"a":1},{"b":2},{"c":3}];
    checkoutRepositories = callback(promise.resolve());
    moduleFileLoader = callback(function () {
        return promise.resolve(modules[moduleFileLoader.callbackCount - 1]);
    });
    moduleMerger = callback(promise.resolve());
    filePicker = callback(promise.resolve());

    moduleCollector = module([
        "TruJS.compile.collector._ModuleCollector"
        , [, , , , , checkoutRepositories, moduleFileLoader, moduleMerger, filePicker]
    ]);
    base = "/base";
    entry = {
      "files": [
        "/base/test3.js"
        , "+./*js"
      ]
      , "baseModule": [
          "{repos}/Test1/super.module.json"
          ,"{projects}/Test2/base.module.json"
      ]
    };
  });

  act(function (done) {
    moduleCollector(base, entry)
      .then(function (results) {
        res = results;
        done();
      })
      .catch(function (error) {
          err = error;
          done();
      });
  });

  assert(function (test) {
    test("err should be undef")
    .value(err)
    .isUndef();

    test("checkoutRepositories should be called once")
    .value(checkoutRepositories)
    .hasBeenCalled(1);

    test("moduleMerger should be called with")
    .value(moduleMerger)
    .getCallbackArg(0, 0)
    .stringify()
    .equals("[{\"a\":1},{\"b\":2},{\"c\":3}]");

    test("moduleFileLoader should be called 3 times")
    .value(moduleFileLoader)
    .hasBeenCalled(3);

    test("moduleFileLoader should be called with")
    .value(moduleFileLoader)
    .getCallbackArg(0, 0)
    .matches(/repos[/\\]Test1[/\\]super[.]module[.]json/);

    test("moduleFileLoader should be called with")
    .value(moduleFileLoader)
    .getCallbackArg(1, 0)
    .matches(/projects[/\\]Test2[/\\]base[.]module[.]json/);

    test("moduleFileLoader should be called with")
    .value(moduleFileLoader)
    .getCallbackArg(2, 0)
    .matches(/base[/\\]module[.]json/);

  });
}