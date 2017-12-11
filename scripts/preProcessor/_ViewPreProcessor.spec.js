/**[@test({ "title": "TruJS.compile.preProcessor._ViewPreProcessor: " })]*/
function testviewPreProcessor(arrange, act, assert, callback, promise, module) {
    var viewPreProcessor, type_view_updateModule, type_view_createView
    , type_view_createState, preProcessor_module, entry, files, err;

    arrange(function () {
        type_view_updateModule = callback(promise.resolve());
        type_view_createView = callback(promise.resolve());
        type_view_createState = callback(promise.resolve());
        preProcessor_module = callback(promise.resolve());

        viewPreProcessor = module(["TruJS.compile.preProcessor._ViewPreProcessor"
        , [
            , type_view_updateModule
            , type_view_createView
            , type_view_createState
            , preProcessor_module
        ]]);
        entry = {};
        files = [];
    });

    act(function (done) {
        viewPreProcessor(entry, files)
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

        test("type_view_updateModule should be called once")
        .value(type_view_updateModule)
        .hasBeenCalled(1);

        test("type_view_createView should be called once")
        .value(type_view_createView)
        .hasBeenCalled(1);

        test("type_view_createState should be called once")
        .value(type_view_createState)
        .hasBeenCalled(1);

        test("preProcessor_module should be called once")
        .value(preProcessor_module)
        .hasBeenCalled(1);

    });
}