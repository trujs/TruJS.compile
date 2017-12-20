/**[@test({ "title": "TruJS.compile.type.view._UpdateModule: " })]*/
function testUpdateModule(arrange, act, assert, module) {
    var updateModule, entry, views, err;

    arrange(function () {
        updateModule = module(["TruJS.compile.type.view._UpdateModule", []]);
        entry = {
            "name": "MyProj"
            , "module": {}
        };
        views = {
            "MyProj.views": {
                "template": true
                , "style": true
            }
            , "MyProj.views.Widget": {
                "template": true
                , "controller": true
            }
            , "TruJS.Comp.Layout.Row": {
                "style": true
                , "controller": true
            }
            , "TruJS.Comp.Format": {
                "template": true
                , "style": true
                , "controller": true
            }
        };
    });

    act(function (done) {
        updateModule(entry, views)
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

        test("module should have 3 properties")
        .value(entry.module)
        .hasPropertyCountOf(3);

        test("module should be")
        .value(entry.module)
        .stringify()
        .equals("{\"templates\":[{\"view\":[\"MyProj.views.viewHtml\",[],false],\"widget\":[{\"view\":[\"MyProj.views.Widget.viewHtml\",[],false]}]}],\"styles\":[{\"view\":[\"MyProj.views.viewCss\",[],false],\"trujs\":[{\"comp\":[{\"layout\":[{\"row\":[{\"view\":[\"TruJS.Comp.Layout.Row.viewCss\",[],false]}]}]}]}]}],\"controllers\":[{\"view\":[\".simpleDefaultController\",[[\".templates.view\"],[\".styles.view\"]]],\"widget\":[{\"view\":[\"MyProj.views.Widget.view\",[[\".templates.widget.view\"],\"\\b\"]]}],\"trujs\":[{\"comp\":[{\"layout\":[{\"row\":[{\"view\":[\"TruJS.Comp.Layout.Row.view\",[\"\\b\",[\".styles.trujs.comp.layout.row.view\"]]]}]}]}]}]}]}");

    });
}