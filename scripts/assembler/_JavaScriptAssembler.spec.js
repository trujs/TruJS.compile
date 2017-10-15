/**[@test({ "title": "TruJS.compile.assembler._JavaScriptAssembler: naming false"})]*/
function testJavaScriptAssembler(arrange, act, assert, callback, module) {
  var javaScriptAssembler, entry, files, res;

  arrange(function () {
    javaScriptAssembler = module(["TruJS.compile.assembler._JavaScriptAssembler", []]);
    files = [{
      "data": "/**[@naming({\"name\":\"_NoName\",\"namespace\":\"name.space\"})]*/\nfunction func(){ }\n/**[@another({})]*/"
    }];
    entry = {
      "name": "TestName"
      , "root": "test"
      , "naming": false
    };
  });

  act(function (done) {
    javaScriptAssembler(entry, files)
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

    test("res should have 1 member")
      .value(res)
      .hasMemberCountOf(1);

    test("res[0].file should be")
      .value(res, "[0].file")
      .equals("TestName.js");

    test("res[0].data[0] should be")
      .value(res, "[0].data[0]")
      .equals("function func(){ }");

  });
}

/**[@test({ "title": "TruJS.compile.assembler._JavaScriptAssembler: naming not false"})]*/
function testJavaScriptAssembler(arrange, act, assert, callback, module) {
  var javaScriptAssembler, entry, files, res;

  arrange(function () {
    javaScriptAssembler = module(["TruJS.compile.assembler._JavaScriptAssembler", []]);
    files = [{
      "data": "/**[@naming({\"name\":\"_NoName\",\"namespace\":\"name.space\"})]*/\nfunction func(){ }\n/**[@another({})]*/"
    }];
    entry = {
      "name": "TestName"
      , "root": "test"
    };
  });

  act(function (done) {
    javaScriptAssembler(entry, files)
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

    test("res should have 1 member")
      .value(res)
      .hasMemberCountOf(1);

    test("res[0].data[0] should be")
      .value(res, "[0].data[0]")
      .equals("/** @namespace name */\nvar name = { };\n\n/** @namespace name.space */\nname.space = name.space || { };\n\nname.space._NoName = function func(){ };");

  });
}

/**[@test({ "title": "TruJS.compile.assembler._JavaScriptAssembler: naming is namespace"})]*/
function testJavaScriptAssembler(arrange, act, assert, callback, module) {
  var javaScriptAssembler, entry, files, res;

  arrange(function () {
    javaScriptAssembler = module(["TruJS.compile.assembler._JavaScriptAssembler", []]);
    files = [{
      "data": "/**[@naming({\"name\":\"_NoName\",\"namespace\":\"name.space\"})]*/\nfunction func(){ }\n/**[@another({})]*/"
    }];
    entry = {
      "name": "TestName"
      , "root": "test"
      , "naming": "namespace"
    };
  });

  act(function (done) {
    javaScriptAssembler(entry, files)
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

    test("res should have 1 member")
      .value(res)
      .hasMemberCountOf(1);

    test("res[0].data[0] should be")
      .value(res, "[0].data[0]")
      .equals("/** @namespace name */\nvar name = { };\n\n/** @namespace name.space */\nname.space = name.space || { };\n\nfunction func(){ }");

  });
}
