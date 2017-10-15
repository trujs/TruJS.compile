/**
* This factory produces a worker function that adds formatting to each file. The
* formatting includes adding strict as well as specifics for either node or
* browser
*
* @factory
*/
function _JavaScriptFormatter(getLineEnding, promise, errors, defaults) {
  var LINE_PATT = /\r?\n/g
  ;

  /**
  * Loops through each file object and performs formatting on each
  * @function
  */
  function formatFiles(resolve, reject, entry, files) {
    var hasErr;

    //loop throug the files
    files.forEach(function forEachFile(fileObj) {
      var lineEnding = getLineEnding(fileObj.data);

      //add strict
      if (entry.strict !== false) {
        fileObj.data = "\"use strict\";" + lineEnding + lineEnding + fileObj.data;
      }

      try {
        if (entry.format === "node") {
          fileObj.data = formatNode(entry, fileObj, lineEnding);
        }
        else if (entry.format === "browser") {
          fileObj.data = formatBrowser(entry, fileObj, lineEnding);
        }
      }
      catch(ex) {
        //if we haven't had an error yet, reject with the error
        if (!hasErr) {
          hasErr = true;
          reject(ex);
        }
      }

    });

    //resolve the updated file objects only if there wasn't an error
    if (!hasErr) {
      resolve(files);
    }

  }
  /**
  * Adds the export statement to the end of the file data, using the value in
  *  entry's `return` property as the value that will be exported
  * @function
  */
  function formatNode(entry, fileObj, lineEnding) {
    //we must have a return property
    if (!entry.return) {
      throw new Error(errors.missingReturn);
    }

    return fileObj.data + lineEnding + lineEnding + "module.exports = " + entry.return + ";";
  }
  /**
  * Adds a return statement, using the in the entry's `return` property as the
  * value that will be returned. Then everything is wrapped in an iife with an
  * assignment to the global with the name of the entry's `namespace` property
  * @function
  */
  function formatBrowser(entry, fileObj, lineEnding) {
    var data = fileObj.data;

    //add the return statement
    if (!!entry.return) {
      data = data + lineEnding + lineEnding + "return " + entry.return + ";";
    }

    //wrap in iife
    data = "(function (){" + lineEnding + data.replace(LINE_PATT, "$&\t") + lineEnding + "})();";

    //add namespace assignment
    if (!!entry.namespace) {
      data = defaults[entry.format].global + "[\"" + entry.namespace + "\"] = " + data;
    }

    return data;
  }

  /**
  * @worker
  */
  return function JavaScriptFormatter(entry, files) {

    return new promise(function (resolve, reject) {
      formatFiles(resolve, reject, entry, files);
    });

  };
}
