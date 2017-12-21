/**
* This factory produces a worker function that uses the module.json file to
* create the list of required files.
* Manifest Entry Properties Used
*   moduleFile: {optional string file name for non-standard module file names}
*   baseModule: {optional array of module paths, to be merged with the module}
*   files: {optional array of file paths to be appended to the output file list}
* @factory
*/
function _ModuleCollector(promise, collector_collection, defaults, pathParser, getScriptsDir, type_module_moduleFileLoader, type_module_moduleFileProcessor, type_module_modulePathProcessor, nodePath, type_module_moduleMerger) {
  var cnsts = {
    "module": "module.json"
  };

  /**
  * Using the manifest entry and base path, produces an array of paths for each
  * based on the module and baseModule properties in the entry
  * @function
  */
  function getModulePaths(base, entry) {
    var baseModule = entry.baseModule, modulePaths = []
    , curModule;

    //if there is a baseModule entry, add that to the modulePaths
    if (!!baseModule) {
      if (!isArray(baseModule)) {
        baseModule = [baseModule];
      }
      //resolve all paths
      baseModule.forEach(function forEachBaseModule(path) {
        if (nodePath.extname(path) !== ".json") {
          path = nodePath.join(path, cnsts.module);
        }
        path = pathParser(null, path);
        modulePaths.push(path);
      });
    }

    //add the current entry's module path at the end
    if (entry.moduleFile !== "") {
      curModule = pathParser(base, entry.moduleFile || cnsts.module);
      modulePaths.push(curModule);
    }

    return modulePaths;
  }
  /**
  * Adds hints for each repo entry
  * @function
  */
  function addRepoHints(entry) {
      entry.hints = entry.hints || {};
      if (isArray(entry.repos)) {
          var hints = {};
          entry.repos.forEach(function forEachRepo(item) {
              var name = item.repo || item.name;
              if (!entry.hints.hasOwnProperty(name)) {
                  hints[name] = item.isProject && "{projects}" || "{repos}";
                  hints[name]+= "/" + item.name;
              }
          });
          Object.keys(hints)
          .sort()
          .reverse()
          .forEach(function forEachKey(key) {
              entry.hints[key] = hints[key];
          });
      }
  }
  /**
  * Loads all module files in the module array
  * @function
  */
  function loadModules(paths) {
    var procs = [];

    paths.forEach(function forEachPath(pathObj) {
      procs.push(type_module_moduleFileLoader(pathObj.path));
    });

    return promise.all(procs);
  }
  /**
  * Add the require ioc paths and add any files from the manifest entry
  * @function
  */
  function augmentPaths(entry, scriptsPath, paths) {
    //add the required ioc paths
    paths = addIocPaths(scriptsPath, paths);
    //add any paths in the entry's files property
    return addEntryFiles(scriptsPath, paths, entry.files);
  }
  /**
  * Add the required ioc entries from the defaults
  * @function
  */
  function addIocPaths(scriptsPath, paths) {
    //convert the iocPaths constants into real paths
    var allPaths = defaults.iocPaths.map(function mapIocPaths(path) {
      return pathParser(scriptsPath, path).path;
    });

    //only add the non-ioc paths from our compiled array of paths
    return allPaths
      .concat(paths.filter(function filterPaths(path) {
        if (allPaths.indexOf(path) === -1) {
          return true;
        }
      }));
  }
  /**
  * Adds any members from the entry's files array to the end of the paths array
  * @function
  */
  function addEntryFiles(scriptsPath, paths, files) {
    if(!!files) {
      return paths.concat(files);
    }
    return paths;
  }

  /**
  * @worker
  */
  return function ModuleCollector(base, entry) {
    //setup the path to the scripts, using the default or the manifest entry
    var scriptsPath = getScriptsDir(base, entry)
    //get an array of all the module files we're going to load
    , modulePaths = getModulePaths(base, entry);

    //add the hints
    addRepoHints(entry);

    var proc = promise.resolve([]);

    //get the module file data
    if (!isEmpty(modulePaths)) {
      proc = proc.then(function () {
        return loadModules(modulePaths);
      });
    }

    //merge all of the module objects
    proc = proc.then(function (modules) {
      //there could be a module object in the manifest entry, append to the end
      if (!!entry.module) {
        modules.push(entry.module);
      }
      return type_module_moduleMerger(modules);
    });

    //use the module to get the list of file paths
    proc = proc.then(function (module) {
      entry.module = module;//update the entry module object
      return type_module_moduleFileProcessor(entry, module);
    });

    //determine the file type and verify the paths iteratively
    proc = proc.then(function (pathsObj) {
      return type_module_modulePathProcessor(scriptsPath, pathsObj);
    });

    //use the collection collector to load the files
    return proc.then(function (paths) {
      //augment the paths and set the files property
      entry.files = augmentPaths(entry, scriptsPath, paths);
      //pass the buck to the standard collection collector
      return collector_collection(base, entry);
    });

  };
}
