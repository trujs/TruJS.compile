/**[@test({ "title": "TruJS.compile.type.view._CreateState: "})]*/
function testCreateState(arrange, act, assert, module) {
    var createState, entry, files, err;

    arrange(function () {
        createState = module(["TruJS.compile.type.view._CreateState", []]);
        entry = {
            "name": "TruJS.example"
            , "module": []
        };
        files = [{
            "dir": "TruJS.example.views"
            , "file": "state.json"
            , "name": "state"
            , "ext": ".json"
            , "data": "{\"name\":\"state\"}"
        }, {
            "dir": "TruJS.example.views.main"
            , "file": "state.json"
            , "name": "state"
            , "ext": ".json"
            , "data": "{\"name\":\"main\"}"
        }, {
            "dir": "TruJS.example.views.main.toolbar"
            , "file": "state.json"
            , "name": "state"
            , "ext": ".json"
            , "data": "{\"name\":\"toolbar\"}"
        }, {
            "dir": "TruJS.example.views.main.header"
            , "file": "state.json"
            , "name": "state"
            , "ext": ".json"
            , "data": "{\"name\":\"header\"}"
        }, {
            "dir": "TruJS.example.views.users"
            , "file": "state.json"
            , "name": "state"
            , "ext": ".json"
            , "data": "{\"name\":\"user\"}"
        }, {
            "dir": "TruJS.example.view.users"
            , "file": "user.json"
            , "name": "user"
            , "ext": ".json"
            , "data": "{}"
        }];
    });

    act(function (done) {
        createState(entry, files)
        .then(function () {
            done();
        })
        .catch(function (error) {
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
        .equals("/**[@naming({\"namespace\":\"TruJS.example\",\"name\":\"$State\"})]*/\n{\"name\":\"state\",\"main\":{\"name\":\"main\",\"toolbar\":{\"name\":\"toolbar\"},\"header\":{\"name\":\"header\"}},\"users\":{\"name\":\"user\"}}");

    });
}