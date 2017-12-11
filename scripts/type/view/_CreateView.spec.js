/**[@test({ "title": "TruJS.compile.type.view._CreateView: " })]*/
function testCreateView(arrange, act, assert, callback, promise, module) {
    var createView, type_view_processTemplate, entry, files, res
    , err;

    arrange(function () {
        type_view_processTemplate = callback(function() {
            return promise.resolve([{ "id": "id", "name": "name" }]);
        });
        createView = module(["TruJS.compile.type.view._CreateView", [,,, type_view_processTemplate]]);
        entry = {
            "module": {}
        };
        files = [{
            "file": "view.html"
            , "name": "view"
            , "ext": ".html"
            , "dir": "/code/projects/Proj/scripts/views/ToolBar"
            , "data": "<TruJS-Comp-Table></TruJS-Comp-Table><TruJS-Comp-Grid></TruJS-Comp-Grid>"
        },{
            "file": "view.css"
            , "name": "view"
            , "ext": ".css"
            , "dir": "/code/projects/Proj/scripts/views/ToolBar"
            , "data": ""
        },{
            "file": "view.js"
            , "name": "view"
            , "ext": ".js"
            , "dir": "/code/projects/Proj/scripts/views/ToolBar"
            , "data": ""
        }];
    });

    act(function (done) {
        createView(entry, files)
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

        test("res should have 2 properties")
        .value(res)
        .hasPropertyCountOf(2);

        test("res should have a property of")
        .value(res)
        .hasProperty("$idRef");

        test("res.$idRef should have a property")
        .value(res, "$idRef")
        .hasProperty("Proj.views.ToolBar.id");

        test("res should have a property of")
        .value(res)
        .hasProperty("Proj.views.ToolBar");

    });
}