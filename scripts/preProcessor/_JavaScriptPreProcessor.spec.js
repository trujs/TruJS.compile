/**[@test({ "title": "TruJS.compile.preProcessor._JavaScriptPreProcessor: " })]*/
function testJavascriptPreProcessor1(arrange, act, assert, callback, promise, module) {
  var annotation, linter, javaScriptConverter, javascriptPreProcessor, entry, files, res;

  arrange(function () {
    annotation = {
      "getAll": callback()
      , "clear": callback()
      , "annotateAll": callback()
    };
    linter = callback(promise.resolve());
    javaScriptConverter = callback();
    javascriptPreProcessor = module(["TruJS.compile.preProcessor._JavaScriptPreProcessor", [, annotation,, linter, javaScriptConverter]]);
    entry = {
      "lint": "pre"
    };
    files = [{
      "ext": ".html"
    }, {
      "ext": ".js"
    }];
  });

  act(function (done) {
    javascriptPreProcessor(entry, files)
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
    test("annotation.getAll should be called twice")
      .value(annotation.getAll)
      .hasBeenCalled(2);

    test("The entry.fileTypes array should be")
      .value(entry, "fileTypes")
      .toString()
      .equals(".html,.js");

    test("annotation.clear should be called twice")
      .value(annotation.clear)
      .hasBeenCalled(2);

    test("javaScriptConverter should be called once")
      .value(javaScriptConverter)
      .hasBeenCalled(1);

    test("linter should be called twice")
      .value(linter)
      .hasBeenCalled(2);

    test("annotation.annotateAll should be called twice")
      .value(annotation.annotateAll)
      .hasBeenCalled(2);
  });
}
