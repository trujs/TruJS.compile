/**
* This factory produces a function worker that tests the paths from the module
* entries, removing the last segment until the file is found
* @factory
*/
function _ModulePathProcessor(promise, nodeFs, pathParser, errors, defaults) {
  var SEP_PATT = /[\\/]/;

  /**
  * Loops through the paths, determines the type, checks to see if the files
  * exists, if not removes a part of the path and checks again
  * @function
  */
  function processPaths(resolve, reject, scriptsPath, paths) {
    var hasErr, len = Object.keys(paths).length, found = [];

    //loop through each path
    Object.keys(paths).forEach(function forEachPath(key) {
      processPath(paths[key], key, scriptsPath, pathFinished);
    });

    //the callback for each path that has finished
    function pathFinished(path, key, startPath) {
      if (!hasErr) {

        //if there isn't a path found it's an err
        if (!path) {
          hasErr = true;
          reject(new Error(errors.invalidModuleEntry.replace("{entry}", key).replace("{path}", startPath)));
          return;
        }

        //record the found path, decrement the length, and see if we're done
        if (found.indexOf(path) === -1) {
          found.push(path);
        }
        len--;
        if (len === 0) {
          //sort the paths so repo entries are first (more cosmetic than anything)
          found.sort(sortFound);
          resolve(found);
        }

      }
    }
  }
  /**
  * Resolve the path and verify, removing part if not found, until found
  * @function
  */
  function processPath(path, key, scriptsPath, finished) {

    //complete the path
    path = pathParser(scriptsPath, path).path;

    //start the iteration to find the path that exists
    runIteration(path);

    //tests the path
    function runIteration(curPath) {
      //add the extension
      curPath = determineExtension(curPath);

      //see if the path exists
      verifyPath(curPath, done);
    }

    function done(curPath, exists) {
      if (exists) {
        finished(curPath, key);
      }
      else {
        //we didn't find the file, if it's .js then lets try .json
        if (curPath.indexOf(".js") !== -1 && curPath.indexOf(".json") === -1) {
          curPath = curPath.replace(".js", "Json");
        }
        //otherwise remove the last segment of the path and try again
        else {
          curPath = removeLastSegment(curPath);
        }

        //if we still have a path left to work with, continue to iterate
        if (!!curPath) {
          runIteration(curPath);
        }
        //no path left, finish with a null result
        else {
          finished(null, key, path);
        }

      }
    }

  }
  /**
  * Determines the file extension by the path, using the patterns in the
  * fileTypes constant
  * @function
  */
  function determineExtension(path) {
    var fileType;

    //find the type
    Object.keys(defaults.fileTypes).every(function forEachFileType(type) {
      //test the name with this patthern
      var patt = new RegExp("(.*)" + defaults.fileTypes[type] + "$")
      , match = patt.exec(path);
      if (!!match) {
        path = match[1];
        fileType = type;
        return false;
      }
      return true;
    });

    //no type, default to js
    if (!fileType) {
      fileType = ".js";
    }

    return path + fileType;
  }
  /**
  * Tests the path to see if the file exists
  * @function
  */
  function verifyPath(curPath, done) {
    nodeFs.stat(curPath, function(err, stats) {
      done(curPath, !err);
    });
  }
  /**
  * Removes that last segment from the path
  * @function
  */
  function removeLastSegment(path) {
    var sep = SEP_PATT.exec(path)[0]
    , segs = path.split(sep);
    segs.pop();
    if (segs.length < 2) {
      return null;
    }
    return segs.join(sep);
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
