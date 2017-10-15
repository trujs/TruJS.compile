/**[@test({ "title": "TruJS.compile.collector._SassCollector: use defaults" })]*/
function testSassCollector1(arrange, act, assert, callback, module) {
  var sassCollector, collector_collection, base, entry;

  arrange(function () {
    collector_collection = callback();
    sassCollector = module(["TruJS.compile.collector._SassCollector", [, collector_collection]]);
    base = "/base";
    entry = {};
  });

  act(function () {
    sassCollector(base, entry);
  });

  assert(function (test) {
    test("The collector_collection should be called once")
      .value(collector_collection)
      .hasBeenCalled(1);

    test("The entry.files property should have 1 member")
      .value(entry, "files")
      .hasMemberCountOf(1);

  });
}

/**[@test({ "title": "TruJS.compile.collector._SassCollector: files array in entry" })]*/
function testSassCollector1(arrange, act, assert, callback, module) {
  var sassCollector, collector_collection, base, entry;

  arrange(function () {
    collector_collection = callback();
    sassCollector = module(["TruJS.compile.collector._SassCollector", [, collector_collection]]);
    base = "/base";
    entry = {
      "files": [
        "+./*.scss"
        , "-./noinclude/*.scss"
      ]
    };
  });

  act(function () {
    sassCollector(base, entry);
  });

  assert(function (test) {
    test("The collector_collection should be called once")
      .value(collector_collection)
      .hasBeenCalled(1);

    test("The entry.files property should have 2 members")
      .value(entry, "files")
      .hasMemberCountOf(2);

  });
}
