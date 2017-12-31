/**
* This factory produces a function worker that tests the paths from the module
* entries, removing the last segment until the file is found
* @factory
*/
function _ModulePathProcessor(promise, errors, type_module_modulePathFinder) {

  /**
  * Loops through the paths, running the path finder for each
  * @function
  */
  function processPaths(resolve, reject, scriptsPath, paths) {
    var hasErr, len = Object.keys(paths).length, procs = [];

    //loop through each path
    Object.keys(paths).forEach(function forEachPath(key) {
        procs.push(type_module_modulePathFinder(paths[key], scriptsPath));
    });

    promise.all(procs)
    .then(function (paths) {
        //sort the paths so repo entries are first (more cosmetic than anything)
        paths.sort(sortFound);
        resolve(paths);
    })
    .catch(function (err) {
        reject(err);
    });
  }
  /**
  * Sorts the array of paths so anything with a repos directory are first
  * @function
  */
  function sortFound(a,b) {
    if (a.indexOf("repos") !== -1 && b.indexOf("repos") === -1) {
      return -1;
    }
    if (b.indexOf("repos") !== -1 && a.indexOf("repos") === -1) {
      return 1;
    }
    if (a < b) {
      return -1;
    }
    if (b < a) {
      return 1;
    }
    return 0;
  }
  /**
  * @worker
  */
  return function ModulePathProcessor(scriptsPath, pathsObj) {

    //failsafe, if pathsObj is empty then our processPaths method will never resolve
    if (isEmpty(pathsObj)) {
      return promise.resolve([]);
    }

    //go through each path
    return new promise(function (resolve, reject) {
      processPaths(resolve, reject, scriptsPath, pathsObj);
    });

  }
}
