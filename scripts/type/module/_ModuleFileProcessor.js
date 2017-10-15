/**
* This factory produces a worker function that builds a list of paths from the
* module object
* @factory
*/
function _ModuleFileProcessor(promise, nodePath, type_module_iocEntry, errors) {

  /**
  * Uses the module to build a list of paths
  * @function
  */
  function processModule(resolve, reject, entry, module) {
    //add the project's hint
    entry.hints = entry.hints || [];
    if (!entry.hints.hasOwnProperty(entry.name)) {
      //we want the project hint to come first in the order, so we need to first
      //create a new hints object and then append the entry's hints to that
      var hints = {};
      hints[entry.name] = "./";
      entry.hints = apply(entry.hints, hints);
    }

    //loop through all properties in the module object
    var objPaths = processModuleEntry([module])
    , filePaths = {}
    ;

    //using the hints, process the paths, if every returns true then continue
    if (objPaths.every(forEachObjPath)) {
      resolve(filePaths);
    }

    //the iterator for looping through the object paths
    function forEachObjPath(objPath) {
      var hint, filePath;
      //find the hint
      Object.keys(entry.hints).every(function forEachHintKey(key) {
          if (objPath.indexOf(key) === 0) {
            hint = key;
            return false; //stop the iterator
          }
          return true; //continue the iterator
      });

      //if no hint was found then we'll reject and stop the iterator
      if (!hint) {
        reject(new Error(errors.missingHint.replace("{path}", objPath)));
        return false;
      }

      //replace the hint portion with the hint value, replace dots
      filePath = objPath.replace(hint, "").replace(/[.]/g, "/");
      filePath = nodePath.join(entry.hints[hint], filePath);

      //add the file path to the array if not already
      if (!filePaths.hasOwnProperty(objPath)) {
          filePaths[objPath] = filePath;
      }

      return true; //continue the iterator
    }

  }
  /**
  * Iterate over the module entries and extract the fully qualified factory and
  * object entries
  * @function
  */
  function processModuleEntry(entry) {
    //see if this is a container entry
    var paths = []
    , entryType = type_module_iocEntry.getEntryType(entry)
    ;

    switch(entryType) {
      case "object":
        //process each property of the entry object, adding the results to the
        //array
        Object.keys(entry[0]).forEach(function forEachKey(key) {
          paths = paths.concat(processModuleEntry(entry[0][key]));
        });
        break;
      case "factory":
        //only grab fully qualified entries, if they start with a dot then
        //that is not fully quualified
        if (entry[0][0] !== ".") {
            paths.push(entry[0]);
        }
        break;
    }

    return paths;
  }

  /**
  * @worker
  */
  return function ModuleFileProcessor(entry, module) {

    //process the module
    return new promise(function (resolve, reject) {
      processModule(resolve, reject, entry, module);
    })

  };
}
