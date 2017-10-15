/**
* This factory produces a worker function that saves the files for each entry
* in the manifest
* @factory
*/
function _Saver(promise, fileSaver) {

  /**
  * @worker
  */
  return function Saver(manifest) {

    var procs = [];
    manifest.forEach(function forEachEntry(entry) {
      if (!!entry.output) {
        procs.push(fileSaver(entry.output, entry.files));
      }
    });

    return promise.all(procs);
  };
}
