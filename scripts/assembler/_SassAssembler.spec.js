/**[@test({ "title": "TruJS.compile.assembler._SassAssembler: "})]*/
function testSassAssembler1(arrange, act, assert, module) {
  var sassAssembler, entry, files, res;

  arrange(function () {
    sassAssembler = module(["TruJS.compile.assembler._SassAssembler", []]);
    entry = {

    };
    files = [{
      "data": "entry1"
    }, {
      "data": "entry2"
    }];

  });

  act(function (done) {
    sassAssembler(entry, files)
      .then(function (results){
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

    test("res data should be")
      .value(res, "[0].data")
      .equals("entry1\nentry2");

  });
}
