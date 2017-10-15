/**[@test({ "title": "TruJS.compile.type.module._ModuleMerger: single module" })]*/
function testModuleMerger1(arrange, act, assert, module) {
  var moduleMerger, modules, resModule;

  arrange(function () {
    moduleMerger = module(["TruJS.compile.type.module._ModuleMerger", []]);
    modules = [{

    }];
  });

  act(function () {
    resModule = moduleMerger(modules);
  });

  assert(function (test) {
    test("resModule should be the 1st modules member")
      .value(resModule)
      .equals(modules[0]);
  });
}

/**[@test({ "title": "TruJS.compile.type.module._ModuleMerger: multiple complex modules" })]*/
function testModuleMerger1(arrange, act, assert, module) {
  var moduleMerger, modules, resModule;

  arrange(function () {
    moduleMerger = module(["TruJS.compile.type.module._ModuleMerger", []]);
    modules = [{
      "root": [{ "Mod1": ":Mod1" }]
      , "stuff": [{
        "stuff1": ["Mod1.stuff.Stuff1", []]
        , "stuff2": ["Mod1.stuff.Stuff2", []]
      }]
      , "entry1": ["Mod1.Entry1", []]
      , "entry2": ["Mod1.Entry2", []]
    }, {
      "root": [{ "Mod2": ":Mod2" }]
      , "stuff": [{
        "stuff2": ["Mod2.stuff.Stuff2", []]
        , "stuff3": ["Mod2.stuff.Stuff3", []]
      }]
      , "entry1": ["Mod2.Entry1", []]
      , "entry3": ["Mod2.Entry3", []]
    }, {
      "stuff": [{
        "stuff3": ["Mod3.stuff.Stuff3", []]
      }]
      , "entry3": ["Mod3.Entry3", []]
    }];
  });

  act(function () {
    resModule = moduleMerger(modules);
  });

  assert(function (test) {
    test("resModule should have 5 properties")
      .value(resModule)
      .hasPropertyCountOf(5);

    test("the root should have 2 properties")
      .value(resModule, "root[0]")
      .hasPropertyCountOf(2);

    test("the root should have a Mod1 property")
      .value(resModule, "root[0]")
      .hasProperty("Mod1");

    test("the root should have a Mod2 property")
      .value(resModule, "root[0]")
      .hasProperty("Mod2");

    test("entry1 should be from Mod2")
      .value(resModule, "entry1[0]")
      .equals("Mod2.Entry1");

    test("entry2 should be from Mod1")
      .value(resModule, "entry2[0]")
      .equals("Mod1.Entry2");

    test("entry3 should be from Mod3")
      .value(resModule, "entry3[0]")
      .equals("Mod3.Entry3");

    test("stuff.stuff1 should be from Mod1")
      .value(resModule, "stuff[0].stuff1[0]")
      .equals("Mod1.stuff.Stuff1");

    test("stuff.stuff2 should be from Mod2")
      .value(resModule, "stuff[0].stuff2[0]")
      .equals("Mod2.stuff.Stuff2");

    test("stuff.stuff3 should be from Mod3")
      .value(resModule, "stuff[0].stuff3[0]")
      .equals("Mod3.stuff.Stuff3");
  });
}

/**[@test({ "title": "TruJS.compile.type.module._ModuleMerger: conflicting module entry types" })]*/
function testModuleMerger1(arrange, act, assert, module) {
  var moduleMerger, modules, resModule;

  arrange(function () {
    moduleMerger = module(["TruJS.compile.type.module._ModuleMerger", []]);
    modules = [{
      "badentry": [{}]
    }, {
      "badentry": ["", []]
    }];
  });

  act(function () {
    try {
      resModule = moduleMerger(modules);
    }
    catch(ex) {
      resModule = ex;
    }
  });

  assert(function (test) {
    test("resModule should be an error")
      .value(resModule)
      .isError();
  });
}