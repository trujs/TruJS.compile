/**[@test({ "title": "TruJS.compile.collector._CollectionCollector: no error" })]*/
function testCollectionCollector(arrange, act, assert, callback, promise, module) {
  var collectionCollector, nodeFs, pathResolver, paths, base, entry, res;

  arrange(function () {
    nodeFs = {
      "readFile": callback(function (path, b, cb) {
        cb(null, path);
      })
    };
    paths = [{
      "path":"/base/path/file1.js"
    }, {
      "path": "/base/path/file2.js"
    } , {
      "path": "/base/path/file3.js"
    }];
    pathResolver = callback(function () {
      return promise.resolve(paths);
    });
    collectionCollector = module(["TruJS.compile.collector._CollectionCollector", [, nodeFs, pathResolver]]);
    base = "/base";
    entry = {};
  });

  act(function (done) {
    collectionCollector(base, entry)
      .then(function (results) {
        res = results;
        done();
      })
      .catch(function (err) {
        res = err;
        done();
      })
  });

  assert(function (test) {
    test("res should not be an error")
      .value(res)
      .not()
      .isError();

    test("pathResolver should be called once")
      .value(pathResolver)
      .hasBeenCalled(1);

    test("nodeFs.readFile should be called 3 times")
      .value(nodeFs, "readFile")
      .hasBeenCalled(3);

    test("res should have 3 members")
      .value(res)
      .hasMemberCountOf(3);

  });
}

/**[@test({ "title": "TruJS.compile.collector._CollectionCollector: missing" })]*/
function testCollectionCollector(arrange, act, assert, callback, promise, module) {
  var collectionCollector, nodeFs, pathResolver, paths, base, entry, res;

  arrange(function () {
    nodeFs = {
      "readFile": callback(function (path, b, cb) {
        cb(null, path);
      })
    };
    paths = [{
      "path":"/base/path/file1.js"
    }, {
      "path": "/base/path/file2.js"
    } , {
      "path": "/base/path/file3.js"
      , "missing": true
    }];
    pathResolver = callback(function () {
      return promise.resolve(paths);
    });
    collectionCollector = module(["TruJS.compile.collector._CollectionCollector", [, nodeFs, pathResolver]]);
    base = "/base";
    entry = {};
  });

  act(function (done) {
    collectionCollector(base, entry)
      .then(function (results) {
        res = results;
        done();
      })
      .catch(function (err) {
        res = err;
        done();
      })
  });

  assert(function (test) {
    test("res should be an error")
      .value(res)
      .isError();

  });
}
