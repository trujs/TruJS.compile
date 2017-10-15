/**[@test({ "title": "TruJS.compile._FileSaver: save a file with a fragment" })]*/
function testFileSaver1(arrange, act, assert, module, callback) {
  var nodePath, fileSaver, nodeFs, fileObj, filePath, res, mkdirPath, writeFilePath;

  arrange(function () {
    nodePath = module(".nodePath");
    nodeFs = {
      "writeFile": callback(function (path, data, cb) {
        cb(null);
      })
      , "mkdir": callback(function (dir, cb) {
        cb({ "errno": -4075 });
      })
    };
    fileSaver = module(["TruJS.compile._FilesSaver", [nodeFs]]);
    filePath = "/base/output";
    fileObj = {
      "fragment": "path1/path2"
      , "file": "test.js"
      , "data": ""
    };
    mkdirPath = nodePath.resolve("/base/output/path1/path2");
    writeFilePath = nodePath.resolve("/base/output/path1/path2/test.js");
  });

  act(function (done) {
    fileSaver(filePath, [fileObj])
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

    test("The mkdir callback should be called 5 times")
      .value(nodeFs, "mkdir")
      .hasBeenCalled(5);

    test("The mkdir should be called with path")
      .value(nodeFs, "mkdir")
      .hasBeenCalledWithArg(4, 0, mkdirPath);

    test("The writeFile callback should be called once")
      .value(nodeFs, "writeFile")
      .hasBeenCalled(1);

    test("The writeFile callback should be called with path")
      .value(nodeFs, "writeFile")
      .hasBeenCalledWithArg(0, 0, writeFilePath);

  });
}

/**[@test({ "title": "TruJS.compile._FileSaver: error on mkdir call" })]*/
function testFileSaver2(arrange, act, assert, callback, module) {
  var fileSaver, errObj, nodeFs, fileObj, filePath, res;

  arrange(function () {
    errObj = { "errno": -1 };
    nodeFs = {
      "mkdir": callback(function (dir, cb) {
        cb(errObj);
      })
    };
    fileSaver = module(["TruJS.compile._FilesSaver", [nodeFs]]);
    filePath = "/base/output";
    fileObj = {
      "fragment": "path1/path2"
      , "file": "test.js"
      , "data": ""
    };
  });

  act(function (done) {
    fileSaver(filePath, [fileObj])
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

    test("The result should be the error object")
      .value(res)
      .equals(errObj);

  });
}

/**[@test({ "title": "TruJS.compile._FileSaver: dot in filePath" })]*/
function testFileSaver3(arrange, act, assert, module, callback) {
  var nodePath, fileSaver, nodeFs, fileObj, filePath, res, mkdirPath, writeFilePath;

  arrange(function () {
    nodePath = module(".nodePath");
    nodeFs = {
      "writeFile": callback(function (path, data, cb) {
        cb(null);
      })
      , "mkdir": callback(function (dir, cb) {
        cb();
      })
    };
    fileSaver = module(["TruJS.compile._FilesSaver", [nodeFs]]);
    filePath = "/base/output.path";
    fileObj = {
      "fragment": "path1/path2"
      , "file": "test.js"
      , "data": ""
    };
    mkdirPath = nodePath.resolve("/base/output.path/path1/path2");
    writeFilePath = nodePath.resolve("/base/output.path/path1/path2/test.js");
  });

  act(function (done) {
    fileSaver(filePath, [fileObj])
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

    test("The mkdir should be called with path")
      .value(nodeFs, "mkdir")
      .hasBeenCalledWithArg(4, 0, mkdirPath);

    test("The writeFile callback should be called with path")
      .value(nodeFs, "writeFile")
      .hasBeenCalledWithArg(0, 0, writeFilePath);

  });
}

/**[@test({ "title": "TruJS.compile._FileSaver: file object missing file property" })]*/
function testFileSaver4(arrange, act, assert, module, callback) {
  var nodePath, fileSaver, nodeFs, fileObj, filePath, res;

  arrange(function () {
    nodePath = module(".nodePath");
    nodeFs = {
      "writeFile": callback(function (path, data, cb) {
        cb(null);
      })
      , "mkdir": callback(function (dir, cb) {
        cb();
      })
    };
    fileSaver = module(["TruJS.compile._FilesSaver", [nodeFs]]);
    filePath = "/base/output.path";
    fileObj = {
      "fragment": "path1/path2"
      , "data": ""
    };
  });

  act(function (done) {
    fileSaver(filePath, [fileObj])
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
    test("The res should be an error")
      .value(res)
      .isError();

  });
}
