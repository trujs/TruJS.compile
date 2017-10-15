/**[@test({ "title": "TruJS.compile.formatter._JavaScriptFormatter: node entry with strict as default" })]*/
function testJavaScriptFormatter1(arrange, act, assert, module) {
  var javaScriptFormatter, entry, files, res, correct;

  arrange(function () {
    javaScriptFormatter = module(["TruJS.compile.formatter._JavaScriptFormatter", []]);
    entry = {
      "format": "node"
      , "return": "test"
    };
    files = [{
      "data": ""
    }];
    correct = "\"use strict\";\n\n\n\nmodule.exports = " + entry.return + ";";
  });

  act(function (done) {
    javaScriptFormatter(entry, files)
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
      .isError()

    test("res[0].data should be")
      .value(res, "[0].data")
      .equals(correct);

  });
}

/**[@test({ "title": "TruJS.compile.formatter._JavaScriptFormatter: node entry no return" })]*/
function testJavaScriptFormatter2(arrange, act, assert, module) {
  var javaScriptFormatter, entry, files, res;

  arrange(function () {
    javaScriptFormatter = module(["TruJS.compile.formatter._JavaScriptFormatter", []]);
    entry = {
      "format": "node"
    };
    files = [{
      "data": ""
    }];
  });

  act(function (done) {
    javaScriptFormatter(entry, files)
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

/**[@test({ "title": "TruJS.compile.formatter._JavaScriptFormatter: browser entry, no namespace, no return, no strict" })]*/
function testJavaScriptFormatter3(arrange, act, assert, module) {
  var javaScriptFormatter, entry, files, res, correct;

  arrange(function () {
    javaScriptFormatter = module(["TruJS.compile.formatter._JavaScriptFormatter", []]);
    entry = {
      "format": "browser"
      , "strict": false
    };
    files = [{
      "data": ""
    }];
    correct = "(function (){\n\n})();";
  });

  act(function (done) {
    javaScriptFormatter(entry, files)
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

    test("res[0].data should be")
      .value(res, "[0].data")
      .equals(correct);

  });
}

/**[@test({ "title": "TruJS.compile.formatter._JavaScriptFormatter: browser entry, with namespace, with return, strict true" })]*/
function testJavaScriptFormatter4(arrange, act, assert, module) {
  var javaScriptFormatter, entry, files, res, correct;

  arrange(function () {
    javaScriptFormatter = module(["TruJS.compile.formatter._JavaScriptFormatter", []]);
    entry = {
      "format": "browser"
      , "strict": true
      , "return": "test"
      , "namespace": "myns"
    };
    files = [{
      "data": ""
    }];
    correct = "window[\"myns\"] = (function (){\n\"use strict\";\n\t\n\t\n\t\n\treturn test;\n})();";
  });

  act(function (done) {
    javaScriptFormatter(entry, files)
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

    test("res[0].data should be")
      .value(res, "[0].data")
      .equals(correct);

  });
}
