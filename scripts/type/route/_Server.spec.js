/**[@test({ "label": "routeServerHelper", "type": "factory" })]*/
function routeServerHelper(module, callback) {
  var routeServer, apps, routers, server, serverCnt = 0, servers, nodeExpress, nodeHttp, nodeHttps, routingErrors, routeReporter, nodePath;

  apps = [ //mock responses for nodeExpress
    { "use": callback() }
    , { "use": callback() }
    , { "use": callback() }
  ];
  routers = [ //mock responses for nodeExpress.Router
    { "all": callback(), "get": callback(), "use": callback(), "put": callback() }
    , { "all": callback(), "get": callback(), "use": callback(), "put": callback() }
    , { "all": callback(), "get": callback(), "use": callback(), "put": callback() }
    , { "all": callback(), "get": callback(), "use": callback(), "put": callback() }
  ];
  servers = [ //mock responses for nodeHttp and nodeHttps
    { "listen": callback() }
    , { "listen": callback() }
    , { "listen": callback() }
  ];
  server = {
    "apps": {
      "app": { "label": "app", "routers": { "/": ["router0"] }, "middleware": { "/": ["appMiddleware0"] }, "statics": { "/": ["/public"] } }
      , "auth": { "label": "auth", "routers": { "/": ["appRouter0", "router1"] }, "middleware": { "/": ["middleware0"] } }
      , "app2": { "label": "app2", "routers": { "/app2": ["appRouter1", "router0"], "/": ["router1"] }, "middleware": {} }
    }
    , "routers": {
      "appRouter0": {
        "factory": "appRoute0factory"
        , "meta": {
          "method": "all"
          , "type": "app"
        }
      }
      , "appRouter1": {
        "factory": "appRoute1factory"
        , "meta": {
          "method": "get,put"
          , "type": "app"
        }
      }
      , "router0": {
        "factory": "route0factory"
        , "meta": {
          "path": "/order"
          , "method": "get"
        }
      }
      , "router1": {
        "factory": "route1factory"
        , "meta": {
          "path": "/\\/account/i"
          , "method": "all"
        }
      }
    }
    , "middleware": {
        "appMiddleware0": {
            "factory": "appMiddleware0Factory"
            , "meta": {
                "afterRouters": false
            }
        }
        , "middleware0": {
            "factory": "middleware0Factory"
            , "meta": {
                "afterRouters": true
            }
        }
    }
  };
  nodeExpress = callback(function () {
    return apps[nodeExpress.callbackCount - 1];
  });
  nodeExpress.static = callback();
  nodeExpress.Router = callback(function () {
    return routers[nodeExpress.Router.callbackCount - 1];
  });
  nodeHttp = {
    "createServer": callback(function () {
      return servers[serverCnt++];
    })
  };
  nodeHttps = {
    "createServer": callback(function () {
      return servers[serverCnt++];
    })
  };
  routeReporter = {
      "extended": callback()
  };
  nodePath = {
      "join": callback()
  };
  routingErrors = module([".type_route_routingErrors"]);
  routeServer = module(["TruJS.compile.type.route._Server", [, server, nodeExpress, nodeHttp, nodeHttps, routingErrors, routeReporter, "dirname", nodePath]]);

  return {
    "routeServer": routeServer
    , "nodeExpress": nodeExpress
    , "nodeHttp": nodeHttp
    , "nodeHttps": nodeHttps
    , "server": server
    , "apps": apps
    , "routers": routers
    , "servers": servers
  };
}

/**[@test({ "title": "TruJS.compile.type.route._Server: test app and route creation"})]*/
function testrouteServer1(arrange, act, assert, routeServerHelper) {
  var config, res;

  arrange(function () {
    config = {
      "port": 5000
    };
  });

  act(function (done) {
    routeServerHelper.routeServer(config)
      .then(function (servers){
        res = servers;
        done();
      })
      .catch(function (err) {
        res = err;
        done();
      });
  });

  assert(function (test) {
    test("res should not be an error")
      .value(res)
      .not()
      .isError();

    test("nodeExpress should be called 3 times")
      .value(routeServerHelper, "nodeExpress")
      .hasBeenCalled(3);

    test("nodeExpress.Router should be called 4 times")
      .value(routeServerHelper, "nodeExpress.Router")
      .hasBeenCalled(4);

    test("The 1st router's all callback should be called once")
      .value(routeServerHelper, "routers[0].all")
      .hasBeenCalled(1);

    test("The 1st router's get callback should not be called")
      .value(routeServerHelper, "routers[0].get")
      .not()
      .hasBeenCalled();

    test("The 1st router's all callback should be called with")
      .run(routeServerHelper.routers[0].all.getArgs, [0])
      .stringify()
      .equals("[\"*\",\"appRoute0factory\"]");

    test("The 2nd router's get callback should be called once")
      .value(routeServerHelper, "routers[1].get")
      .hasBeenCalled(1);

    test("The 2nd router's put callback should be called once")
      .value(routeServerHelper, "routers[1].put")
      .hasBeenCalled(1);

    test("The 3rd router's get callback should be called once")
      .value(routeServerHelper, "routers[2].get")
      .hasBeenCalled(1);

    test("The 3rd router's get callback should be called with")
      .run(routeServerHelper.routers[2].get.getArgs, [0])
      .stringify()
      .equals("[[\"/order\"],\"route0factory\"]");

    test("The 4th router's all callback should be called once")
      .value(routeServerHelper, "routers[3].all")
      .hasBeenCalled(1);

    test("The 1st app's use method should be called 3 times")
      .value(routeServerHelper, "apps[0].use")
      .hasBeenCalled(3);

    test("The 2nd app's use method should be 3 times")
      .value(routeServerHelper, "apps[1].use")
      .hasBeenCalled(3);

    test("The 3rd app's use method should be 3 times")
      .value(routeServerHelper, "apps[2].use")
      .hasBeenCalled(3);

    test("The 3rd app's use method should be called 2nd time with")
      .run(routeServerHelper.apps[2].use.getArgs, [1])
      .stringify()
      .equals("[[\"/app2\"],{}]");

    test("The 3rd app's use method should be called 2nd time with arg")
      .value(routeServerHelper, "apps[2].use")
      .hasBeenCalledWithArg(1, 1, routeServerHelper.routers[2]);

    test("The 3rd app's use method should be called 3rd time with")
      .run(routeServerHelper.apps[2].use.getArgs, [2])
      .stringify()
      .equals("[[\"/\"],{}]");

    test("The express.static method should be called once")
      .value(routeServerHelper.nodeExpress.static)
      .hasBeenCalled(1);

  });
}

/**[@test({ "title": "TruJS.compile.type.route._Server: test server configuration"})]*/
function testrouteServer2(arrange, act, assert, routeServerHelper) {
  var config, res;

  arrange(function () {
    config = {
      "auth": {
        "port": 443
        , "secure": true
        , "options": {
          "cert": "cert"
          , "key": "key"
        }
        , "hostname": "hostname"
      }
      , "app2": {
        "secure": false
        , "socket": "/tmp/socket"
        , "backLog": 10
      }
      , "port": 5000
      , "options": {
        "cert": "other cert"
        , "key": "other key"
      }
    };
  });

  act(function (done) {
    routeServerHelper.routeServer(config)
      .then(function (servers){
        res = servers;
        done();
      })
      .catch(function (err) {
        res = err;
        done();
      });
  });

  assert(function (test) {
    test("res should not be an error")
      .value(res)
      .not()
      .isError();

    test("nodeHttp.createServer should be called 1 time")
      .value(routeServerHelper, "nodeHttp.createServer")
      .hasBeenCalled(1);

    test("nodeHttps.createServer should be called 2 times")
      .value(routeServerHelper, "nodeHttps.createServer")
      .hasBeenCalled(2);

    test("the 1st server listen should be called 1 time")
      .value(routeServerHelper, "servers[0].listen")
      .hasBeenCalled(1);

    test("the 1st server listen should be called with")
      .value(routeServerHelper, "servers[0].listen")
      .getCallbackArgs()
      .stringify()
      .equals("[5000,null,null]");

    test("the 2nd server listen should be called with")
      .value(routeServerHelper, "servers[1].listen")
      .getCallbackArgs()
      .stringify()
      .equals("[443,\"hostname\",null]");

    test("the 3rd server listen should be called with")
      .value(routeServerHelper, "servers[2].listen")
      .getCallbackArgs()
      .stringify()
      .equals("[\"/tmp/socket\",null,10]");

    test("res should have 3 properties")
      .value(res)
      .hasPropertyCountOf(3);

    test("res.app should be")
      .value(res, "app")
      .stringify()
      .equals("{\"label\":\"app\",\"routers\":{\"/\":[\"router0\"]},\"middleware\":{\"/\":[\"appMiddleware0\"]},\"statics\":{\"/\":[\"/public\"]},\"app\":{},\"server\":{}}");

    test("res.auth should be")
      .value(res, "auth")
      .stringify()
      .equals("{\"label\":\"auth\",\"routers\":{\"/\":[\"appRouter0\",\"router1\"]},\"middleware\":{\"/\":[\"middleware0\"]},\"app\":{},\"server\":{}}");

    test("res.auth.app should be")
      .value(res, "auth.app")
      .equals(routeServerHelper.apps[1]);

    test("res.app2 should be")
      .value(res, "app2")
      .stringify()
      .equals("{\"label\":\"app2\",\"routers\":{\"/app2\":[\"appRouter1\",\"router0\"],\"/\":[\"router1\"]},\"middleware\":{},\"app\":{},\"server\":{}}");

    test("res.app2.server should be")
      .value(res, "app2.server")
      .equals(routeServerHelper.servers[2]);

  });
}
