/**
* This factory produces a worker function that minifies a `file` based on the
* type of file it is; javascript, html, css.
*
* @factory
*/
function _Minifier(promise, $container, defaults, errors) {

  /**
  * Minifies the file, rejecting if there is an error
  * @function
  */
  function minifyFile(resolve, reject, fileObj, options) {

    //get the correct module
    var name = defaults.minifier.extentionMap[fileObj.ext]
    , module = !!name && $container("type.javascript.minifiers." + name, "missing");
    if (module === "missing") {
      reject(new Error(errors.missingMinifierModule.replace("{ext}", fileObj.ext)));
    }

    //run the module
    module(fileObj, options)
      .then(function (result) {
        handleResult(resolve, reject, fileObj, result);
      })
      .catch(function (err) {
        reject(err);
      });

  }
  /**
  * Handles the minifiers result
  * @function
  */
  function handleResult(resolve, reject, fileObj, result) {
    fileObj.data = result.data;
    resolve(fileObj);
  }

  /**
  * @worker
  */
  return function Minifier(fileObj, options) {

    return new promise(function (resolve, reject) {
      minifyFile(resolve, reject, fileObj, options);
    });

  };
}
