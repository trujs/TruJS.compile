/**[@test({ "title": "TruJS.compile.type.view._ProcessTemplate: " })]*/
function testProcessTemplate(arrange, act, assert, promise, callback, module) {
    var processTemplate, collector_collection, entry, html, err, res, files;

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
            , "module": {
                "views":[{
                    "trujs":[{
                        "comp": [{
                            "grid": ["TruJS.Comp.Grid", []]
                        }]
                    }]
                }]
            }
        };
        html = [
            "<TruJS-Comp-Table></TruJS-Comp-Table>"
            , "<Comp-Form-TextBox class=\"invalid\"><Comp-Form-TextBox/>"
            , "<div style=\"color:blue;\">"
            , "<TruJS-Table></TruJS-Table>"
            , "<TruJS-Comp-Grid></TruJS-Comp-Grid>"
            , "</div>"
        ].join("\n");
    });

    act(function (done) {
        processTemplate(entry, html)
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
        .equals(files);

        test("collector_collection should be called once")
        .value(collector_collection)
        .hasBeenCalled(1);

        test("collector_collection should be called with")
        .value(collector_collection)
        .getCallbackArg(0, 1)
        .stringify()
        .equals("{\"files\":[\"{repos}/TruJS.Comp/scripts/Table/*.view.html\",\"{repos}/TruJS.Comp/scripts/Table/view.html\",\"{repos}/TruJS.Comp/scripts/Table/*.view.css\",\"{repos}/TruJS.Comp/scripts/Table/view.css\",\"{repos}/TruJS.Comp/scripts/Table/*.view.js\",\"{repos}/TruJS.Comp/scripts/Table/view.js\",\"{repos}/Comp/Form/TextBox/*.view.html\",\"{repos}/Comp/Form/TextBox/view.html\",\"{repos}/Comp/Form/TextBox/*.view.css\",\"{repos}/Comp/Form/TextBox/view.css\",\"{repos}/Comp/Form/TextBox/*.view.js\",\"{repos}/Comp/Form/TextBox/view.js\"]}");

    });
}