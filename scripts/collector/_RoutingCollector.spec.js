/**[@test({ "title": "TruJS.compile.collector._RoutingCollector: using defaults" })]*/
function testRoutingCollector1(arrange, act, assert, callback, module) {
  var routingCollector, base, entry, res, collector_module;

  arrange(function () {
    collector_module = callback();
    routingCollector = module(["TruJS.compile.collector._RoutingCollector", [, collector_module]]);
    base = "/base";
    entry = {};
  });

  act(function () {
    routingCollector(base, entry);
  });

  assert(function (test) {
    test("The module collector should be called once")
      .value(collector_module)
      .hasBeenCalled(1);

    test("entry.files should have 2 members")
      .value(entry, "files")
      .hasMemberCountOf(2);

    test("entry.files[0] should be")
      .value(entry, "files[0]")
      .equals("+./*.route.js");

    test("entry.moduleFile should be")
      .value(entry, "moduleFile")
      .equals("route.module.json");

  });
}

/**[@test({ "title": "TruJS.compile.collector._RoutingCollector: override defaults" })]*/
function testRoutingCollector2(arrange, act, assert, callback, module) {
  var routingCollector, base, entry, res, collector_module;

  arrange(function () {
    collector_module = callback();
    routingCollector = module(["TruJS.compile.collector._RoutingCollector", [, collector_module]]);
    base = "/base";
    entry = {
      "files": [
        "+./*.express.js"
      ]
      , "moduleFile": "module.json"
    };
  });

  act(function () {
    routingCollector(base, entry);
  });

  assert(function (test) {
    test("The module collector should be called once")
      .value(collector_module)
      .hasBeenCalled(1);

    test("entry.files should have 1 member")
      .value(entry, "files")
      .hasMemberCountOf(1);

    test("entry.files[0] should be")
      .value(entry, "files[0]")
      .equals("+./*.express.js");

    test("entry.moduleFile should be")
      .value(entry, "moduleFile")
      .equals("module.json");

  });
}
