/**[@test({ "title": "TruJS.compile.preProcessor._ViewPreProcessor: " })]*/
function testviewPreProcessor(arrange, act, assert, callback, promise, module) {
    var viewPreProcessor, type_view_createState, type_view_createView
    , entry, files, err;

    arrange(function () {
        type_view_createState = callback(promise.resolve(files));
        type_view_createView = callback(promise.resolve(files));
        viewPreProcessor = module(["TruJS.compile.preProcessor._ViewPreProcessor", [, type_view_createState, type_view_createView]]);
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

        test("type_view_createState should be called once")
        .value(type_view_createState)
        .hasBeenCalled(1);

        test("type_view_createState should be called with")
        .value(type_view_createState)
        .hasBeenCalledWith(0, [entry, files]);

    });
}