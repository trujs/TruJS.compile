/**[@test({ "title": "TruJS.compile.assembler._TestAssembler: 1 with title, one with label"})]*/
function testTestAssembler1(arrange, act, assert, module) {
  var testAssembler, entry, files, res, correct;

  arrange(function () {
    testAssembler = module(["TruJS.compile.assembler._TestAssembler", []]);
    entry = {};
    files = [{
      "title": "test title"
      , "data": "file1"
    }, {
      "label": "test label"
      , "type": "factory"
      , "data": "file2"
    }];
    correct = "[{\n\t\"title\": \"test title\", \n\t\"type\": \"test\", \n\t\"value\": file1\n}, {\n\t\"label\": \"test label\", \n\t\"type\": \"factory\", \n\t\"value\": file2\n}]";
  });

  act(function (done) {
    testAssembler(entry, files)
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

    test("res should have 1 member")
      .value(res)
      .hasMemberCountOf(1);

    test("res[0].data should be")
      .value(res, "[0].data")
      .equals(correct);
  });
}

/**[@test({ "title": "TruJS.compile.assembler._TestAssembler: missing title and label"})]*/
function testTestAssembler1(arrange, act, assert, module) {
  var testAssembler, entry, files, res;

  arrange(function () {
    testAssembler = module(["TruJS.compile.assembler._TestAssembler", []]);
    entry = {};
    files = [{
      "data": "file1"
      , "type": "factory"
    }];
  });

  act(function (done) {
    testAssembler(entry, files)
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
    test("res should be an error")
      .value(res)
      .isError();

  });
}
