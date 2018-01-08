/**
* Creates a `Compiler` worker function that given a `base` and `manifest` will
* run the compiler logic and return a promise
*
* @factory
*/
function _Compiler(promise, $container, errors, includes, compileReporter, performance) {

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
    , exec
    , start = performance.now();

    compileReporter.info("Collection process starting");
    compileReporter.group("collection");

    //if we passed then create the collect promise, otherwise we already rejected
    //loop through the manifest, run the collector for each
    if (manifest.every(everyEntry)) {
        //run each collector asyncronously because a collector could update
        // repositories in the file system
        procs.forEach(function forEachProc(proc, indx) {
            if (!exec) {
                exec = proc();
            }
            else {
                exec = exec.then(function (files) {
                    values.push(files);
                    compileReporter.extended("Collector stopped");
                    compileReporter.groupEnd("collect");
                    return proc();
                });
            }
        });

        compileReporter.info("Collection process running");

        //after all of the collectors finish
        exec.then(function (results) {
            compileReporter.groupEnd("collect");
            compileReporter.groupEnd("collection");
            compileReporter.info("Collection process finished (" + (performance.now() - start).toFixed(4) + "ms)");

            values.push(results);
            resolve(values);
        })
        .catch(function (err) {
            compileReporter.error(err);
            reject(err);
        });
    }

    //iterator function for the manifest entries
    function everyEntry(entry, indx) {

      //get the collector
      var collector = getModule(entry, "collector");

      //a collector is required for every type
      if (collector === undefined) {
        reject(new Error(errors.missingCollector.replace("{type}", entry.type)));
        return false;
      }

      compileReporter.extended("Collector found \"" + entry.type + "\"");

      //run the collector to get a promise and add it to the procs array
      procs.push(function () {
          compileReporter.extended("Collector started \"" + entry.type + "\"");
          compileReporter.group("collect");
          return collector(base, entry, indx);
      });

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
  * Runs the pre-processor and assembler for all manifest entries
  * @function
  */
  function postCollectorProcess(resolve, reject, manifest, manifestFiles) {
    //an array of promises to wait for
    var procs = []
    , start = performance.now();

    compileReporter.info("Post collector process started");
    compileReporter.group("postcollector");

    //chain together the pre-processor, assembler, formattor, and post-processor
    // for each entry in the manifest files array
    manifestFiles.forEach(function forEachFilesEntry(files, indx) {
        //get the entry for this data set
        var entry = manifest[indx]
        //start a promise to chain everything to
        , chain = promise.resolve(files)
        //get the modules for this entry
        , preProcessor = getModule(entry, "preProcessor")
        , assembler = getModule(entry, "assembler")
        , start = performance.now();
        ;

        //chain the pre processor
        if (!!preProcessor) {

          compileReporter.extended("Pre-Processor found for \"" + entry.type + "\"");

          chain = chain.then(function(files) {
            return preProcessor(entry, files, indx);
          });
        }

        //chain the assembler
        if (!!assembler) {

          compileReporter.extended("Assembler found for \"" + entry.type + "\"");

          chain = chain.then(function(files) {
            return assembler(entry, files, indx);
          });
        }

        procs.push(chain);
    });

    compileReporter.extended("Post collector process running");
    compileReporter.group("postcollectorrunning");

    //wait for all entry processes
    promise.all(procs)
      .then(function(manifestFiles) {
        compileReporter.groupEnd("postcollectorrunning");
        compileReporter.groupEnd("postcollector");
        compileReporter.info("Post collector process finished (" + (performance.now() - start).toFixed(4) + "ms)");

        resolve(manifestFiles);
      })
      .catch(function (err) {
        reject(err);
      });
  }
  /**
  * Runs the formatter and post-processor for all manifest entries
  * @function
  */
  function postAssemblerProcess(resolve, reject, manifest, manifestFiles) {
      //an array of promises to wait for
      var procs = []
      , start = performance.now();

      compileReporter.info("Post assembler process started");
      compileReporter.group("postassembler");

      //chain together the pre-processor, assembler, formattor, and post-processor
      // for each entry in the manifest files array
      manifestFiles.forEach(function forEachFilesEntry(files, indx) {
          //get the entry for this data set
          var entry = manifest[indx]
          , chain = promise.resolve(files)
          , formatter = getModule(entry, "formatter")
          , postProcessor = getModule(entry, "postProcessor");

          //chain the formattor
          if (!!formatter) {

            compileReporter.extended("Formatter found for \"" + entry.type + "\"");

            chain = chain.then(function(files) {
              return formatter(entry, files, indx);
            });
          }

          //chain the post processor
          if (!!postProcessor) {

            compileReporter.extended("Post-Processor found for \"" + entry.type + "\"");

            chain = chain.then(function(files) {
              return postProcessor(entry, files, indx);
            });
          }

          procs.push(chain);
      });

      compileReporter.extended("Post assembler process running");
      compileReporter.group("postassemblerrunning");

      //wait for all entry processes
      promise.all(procs)
        .then(function(manifestFiles) {
          compileReporter.groupEnd("postassemblerrunning");
          compileReporter.groupEnd("postassembler");
          compileReporter.info("Post assembler process finished (" + (performance.now() - start).toFixed(4) + "ms)");

          resolve(manifestFiles);
        })
        .catch(function (err) {
          reject(err);
        });
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

    //update the output path
    proc = proc.then(function (manifestFiles) {
      return new promise(function (resolve, reject) {
          updateOutputPath(resolve, reject, manifest, manifestFiles);
      });
    });

    //update with the includes
    proc = proc.then(function (manifestFiles) {
      return includes(manifest, manifestFiles, "postCollector");
    });

    //process the entries
    proc = proc.then(function (manifestFiles) {
      return new promise(function (resolve, reject) {
        postCollectorProcess(resolve, reject, manifest, manifestFiles);
      });
    });

    //add the post include
    proc = proc.then(function (manifestFiles) {
      return includes(manifest, manifestFiles, "postAssembler");
    });

    //process the entries
    proc = proc.then(function (manifestFiles) {
      return new promise(function (resolve, reject) {
        postAssemblerProcess(resolve, reject, manifest, manifestFiles);
      });
    });

    //add the post include
    proc = proc.then(function (manifestFiles) {
      return includes(manifest, manifestFiles, "final");
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