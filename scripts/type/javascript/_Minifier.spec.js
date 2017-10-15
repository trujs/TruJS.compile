/**[@test({ "title": "TruJS.compile.type.javascript._Minifier: minifiy a file not supported" })]*/
function testMinifier1(arrange, act, assert, module) {
  var minifier, fileObj, res;

  arrange(function () {
    minifier = module(["TruJS.compile.type.javascript._Minifier", []]);
    fileObj = {
      "ext": ".notexists"
    };
  });

  act(function (done) {
    minifier(fileObj, {})
      .then(function(result) {
        res = result;
        done();
      })
      .catch(function (err) {
        res = err;
        done();
      });
  });

  assert(function (test) {

    test("The result should be an error")
      .value(res)
      .isError();

  });
}

/**[@test({ "title": "TruJS.compile._Minifier: minify javascript" })]*/
function testMinifier1(arrange, act, assert, module, callback, promise) {
  var minifier, fileObj, res, $cont;

  arrange(function () {
    $cont = callback(function () {
      return function(fileObj) {
        return new promise(function(resolve) {
          resolve(fileObj);
        });
      };
    });
    minifier = module(["TruJS.compile.type.javascript._Minifier", [, $cont]]);
    fileObj = {
      "ext": ".js"
      , "data": ""
    };
  });

  act(function (done) {
    minifier(fileObj, {})
      .then(function(result) {
        res = result;
        done();
      })
      .catch(function (err) {
        res = err;
        done();
      });
  });

  assert(function (test) {

    test("The result should not be an error")
      .value(res)
      .not()
      .isError();

  });
}