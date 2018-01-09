/**
* This factory produces a worker function that sets some defaults and then runs
* the collection collector
* @factory
*/
function _TestCollector(promise, collector_collection, defaults) {

  /**
  * @worker
  */
  return function TestCollector(base, entry, indx) {
    //by default we'll add the TruJS base and all spec.js file recursively
    update(entry, copy(defaults.entry.test));

    //the default test entry is the entry's previous sibling
    if (!entry.testEntry) {
        entry.testEntry = indx - 1;
    }
    entry.includes.postAssembler = entry.testEntry;

    //run the collection collector
    return collector_collection(base, entry);
  };
}
