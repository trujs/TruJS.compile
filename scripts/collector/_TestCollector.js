/**
* This factory produces a worker function that sets some defaults and then runs
* the collection collector
* @factory
*/
function _TestCollector(collector_collection, promise) {
  var defaults = {
    "files": [
      "{repos}/TruJS/TruJS.js"
      , "+./*.spec.js"
    ]
  };

  /**
  * @worker
  */
  return function TestCollector(base, entry) {
    //by default we'll add the TruJS base and all spec.js file recursively
    entry = applyIf(defaults, entry);

    //run the collection collector
    return collector_collection(base, entry);
  };
}
