/**
*
*
*/
function _SassCollector(promise, collector_collection) {
  var defaults = {
    "files": [
      "+./*.scss"
    ]
  };

  /**
  * @worker
  */
  return function SassCollector(base, entry) {
    //by default we'll add a files entry for all scss file recursively
    entry = applyIf(defaults, entry);

    //run the collection collector
    return collector_collection(base, entry);
  };
}
