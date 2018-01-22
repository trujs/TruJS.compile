/**[@test({ "title": "TruJS.compile.type.module._ExtractFileDependencies: found dependencies" })]*/
function testExtractFileDependencies1(arrange, act, assert, module) {
    var extractFileDependencies, entry, files, res, err;

    arrange(function () {
        extractFileDependencies = module(["TruJS.compile.type.module._ExtractFileDependencies", []]);
        entry = {
            "module": {
                "test1": ["test1", []]
            }
        };
        files = [
            {
                "path": "/base/test"
                , "data": [
                    "/**[@dependencies({"
                    , "\"test1\": [\"test1\", []]"
                    , ", \"test2\": [\"test2\", []]"
                    , "})]*/"
                    , ""
                    , ""
                ].join("\n")
            }
        ];
    });

    act(function (done) {
        extractFileDependencies(entry, files)
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

        test("res should be")
        .value(res)
        .stringify()
        .equals("{\"test1\":[\"test1\",[]],\"test2\":[\"test2\",[]]}");

    });
}

/**[@test({ "title": "TruJS.compile.type.module._ExtractFileDependencies: dependency conflict" })]*/
function testExtractFileDependencies2(arrange, act, assert, module) {
    var extractFileDependencies, module, files, res, err;

    arrange(function () {
        extractFileDependencies = module(["TruJS.compile.type.module._ExtractFileDependencies", []]);
        module = {
            "test1": ["test1", []]
        };
        files = [
            {
                "path": "/base/test"
                , "data": [
                    "/**[@dependencies({"
                    , "\"test1\": [\"test1\", [\"test\"]]"
                    , ", \"test2\": [\"test2\", []]"
                    , "})]*/"
                    , ""
                    , ""
                ].join("\n")
            }
        ];
    });

    act(function (done) {
        extractFileDependencies(module, files)
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
        test("err should not be undefined")
        .value(err)
        .not()
        .isUndef();

    });
}