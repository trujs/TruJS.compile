/**
* This factory produces a worker function that extracts the routing annotations
* from each file, creates module enties for each route and app, adds the run
* factory file which implements the apps and routes, and then executes the
* module preProcessor.
* @factory
*/
function _RoutingPreProcessor(promise, preProcessor_module, type_route_server, annotation, namer, fileObj, type_route_routingErrors) {
  var cnsts = {
    "annotaionName": "route"
    , "defaults": {
      "index": 999
      , "type": "router"
      , "appName": "app"
      , "method": "all"
      , "path": "*"
      , "appPath": "-"
      , "appMethod": "use"
    }
    , "dependencies": {
      "nodeExpress": [":require('express')"]
      , "nodeHttp": [":require('http')"]
      , "nodeHttps": [":require('https')"]
      , "routeReporter": ["TruJS.log._Reporter", []]
      , "routingErrors": type_route_routingErrors
      , "nodePath": [":require('path')"]
      , "nodeDirName": [":__dirname"]
    }
    , "entries": {
        "serve": "$serve$"
        , "server": "$server$"
        , "routing": "$routing$"
    }
  };

  /**
  * Extracts the annotaions from each file and returns an array of route
  * objects
  * @function
  */
  function getRoutes(resolve, reject, entry, files) {
    try {
      var routes = [];

      files.forEach(function forEachFile(fileObj) {
        var route = getRoute(entry, fileObj);
        if (!!route) {
          routes.push(route);
        }
      });

      resolve(routes);
    }
    catch(ex) {
      reject(ex);
    }
  }
  /**
  * Builds a route object for the fileObj
  * @function
  */
  function getRoute(entry, fileObj) {
    //remove the ending .route from the name
    fileObj.name = fileObj.name.replace(".route", "");
    fileObj.file = fileObj.name + fileObj.ext;

    var route = annotation.lookup(cnsts.annotaionName, fileObj.data)
    , naming = namer(entry.root, fileObj, entry.scripts);

    //only process if this has a route annotaion
    if (!!route) {
      //throw an error if we don't have a namespace + name
      if (!route.name && (!naming.namespace || !naming.name)) {
        throw new Error(errors.invalidNaming.replace("{path}", fileObj.path));
      }
      //set the factory name on the route object
      route.name = route.name || naming.name;
      //set the default type
      route.type = route.type || cnsts.defaults.type;

      //type specific defaults
      if (route.type === "router") {
          route.method = route.method || cnsts.defaults.method;
          route.path = route.path || cnsts.defaults.path;
      }
      if (route.type === "app") {
        route.method = route.method || cnsts.defaults.appMethod;
        route.label = route.label || cnsts.defaults.appName;
        route.index = route.index || cnsts.defaults.index;
        if (!!route.routers) {
            route.path = route.path || cnsts.defaults.appPath;
        }
      }
    }

    return route;
  }
  /**
  * sorts the routes and apps using the index property
  * @function
  */
  function sortRoutes(resolve, reject, routes) {
    try {
      //seperate the routes and apps
      var apps = routes.filter(function filterApps(route) { return route.type === "app"; })
      , rts = routes.filter(function filterApps(route) { return route.type !== "app"; })
      ;
      //sort the apps
      apps.sort(sorter);
      //recombine the apps and routes
      resolve(apps.concat(rts));
    }
    catch(ex) {
      reject(ex);
    }
  }
  /**
  * A sorter that uses the index property to sort the array
  * @function
  */
  function sorter(a, b) {
    if (a.index < b.index) {
      return -1;
    }
    if (a.index > b.index) {
      return 1;
    }
    return 0;
  }
  /**
  * Adds the app and route entries to the module object
  * @function
  */
  function updateModule(resolve, reject, entry, routes) {
    try {
      //add the server entry to the module
      entry.module[cnsts.entries.server] = entry.module[cnsts.entries.server] || [{}];

      //get the server object for easy adding
      var server = entry.module[cnsts.entries.server][0]
      , apps = server["apps"] = (server["apps"] || [{}])
      , rtes = server["routers"] = (server["routers"] || [{}])
      , mdlwr = server["middleware"] = (server["middleware"] || [{}])
      , appIndx = 0
      , routeIndx = 0
      , mdlIndx = 0;
      ;

      //loop through the routes and update the server object
      routes.forEach(function forEachRoute(route) {
        var entry, app;

        //special processing for routes of type app
        if (route.type === "app") {
          app = processAppEntry(apps, route, appIndx++);
        }
        else if (route.type === "router") {
            //ensure we have a label
            if (!route.label) {
              route.label = "router" + routeIndx++;
            }
        }
        else if (route.type === "middleware") {
            //ensure we have a label
            if (!route.label) {
              route.label = "middleware" + mdlIndx++;
            }
        }

        //create the module entry
        entry = [{
          "factory": [route.name, []]
          , "meta": route
        }];

        if (route.type === "router") {
            rtes[0][route.label] = entry
        }
        else if (route.type === "middleware") {
            mdlwr[0][route.label] = entry;
        }

        //clean up the route object
        delete route.$index;
        delete route.$line;
        delete route.index;
        delete route.routers;
        delete route.middleware;
        delete route.name;

      });

      resolve();
    }
    catch(ex) {
      reject(ex);
    }
  }
  /**
  * Creates an app on the apps collection if not already, adds routes and
  * middleware entries to the app, updates the route to either router or
  * middleware
  * @function
  */
  function processAppEntry(apps, route, appMiddlewareIndx) {
      //see if we need to add the app to the apps entry
      if(!apps[0].hasOwnProperty(route.label)) {
        apps[0][route.label] = { "label": route.label, "routers": {}, "middleware": {}, "statics": {} };
      }

      //a reference to the app object
      var curApp = apps[0][route.label]
      //get the path or no-path character
      , path = route.path || "-"
      //a reference to the collection of routes
      , routerList = curApp.routers[path]
      //a reference to the collection of middleware
      , middlewareList = curApp.middleware[path]
      //a reference to the collection of static paths
      , staticList = curApp.statics[path]
      ;

      //add the path entry to the routers object if missing
      if(!routerList) {
        routerList = curApp.routers[path] = [];
      }

      //add the path entry to the middleware object if missing
      if(!middlewareList) {
        middlewareList = curApp.middleware[path] = [];
      }

      //add the path entry to the statis object if missing
      if(!staticList) {
        staticList = curApp.statics[path] = [];
      }

      //add any routes to the route collection for this path
      if(!!route.routers) {
        //ensure the routes property is an array
        !isArray(route.routers) && (route.routers = route.routers.split(","));
        //loop through each route, only add a route if it hasn't been yet
        route.routers.forEach(function forEachRoute(route) {
          if (routerList.indexOf(route) === -1) {
            routerList.push(route);
          }
        });
      }

      //add any routes to the route collection for this path
      if(!!route.middleware) {
        //ensure the routes property is an array
        !isArray(route.middleware) && (route.middleware = route.middleware.split(","));
        //loop through each route, only add a middleware if it hasn't been yet
        route.middleware.forEach(function forEachRoute(middleware) {
          if (middlewareList.indexOf(middleware) === -1) {
            middlewareList.push(middleware);
          }
        });
      }

      //add any routes to the route collection for this path
      if(!!route.static) {
        //ensure the routes property is an array
        !isArray(route.static) && (route.static = route.static.split(","));
        //loop through each route, only add a middleware if it hasn't been yet
        route.static.forEach(function forEachRoute(staticPath) {
          if (staticList.indexOf(staticPath) === -1) {
            staticList.push(staticPath);
          }
        });
      }

      //change the type to middleware so we can add this in the middleware step
      route.type = "middleware";
      //no need for the path as it will be included when we add the middleware
      delete route.path;
      //modify the label for the middleware array
      route.label = route.label + "EntryPoint" + appMiddlewareIndx;
      //add this entry point to the middleware list
      middlewareList.splice(0, 0, route.label);

      return curApp;
  }
  /**
  * Add the required dependencies for the routing
  * @function
  */
  function addDependencies(resolve, reject, entry) {
    try {
      //add the routing entry
      entry.module[cnsts.entries.routing] = entry.module[cnsts.entries.routing] || [{}];
      applyIf(cnsts.dependencies, entry.module[cnsts.entries.routing][0]);
      resolve();
    }
    catch(ex) {
      reject(ex);
    }
  }
  /**
  * Adds the server fileObj to the files array
  * @function
  */
  function addServerFile(resolve, reject, entry, files) {
    try {
      //create the file
      var data = type_route_server.toString()
      , name = (entry.name || "TruJS") + ".routing._Server"
      , path = name.replace(/[.]/g, "/") + ".js"
      , serverFileObj = fileObj(path, data)
      ;

      files.push(serverFileObj);

      //add the module entry
      entry.module[cnsts.entries.serve] = [name, []];
      
      resolve();
    }
    catch(ex) {
      reject(ex);
    }
  }

  /**
  * @worker
  */
  return function RoutingPreProcessor(entry, files) {

    //extract the routes from the files
    var proc = new promise(function (resolve, reject) {
      getRoutes(resolve, reject, entry, files);
    });

    //sort the route entries using the index property
    proc = proc.then(function (routes) {
      return new promise(function (resolve, reject) {
        sortRoutes(resolve, reject, routes);
      });
    });

    //create the route entries in the module object
    proc = proc.then(function (routes) {
      return new promise(function (resolve, reject) {
        updateModule(resolve, reject, entry, routes);
      });
    });

    //add the required dependencies
    proc = proc.then(function () {
      return new promise(function (resolve, reject) {
        return addDependencies(resolve, reject, entry);
      });
    });

    //add the server static file
    proc = proc.then(function () {
      return new promise(function (resolve, reject) {
        addServerFile(resolve, reject, entry, files);
      });
    });

    //run the module preProcessor
    return proc.then(function () {
      return preProcessor_module(entry, files);
    });
  };
}