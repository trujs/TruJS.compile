/**
* This factory produces a worker function that sets some routing related
* defaults, files and moduleFile properties, and then defers to the module
* collector
* @factory
*/
function _RoutingCollector(promise, collector_module) {
  var cnsts = {
    "defaults": {
      "files": [
        "+./*.route.js"
        , "{repos}/TruJS/log/_Reporter.js"
      ]
      , "moduleFile": "route.module.json"
    }
  };

  /**
  * @worker
  */
  return function RoutingCollector(base, entry) {
    //set the defaults
    applyIf(cnsts.defaults, entry);

    //run the module collector
    return collector_module(base, entry);
  };
}