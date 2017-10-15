/**[@test( { "title": "TruJS.compile._Utilities.getLineEnding" } )]*/
function testUtilitiesGetLineEnding(arrange, act, assert, module) {
  var getLineEnding, CRLF = "\r\n", LF = "\n", data1, data2, res1, res2;

  arrange(function () {
    getLineEnding = module(["TruJS.compile._Utilities", []]).getLineEnding;
    data1 = "This is a test with a CR and LF\r\n";
    data2 = "This is a test with just a LF\n";
  });

  act(function () {
    res1 = getLineEnding(data1);
    res2 = getLineEnding(data2);
  });

  assert(function (test) {
    test("res1 should be CRLF").value(res1).equals(CRLF);
    test("res2 should be LF").value(res2).equals(LF)
  });
}

/**[@test( { "title": "TruJS.compile._Utilities.getScriptsDir" } )]*/
function testUtilitiesGetScriptsDir(arrange, act, assert, module) {
  var getScriptsDir, base, entry1, entry2, res1, res2;

  arrange(function () {
    getScriptsDir = module(["TruJS.compile._Utilities", []]).getScriptsDir;
    base = "/";
    entry1 = {};
    entry2 = { "scripts": "other" };
  });

  act(function () {
    res1 = getScriptsDir(base, entry1);
    res2 = getScriptsDir(base, entry2);
  });

  assert(function (test) {
    test("res1 should have the default \"scripts\" dir").value(res1).contains("scripts");
    test("res2 should have a \"other\" dir").value(res2).contains("other");
  });
}

/**[@test( { "title": "TruJS.compile._Utilities.getEntryArg" } )]*/
function testUtilitiesGetScriptsDir(arrange, act, assert, module) {
  var getEntryArg, cmdArgs1, cmdArgs2, cmdArgs3, res1, res2, res3;

  arrange(function () {
    getEntryArg = module(["TruJS.compile._Utilities", []]).getEntryArg;
    cmdArgs1 = {
      "entry": "all"
    };
    cmdArgs2 = {
      "entry": "1,2,4"
    };
    cmdArgs3 = {

    };
  });

  act(function () {
    res1 = getEntryArg(cmdArgs1);
    res2 = getEntryArg(cmdArgs2);
    res3 = getEntryArg(cmdArgs3);
  });

  assert(function (test) {
    test("res1 should be \"all\"")
      .value(res1)
      .equals("all");

    test("res2 should be an array with 3 members")
      .value(res2)
      .hasMemberCountOf(3);

    test("the 2nd member of res2 should be")
      .value(res2, "[1]")
      .equals("2");

    test("res1 should be \"all\"")
      .value(res3)
      .equals("all");

  });
}
