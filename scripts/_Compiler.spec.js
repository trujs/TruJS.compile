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
    modules = {};
    $container = callback(function (name) {
        if (!modules.hasOwnProperty(name)) {
            modules[name] = callback(function(a, b) {
                if (Array.isArray(b)) {
                    return promise.resolve(b.concat([name]));
                }
                return promise.resolve([name]);
            });
        }
        return modules[name];
    });
    $container.hasDependency = callback(true);
    compiler = module(["TruJS.compile._Compiler", [, $container]]);
    base = "/base";
    manifest = [{
      "type": "collection"
      , "name": "mycol"
    }, {
      "type": "javascript"
      , "includes": {
          "postCollector": ["mycol"]
      }
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

    test("the modules collection should have x properties")
    .value(modules)
    .hasPropertyCountOf(10);

    test("the collector collection should be called once")
    .value(modules[".collector.collection"])
    .hasBeenCalled(1);

    test("the collector collection should be called with")
    .value(modules[".collector.collection"])
    .hasBeenCalledWith([base, manifest[0], 0]);

    test("the collector javascript should be called once")
    .value(modules[".collector.javascript"])
    .hasBeenCalled(1);

    test("the collector javascript should be called with")
    .value(modules[".collector.javascript"])
    .hasBeenCalledWith([base, manifest[1], 1]);

    test("the preProcessor javascript should be called once")
    .value(modules[".preProcessor.javascript"])
    .hasBeenCalled(1);

    test("the assembler javascript should be called once")
    .value(modules[".assembler.javascript"])
    .hasBeenCalled(1);

    test("the formatter javascript should be called once")
    .value(modules[".formatter.javascript"])
    .hasBeenCalled(1);

    test("the postProcessor javascript should be called once")
    .value(modules[".postProcessor.javascript"])
    .hasBeenCalled(1);

    test("res should be")
    .value(res)
    .stringify()
    .equals("[{\"type\":\"collection\",\"name\":\"mycol\",\"files\":[\".collector.collection\",\".preProcessor.collection\",\".assembler.collection\",\".formatter.collection\",\".postProcessor.collection\"]},{\"type\":\"javascript\",\"includes\":{\"postCollector\":[\"mycol\"]},\"files\":[\".collector.collection\",\".collector.javascript\",\".preProcessor.javascript\",\".assembler.javascript\",\".formatter.javascript\",\".postProcessor.javascript\"]}]");

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
      , "include": {
          "postCollector": ["mycol"]
      }
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