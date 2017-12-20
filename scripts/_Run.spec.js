/**[@test({ "title": "TruJS.compile._Run: pass correct base and manifest paths " })]*/
function testRun1(arrange, act, assert, callback, promise, module) {
  var defaults, data, nodeFs, nodePath, compiler, run, cmdArgs, res, manifestPath;

  arrange(function () {
    data = "[{ \"name\": \"value\" }]";
    nodeFs = {
      "readFile": callback(function (path, b, cb) {
        cb(null, data);
      })
    };
    nodePath = module(".nodePath");
    compiler = callback(function (basePath, settings) {
      return promise.resolve(settings);
    });
    defaults = {
      "manifest": {
        "manifestFile": "manifest.json"
      }
    };
    run = module(["TruJS.compile._Run", [, nodeFs,, compiler, defaults]]);
    cmdArgs = {
      "base": "/base"
      , "manifest": "path1"
    };
    manifestPath = nodePath.resolve(nodePath.join(cmdArgs.manifest, defaults.manifest.manifestFile));
  });

  act(function (done) {
    run(cmdArgs)
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

    test("The nodeFs.readFile callback should be called once")
      .value(nodeFs, "readFile")
      .hasBeenCalled(1);

    test("The nodeFs.readFile callback should be called with the path")
      .value(nodeFs, "readFile")
      .hasBeenCalledWithArg(0, 0, manifestPath);

    test("The compiler callback should be called once")
      .value(compiler)
      .hasBeenCalled(1);

    test("The compiler callback 2nd arg should have a property \"name\"")
      .run(compiler.getArgs, [0])
      .value("{value}", "[1][0]")
      .hasProperty("name");

  });
}

/**[@test({ "title": "TruJS.compile._Run: no manifest path" })]*/
function testRun2(arrange, act, assert, callback, promise, module) {
  var defaults, data, nodeFs, nodePath, compiler, run, cmdArgs, res, manifestPath;

  arrange(function () {
    data = "[{ \"name\": \"value\" }]";
    nodeFs = {
      "readFile": callback(function (path, b, cb) {
        cb(null, data);
      })
    };
    nodePath = module(".nodePath");
    compiler = callback(function (settings) {
      return promise.resolve(settings);
    });
    defaults = {
      "manifest": {
        "manifestDir": "/base/manifest.json"
      }
    };
    run = module(["TruJS.compile._Run", [, nodeFs,, compiler, defaults]]);
    cmdArgs = {
      "base": "/base"
    };
    manifestPath = nodePath.resolve(defaults.manifest.manifestDir);
  });

  act(function (done) {
    run(cmdArgs)
      .then(function (results) {
        res = results;
        done();
      })
      .catch(function (err) {
          console.log(err);
        res = err;
        done();
      });
  });

  assert(function (test) {
    test("The res should not be an error")
      .value(res)
      .not()
      .isError();

    test("The nodeFs.readFile callback should be called with the path")
      .value(nodeFs, "readFile")
      .hasBeenCalledWithArg(0, 0, manifestPath);

  });
}

/**[@test({ "title": "TruJS.compile._Run: error reading manifest file" })]*/
function testRun3(arrange, act, assert, callback, module) {
  var nodeFs, compiler, run, cmdArgs, res;

  arrange(function () {
    nodeFs = {
      "readFile": callback(function (path, b, cb) {
        cb(new Error("fake error"));
      })
    };
    run = module(["TruJS.compile._Run", [, nodeFs]]);
    cmdArgs = {
      "base": "/base"
      , "manifest": "/base/path1"
    };
  });

  act(function (done) {
    run(cmdArgs)
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

/**[@test({ "title": "TruJS.compile._Run: bad manifest json data" })]*/
function testRun4(arrange, act, assert, callback, module) {
  var defaults, data, nodeFs, compiler, run, cmdArgs, res, manifestPath;

  arrange(function () {
    data = "[{ \"name\": \"value\" ";
    nodeFs = {
      "readFile": callback(function (path, b, cb) {
        cb(null, data);
      })
    };
    run = module(["TruJS.compile._Run", [, nodeFs]]);
    cmdArgs = {
      "base": "/base"
      , "manifest": "/base/path1"
    };
  });

  act(function (done) {
    run(cmdArgs)
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

/**[@test({ "title": "TruJS.compile._Run: try all special path tags" })]*/
function testRun5(arrange, act, assert, callback, module) {
  var defaults, data, nodeFs, nodePath, compiler, run, cmdArgs, cnt, nodeDirName, nodeProcess, manifestPaths, finished;

  arrange(function () {
    data = "[{ \"name\": \"value\" }]";
    nodeFs = {
      "readFile": callback(function (path, b, cb) {
        cb(null, data);
      })
    };
    nodePath = module(".nodePath");
    compiler = callback();
    nodeDirName = "/nodedir";
    nodeProcess = {
      "cwd": callback("/cwd")
    }
    run = module(["TruJS.compile._Run", [, nodeFs, , compiler, , nodeDirName, nodeProcess]]);
    cmdArgs = [{
      "manifest": "{script}/path1/manifest.json"
    }, {
      "manifest": "{cwd}/path1/manifest.json"
    }, {
      "manifest": "{projects}/path1/manifest.json"
    }, {
      "manifest": "{repos}/path1/manifest.json"
    }];
    manifestPaths = [
      nodePath.resolve(nodePath.join(nodeDirName, "path1/manifest.json"))
      , nodePath.resolve(nodePath.join("/cwd", "path1/manifest.json"))
      , nodePath.resolve(nodePath.join("/cwd/projects", "path1/manifest.json"))
      , nodePath.resolve(nodePath.join("/cwd/repos", "path1/manifest.json"))
    ];
    cnt = 0;
  });

  act(function (done) {
    finished = function () {
      cnt++;
      if (cnt === 4) {
        done();
      }
    };

    run(cmdArgs[0]).then(function () { finished(); });
    run(cmdArgs[1]).then(function () { finished(); });
    run(cmdArgs[2]).then(function () { finished(); });
    run(cmdArgs[3]).then(function () { finished(); });

  });

  assert(function (test) {
    test("The 1st nodeFs callback should be called with path")
      .value(nodeFs, "readFile")
      .hasBeenCalledWithArg(0, 0, manifestPaths[0]);

    test("The 2nd nodeFs callback should be called with path")
      .value(nodeFs, "readFile")
      .hasBeenCalledWithArg(1, 0, manifestPaths[1]);

    test("The 3rd nodeFs callback should be called with path")
      .value(nodeFs, "readFile")
      .hasBeenCalledWithArg(2, 0, manifestPaths[2]);

    test("The 4th nodeFs callback should be called with path")
      .value(nodeFs, "readFile")
      .hasBeenCalledWithArg(3, 0, manifestPaths[3]);
  });
}

/**[@test({ "title": "TruJS.compile._Run: missing base, defaults to manifestPath" })]*/
function testRun6(arrange, act, assert, callback, module) {
  var data, nodeFs, nodePath, compiler, run, cmdArgs, res, manifestPath;

  arrange(function () {
    data = "[{ \"name\": \"value\" }]";
    nodeFs = {
      "readFile": callback(function (path, b, cb) {
        cb(null, data);
      })
    };
    nodePath = module(".nodePath");
    compiler = callback();
    run = module(["TruJS.compile._Run", [, nodeFs,, compiler]]);
    cmdArgs = {
      "manifest": "/base/path1"
    };
    manifestPath = nodePath.resolve(cmdArgs.manifest);
  });

  act(function (done) {
    run(cmdArgs)
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

    test("The compiler callback should be called with the base path")
      .value(compiler)
      .hasBeenCalledWithArg(0, 0, manifestPath);

  });
}

/**[@test({ "title": "TruJS.compile._Run: entry command arg " })]*/
function testRun7(arrange, act, assert, callback, promise, module) {
  var defaults, manifest, nodeFs, compiler, run, cmdArgs, res;

  arrange(function () {
    manifest = "[{ \"name\": \"entry1\" },{ \"name\": \"entry2\" },{ \"name\": \"entry3\" },{ \"name\": \"entry4\" }]";
    nodeFs = {
      "readFile": callback(function (path, b, cb) {
        cb(null, manifest);
      })
    };
    compiler = callback(function (settings) {
      return promise.resolve(settings);
    });
    run = module(["TruJS.compile._Run", [, nodeFs, , compiler]]);
    cmdArgs = {
      "base": "/base"
      , "manifest": "path1"
      , "entry": "1,3"
    };
  });

  act(function (done) {
    run(cmdArgs)
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
    test("The manifest sent to the compile should have 2 members")
      .run(compiler.getArgs, [0])
      .value("{value}", "[1]")
      .hasMemberCountOf(2);

    test("The 1st manifest entry should have a property \"name\" equal to")
      .run(compiler.getArgs, [0])
      .value("{value}", "[1][0].name")
      .equals("entry2");

    test("The 2nd manifest entry should have a property \"name\" equal to")
      .run(compiler.getArgs, [0])
      .value("{value}", "[1][1].name")
      .equals("entry4");

  });
}

/**[@test({ "title": "TruJS.compile._Run: object with entries " })]*/
function testRun7(arrange, act, assert, callback, promise, module) {
  var defaults, manifest, nodeFs, compiler, run, cmdArgs, res;

  arrange(function () {
    manifest = "{ \"name\": \"entry1\", \"entries\": [{ },{ \"name\": \"entry2\" },{ \"name\": \"entry3\" },{ \"name\": \"entry4\" }]}";
    nodeFs = {
      "readFile": callback(function (path, b, cb) {
        cb(null, manifest);
      })
    };
    compiler = callback(function (basePath, manifest) {
      return promise.resolve(manifest);
    });
    run = module(["TruJS.compile._Run", [, nodeFs, , compiler]]);
    cmdArgs = {
      "base": "/base"
      , "manifest": "path1"
    };
  });

  act(function (done) {
    run(cmdArgs)
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
      test("The 1st entry should have the parent name")
      .value(res, "[0].name")
      .equals("entry1");

      test("The 2nd entry should have its own name")
      .value(res, "[1].name")
      .equals("entry2");

  });
}