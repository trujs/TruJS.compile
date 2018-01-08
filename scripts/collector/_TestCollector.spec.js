/**[@test({ "title": "TruJS.compile.collector._TestCollector: adds default files" })]*/
function testTestCollector1(arrange, act, assert, callback, module) {
  var testCollector, collector_collection, base, entry;

  arrange(function () {
    collector_collection = callback();
    testCollector = module(["TruJS.compile.collector._TestCollector", [,collector_collection]]);
    base = "/base";
    entry = {};

  });

  act(function () {
    testCollector(base, entry);
  });

  assert(function (test) {
    test("The entry should have a files property")
      .value(entry)
      .hasProperty("files");

    test("The collector_collection should be called once")
      .value(collector_collection)
      .hasBeenCalled(1);

    test("The collector_collection callback first args should be")
      .value(collector_collection)
      .hasBeenCalledWithArg(0, 0, base);

    test("The collector_collection callback 2nd args should be")
      .value(collector_collection)
      .hasBeenCalledWithArg(0, 1, entry);

  });
}

/**[@test({ "title": "TruJS.compile.collector._TestCollector: entry has files" })]*/
function testTestCollector2(arrange, act, assert, callback, module) {
  var testCollector, collector_collection, base, files, entry;

  arrange(function () {
    collector_collection = callback();
    testCollector = module(["TruJS.compile.collector._TestCollector", [,collector_collection]]);
    base = "/base";
    files = [];
    entry = {
      "files": files
    };

  });

  act(function () {
    testCollector(base, entry);
  });

  assert(function (test) {
    test("The entry.files array should be")
      .value(entry, "files")
      .equals(files);

  });
}
