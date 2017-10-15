/**[@test( { "title": "TruJS.compile._Saver" } )]*/
function testSaver(arrange, act, assert, callback, promise, module) {
  var saver, fileSaver, manifest, res;

  arrange(function () {
    fileSaver = callback(function(output, files) {
      return promise.resolve(files[0]);
    });
    saver = module(["TruJS.compile._Saver", [, fileSaver]]);
    manifest = [{
      "output": "./output"
      , "files": ["file1"]
    }, {
      "output": "./output"
      , "files": ["file2"]
    }, {
      "output": ""
      , "files": ["file3"]
    }];
  });

  act(function (done) {
    saver(manifest)
      .then(function (results) {
        res = results;
        done();
      });
  });

  assert(function (test) {
    test("fileSaver callback should be called twice").value(fileSaver).hasBeenCalled(2);
    test("res should be an array with 2 members").value(res).hasMemberCountOf(2);
    test("res[0] should be \"file1\"").value(res, "[0]").equals("file1");
    test("res[1] should be \"file2\"").value(res, "[1]").equals("file2");
  });
}
