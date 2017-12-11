/**[@test( { "title": "TruJS.compile.type.collection._PathResolver: send undefined as the paths array" } )]*/
function testPathResolver1(arrange, act, assert, module) {
  var pathResolver, base, paths, res;

  arrange(function() {
    pathResolver = module(["TruJS.compile.type.collection._PathResolver", []]);
    base = "/";
    paths = undefined;
  });

  act(function() {
    pathResolver(base, paths)
      .then(function (results) {
        res = results;
      })
      .catch(function (err) {
        console.log(err);
      });
  });

  assert(function(test) {
    test("res should be an empty array").value(res).isEmpty();
  });
}

/**[@test( { "title": "TruJS.compile.type.collection._PathResolver: send paths for each type" } )]*/
function testPathResolver1(arrange, act, assert, callback, mock, module) {
  var pathProcessor, pathResolver, dirProcessor, pathResultProcessor, base, paths, res;

  arrange(function () {
    pathProcessor = callback(module(["TruJS.compile.type.collection._PathProcessor", []]));
    dirProcessor = callback(function (pathObj) {
      if (dirProcessor.callbackCount === 1) {
        pathObj.files = [
          pathObj.path + "\\file1.html"
          , pathObj.path + "\\file2.css"
          , pathObj.path + "\\file3.js"
          , pathObj.path + "\\file4.js"
        ];
      }
      else if (dirProcessor.callbackCount === 2) {
        pathObj.files = [
          pathObj.path + "\\file5.js"
          , pathObj.path + "\\file6.js"
        ];
      }
      else if (dirProcessor.callbackCount === 3) {
        pathObj.files = [
          pathObj.path + "\\path3\\file31.js"
          , pathObj.path + "\\path4\\file41.js"
          , pathObj.path + "\\file41.js"
        ];
      }
      return pathObj;
    });
    pathResultProcessor = callback(module(["TruJS.compile.type.collection._PathResultProcessor", []]));
    pathResolver = module(["TruJS.compile.type.collection._PathResolver", [, pathProcessor, pathResultProcessor, dirProcessor]]);
    base = "/base";
    paths = [
      "./path/file.js",
      "./path/*",
      "./path/*.js",
      "+./path/path2/*",
      "-./path/*.html"
    ];
  });

  act(function (done) {
    pathResolver(base, paths)
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
    test("The res should not be an exception").value(res).not().isError();

    test("The dirProcessor should be called 3 times")
      .value(dirProcessor)
      .hasBeenCalled(4);

    test("The 1st call to the dirProcessor should have a path of")
      .run(dirProcessor.getArgs, [0])
      .value("{value}", "[0].path")
      .matches(/[/\\]base[/\\]path/);

    test("The 2nd call to the dirProcessor should have a path of")
      .run(dirProcessor.getArgs, [1])
      .value("{value}", "[0].path")
      .matches(/[/\\]base[/\\]path/);

    test("The 3rd call to the dirProcessor should have a path of")
      .run(dirProcessor.getArgs, [2])
      .value("{value}", "[0].path")
      .matches(/[/\\]base[/\\]path[/\\]path2/);

      test("The 3rd call to the dirProcessor should have a path of")
        .run(dirProcessor.getArgs, [3])
        .value("{value}", "[0]")
        .stringify()
        .equals("{\"root\":\"Z:\\\\\",\"dir\":\"Z:\\\\base\\\\path\",\"base\":\"*.html\",\"ext\":\".html\",\"name\":\"*\",\"path\":\"Z:\\\\base\\\\path\",\"options\":{\"recurse\":false,\"filter\":\".html\"},\"minus\":true,\"directory\":true,\"wildcard\":\"*.html\"}");

    test("The pathProcessor should be called 5 times")
      .value(pathProcessor.callbackCount)
      .equals(5);

    test("The pathResultProcessor should have been called 5 times")
      .value(pathResultProcessor.callbackCount)
      .equals(5);

    test("The results should have 9 members")
      .value(res)
      .hasMemberCountOf(9);
  });
}