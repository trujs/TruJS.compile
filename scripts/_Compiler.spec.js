/**[@test({ "title": "TruJS.compile._Compiler: simple container test" })]*/
function testCompiler1(arrange, act, assert, promise, callback, module) {
  var compiler, $container, base, manifest, res;

  arrange(function () {
    $container = callback(function () {
      return function() { return promise.resolve([[],[]]); };
    });
    $container.hasDependency = callback(true);
    compiler = module(["TruJS.compile._Compiler", [, $container]]);
    base = "/base";
    manifest = [{
      "type": "javascript"
    }, {
      "type": "files"
    }];
  });

  act(function (done) {
    compiler(base, manifest)
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
    test("res should not be an Error")
      .value(res)
      .not()
      .isError();

    test("The $container should be called x times")
      .value($container)
      .hasBeenCalled(10);

  });
}

/**[@test({ "title": "TruJS.compile._Compiler: type has no collector" })]*/
function testCompiler2(arrange, act, assert, promise, callback, module) {
  var compiler, $container, base, manifest, res;

  arrange(function () {
    $container = {
      "hasDependency": callback(false)
    }
    compiler = module(["TruJS.compile._Compiler", [, $container]]);
    base = "/base";
    manifest = [{
      "type": "notexist"
    }];
  });

  act(function (done) {
    compiler(base, manifest)
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
    test("res should be an Error")
      .value(res)
      .isError();

  });
}

/**[@test({ "title": "TruJS.compile._Compiler: add include" })]*/
function testCompiler3(arrange, act, assert, promise, callback, module) {
  var compiler, $container, modules, base, manifest, res;

  arrange(function () {
    modules = [];
    $container = callback(function (name) {
      var mcb;
      return mcb = modules[modules.length] = callback(function(a, b) {
        return promise.resolve([1, 2]);
      });
    });
    $container.hasDependency = callback(true);
    compiler = module(["TruJS.compile._Compiler", [, $container]]);
    base = "/base";
    manifest = [{
      "type": "collection"
      , "name": "mycol"
    }, {
      "type": "javascript"
      , "include": ["mycol"]
    }];
  });

  act(function (done) {
    compiler(base, manifest)
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
    test("res should not be an Error")
      .value(res)
      .not()
      .isError();

    test("The call to the 7th module's 2nd argument should be")
      .run(modules[6].getArgs, [0])
      .value("{value}", "[1]")
      .toString()
      .equals("1,2,1,2");

  });
}

/**[@test({ "title": "TruJS.compile._Compiler: missing include" })]*/
function testCompiler4(arrange, act, assert, promise, callback, module) {
  var compiler, $container, base, manifest, res;

  arrange(function () {
    $container = callback(function (name) {
      return promise.resolve([1, 2]);
    });
    $container.hasDependency = callback(true);
    compiler = module(["TruJS.compile._Compiler", [, $container]]);
    base = "/base";
    manifest = [{
      "type": "javascript"
      , "include": ["mycol"]
    }];
  });

  act(function (done) {
    compiler(base, manifest)
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
    test("res should be an Error")
      .value(res)
      .isError();

  });
}
