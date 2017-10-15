/**
* This factory produces a worker function that runs the sass compile for the
* file
* @function
*/
function _SassPostProcessor(promise, type_sass_sassRender, fileObj) {
  var cnsts = {
    "defaultPath": "style.css"
  };

  /**
  * Executes the sass rendering engine
  * @function
  */
  function renderSass(resolve, reject, entry, files) {
    var outputFile;

    try {
      type_sass_sassRender({ "data": files[0].data }, function (err, result) {
        if (!!err) {
          reject(new Error(err.message));
        }
        else {
          outputFile = fileObj(entry.output || cnsts.defaultPath, result.css);
          resolve([outputFile]);
        }
      });
    }
    catch(ex) {
      reject(ex);
    }
  }

  /**
  * @factory
  */
  return function SassPostProcessor(entry, files) {

    return new promise(function (resolve, reject) {
      renderSass(resolve, reject, entry, files);
    });

  };
}
