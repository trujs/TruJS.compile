/**[@test({ "title": "TruJS.compile.type.view._CreateView: " })]*/
function testCreateView(arrange, act, assert, callback, promise, module) {
    var createView, templateFiles, type_view_processTemplate, entry, files, res
    , err;

    arrange(function () {
        templateFiles = [{
            "file": "view.html"
            , "name": "view"
            , "ext": ".html"
            , "dir": "/code/repos/TruJS/Comp/Table"
            , "data": ""
        }, {
            "file": "view.css"
            , "name": "view"
            , "ext": ".css"
            , "dir": "/code/repos/TruJS/Comp/Table"
            , "data": ""
        }, {
            "file": "view.js"
            , "name": "view"
            , "ext": ".js"
            , "dir": "/code/repos/TruJS/Comp/Table"
            , "data": ""
        }, {
            "file": "view.html"
            , "name": "view"
            , "ext": ".html"
            , "dir": "/code/repos/TruJS/Comp/Grid"
            , "data": ""
        }, {
            "file": "view.js"
            , "name": "view"
            , "ext": ".js"
            , "dir": "/code/repos/TruJS/Comp/Grid"
            , "data": ""
        }];
        type_view_processTemplate = callback(function() {
            if (type_view_processTemplate.callbackCount === 1) {
                return promise.resolve(templateFiles);
            }
            return promise.resolve([]);
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

        test("res should have 8 members")
        .value(res)
        .hasMemberCountOf(8);

        test("entry.module should be")
        .value(entry.module)
        .stringify()
        .equals("{\"templates\":[{\"proj\":[{\"toolbar\":[\"Proj.ToolBarHtml\",[],false]}],\"trujs\":[{\"comp\":[{\"table\":[\"TruJS.Comp.TableHtml\",[],false],\"grid\":[\"TruJS.Comp.GridHtml\",[],false]}]}]}],\"styles\":[{\"proj\":[{\"toolbar\":[\"Proj.ToolBarCss\",[],false]}],\"trujs\":[{\"comp\":[{\"table\":[\"TruJS.Comp.TableCss\",[],false]}]}]}],\"controllers\":[{\"proj\":[{\"toolbar\":[\"Proj.ToolBar\",[[\".templates.proj.toolbar\"],[\".styles.proj.toolbar\"]]]}],\"trujs\":[{\"comp\":[{\"table\":[\"TruJS.Comp.Table\",[[\".templates.trujs.comp.table\"],[\".styles.trujs.comp.table\"]]],\"grid\":[\"TruJS.Comp.Grid\",[[\".templates.trujs.comp.grid\"],[\".styles.trujs.comp.grid\"]]]}]}]}]}");

    });
}