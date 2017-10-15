/**
* This factory produces a worker function that runs post process routines
*  against the file array. If the `minify` option is !false then the files will
* be minified. If the `lint` option is true or "post" then the files will be
* linted.
* @factory
*/
function _JavaScriptPostProcessor(promise, type_javascript_linter, type_javascript_minifier, nodePath, fileObj) {

  /**
  * Loops through each file and runs the post process for each
  * @function
  */
  function processFiles(resolve, reject, entry, files) {
    var procs = [];

    files.forEach(function forEachFile(fileObj) {
      procs.push(processFile(entry, fileObj));
    });

    //wait for all files to process and then resolve with the updated files
    promise.all(procs)
      .then(function (files) {
        resolve(files);
      })
      .catch(function (err) {
        reject(err);
      });

  }
  /**
  * Runs the minifier and linter for the file
  * @function
  */
  function processFile(entry, fileObj) {
    var proc = promise.resolve(fileObj);

    if (entry.minify !== false) {
      proc = proc.then(function (fileObj) {
        return type_javascript_minifier(fileObj);
      });
    }

    if (entry.lint === true || entry.lint === "post") {
      proc = proc.then(function (fileObj) {
        //run the linter, then add the results, then return the fileObj
        return type_javascript_linter(fileObj.data)
          .then(function (results) {
            //add the results to the fileObj
            fileObj["lint"] = results;

            return fileObj;
          });
      });
    }

    return proc;
  }
  /**
  * If the entry is for node, and there is a package property, create a package
  * file
  * @function
  */
  function addPackage(resolve, reject, entry, files) {
      try {
          var output = !!entry.output && nodePath.parse(entry.output);

          if (entry.format === "node" && !!entry.package) {
              if (files.length === 1 && !!output && !!output.base) {
                  files[0].file = output.base;
                  files[0].name = output.name;
                  files[0].ext = output.ext;
              }
              !!output && (entry.output = output.dir);

              entry.package.name = entry.package.name ||
                entry.name.toLowerCase().replace(".", "-");

              entry.package.description = entry.package.description ||
                entry.description;

              entry.package.version = entry.package.version ||
                entry.version;

              entry.package.main = entry.package.main ||
                files[0].file;

              files.push(fileObj("package.json", JSON.stringify(entry.package)));
          }

          resolve(files);
      }
      catch(ex) {
          reject(ex);
      }
  }

  /**
  * @worker
  */
  return function JavaScriptPostProcessor(entry, files) {

    var proc = new promise(function(resolve, reject) {
      processFiles(resolve, reject, entry, files);
    });

    return proc.then(function (files) {
        return new promise(function(resolve, reject) {
          addPackage(resolve, reject, entry, files);
        });
    });

  };
}
