/**
* This factory produces a worker function that adds some simple view system
* requirements to the manifest entry
* @factory
*/
function _ViewCollector() {
    var defaults = {
      "files": [
        "+./*.state.json"
      ]
      , "baseModule": ["{repos}/TruJS.simpleViewSystem"]
    };

    /**
    * @worker
    */
    return function ViewCollector(base, entry) {

        //by default we'll add the TruJS base and all spec.js file recursively
        entry = merge(defaults, entry);

        //run the collection collector
        return collector_module(base, entry);
    };
}