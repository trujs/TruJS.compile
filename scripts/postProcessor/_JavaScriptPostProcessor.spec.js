/**[@test({ "title": "TruJS.compile.postProcessor._JavaScriptPostProcessor: lint, but not minify" })]*/
function testJavsScriptPostProcessor1(arrange, act, assert, promise, callback, module) {
  var javaScriptPostProcessor, linter, lintRes, minifier, data, entry, files, res;

  arrange(function () {
    lintRes = {};
    linter = callback(promise.resolve());
    minifier = callback(promise.resolve(lintRes));
    javaScriptPostProcessor = module(["TruJS.compile.postProcessor._JavaScriptPostProcessor", [, linter, minifier]]);
    data = "test";
    entry = {
      "lint": "post"
      , "minify": false
    };
    files = [{
      "data": data
    }, {
      "data": data
    }];
  });

  act(function (done) {
    javaScriptPostProcessor(entry, files)
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
    test("The res should not be an error")
      .value(res)
      .not()
      .isError();

    test("The linter callback should be called twice")
      .value(linter)
      .hasBeenCalled(2);

    test("The minifier callback should not be called")
      .value(minifier)
      .not()
      .hasBeenCalled();
  });
}

/**[@test({ "title": "TruJS.compile.postProcessor._JavaScriptPostProcessor: minify, but no lint" })]*/
function testJavsScriptPostProcessor2(arrange, act, assert, promise, callback, module) {
  var javaScriptPostProcessor, linter, lintRes, minifier, data, entry, files, res;

  arrange(function () {
    lintRes = {};
    linter = callback(promise.resolve());
    minifier = callback(promise.resolve(lintRes));
    javaScriptPostProcessor = module(["TruJS.compile.postProcessor._JavaScriptPostProcessor", [, linter, minifier]]);
    data = "test";
    entry = {
      "minify": true
    };
    files = [{
      "data": data
    }, {
      "data": data
    }];
  });

  act(function (done) {
    javaScriptPostProcessor(entry, files)
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
    test("The res should not be an error")
      .value(res)
      .not()
      .isError();

    test("The linter callback should not be called")
      .value(linter)
      .not()
      .hasBeenCalled();

    test("The minifier callback should be called twice")
      .value(minifier)
      .hasBeenCalled(2);
  });
}

/**[@test({ "title": "TruJS.compile.postProcessor._JavaScriptPostProcessor: no minify, but no lint" })]*/
function testJavsScriptPostProcessor3(arrange, act, assert, promise, callback, module) {
  var javaScriptPostProcessor, linter, lintRes, minifier, data, entry, files, res;

  arrange(function () {
    lintRes = {};
    linter = callback(promise.resolve());
    minifier = callback(promise.resolve(lintRes));
    javaScriptPostProcessor = module(["TruJS.compile.postProcessor._JavaScriptPostProcessor", [, linter, minifier]]);
    data = "test";
    entry = {
      "minify": false
    };
    files = [{
      "data": data
    }, {
      "data": data
    }];
  });

  act(function (done) {
    javaScriptPostProcessor(entry, files)
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
    test("The res should not be an error")
      .value(res)
      .not()
      .isError();

    test("The linter callback should not be called")
      .value(linter)
      .not()
      .hasBeenCalled();

    test("The minifier callback should not be called")
      .value(minifier)
      .not()
      .hasBeenCalled();
  });
}
