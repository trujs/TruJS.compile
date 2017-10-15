/**
* This factory produces a worker function that accepts a file object with a data
* poperty, along with a collection of options. The data must be valid javascript
* code. The worker minifies and resolves the returned promise with the minified
* data.
* @factory
*/
function _JavaScriptMinifier(promise, type_javascript_uglify, stringApply, defaults, errors) {

  /**
  * Invokes the javascript specific minifier
  * @function
  */
  function minifyJs(resolve, reject, fileObj, options) {
    //update the minify options with the defaults
    options = applyIf(defaults.minifier.javascript, options || {});

    try {
      //execute the minifier
      var result = type_javascript_uglify.minify(fileObj.data, options);

      //if there was an error or if we are not allowing errors
      if (!!result.error && options.allowErrors !== true) {
        reject(new Error(stringApply(errors.minificationError, result.error)));
      }
      //otherwise resolve with the standard response
      else {
        resolve({ "data": result.code, "error": result.error, "warnings": result.warnings });
      }
    }
    catch(ex) {
      reject(ex);
    }

  }

  /**
  * @worker
  */
  return function JavaScriptMinifier(fileObj, options) {

    return new promise(function (resolve, reject) {
      minifyJs(resolve, reject, fileObj, options);
    });

  };
}
