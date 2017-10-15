/**[@test({ "title": "TruJS.compile._Namer: no naming annotaion, no name in data"})]*/
function testNamer1(arrange, act, assert, module) {
  var namer, fileObj, res;

  arrange(function () {
    namer = module(["TruJS.compile._Namer", []]);
    fileObj = {
      "name": "_Test"
      , "dir": "/base/project/test/widgets"
      , "data": "function () {}"
    };
  });

  act(function () {
    res = namer("test", fileObj);
  });

  assert(function (test) {
    test("The naming object should be")
      .value(res)
      .stringify()
      .equals("{\"name\":\"test.widgets._Test\",\"namespace\":\"test.widgets\"}");
  });
}

/**[@test({ "title": "TruJS.compile._Namer: naming annotaion with root"})]*/
function testNamer2(arrange, act, assert, module) {
  var namer, fileObj, res;

  arrange(function () {
    namer = module(["TruJS.compile._Namer", []]);
    fileObj = {
      "name": "_Test"
      , "dir": "/base/project/test/widgets"
      , "data": "/**[@naming({ \"root\": \"project\" })]*/\nfunction () {}"
    };
  });

  act(function () {
    res = namer("test", fileObj);
  });

  assert(function (test) {
    test("The naming object should be")
      .value(res)
      .stringify()
      .equals("{\"root\":\"project\",\"$index\":0,\"$line\":0,\"name\":\"project.test.widgets._Test\",\"namespace\":\"project.test.widgets\"}");
  });
}

/**[@test({ "title": "TruJS.compile._Namer: naming annotaion with namespace"})]*/
function testNamer3(arrange, act, assert, module) {
  var namer, entry, fileObj, res;

  arrange(function () {
    namer = module(["TruJS.compile._Namer", []]);
    fileObj = {
      "name": "_Test"
      , "dir": "/base/project/test/widgets"
      , "data": "/**[@naming({ \"namespace\": \"totally.different\" })]*/\nfunction () {}"
    };
  });

  act(function () {
    res = namer("test", fileObj);
  });

  assert(function (test) {
    test("The naming object should be")
      .value(res)
      .stringify()
      .equals("{\"namespace\":\"totally.different\",\"$index\":0,\"$line\":0,\"name\":\"totally.different._Test\"}");
  });
}

/**[@test({ "title": "TruJS.compile._Namer: naming annotaion with skip"})]*/
function testNamer4(arrange, act, assert, module) {
  var namer, entry, fileObj, res;

  arrange(function () {
    namer = module(["TruJS.compile._Namer", []]);
    fileObj = {
      "name": "_Test"
      , "dir": "/base/project/test/widgets"
      , "data": "/**[@naming({ \"skip\": true })]*/\nfunction () {}"
    };
  });

  act(function () {
    res = namer("test", fileObj);
  });

  assert(function (test) {
    test("The naming object should be")
      .value(res)
      .stringify()
      .equals("{}");
  });
}

/**[@test({ "title": "TruJS.compile._Namer: naming annotaion with skip and namespace"})]*/
function testNamer5(arrange, act, assert, module) {
  var namer, entry, fileObj, res;

  arrange(function () {
    namer = module(["TruJS.compile._Namer", []]);
    fileObj = {
      "name": "_Test"
      , "dir": "/base/project/test/widgets"
      , "data": "/**[@naming({ \"skip\": true, \"namespace\": \"totally.different\" })]*/\nfunction () {}"
    };
  });

  act(function () {
    res = namer("test", fileObj);
  });

  assert(function (test) {
    test("The naming object should be")
      .value(res)
      .stringify()
      .equals("{\"skip\":true,\"namespace\":\"totally.different\",\"$index\":0,\"$line\":0}");
  });
}

/**[@test({ "title": "TruJS.compile._Namer: no naming annotaion no defaultRoot"})]*/
function testNamer6(arrange, act, assert, module) {
  var namer, entry, fileObj, res;

  arrange(function () {
    namer = module(["TruJS.compile._Namer", []]);
    fileObj = {
      "name": "_Test"
      , "dir": "/base/project/test/widgets"
      , "data": "function () {}"
    };
  });

  act(function () {
    res = namer(null, fileObj);
  });

  assert(function (test) {
    test("The naming object should be")
      .value(res)
      .stringify()
      .equals("{\"name\":\"base.project.test.widgets._Test\",\"namespace\":\"base.project.test.widgets\"}");
  });
}

/**[@test({ "title": "TruJS.compile._Namer: non js/json"})]*/
function testNamer7(arrange, act, assert, module) {
  var namer, fileObj, res;

  arrange(function () {
    namer = module(["TruJS.compile._Namer", []]);
    fileObj = {
      "name": "Test"
      , "ext": ".html"
      , "dir": "/base/project/test/widgets"
      , "data": "function () {}"
    };
  });

  act(function () {
    res = namer("test", fileObj);
  });

  assert(function (test) {
    test("The naming object should be")
      .value(res)
      .stringify()
      .equals("{\"name\":\"test.widgets.TestHtml\",\"namespace\":\"test.widgets\"}");
  });
}

/**[@test({ "title": "TruJS.compile._Namer: fragment in fileObj"})]*/
function testNamer8(arrange, act, assert, module) {
  var namer, entry, fileObj, res;

  arrange(function () {
    namer = module(["TruJS.compile._Namer", []]);
    fileObj = {
      "name": "_Test"
      , "dir": "/base/project/test"
      , "fragment": "widgets"
      , "data": "function () {}"
    };
  });

  act(function () {
    res = namer(null, fileObj);
  });

  assert(function (test) {
    test("The naming object should be")
      .value(res)
      .stringify()
      .equals("{\"name\":\"base.project.test.widgets._Test\",\"namespace\":\"base.project.test.widgets\"}");
  });
}
