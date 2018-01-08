/**[@test({ "title": "TruJS.compile._Includes: multiple includes" })]*/
function testIncludes1(arrange, act, assert, module) {
  var includes, manifest, manifestFiles, res;

  arrange(function () {
    includes = module(["TruJS.compile._Includes", []]);
    manifest = [{
      "name": "entry1"
      , "includes": {
          "postCollector": "1"
      }
    }, {
      "name": "entry2"
      , "includes": {
          "postCollector": ["entry3", 0]
      }
    }, {
      "name": "entry3"
    }];
    manifestFiles = [[
      "entry1file"
    ], [
      "entry2file"
    ], [
      "entry3file"
    ]];
  });

  act(function (done) {
    includes(manifest, manifestFiles, "postCollector")
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
    test("res should not be an error")
      .value(res)
      .not()
      .isError();

    test("res 1st set of files should have 2 members")
      .value(res, "[0]")
      .hasMemberCountOf(2);

    test("res 1st set of files should be")
      .value(res, "[0]")
      .toString()
      .equals("entry2file,entry1file");

    test("res 2nd set of files should have 3 members")
      .value(res, "[1]")
      .hasMemberCountOf(3);

    test("res 2nd set of files should be")
      .value(res, "[1]")
      .toString()
      .equals("entry3file,entry1file,entry2file");

    test("res 3rd set of files should have 1 member")
      .value(res, "[2]")
      .hasMemberCountOf(1);
  });
}

/**[@test({ "title": "TruJS.compile._Includes: final include" })]*/
function testIncludes2(arrange, act, assert, module) {
  var includes, manifest, manifestFiles, res;

  arrange(function () {
    includes = module(["TruJS.compile._Includes", []]);
    manifest = [{
      "name": "entry1"
      , "includes": {
          "final": "1"
      }
    }, {
      "name": "entry2"
      , "includes": {
          "postCollector": ["entry3", 0]
      }
    }, {
      "name": "entry3"
    }];
    manifestFiles = [[
      "entry1file"
    ], [
      "entry2file"
    ], [
      "entry3file"
    ]];
  });

  act(function (done) {
    includes(manifest, manifestFiles, "final")
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
    test("res should not be an error")
      .value(res)
      .not()
      .isError();

    test("res 1st set of files should have 2 members")
      .value(res, "[0]")
      .hasMemberCountOf(2);

    test("res 1st set of files should be")
      .value(res, "[0]")
      .toString()
      .equals("entry1file,entry2file");

    test("res 2nd set of files should have 1 member")
      .value(res, "[1]")
      .hasMemberCountOf(1);

    test("res 3rd set of files should have 1 member")
      .value(res, "[2]")
      .hasMemberCountOf(1);
  });
}