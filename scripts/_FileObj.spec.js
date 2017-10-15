/**[@test({ "title": "TruJS.compile._FileObj: string path and data" })]*/
function testFileObj1(arrange, act, assert, module) {
  var fileObj, path, data, res;

  arrange(function () {
    fileObj = module(["TruJS.compile._FileObj", []]);
    path = "/base/path/file.js";
    data = "file data";
  });

  act(function () {
    res = fileObj(path, data);
  });

  assert(function (test) {
    test("res.file should be")
      .value(res, "file")
      .equals("file.js");

    test("res.name should be")
      .value(res, "name")
      .equals("file");

    test("res.ext should be")
      .value(res, "ext")
      .equals(".js");

    test("res.path should be")
      .value(res, "path")
      .matches(/[/\\]base[/\\]path[/\\]file[.]js/);

    test("res.data should be")
      .value(res, "data")
      .equals(data);

  });
}

/**[@test({ "title": "TruJS.compile._FileObj: path object w/ file property and data" })]*/
function testFileObj2(arrange, act, assert, module) {
  var fileObj, path, data, res, nodePath;

  arrange(function () {
    nodePath = module(".nodePath");
    fileObj = module(["TruJS.compile._FileObj", []]);
    path = nodePath.parse("/base/path/file.js");
    path.file = path.base;
    delete path.base;
    data = "file data";
  });

  act(function () {
    res = fileObj(path, data);
  });

  assert(function (test) {
    test("res.file should be")
      .value(res, "file")
      .equals("file.js");

    test("res.name should be")
      .value(res, "name")
      .equals("file");

    test("res.ext should be")
      .value(res, "ext")
      .equals(".js");

    test("res.path should be")
      .value(res, "path")
      .matches(/[/\\]base[/\\]path[/\\]file[.]js/);

    test("res.data should be")
      .value(res, "data")
      .equals(data);

  });
}

/**[@test({ "title": "TruJS.compile._FileObj: dir, name, ext empty string" })]*/
function testFileObj2(arrange, act, assert, module) {
  var fileObj, path, data, res, nodePath;

  arrange(function () {
    nodePath = module(".nodePath");
    fileObj = module(["TruJS.compile._FileObj", []]);
    path = nodePath.parse("/base/path/file.js");
    path.ext = "";
    path.name = "";
    path.dir = "";
    path.path = "/base/path/file.js";
    data = "file data";
  });

  act(function () {
    res = fileObj(path, data);
  });

  assert(function (test) {
    test("res.file should be")
      .value(res, "file")
      .equals("file.js");

    test("res.name should be")
      .value(res, "name")
      .equals("file");

    test("res.ext should be")
      .value(res, "ext")
      .equals(".js");

    test("res.path should be")
      .value(res, "path")
      .matches(/[/\\]base[/\\]path[/\\]file[.]js/);

    test("res.data should be")
      .value(res, "data")
      .equals(data);

  });
}
