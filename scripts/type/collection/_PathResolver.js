/**
* This factory provides a worker function that resolves either a single path or an
*   array of paths.
*
*   logic:
*   1. ./path/file.js -> single file starting with the base
*   2. ./path/* -> all files within path
*   3. +./path/* -> all files within path and sub directories within
*   4. ./path/*.spec.js -> all files ending with .spec.js
*   5. -./path/*.html -> removes all resolved paths
*
* @factory
* @function
*/
function _PathResolver(promise, type_collection_pathProcessor, type_collection_pathResultProcessor, type_collection_dirProcessor) {

  /**
  *
  * @function
  */
  function resolvePaths(resolve, reject, base, paths) {

    //get the path object and process any directories
    promise.all(setupEachPath(base, paths))
      .then(function (results) {

        //process the minus entries in the results
        results = processResults(results);

        //resolve the final promise with the updated results
        resolve(results);

      })
      .catch(function (err) {
        reject(err);
      });

  }
  /**
  * Generate a pathObj for each path and return an array of value/promise
  * @function
  */
  function setupEachPath(base, paths) {

    return paths.map(function mapPaths(curPath) {
      //get the path details
      var pathObj = type_collection_pathProcessor(base, curPath);

      //if the pathObj is a directory then list it
      if (pathObj.directory) {
        return type_collection_dirProcessor(pathObj);
      }
      //otherwise resolve a promise with the path
      else {
        return pathObj;
      }
    });
  }
  /**
  *
  * @function
  */
  function processResults(results) {
    //create a container for the distinct files
    var files = [];

    //loop through the results
    results.forEach(function forEachResult(result) {
      files = type_collection_pathResultProcessor(files, result);
    });

    return files;
  }

  /**
  * @worker
  * @function
  */
  return function PathResolver(base, paths) {
    //make the paths value an array
    if (!isArray(paths) && !!paths) {
      paths = [paths];
    }

    return new promise(function (resolve, reject) {
      if (!!paths) {
        resolvePaths(resolve, reject, base, paths);
      }
      else {
        resolve([]);
      }
    });

  };
}
