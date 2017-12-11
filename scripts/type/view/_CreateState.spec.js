/**[@test({ "title": "TruJS.compile.type.view._CreateState:" })]*/
function testCreateState(arrange, act, assert, module) {
    var createState, entry, files, views, err;

    arrange(function () {
        createState = module(["TruJS.compile.type.view._CreateState", []]);
        entry = {
            "name": "MyProj"
            , "module": {}
        };
        files = [];
        views = {
            "$idRef": {
                "MyProj.views.Widget.form1": {
                    "type": "TruJS.Comp.Form"
                }
             }
            , "MyProj.views.Widget": {
                "state": "{ \"name\": \"widget\" }"
            }
            , "TruJS.Comp.Layout.Row": {
                "state": "{ \"name\": \"row\" }"
                , "default": "{ \"name\": \"defaultrow\" }"
            }
            , "MyProj.views.Widget.form1": {
                "state": "{ \"name\": \"form1\", \"subtitle\": \"SubForm\"}"
            }
            , "TruJS.Comp.Form": {
                "default": "{ \"name\": \"defaultform\", \"title\": \"Form\" }"
            }
        };
    });

    act(function (done) {
        createState(entry, files, views)
        .then(function () {
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

        test("module should have 1 property")
        .value(entry.module)
        .hasPropertyCountOf(1);

        test("files should have 1 member")
        .value(files)
        .hasMemberCountOf(1);

        test("files 1st member should be")
        .value(files, "[0].data")
        .equals("{\"Widget\":{\"name\":\"widget\",\"form1\":{\"name\":\"form1\",\"subtitle\":\"SubForm\",\"title\":\"Form\"}},\"TruJS\":{\"Comp\":{\"Layout\":{\"Row\":{\"name\":\"row\"}}}}}");

    });
}