/**[@test({ "title": "TruJS.compile.type.view._ProcessTemplate: " })]*/
function testProcessTemplate(arrange, act, assert, promise, callback, module) {
    var processTemplate, collector_collection, entry, view, err, res, files;

    arrange(function () {
        files = [{}];
        collector_collection = callback(promise.resolve(files));

        processTemplate = module([
            "TruJS.compile.type.view._ProcessTemplate"
            , [, , collector_collection]
        ]);
        entry = {
            "hints": {
                "TruJS.Comp": "{repos}/TruJS.Comp/scripts"
                , "Comp": "{repos}/Comp"
            }
        };
        view = {
            "template": {
                "data": [
                    "<TruJS-Comp-Table></TruJS-Comp-Table>"
                    , "<Comp-Form-TextBox class=\"invalid\" id=\"textBox1\"><Comp-Form-TextBox/>"
                    , "<div style=\"color:blue;\">"
                    , "<TruJS-Table id=\"table1\"></TruJS-Table>"
                    , "<TruJS-Comp-Grid></TruJS-Comp-Grid>"
                    , "</div>"
                ].join("\n")
            }
        };
    });

    act(function (done) {
        processTemplate(entry, view)
        .then(function (results) {
            res = results;
            done();
        })
        .catch(function (error) {
            err = error;
            done();
        });
    });

    assert(function (test) {
        test("err should be undefined")
        .value(err)
        .isUndef();

        test("res should be")
        .value(res)
        .stringify()
        .equals("[{\"name\":\"TruJS.Comp.Table\",\"id\":\"TruJS.Comp.Table\",\"namespace\":\"TruJS.Comp\",\"basePath\":\"{repos}/TruJS.Comp/scripts\",\"files\":[{}]},{\"name\":\"Comp.Form.TextBox\",\"id\":\"textBox1\",\"namespace\":\"Comp\",\"basePath\":\"{repos}/Comp\",\"files\":[{}]},{\"name\":\"TruJS.Comp.Grid\",\"id\":\"TruJS.Comp.Grid\",\"namespace\":\"TruJS.Comp\",\"basePath\":\"{repos}/TruJS.Comp/scripts\",\"files\":[{}]}]");

        test("collector_collection should be called 3 times")
        .value(collector_collection)
        .hasBeenCalled(3);

        test("The 1st collector_collection call 2nd arg should be")
        .value(collector_collection)
        .getCallbackArg(0, 1)
        .stringify()
        .equals("{\"files\":[\"+{repos}/TruJS.Comp/scripts/*Table/*.view.html\",\"+{repos}/TruJS.Comp/scripts/*Table/view.html\",\"+{repos}/TruJS.Comp/scripts/*Table/*.view.css\",\"+{repos}/TruJS.Comp/scripts/*Table/view.css\",\"+{repos}/TruJS.Comp/scripts/*Table/*.view.js\",\"+{repos}/TruJS.Comp/scripts/*Table/view.js\",\"+{repos}/TruJS.Comp/scripts/*Table/*.state.json\",\"+{repos}/TruJS.Comp/scripts/*Table/state.json\"]}");

    });
}