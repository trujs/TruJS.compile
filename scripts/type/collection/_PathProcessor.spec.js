/**[@test({ "title": "TruJS.compile.type.collection._PathProcessor: full path, wild card, partial name, recurse, and minus" })]*/
function testPathProcessor(arrange, act, assert, module) {
  var pathProcessor, base, paths, results;

  arrange(function () {
    pathProcessor = module(["TruJS.compile.type.collection._PathProcessor", []]);
    base = "/base";
    paths = [
      "./path/file.js",
      "./path/*",
      "./path/*.spec.js",
      "+./path/path2",
      "-./path/*.html",
      "./path/*/-*.js"
    ];
    results = [];
  });

  act(function () {
    paths.forEach(function (path, indx) {
      results[indx] = pathProcessor(base, path);
    });
  });

  assert(function (test) {
    test("The first results should not be a directory")
      .value(results[0], "directory")
      .not()
      .isTrue();
    test("The first results should not be a minus")
      .value(results[0], "minus")
      .not()
      .isTrue();

    test("The 2nd results should be a directory")
      .value(results[1], "directory")
      .isTrue();
    test("The 2nd results should not have a filter")
      .value(results[1], "options.filter")
      .isNill();
    test("The 2nd results should not be recursive")
      .value(results[1], "options.recurse")
      .not()
      .isTrue();

    test("The 3rd results should be a directory")
      .value(results[2], "directory")
      .isTrue();
    test("The 3rd results should have a wildcard")
      .value(results[2], "wildcard")
      .equals("*.spec.js");
    test("The 3rd results should not be recursive")
      .value(results[2], "options.recurse")
      .not()
      .isTrue();

    test("The 4th results should be a directory")
      .value(results[3], "directory")
      .isTrue();
    test("The 4th results should be recursive")
      .value(results[3], "options.recurse")
      .isTrue();
    test("The 4th results should not have a filter")
      .value(results[3], "options.filter")
      .isNill();

    test("The 5th results should be a minus")
      .value(results[4], "minus")
      .isTrue();
    test("The 5th results should have a wildcard")
      .value(results[4], "wildcard")
      .equals("*.html");

    test("The 6th results should be a directory")
      .value(results[5], "directory")
      .isTrue();
    test("The 6th results should be recursive")
      .value(results[5], "options.recurse")
      .isTrue();
    test("The 6th results should have a fragment")
      .value(results[5], "fragment")
      .not()
      .isNill();
    test("The 6th results should not be a minus")
      .value(results[5], "minus")
      .not()
      .isTrue();
    test("The 6th results should have a wildcard")
      .value(results[5], "wildcard")
      .not()
      .isNill();
    test("The 6th results path should be")
      .value(results[4], "path")
      .matches(/[/\\]base[/\\]path/);

  });
}