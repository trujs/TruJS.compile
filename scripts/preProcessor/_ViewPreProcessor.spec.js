/**[@test({ "title": "TruJS.compile.preProcessor._ViewPreProcessor: " })]*/
function testviewPreProcessor(arrange, act, assert, module) {
    var viewPreProcessor, entry, files, err;

    arrange(function () {
        viewPreProcessor = module(["TruJS.compile.preProcessor._ViewPreProcessor", []]);
        entry = {
            "name": "TruJS.example"
            , "module": []
        };
        files = [{
            "dir": "TruJS.example"
            , "file": "main.state.json"
            , "name": "main.state"
            , "ext": ".json"
            , "data": "{\"name\":\"main\"}"
        }, {
            "dir": "TruJS.example.views"
            , "file": "toolbar.state.json"
            , "name": "toolbar.state"
            , "ext": ".json"
            , "data": "{\"name\":\"toolbar\"}"
        }, {
            "dir": "TruJS.example.views"
            , "file": "header.state.json"
            , "name": "header.state"
            , "ext": ".json"
            , "data": "{\"name\":\"header\"}"
        }, {
            "dir": "TruJS.example.views.users"
            , "file": "user.state.json"
            , "name": "user.state"
            , "ext": ".json"
            , "data": "{\"name\":\"user\"}"
        }, {
            "dir": "TruJS.example.view.user"
            , "file": "user.json"
            , "name": "user"
            , "ext": ".json"
            , "data": "{}"
        }];
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

        test("files should have 2 members")
        .value(files)
        .hasMemberCountOf(2);

        test("files[1].data should be")
        .value(files, "[1].data")
        .equals("/**[@naming({\"namespace\":\"TruJS.example\",\"name\":\"$State\"})]*/\n{\"main\":{\"name\":\"main\"},\"views\":{\"toolbar\":{\"name\":\"toolbar\"},\"header\":{\"name\":\"header\"},\"users\":{\"user\":{\"name\":\"user\"}}}}");

    });
}