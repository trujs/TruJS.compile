/**
* This factory produces a worker function that implements the $$server$$ module
* entry with the express, http, and https modules using the configuration object
* passed to the worker function.
* @factory
*/
function _Server(promise, $$server$$, $$routing$$_nodeExpress, $$routing$$_nodeHttp, $$routing$$_nodeHttps, $$routing$$_routingErrors, $$routing$$_routeReporter, $$routing$$_nodeDirName, $$routing$$_nodePath ) {
  var REGEX_PATT = /^:\/(.*)\/([gim]{0,3})$/
  , nodeExpress = $$routing$$_nodeExpress
  , nodeHttp = $$routing$$_nodeHttp
  , nodeHttps = $$routing$$_nodeHttps
  , routingErrors = $$routing$$_routingErrors
  , routeReporter = $$routing$$_routeReporter
  , nodeDirName = $$routing$$_nodeDirName
  , nodePath = $$routing$$_nodePath
  ;

  /**
  * Uses the $$server$$ to create first the apps and then the routes
  * @function
  */
  function processServer(resolve, reject, appList) {
    try {
      //create the express apps
      var apps = createApps()
      //create the express routers
      , routers = createRouters()
      //create the middleware functions
      , middleware = createMiddleware()
      ;

      //add before middleware to each app
      addMiddleware(apps, middleware, false);

      //add the routers to each app
      addRouters(apps, routers);

      //add any statics
      addStatics(apps);

      //add middleware to each app
      addMiddleware(apps, middleware, true);

      resolve(apps);
    }
    catch(ex) {
      reject(ex);
    }
  }
  /**
  * Loops through the apps entries, for the first istance of `label` creates an
  * express app, then for each apps entry,
  * @function
  */
  function createApps() {
    var apps = {};

    //loop through the apps (use the factories object as the base)
    Object.keys($$server$$.apps).forEach(function forEachKey(key) {
      //create the express app
      $$server$$.apps[key].app = nodeExpress();
      routeReporter.extended("Adding app [" + key + "]");
      //add to the application list
      apps[key] = $$server$$.apps[key];
    });

    return apps;
  }
  /**
  * Loops through the routers entries, creates the route object, adds the route
  * to the apps
  * @function
  */
  function createRouters() {
    var routers = {};

    //loop through the routers
    Object.keys($$server$$.routers).forEach(function forEachKey(key) {
      //get the factory and meta data
      var worker = $$server$$.routers[key].factory
      , meta = $$server$$.routers[key].meta
      //get the path, converting string RegEx to RegExp
      , path = getPath(meta.path)
      //create the route object
      , router = nodeExpress.Router()
      , methods = meta.method.split(",")
      ;

      //add the route to the router for each method
      methods.forEach(function forEachMethod(method) {
          router[method](path || "*", worker);
      });

      routers[key] = {
          "worker": router
          , "label": meta.label
      };
    });

    return routers;
  }
  /**
  * Loops through the $$server$$.middleware collection, gets the worker, and
  * determines if the middleware should be added added after the routers
  * @function
  */
  function createMiddleware() {
      var middleware = {};

      //loop through the routers
      Object.keys($$server$$.middleware).forEach(function forEachKey(key) {
        //get the factory and meta data
        var worker = $$server$$.middleware[key].factory
        , meta = $$server$$.middleware[key].meta
        , afterRouters = !!meta.afterRouters
        ;
        middleware[key] = {
            "worker": worker
            , "afterRouters": afterRouters
            , "label": meta.label
        };
      });

      return middleware;
  }
  /**
  * Gets the path from the meta data, converting it to RegExp if needed
  * @function
  */
  function getPath(path) {
    //allow no path
    if (!path) {
      return;
    }

    var paths = isArray(path) ? path : [path]
    , match;

    return paths.map(function mapPaths(path) {
      var match = REGEX_PATT.exec(path);
      //test for regexp
      if (!!match) {
        path = new RegExp(match[1], match[2]);
      }
      return path;
    });
  }
  /**
  * Loops through the apps, using the middleware array adds the corresponding
  * middleware functions to the app
  * @function
  */
  function addMiddleware(apps, middleware, afterRouters) {
      Object.keys(apps).forEach(function forEachApp(key) {
        var app = apps[key];

        //loop through the app middleware
        Object.keys(app.middleware).forEach(function forEachAppRouter(path) {
          var appMiddleware = app.middleware[path];

            //loop through the app middleware
            appMiddleware.forEach(function forEachAppRoute(midKey) {
                var mid = middleware[midKey]
                , methods = !!mid.method && (isArray(mid.method) && mid.method || mid.method.split(",")) || ["use"]
                ;

                //throw an error if the middleware is not found
                if (!mid) {
                    throw new Error(routingErrors.missingMiddleware.replace("{name}", midKey));
                }

                //see if this is a before or after
                if (!!mid.afterRouters === afterRouters) {
                    routeReporter.extended("Adding middleware  ("+ path + ") [" + mid.label + "]");
                    methods.forEach(function (method) {
                        if (path === "-") {
                            app.app[method](mid.worker);
                        }
                        else {
                            app.app[method](path, mid.worker);
                        }
                    });
                }
            });

        });

      });
  }
  /**
  * Loops through the apps, using the routes collection adds the corresponding
  * route to the app
  * @function
  */
  function addRouters(apps, routers) {
    //loop through the apps
    Object.keys(apps).forEach(function forEachApp(key) {
      var app = apps[key];

      //loop through the app routes
      Object.keys(app.routers).forEach(function forEachAppRouter(path) {
        var appRouters = app.routers[path];

        //loop through the route key array
        appRouters.forEach(function forEachRouter(routeKey) {

          //lookup the router
          var router = routers[routeKey];
          if (!router) {
            throw new Error(routingErrors.missingRouter.replace("{router}", routeKey));
          }
          routeReporter.extended("Adding router ("+ path + ")[" + router.label + "]");
          //if the path is the placeholder then add the router without a path
          if (path === "-") {
              app.app.use(router.worker);
          }
          else {
              //parse the path and add the router to the app
              app.app.use(getPath(path), router.worker);
          }
        });

      });

    });
  }
  /**
  * Creates the static middleware and adds them to the application
  * @function
  */
  function addStatics(apps) {
      //loop through each app looking for a static property
      Object.keys(apps).forEach(function forEachApp(key) {
          var app = apps[key];

          if (!!app.statics) {
              //loop through the app statics paths
             Object.keys(app.statics).forEach(function forEachAppRouter(path) {
                 var statics = app.statics[path];
                 //loop through the statics list
                 statics.forEach(function forEachStatic(staticMw) {
                     if (!isObject(staticMw)) {
                         staticMw = {
                             "path": staticMw
                         };
                     }
                     routeReporter.extended("Adding static  ("+ path + ") [" + staticMw.path + "]");
                     if (path === "-") {
                         app.app.use(nodeExpress.static(nodePath.join(nodeDirName, staticMw.path)));
                     }
                     else {
                         app.app.use(path, nodeExpress.static(nodePath.join(nodeDirName, staticMw.path)));
                     }
                 });
            });
          }
      });
  }
  /**
  * Loops through the apps, executing the listen method for each, using the
  * values in the config
  * @function
  */
  function startServers(resolve, reject, appList, config) {
    try {
      //loop through the apps
      Object.keys(appList).forEach(function forEachApp(key) {
        var app = appList[key].app
        , appConfig = getAppConfig(key, config);
        //create the server
        if (appConfig.secure) {
          appList[key].server = nodeHttps.createServer(appConfig.options, app);
        }
        else {
          appList[key].server = nodeHttp.createServer(app);
        }
        //start listening
        appList[key].instance =
        appList[key].server.listen(appConfig.port || appConfig.socket, appConfig.hostname, appConfig.backLog);
      });

      resolve(appList);
    }
    catch(ex) {
      reject(ex);
    }
  }
  /**
  * Attempts to get/create a configuration object for the app. Uses the app's
  * named entry if available, fills in missing properties using the root config
  * object properties.
  * @function
  * @param {string} name The name of the app
  * @param {object} config The config object passed to the worker
  */
  function getAppConfig(name, config) {
    var appConfig = config[name] || {};
    //ensure we have a port, starting with the app config, falling back to the
    //the port property on the config object
    if (!appConfig.port && !appConfig.socket) {
      if (!config.port) {
        throw new Error(routingErrors.missingPort.replace("{app}", name));
      }
      appConfig.port = config.port;
      //increment the port for the next app
      config.port++;
    }
    //use the options property on the config object if there isn't one on the
    //app config object
    if (isNill(appConfig.options)) {
      appConfig.options = config.options || {};
    }
    //if the secure property isn't explicitly set then infer it
    if (isNill(appConfig.secure)) {
      //if we have a cert and key then this should be secure
      if (!!appConfig.options.cert && !!appConfig.options.key) {
        appConfig.secure = true;
      }
      else {
        appConfig.secure = false;
      }
    }

    return appConfig;
  }

  /**
  * @worker
  * @param {object} config The server configuration object
  */
  return function Server(config) {

    //loop throught the $$server$$ object
    var proc = new promise(function (resolve, reject) {
      processServer(resolve, reject);
    });

    //start the apps return the server object with the apps
    return proc.then(function (appList) {
      return new promise(function (resolve, reject) {
        startServers(resolve, reject, appList, config);
      });
    });
  };
}