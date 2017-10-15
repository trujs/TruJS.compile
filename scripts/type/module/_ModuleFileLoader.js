/**
* This factory produces a worker function that loads and parses a modules file.
* This includes the loading of a baseModule file.
* @factory
*/
function _ModuleFileLoader(promise, nodeFs, nodePath, errors) {
  var cnsts = {
    "nofile": -4058
  };

  /**
  * Finds and loads the module.json file.
  * @function
  */
  function loadModuleFile(resolve, reject, path) {

    nodeFs.readFile(path, 'utf8', moduleReadCb);

    function moduleReadCb(err, data) {
      if (!!err) {
        handleFileReadErr(err, path, reject);
      }
      else {
        resolveModule(data, resolve, reject);
      }
    }

  }
  /**
  * Evaluates the data returned from the file read. The file could have data
  * that is not json compatible
  * @function
  */
  function resolveModule(data, resolve, reject) {
    try {
      resolve(JSON.parse(data));
    }
    catch(ex) {
      reject(ex);
    }
  }
  /**
  * Rejects the promise with a standard message if the file wasn't found,
  * otherwise it rejects with the file read error
  * @function
  */
  function handleFileReadErr(err, path, reject) {
    if (err.errno === cnsts.nofile) {
      reject(new Error(errors.moduleFileNotFound.replace("{path}", path)));
    }
    else {
      reject(err);
    }
  }

  /**
  * @worker
  */
  return function ModuleFileLoader(modulePath) {

    //get the module file
    return new promise(function (resolve, reject) {
      loadModuleFile(resolve, reject, modulePath);
    });

  };
}
