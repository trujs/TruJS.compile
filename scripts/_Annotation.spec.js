/**[@test({ "title": "TruJS.compile._Annotation: annotate" })]*/
function testAnnotation_Annotate(arrange, act, assert, module) {
  var annotation, text, name, params, line, result;

  arrange(function () {
    annotation = module(["TruJS.compile._Annotation", []]);
    text = "line1\nline2\nline3\n";
    name = "fake";
    params = {
      "test": "value"
    };
    line = 2;
  });

  act(function () {
    result = annotation.annotate(name, params, text, line);
  });

  assert(function (test) {
    test("The result should be")
      .value(result)
      .equals("line1\nline2\n/**[@fake({\"test\":\"value\"})]*/\nline3\n");
  });
}

/**[@test({ "title": "TruJS.compile._Annotation: annotateAll" })]*/
function testAnnotation_AnnotateAll(arrange, act, assert, module) {
  var annotation, text, annotations, result;

  arrange(function () {
    annotation = module(["TruJS.compile._Annotation", []]);
    text = "line1\nline2\nline3\n";
    annotations = {
      "fake1": {
        "test": "value"
      }
      , "fake2": {
        "name": "value"
      }
    };
  });

  act(function () {
    result = annotation.annotateAll(annotations, text);
  });

  assert(function (test) {
    test("The result should be")
      .value(result)
      .equals("/**[@fake2({\"name\":\"value\"})]*/\n/**[@fake1({\"test\":\"value\"})]*/\nline1\nline2\nline3\n");
  });
}

/**[@test({ "title": "TruJS.compile._Annotation: get" })]*/
function testAnnotation_Get(arrange, act, assert, module) {
  var annotation, text, result;

  arrange(function () {
    annotation = module(["TruJS.compile._Annotation", []]);
    text = "/**[@fake1({\"test\":\"value1\"})]*/line1\nline2\n/**[@fake2({\"test\":\"value1\"})]*/\nline3\n/**[@fake2({\"test\":\"value2\"})]*/";
  });

  act(function () {
    result = annotation.get(text);
  });

  assert(function (test) {
    test("The result should have a property fake1")
      .value(result)
      .hasProperty("fake1");

    test("The result should have a property fake2")
      .value(result)
      .hasProperty("fake2");

    test("The fake2 result should have a property test with value1")
      .value(result, "fake2.test")
      .equals("value1");

  });
}

/**[@test({ "title": "TruJS.compile._Annotation: getAll" })]*/
function testAnnotation_GetAll(arrange, act, assert, module) {
  var annotation, text, result;

  arrange(function () {
    annotation = module(["TruJS.compile._Annotation", []]);
    text = "/**[@fake1({\"test\":\"value1\"})]*/line1\nline2\n/**[@fake2({\"test\":\"value1\"})]*/\nline3\n/**[@fake2({\"test\":\"value2\"})]*/";
  });

  act(function () {
    result = annotation.getAll(text);
  });

  assert(function (test) {

    test("The result should have a property fake1")
      .value(result)
      .hasProperty("fake1");

    test("The result should have a property fake2")
      .value(result)
      .hasProperty("fake2");

    test("The fake1 result should have 1 member")
      .value(result, "fake1")
      .hasMemberCountOf(1);

    test("The fake2 result should have 2 members")
      .value(result, "fake2")
      .hasMemberCountOf(2);

    test("The 2nd member of the fake2 result should have a property test with value2")
      .value(result, "fake2[1].test")
      .equals("value2");

  });
}

/**[@test({ "title": "TruJS.compile._Annotation: lookup" })]*/
function testAnnotation_Lookup(arrange, act, assert, module) {
  var annotation, text, result;

  arrange(function () {
    annotation = module(["TruJS.compile._Annotation", []]);
    text = "/**[@fake1({\"test\":\"value1\"})]*/line1\nline2\n/**[@fake2({\"test\":\"value1\"})]*/\nline3\n/**[@fake2({\"test\":\"value2\"})]*/";
  });

  act(function () {
    result = annotation.lookup("fake2", text);
  });

  assert(function (test) {

    test("The result should have a property test with value2")
      .value(result, "test")
      .equals("value1");

  });
}

/**[@test({ "title": "TruJS.compile._Annotation: find" })]*/
function testAnnotation_Find(arrange, act, assert, module) {
  var annotation, text, result;

  arrange(function () {
    annotation = module(["TruJS.compile._Annotation", []]);
    text = "/**[@fake1({\"test\":\"value1\"})]*/line1\nline2\n/**[@fake2({\"test\":\"value1\"})]*/\nline3\n/**[@fake2({\"test\":\"value2\"})]*/";
  });

  act(function () {
    result = annotation.find("fake2", text);
  });

  assert(function (test) {

    test("The result should have 2 members")
      .value(result)
      .hasMemberCountOf(2);

    test("The results second member should have a property test with value2")
      .value(result, "[1].test")
      .equals("value2");

  });
}

/**[@test({ "title": "TruJS.compile._Annotation: remove" })]*/
function testAnnotation_Remove(arrange, act, assert, module) {
  var annotation, text, result, correct;

  arrange(function () {
    annotation = module(["TruJS.compile._Annotation", []]);
    text = "/**[@fake1({\"test\":\"value1\"})]*/line1\nline2\n/**[@fake2({\"test\":\"value1\"})]*/\nline3\n/**[@fake2({\"test\":\"value2\"})]*/";
    correct = "/**[@fake1({\"test\":\"value1\"})]*/line1\nline2\nline3\n";
  });

  act(function () {
    result = annotation.remove("fake2", text);
  });

  assert(function (test) {

    test("The result should be")
      .value(result)
      .equals(correct);

  });
}

/**[@test({ "title": "TruJS.compile._Annotation: clear" })]*/
function testAnnotation_Clear(arrange, act, assert, module) {
  var annotation, text, result, correct;

  arrange(function () {
    annotation = module(["TruJS.compile._Annotation", []]);
    text = "/**[@fake1({\"test\":\"value1\"})]*/line1\nline2\n/**[@fake2({\"test\":\"value1\"})]*/\nline3\n/**[@fake2({\"test\":\"value2\"})]*/";
    correct = "line1\nline2\nline3\n";
  });

  act(function () {
    result = annotation.clear(text);
  });

  assert(function (test) {

    test("The result should be")
      .value(result)
      .equals(correct);

  });
}

/**[@test({ "title": "TruJS.compile._Annotation: extract" })]*/
function testAnnotation_Extract(arrange, act, assert, module) {
  var annotation, data, result, correct;

  arrange(function () {
    annotation = module(["TruJS.compile._Annotation", []]);
    data = [
        "/**[@test({ \"label\":\"test1\", \"format\":\"node\" })]*/"
        , "function test1() { }\n"
        , "/**[@test({ \"label\":\"test2\" })]*/"
        , "function test2() { }\n"
        , "/**[@test({ \"label\":\"test3\", \"format\":\"browser\" })]*/"
        , "function test3() { }"
    ].join("\n");
    correct = "line1\nline2\nline3\n";
  });

  act(function () {
    result = annotation.extract("test", data);
  });

  assert(function (test) {

    test("The result should have 2 members")
      .value(result)
      .hasMemberCountOf(3);

    test("The result2 1st member should be")
      .value(result, "[0]")
      .equals("/**[@test({ \"label\":\"test1\", \"format\":\"node\" })]*/\nfunction test1() { }");

    test("The result2 1st member should be")
      .value(result, "[1]")
      .equals("/**[@test({ \"label\":\"test2\" })]*/\nfunction test2() { }");

    test("The result2 1st member should be")
      .value(result, "[2]")
      .equals("/**[@test({ \"label\":\"test3\", \"format\":\"browser\" })]*/\nfunction test3() { }");

  });
}
