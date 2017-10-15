/**
* This factory produces a worker function that takes javascript `text` input and
*   performs linting against it, returning an array of objects representing the
*   linting findings.
*
* @factory
*/
function _Linter(promise) {

  /**
  * @worker
  */
  return function Linter(fileObj) {

    return new promise(function(resolve, reject) {
      resolve([]);
    });

  };
}
