/**[@test({ "title": "TruJS.compile.type.collection._PathResultProcessor: file, directory, missing, minus" })]*/
function testPathResultProcessor1(arrange, act, assert, module) {
  var pathResultProcessor, files, pathResults;

  arrange(function () {
    pathResultProcessor = module(["TruJS.compile.type.collection._PathResultProcessor", []]);
    files = [{
      "path": "/base/path/file.js"
    }];
    pathResults = [
      "/base/path/file.js"
      , "/base/path/file1.js"
      , "/base/path2/file5.html" //minused below
      , {
        "fragment": "path"
        , "path": "/base"
        , "files": [
          "/base/path/file1.js" //duplicate
          , "/base/path/file2.js"
          , "/base/path/file3.js" //minused below
          , "/base/path/file4.html"
          , "/base/path/path2/path3/file6.html" //not recursive
        ]
      }, {
        "missing": true
        , "path": "/base/path/missing.js"
      }, {
        "minus": true
        , "path": "/base/path/file3.js"
      }, {
        "minus": true
        , "path": "/base"
        , "fragment": "path2"
        , "wildcard": "*.html"
      }
    ];

  });

  act(function () {
    pathResults.forEach(function (result) {
      files = pathResultProcessor(files, result);
    });
  });

  assert(function (test) {

    test("There should be 5 files")
      .value(files)
      .hasMemberCountOf(5);


    test("The files should be unique")
      .value(files)
      .isUnique();

  });
}

/**[@test({ "title": "TruJS.compile.type.collection._PathResultProcessor: directory with recursive" })]*/
function testPathResultProcessor2(arrange, act, assert, module) {
  var pathResultProcessor, files, pathResults;

  arrange(function () {
    pathResultProcessor = module(["TruJS.compile.type.collection._PathResultProcessor", []]);
    files = [{
      "path": "/base/path/file.js"
    }];
    pathResults = [
      "/base/path/file.js"
      , "/base/path/file1.js"
      , {
        "options": {
          "recurse": true
        }
        , "files": [
          "/base/path/file1.js"
          , "/base/path/file2.js"
          , "/base/path/file3.js"
          , "/base/path/file4.html"
          , "/base/path2/file5.html"
          , "/base/path/path2/path3/file6.html"
        ]
      }, {
        "missing": true
        , "path": "/base/path/missing.js"
      }, {
        "minus": true
        , "path": "/base/path/file3.js"
      }, {
        "minus": true
        , "path": "/base"
        , "fragment": "path2"
        , "wildcard": "*.html"
      }
    ];

  });

  act(function () {
    pathResults.forEach(function (result) {
      files = pathResultProcessor(files, result);
    });
  });

  assert(function (test) {

    test("There should be 6 files")
      .value(files)
      .hasMemberCountOf(6);
    test("The files should be unique")
      .value(files)
      .isUnique();

  });
}

/**[@test({ "title": "TruJS.compile.type.collection._PathResultProcessor: minus without path" })]*/
function testPathResultProcessor2(arrange, act, assert, module) {
  var pathResultProcessor, files, pathResults;

  arrange(function () {
    pathResultProcessor = module(["TruJS.compile.type.collection._PathResultProcessor", []]);
    files = [];
    pathResults = [
      {
        root: 'Z:\\',
        dir: 'Z:\\geekshake\\TruJS\\repos\\TruJS',
        base: '*.js',
        ext: '.js',
        name: '*',
        path: 'Z:\\geekshake\\TruJS\\repos\\TruJS',
        options: { recurse: true, filter: '.js' },
        minus: false,
        directory: true,
        wildcard: '*.js',
        files:[
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\_RegEx.spec.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\_Object.spec.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\_String.spec.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\_Array.spec.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\_Object.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\TruJS.spec.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\_String.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\_Number.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\_Array.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\TruJS.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\_Number.spec.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\_RegEx.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\encode\\_HtmlEncoder.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\encode\\_HtmlEncoder.spec.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\timing\\_Performance.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\security\\AntiXss.spec.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\security\\AntiXss.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\object\\_Watcher.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\object\\_Watcher.spec.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\log\\_Reporter.spec.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\log\\_Log.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\log\\_Reporter.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\event\\_SimpleEvent.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\event\\_EventTarget.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\event\\_EventTarget.spec.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\event\\_SimpleEvent.spec.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\fs\\_Directory.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\ioc\\_Container.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\ioc\\_Container.spec.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\ioc\\Container.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\ioc\\_Entry.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\dom\\_ClassHelper.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\dom\\_ClassHelper.spec.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\dom\\_ElementHelper.spec.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\dom\\_ElementHelper.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\data\\request\\_HttpRequest.spec.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\data\\request\\_HttpRequest.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\func\\_Wrapper.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\func\\_Async.spec.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\func\\_Wrapper.spec.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\func\\_Inspector.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\func\\_Stack.spec.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\func\\_Stack.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\func\\_Delay.spec.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\func\\_Delay.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\func\\_Inspector.spec.js',
          'Z:\\geekshake\\TruJS\\repos\\TruJS\\func\\_Async.js'
        ]
      }, {
        root: '',
        dir: '',
        base: '*.spec.js',
        ext: '.js',
        name: '*.spec',
        path: '',
        options: { recurse: false, filter: '.js' },
        minus: true,
        directory: true,
        wildcard: '*.spec.js'
      }
    ];
  });

  act(function () {
    pathResults.forEach(function (result) {
      files = pathResultProcessor(files, result);
    });
  });

  assert(function (test) {
    test("files should have 26 members")
      .value(files)
      .hasMemberCountOf(26);

  });
}