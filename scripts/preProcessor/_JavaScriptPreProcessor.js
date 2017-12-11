/**
* This factory produces a worker function that converts all non-js file to js
*  and performs linting (if enabled). The file object will be updated with the
*  linting results, adding property `lint` which will be an empty array if the
*  linting passed without issue. The `lint` property will be omitted if linting
*  is not performed.
*
* @factory
* @function
*/
function _JavaScriptPreProcessor(promise, annotation, defaults, type_javascript_linter, type_javascript_javaScriptConverter) {
  var cnsts = {
    "jsExt": [".js", ".json"]
  };

  /**
  * Loops through each file, processing each
  * @function
  */
  function processFiles(resolve, reject, entry, files) {
    var procs = [];

    files.forEach(function forEachFile(file, indx) {

      procs.push(new promise(function (resolve, reject) {
        processFile(resolve, reject, entry, file);
      }));

    });

    //wait for all the files to be processed and then resolve the main promise
    promise.all(procs)
      .then(function (files) {
        resolve(files);
      })
      .catch(function (err) {
        reject(err);
      });

  }
  /**
  * asseses a file's type, and converts if non-js, then performs linting
  * @function
  */
  function processFile(resolve, reject, entry, fileObj) {

    //get the annotations
    var data = fileObj.data
    , ans = annotation.getAll(data)
    ;

    //update the entry's fileTypes property
    if (entry.fileTypes.indexOf(fileObj.ext) === -1) {
      entry.fileTypes.push(fileObj.ext);
    }

    //remove the annotations for file processing
    data = annotation.clear(data);

    //if the file is not a .js or .json then convert it to a string
    if (cnsts.jsExt.indexOf(fileObj.ext) === -1 ) {
      data = type_javascript_javaScriptConverter(fileObj.ext.substring(1), data);
    }
    else if (isEmpty(data)) {
        data = "\"\"";
    }

    //see if we are going to perform the linting
    if (entry.lint === true || entry.lint === "pre") {
      lintFile(data, fileObj, finish);
    }
    else {
      finish();
    }

    //junction function
    function finish() {
      //add the annotations back
      fileObj.data = annotation.annotateAll(ans, data);
      //resolve with the updated file object
      resolve(fileObj);
    }

  }
  /**
  * Performs linting on a file and resolves the results
  * @function
  */
  function lintFile(data, fileObj, finish) {
    //run the linter promise
    type_javascript_linter(data)
      .then(function (results) {
        //add the results to the fileObj
        fileObj["lint"] = results;
        //run the junction callback
        finish();
      });
  }

  /**
  * @worker
  * @param {object} entry A manifest entry object
  * @param {array} files An array of file objects
  */
  return function JavaScriptPreProcessor(entry, files) {
    //set some defaults
    applyIf(defaults["all"], entry);
    applyIf(defaults[entry.format], entry);

    return new promise(function (resolve, reject) {
      processFiles(resolve, reject, entry, files);
    });

  };
}
