/**[@test({ "title": "TruJS.compile.preProcessor._RoutingPreprocessor: app and route entries"})]*/
function testRoutingPreProcessor1(arrange, act, assert, callback, promise, module) {
  var routingPreProcessor, preProcessor_module, type_route_server, entry, files, res;

  arrange(function () {
    preProcessor_module = callback(promise.resolve());
    type_route_server = function server() { };
    routingPreProcessor = module(["TruJS.compile.preProcessor._RoutingPreprocessor", [, preProcessor_module, type_route_server]]);
    entry = {
      "root": "Ns"
      , "module": {}
    };
    files = [{ //route with generated label route0
      "data": "/**[@route({ \"type\": \"router\" })]*/"
      , "ext": ".js"
      , "name": "file1"
      , "dir": "My"
    }, { //route with label myroute, setting the name of the factory
      "data": "/**[@route({ \"name\": \"My.Name\", \"label\": \"myroute\" })]*/"
      , "ext": ".js"
      , "name": "file2"
      , "dir": "My"
    }, { //app with default label "app", generated router appRouter1
      "data": "/**[@route({ \"type\": \"app\", \"index\": 1, \"routers\": \"route0,myroute\", \"path\": \"/\" })]*/"
      , "ext": ".js"
      , "name": "file3"
      , "dir": "My"
    }, { // app with label auth, generated middleware appMiddleware0, routers with path "-"
      "data": "/**[@route({ \"type\": \"app\", \"label\": \"auth\", \"routers\": [\"myroute\"], \"middleware\":[\"middleware0\"] })]*/"
      , "ext": ".js"
      , "name": "file3"
      , "dir": "My"
    }, { // app with label "app", generated router appRouter0, 2 routes with path "/order"
      "data": "/**[@route({ \"type\": \"app\", \"index\": 0, \"label\": \"app\", \"routers\": \"myroute\", \"path\": \"/order\" })]*/"
      , "ext": ".js"
      , "name": "file3"
      , "dir": "My"
    }, { // middleware with generated label middleware0
      "data": "/**[@route({ \"type\": \"middleware\" })]*/"
      , "ext": ".js"
      , "name": "file4"
      , "dir": "My"
    }, {
      "data": ""
      , "ext": ".js"
      , "name": "file5"
      , "dir": "My"
    }];
  });

  act(function (done) {
    routingPreProcessor(entry, files)
      .then(function (results) {
        res = results;
        done();
      })
      .catch(function (err) {
        res =err;
        done();
      });
  });

  assert(function (test) {
    test("res should not be an error")
      .value(res)
      .not()
      .isError();

    test("entry.module should have 3 properties")
      .value(entry, "module")
      .hasPropertyCountOf(3);

    test("entry.module should have a property $$serve$$")
      .value(entry, "module")
      .hasProperty("$$serve$$");

    test("$$routing$$ should have 7 properties")
      .value(entry, "module.$$routing$$[0]")
      .hasPropertyCountOf(7);

    test("$$server$$ should have 3 properties")
      .value(entry, "module.$$server$$[0]")
      .hasPropertyCountOf(3);

    test("$$server$$.apps should have 2 properties")
      .value(entry, "module.$$server$$[0].apps[0]")
      .hasPropertyCountOf(2);

    test("The \"app\" application shoud be")
      .value(entry, "module.$$server$$[0].apps[0].app")
      .stringify()
      .equals("{\"label\":\"app\",\"routers\":{\"/\":[\"route0\",\"myroute\"],\"/order\":[\"myroute\"]},\"middleware\":{\"/\":[\"appEntryPoint0\"],\"/order\":[\"appEntryPoint2\"]},\"statics\":{\"/\":[],\"/order\":[]}}");

    test("The \"auth\" application should be")
      .value(entry, "module.$$server$$[0].apps[0].auth")
      .stringify()
      .equals("{\"label\":\"auth\",\"routers\":{\"-\":[\"myroute\"]},\"middleware\":{\"-\":[\"authEntryPoint1\",\"middleware0\"]},\"statics\":{\"-\":[]}}");


    test("$$server$$ routers should have 2 properties")
      .value(entry, "module.$$server$$[0].routers[0]")
      .hasPropertyCountOf(2);

    test("The router, myroute should be")
      .value(entry, "module.$$server$$[0].routers[0].myroute")
      .stringify()
      .equals("[{\"factory\":[\"My.Name\",[]],\"meta\":{\"label\":\"myroute\",\"type\":\"router\",\"method\":\"all\",\"path\":\"*\"}}]");

    test("The router, route0 should be")
      .value(entry, "module.$$server$$[0].routers[0].router0")
      .stringify()
      .equals("[{\"factory\":[\"My.file1\",[]],\"meta\":{\"type\":\"router\",\"method\":\"all\",\"path\":\"*\",\"label\":\"router0\"}}]");

    test("$$server$$ middleware should have 4 properties")
      .value(entry, "module.$$server$$[0].middleware[0]")
      .hasPropertyCountOf(4);


    test("The middleware appEntryPoint0 should be")
      .value(entry, "module.$$server$$[0].middleware[0].appEntryPoint0")
      .stringify()
      .equals("[{\"factory\":[\"My.file3\",[]],\"meta\":{\"type\":\"middleware\",\"method\":\"use\",\"label\":\"appEntryPoint0\"}}]");

    test("The middleware authEntryPoint1 should be")
      .value(entry, "module.$$server$$[0].middleware[0].authEntryPoint1")
      .stringify()
      .equals("[{\"factory\":[\"My.file3\",[]],\"meta\":{\"type\":\"middleware\",\"label\":\"authEntryPoint1\",\"method\":\"use\"}}]");

    test("The middleware, middleware0 should be")
      .value(entry, "module.$$server$$[0].middleware[0].middleware0")
      .stringify()
      .equals("[{\"factory\":[\"My.file4\",[]],\"meta\":{\"type\":\"middleware\",\"label\":\"middleware0\"}}]");

  });
}
