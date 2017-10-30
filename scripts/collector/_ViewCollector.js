/**
* This factory produces a worker function that adds some simple view system
* requirements to the manifest entry
* @factory
*/
function _ViewCollector(collector_module) {
    var defaults = {
      "files": [
        "+./*.state.json"
        , "+./state.json"
        , "+./*.view.html"
        , "+./view.html"
        , "+./*.view.css"
        , "+./view.css"
        , "+./*.view.js"
        , "+./view.js"
      ]
      , "baseModule": ["{repos}/TruJS.simpleViewSystem"]
      , "hints": {
          "TruJS.simpleViewSystem": "{repos}/TruJS.simpleViewSystem/scripts"
          , "TruJS": "{repos}/TruJS"
          , "TruJS.Comp": "{repos}/TruJS.Comp"
      }
      , "module": {}
    };

    /**
    * @worker
    */
    return function ViewCollector(base, entry) {

        //by default we'll add the TruJS base and all spec.js file recursively
        entry = merge(entry, defaults);

        //run the collection collector
        return collector_module(base, entry);
    };
}