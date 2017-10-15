/**[@test({ "title": "TruJS.compile.type.javascript.minifiers._JavaScriptMinifier: options set with defaults, no error " })]*/
function testJavaScriptMinifier1(arrange, act, assert, callback, module) {
  var javaScriptMinifier, defaults, uglifyRes, uglify, fileObj, options, res;

  arrange(function () {
    uglifyRes = {
      "code": "code"
      , "warnings": "warning"
    };
    defaults = {
      "minifier": {
        "javascript": {
          "test1": "default1"
          , "test2": "default2"
        }
      }
    };
    uglify = {
      "minify": callback(uglifyRes)
    };
    javaScriptMinifier = module(["TruJS.compile.type.javascript.minifiers._JavaScriptMinifier", [, uglify, , defaults]]);
    fileObj = {
      "data": "data"
    };
    options = {
      "test1": "option1"
    };
  });

  act(function (done) {
    javaScriptMinifier(fileObj, options)
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

    test("The uglify.minify callback should be called once")
      .value(uglify.minify)
      .hasBeenCalled(1);

    test("The uglify.minify options should have test1=\"option1\"")
      .run(uglify.minify.getArgs, [0])
      .value("{value}", "[1].test1")
      .equals("option1");

    test("The uglify.minify options should have test2=\"default2\"")
      .run(uglify.minify.getArgs, [0])
      .value("{value}", "[1].test2")
      .equals("default2");

    test("The uglify.minify callback 1st arg should equal fileObj.data")
      .run(uglify.minify.getArgs, [0])
      .value("{value}", "[0]")
      .equals(fileObj.data);

    test("res should have a property \"data\"")
      .value(res, "data")
      .equals(uglifyRes.code);

    test("res should have a property \"warnings\"")
      .value(res, "warnings")
      .equals(uglifyRes.warnings);

    test("res should have a property \"error\"")
      .value(res)
      .hasProperty("error");
  });
}

/**[@test({ "title": "TruJS.compile.type.javascript.minifiers._JavaScriptMinifier: exception thrown" })]*/
function testJavaScriptMinifier2(arrange, act, assert, callback, module) {
  var javaScriptMinifier, uglify, res;

  arrange(function () {
    uglify = {
      "minify": callback(new Error("exception"))
    };
    javaScriptMinifier = module(["TruJS.compile.type.javascript.minifiers._JavaScriptMinifier", [, uglify]]);
  });

  act(function (done) {
    javaScriptMinifier()
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

/**[@test({ "title": "TruJS.compile.type.javascript.minifiers._JavaScriptMinifier: minify error, allowErrors is false" })]*/
function testJavaScriptMinifier3(arrange, act, assert, callback, module) {
  var javaScriptMinifier, defaults, uglifyRes, uglify, fileObj, res;

  arrange(function () {
    uglifyRes = {
      "error": "error"
    };
    uglify = {
      "minify": callback(uglifyRes)
    };
    javaScriptMinifier = module(["TruJS.compile.type.javascript.minifiers._JavaScriptMinifier", [, uglify]]);
    fileObj = {
      "data": "data"
    };
  });

  act(function (done) {
    javaScriptMinifier(fileObj)
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

/**[@test({ "title": "TruJS.compile.type.javascript.minifiers._JavaScriptMinifier: minify error, allowErrors is true" })]*/
function testJavaScriptMinifier4(arrange, act, assert, callback, module) {
  var javaScriptMinifier, defaults, uglifyRes, uglify, fileObj, options, res;

  arrange(function () {
    uglifyRes = {
      "error": "error"
    };
    uglify = {
      "minify": callback(uglifyRes)
    };
    javaScriptMinifier = module(["TruJS.compile.type.javascript.minifiers._JavaScriptMinifier", [, uglify]]);
    fileObj = {
      "data": "data"
    };
    options = {
      "allowErrors": true
    };
  });

  act(function (done) {
    javaScriptMinifier(fileObj, options)
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

    test("res.error should be")
      .value(res, "error")
      .equals("error");
  });
}