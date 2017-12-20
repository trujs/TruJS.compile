/**
* Creates a `Compiler` worker function that given a `base` and `manifest` will
* run the compiler logic and return a promise
*
* @factory
* @function
* @param {Promise} promise The Promise module
* @param {object} $container The ioc container reference
* @param {function} arrayFromArguments A function that transforms arguments to
*   an array
*/
function _Compiler(promise, $container, arrayFromArguments, errors, includes) {

  /**
  * Get the processing module by the entry `type` and process
  * @function
  */
  function getModule(entry, process) {
    //create the type string, using "collection" as the default entry type
    var type = process + "." + (entry.type || "collection");
    if (!$container.hasDependency(type)) {
      return;
    }

    return $container("." + type);
  }
  /**
  * Runs the type specific collector for each manifest entry
  * @function
  */
  function collectFiles(resolve, reject, base, manifest) {
    //an array to store the collector promises
    var procs = []
    , values = []
    , exec;

    //if we passed then create the collect promise, otherwise we already rejected
    //loop through the manifest, run the collector for each
    if (manifest.every(everyEntry)) {
        //run each collector asyncronously because a collector could update
        // repositories in the file system
        procs.forEach(function forEachProc(proc, indx) {
            if (!exec) {
                exec = proc;
            }
            else {
                exec = exec.then(function (files) {
                    values.push(files);
                    return proc;
                });
            }
        });
        //after all of the collectors finish
        exec.then(function (results) {
            values.push(results);
            resolve(values);
        })
        .catch(function (err) {
            reject(err);
        });
    }

    //iterator function for the manifest entries
    function everyEntry(entry) {

      //get the collector
      var collector = getModule(entry, "collector");

      //a collector is required for every type
      if (collector === undefined) {
        reject(new Error(errors.missingCollector.replace("{type}", entry.type)));
        return false;
      }

      //run the collector to get a promise and add it to the procs array
      procs.push(collector(base, entry));

      return true;
    }

  }
  /**
  * Merges the output path with the entry
  * @function
  */
  function updateOutputPath(resolve, reject, manifest, manifestFiles) {
      try {
          //loop through each manifest entry
          manifest.forEach(function forEachEntry(entry, indx) {
            //update special values in the output path
            if (!!entry.output && typeof entry.output === 'string') {

              entry.output = entry.output
              .replace(/{([^}]+)}/g, function(tag, key) {
                  var ref = resolvePath(key, entry);
                  return ref.value;
              });
            }
          });

          resolve(manifestFiles);
      }
      catch(ex) {
          reject(ex);
      }
  }
  /**
  * Runs the pre-processor, assembler, formattor, and the post-processor for
  *   all manifest entries
  * @function
  */
  function processEntries(resolve, reject, manifest, manifestFiles) {
    //an array of promises to wait for
    var procs = [];

    //chain together the pre-processor, assembler, formattor, and post-processor
    // for each entry in the manifest files array
    manifestFiles.forEach(function forEachFilesEntry(files, indx) {
        //get the entry for this data set
        var entry = manifest[indx];
        //chain the processes together
        procs.push(chainProcesses(entry, files));
    });

    //wait for all entry processes
    promise.all(procs)
      .then(function(manifestFiles) {
        resolve(manifestFiles);
      })
      .catch(function (err) {
        reject(err);
      });
  }
  /**
  * Chains together the pre-processor, assembler, formattor, and the
  *   post-processor processes together for a single manifest entry
  * @function
  */
  function chainProcesses(entry, files) {
    //start a promise to chain everything to
    var proc = promise.resolve(files)

    //get the modules for this entry
    , preProcessor = getModule(entry, "preProcessor")
    , assembler = getModule(entry, "assembler")
    , formatter = getModule(entry, "formatter")
    , postProcessor = getModule(entry, "postProcessor")
    ;

    //chain the pre processor
    if (!!preProcessor) {
      proc = proc.then(function(files) {
        return preProcessor(entry, files);
      });
    }

    //chain the assembler
    if (!!assembler) {
      proc = proc.then(function(files) {
        return assembler(entry, files);
      });
    }

    //chain the formattor
    if (!!formatter) {
      proc = proc.then(function(files) {
        return formatter(entry, files);
      });
    }

    //chain the post processor
    if (!!postProcessor) {
      proc = proc.then(function(files) {
        return postProcessor(entry, files);
      });
    }

    return proc;
  }

  /**
  * Takes a manifest file and creates the output
  * @worker
  * @param {string} base The base path used to fully qualify relative paths
  * @param {array} manifest The array of manifest entries
  */
  return function Compiler(base, manifest) {

    //collect the files
    var proc = new promise(function (resolve, reject) {
      collectFiles(resolve, reject, base, manifest);
    });

    //update with the includes
    proc = proc.then(function (manifestFiles) {
      return includes(manifest, manifestFiles);
    });

    //update the output path
    proc = proc.then(function (manifestFiles) {
      return new promise(function (resolve, reject) {
          updateOutputPath(resolve, reject, manifest, manifestFiles);
      });
    });

    //process the entries
    proc = proc.then(function (manifestFiles) {
      return new promise(function (resolve, reject) {
        processEntries(resolve, reject, manifest, manifestFiles);
      });
    });

    //add the post include
    proc = proc.then(function (manifestFiles) {
      return includes(manifest, manifestFiles, true);
    });

    //combine the manifest file with the manifest and update the output path
    return proc.then(function (manifestFiles) {
      //loop through each manifest entry
      manifest.forEach(function forEachEntry(entry, indx) {
        //add the files to the entry
        entry.files = manifestFiles[indx];
      });
      return promise.resolve(manifest);
    });

  };
}