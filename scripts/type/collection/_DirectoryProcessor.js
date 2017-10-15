/**
* The factory produces a worker function that does the _Directory listing for a
*   path object, processes the results and performs any path fragment or
*   wildcard filters.
* @factory
* @function
*/
function _DirectoryProcessor(dir, promise) {

  /**
  * Handles the result of the directory listing
  * @function
  */
  function processDir(resolve, reject, pathObj, dirObj) {

    if (dirObj.missing) {
      pathObj.missing = true;
    }
    //add the files to the pathObj so we can perform any wildcard ops
    else if (dirObj.isDirectory) {
      pathObj.files = extractFilePaths(dirObj);
    }
    //just in case we sent a non-directory path
    else {
      pathObj.files = [pathObj.path];
    }

    resolve(pathObj);
  }
  /**
  * Runs through the directory children tree to get an array of files
  * @function
  */
  function extractFilePaths(dir) {
    var files = [];

    if (!!dir.children) {
        dir.children.forEach(function forEachChild(child) {
          if (child.isDirectory) {
            files = files.concat(extractFilePaths(child));
          }
          else {
            files.push(child.path);
          }
        });
    }

    return files;
  }

  /**
  * @worker
  * @function
  */
  return function DirectoryProcessor(pathObj) {

    return new promise(function (resolve, reject) {

      //execute the directory listing and then process the results
      dir(pathObj.path, pathObj.options)
        .then(function (dirObj) {
          processDir(resolve, reject, pathObj, dirObj);
        })
        .catch(function (err) {
          reject(err);
        });

    });

  };
}
