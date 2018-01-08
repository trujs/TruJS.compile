/**
* This factory produces a worker function that sets some routing related
* defaults, files and moduleFile properties, and then defers to the module
* collector
* @factory
*/
function _RoutingCollector(promise, collector_module, defaults) {

  /**
  * @worker
  */
  return function RoutingCollector(base, entry) {
    //set the defaults
    update(entry, defaults.entry.routing);

    //run the module collector
    return collector_module(base, entry);
  };
}