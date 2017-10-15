/**[@test({ "title": "TruJS.compile.postProcessor._SassPostProcessor: simple test"})]*/
function testSassPostProcessor1(arrange, act, assert, callback, module) {
  var sassPostProcessor, sassRender, entry, files, res;

  arrange(function () {
    sassRender = callback(function (options, cb) {
      cb(null, { "css": "data" });
    });
    sassPostProcessor = module(["TruJS.compile.postProcessor._SassPostProcessor", [, sassRender]]);
    entry = {

    };
    files = [{
      "file": "style.scss"
      , "data": "sass data"
    }];

  });

  act(function (done) {
    sassPostProcessor(entry, files)
      .then(function (results){
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

    test("sassRender should be called once")
      .value(sassRender)
      .hasBeenCalled(1);

    test("sassRender should be called with options")
      .run(sassRender.getArgs, [0])
      .value("{value}", "[0].data")
      .equals("sass data");

    test("res should have 1 member")
      .value(res)
      .hasMemberCountOf(1);

    test("res[0].data should be")
      .value(res, "[0].data")
      .equals("data");

  });
}

/**[@test({ "title": "TruJS.compile.postProcessor._SassPostProcessor: render error"})]*/
function testSassPostProcessor1(arrange, act, assert, callback, module) {
  var sassPostProcessor, sassRender, entry, files, res;

  arrange(function () {
    sassRender = callback(function (options, cb) {
      cb({ "message": "error" });
    });
    sassPostProcessor = module(["TruJS.compile.postProcessor._SassPostProcessor", [, sassRender]]);
    entry = {

    };
    files = [{
      "file": "style.scss"
      , "data": "sass data"
    }];

  });

  act(function (done) {
    sassPostProcessor(entry, files)
      .then(function (results){
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
