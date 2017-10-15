/**[@test({ "title": "TruJS.compile.preProcessor._TestPreProcessor: extract tests" })]*/
function testTestPreProcessor1(arrange, act, assert, callback, module) {
  var annotation, testPreProcessor, entry, files, test1, test2, res;

  arrange(function () {
    test1 = "/**[@test({ })]*/\ntest1";
    test2 = "/**[@test({ \"type\": \"factory\" })]*/\nfunction test() {\nconsole.log();\n}";
    annotation = {
      "extract": callback(function (name, data) {
        return [test1, test2];
      })
      , "lookup": callback(function (name, data) {
        if(annotation.lookup.callbackCount === 0) {
          return {};
        }
        else {
          return { "type": "factory" }
        }
      })
      , "clear": callback("data")
    };
    testPreProcessor = module(["TruJS.compile.preProcessor._TestPreProcessor", [, annotation]]);
    entry = {};
    files = [{ "data": "", "name": "file" }];
  });

  act(function (done) {
    testPreProcessor(entry, files)
      .then(function (result) {
        res = result;
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

    test("res should have 2 members")
      .value(res)
      .hasMemberCountOf(2);

    test("The 2nd res member should have a file property")
      .value(res, "[1].file")
      .equals("file2.json");

    test("The 2nd res member should have a type property")
      .value(res, "[1].type")
      .equals("factory");

    test("The annotation.lookup callback should be called 2 times")
      .value(annotation, "lookup")
      .hasBeenCalled(2);

    test("The annotation.clear callback should be called 2 times")
      .value(annotation, "clear")
      .hasBeenCalled(2);

  });
}

/**[@test({ "title": "TruJS.compile.preProcessor._TestPreProcessor: functional test" })]*/
function testTestPreProcessor2(arrange, act, assert, callback, module) {
  var annotation, testPreProcessor, entry, files, data, res;

  arrange(function () {
    data = [
        "/**[@test({ \"label\":\"test1\", \"format\":\"node\" })]*/"
        , "function test1() { }\n"
        , "/**[@test({ \"label\":\"test2\" })]*/"
        , "function test2() { }\n"
        , "/**[@test({ \"label\":\"test3\", \"format\":\"browser\" })]*/"
        , "function test3() { }"
    ].join("\n");
    testPreProcessor = module(["TruJS.compile.preProcessor._TestPreProcessor", []]);
    entry = {
        "format": "node"
    };
    files = [{ "data": data, "name": "file" }];
  });

  act(function (done) {
    testPreProcessor(entry, files)
      .then(function (result) {
        res = result;
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

    test("res should have 2 members")
      .value(res)
      .hasMemberCountOf(2);

  });
}
