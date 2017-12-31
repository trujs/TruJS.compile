/**
* This factory produces a worker function that finds the correct path for a
* module entry
* @factory
*/
function _ModulePathFinder(promise, nodeFs, pathParser, defaults, errors) {
    var SEP_PATT = /[/\\]/;

    /**
    * Resolve the path and verify, removing part if not found, until found
    * @function
    */
    function processPath(resolve, reject, path, scriptsPath) {

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
          resolve(curPath);
        }
        else {
          //we didn't find the file, if it's .js then lets try .json
          if (curPath.indexOf(".js") !== -1 && curPath.indexOf(".json") === -1) {
            curPath = curPath.replace(".js", ".json");
          }
          //otherwise remove the last segment of the path and try again
          else {
            curPath = removeLastSegment(curPath);
          }

          //if we still have a path left to work with, continue to iterate
          if (!!curPath) {
            resolve(curPath);
          }
          //no path left, reject
          else {
            reject(new Error(errors.invalidModuleEntry.replace("{entry}", key).replace("{path}", startPath)));
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
    * @worker
    */
    return function ModulePathFinder(path, scriptsPath) {

        //iterate over several name variations until a files is found
        return new promise(function (resolve, reject) {
            processPath(resolve, reject, path, scriptsPath);
        });

    };
}