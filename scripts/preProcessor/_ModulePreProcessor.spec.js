/**[@test({ "title": "TruJS.compile.preProcessor._ModulePreProcessor: test for module entry in files array" })]*/
function testModulePreProcessor1(arrange, act, assert, callback, promise, module) {
  var modulePreProcessor, preProcessor_javascript, entry, files, res;

  arrange(function () {
    preProcessor_javascript = callback(function (entry, files) {
      return files;
    });
    modulePreProcessor = module(["TruJS.compile.preProcessor._ModulePreProcessor", [,,,preProcessor_javascript]]);
    entry = {
      "module": {
        "test": "value"
      }
    };
    files = [];
  });

  act(function () {
    res = modulePreProcessor(entry, files);
  });

  assert(function (test) {
    test("The files array should have one member")
      .value(res)
      .hasMemberCountOf(1);

    test("The files[0].data property should contain \"test\":\"value\"")
      .value(res, "[0].data")
      .contains("\"test\":\"value\"");
  });
}
