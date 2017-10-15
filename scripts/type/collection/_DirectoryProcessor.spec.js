/**[@test({ "title": "TruJS.compile.type.collection._DirectoryProcessor: directory path" })]*/
function testDirectoryProcessor1(arrange, act, assert, callback, promise, module) {
  var directoryProcessor, dir, pathObj, res;

  arrange(function () {
    dir = callback(function (path, options) {
      return promise.resolve({
        "isDirectory": true
        , "children": [{
          "isDirectory": true
          , "children": [{
            "path": "/base/child1/child2/file.js"
          }]
        }, {
          "path": "/base/child1/file.js"
        }]
      });
    });

    directoryProcessor = module(["TruJS.compile.type.collection._DirectoryProcessor", [dir]]);

    pathObj = {
      "path": "/base/child1"
    };
  });

  act(function (done) {
    directoryProcessor(pathObj, {})
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

    test("The dir callback should be called with")
      .value(dir)
      .hasBeenCalledWithArg(0, 0, pathObj.path);

    test("The res should have a files array with x members")
      .value(res, "files")
      .hasMemberCountOf(2);

    test("The res.files array should have a member")
      .value(res, "files")
      .hasMember("/base/child1/child2/file.js");

  });
}

/**[@test({ "title": "TruJS.compile.type.collection._DirectoryProcessor: missing" })]*/
function testDirectoryProcessor2(arrange, act, assert, callback, promise, module) {
  var directoryProcessor, dir, pathObj, res;

  arrange(function () {
    dir = callback(function (path, options) {
      return promise.resolve({
        "missing": true
      });
    });
    directoryProcessor = module(["TruJS.compile.type.collection._DirectoryProcessor", [dir]]);

    pathObj = {};

  });

  act(function (done) {
    directoryProcessor(pathObj, {})
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

    test("The res should have the property missing = true")
      .value(res, "missing")
      .isTrue();
  });
}

/**[@test({ "title": "TruJS.compile.type.collection._DirectoryProcessor: file path" })]*/
function testDirectoryProcessor3(arrange, act, assert, callback, promise, module) {
  var directoryProcessor, dir, pathObj, res;

  arrange(function () {
    dir = callback(function (path, options) {
      return promise.resolve({
        "path": "/base/path1/file.js"
      });
    });
    directoryProcessor = module(["TruJS.compile.type.collection._DirectoryProcessor", [dir]]);

    pathObj = {
      "path": "/base/path1/file.js"
    };

  });

  act(function (done) {
    directoryProcessor(pathObj, {})
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

    test("The res.file should have one member, the path")
      .value(res, "files")
      .hasMember(pathObj.path);

  });
}