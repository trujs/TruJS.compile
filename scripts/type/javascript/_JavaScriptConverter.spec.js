/**[@test({ "title": "TruJS.compile.type.javascript._JavaScriptConverter: convert html"})]*/
function testJavaScriptConverter(arrange, act, assert, module) {
  var javaScriptConverter, type, data, res, correct;

  arrange(function () {
    javaScriptConverter = module(["TruJS.compile.type.javascript._JavaScriptConverter", []]);
    type = "html";
    data = "<div>\n<span style=\"color:blue;\">\\slash</span>\n</div>";
    correct = "\"<div>\\n<span style=\\\"color:blue;\\\">\\slash</span>\\n</div>\"";
  });

  act(function () {
    res = javaScriptConverter(type, data);
  });

  assert(function (test) {
    test("res should be escaped html")
      .value(res)
      .equals(correct);
  });
}