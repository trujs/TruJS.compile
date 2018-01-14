/**[@test( { "title": "TruJS.compile._PathParser: Test all special tags" } )]*/
function testPathParser1(arrange, act, assert, callback, module) {
  var nodeDirname, nodeProcess, pathParser, base, path1, path2, path3, path4
  , path5, path6, path7, res1, res2, res3, res4, res5, res6, res7;

  arrange(function() {
    nodeDirname = "/dirname";
    nodeProcess = {
      "cwd": callback("/cwd")
    }
    pathParser = module(["TruJS.compile._PathParser", [, nodeProcess, nodeDirname]]);
    base = "/base/";
    path1 = "{script}/path1";
    path2 = "{root}/path2";
    path3 = "{repos}/path3";
    path4 = "{projects}/path4";
    path5 = "path5";
    path6 = "path6";
    path7 = "{resources}/path7";
  });

  act(function() {
    res1 = pathParser(base, path1);
    res2 = pathParser(base, path2);
    res3 = pathParser(base, path3);
    res4 = pathParser(base, path4);
    res5 = pathParser(null, path5);
    res6 = pathParser(base, path6);
    res7 = pathParser(base, path7);
  });

  assert(function(test) {
    test("res1 should be")
      .value(res1, "path")
      .matches(/[/\\]dirname[/\\]path1/);

    test("res2 should be")
      .value(res2, "path")
      .matches(/[/\\]cwd[/\\]path2/);

    test("res3 should be")
      .value(res3, "path")
      .matches(/[/\\]cwd[/\\]repos[/\\]path3/);

    test("res4 should be")
      .value(res4, "path")
      .matches(/[/\\]cwd[/\\]projects[/\\]path4/);

    test("res5 should be")
      .value(res5, "path")
      .matches(/[/\\]cwd[/\\]path5/);

    test("res6 should be")
      .value(res6, "path")
      .matches(/[/\\]base[/\\]path6/);

    test("res6 should be")
      .value(res7, "path")
      .matches(/[/\\]cwd[/\\]resources[/\\]path7/);

  });
}

/**[@test( { "title": "TruJS.compile._PathParser: single argument" } )]*/
function testPathParser2(arrange, act, assert, callback, module) {
  var nodeDirname, nodeProcess, pathParser, path, res;

  arrange(function() {
    nodeDirname = "/dirname";
    nodeProcess = {
      "cwd": callback("/cwd")
    }
    pathParser = module(["TruJS.compile._PathParser", [, nodeProcess, nodeDirname]]);
    path = "{script}/path1";
  });

  act(function() {
    res = pathParser(path);
  });

  assert(function(test) {
    test("res should be")
      .value(res, "path")
      .matches(/[/\\]dirname[/\\]path1/);

  });
}
