/**
* This factory produces a worker function that uses the module.json file to
* create the list of required files.
* Manifest Entry Properties Used
*   moduleFile: {optional string file name for non-standard module file names}
*   baseModule: {optional array of module paths, to be merged with the module}
*   files: {optional array of file paths to be appended to the output file list}
* @factory
*/
function _ModuleCollector(promise, getScriptsDir, defaults, pathParser, nodePath, type_module_checkoutRepositories, type_module_moduleFileLoader, type_module_moduleMerger, type_module_filePicker) {
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
    if (!isEmpty(entry.moduleFile)) {
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
  function augmentPaths(base, entry) {
    var scriptsPath = getScriptsDir(base, entry)
    //add the required ioc paths
    , paths = addIocPaths(scriptsPath);
    //add any paths in the entry's files property
    if(!!entry.files) {
      paths = paths.concat(entry.files);
    }
    return paths;
  }
  /**
  * Add the required ioc entries from the defaults
  * @function
  */
  function addIocPaths(scriptsPath) {
    //convert the iocPaths constants into real paths
    return defaults.module.iocPaths.map(function mapIocPaths(path) {
      return pathParser(scriptsPath, path).path;
    });
  }

  /**
  * @worker
  */
  return function ModuleCollector(base, entry) {
    //apply the defaults
    applyIf(defaults.entry.module, entry);
    //the return must be the default
    entry.return = defaults.entry.module.return;

    //set the repositories to the required branches
    var proc = type_module_checkoutRepositories(base, entry);

    //get the module file data
    proc = proc.then(function () {
        var modulePaths = getModulePaths(base, entry);
        //add the hints
        addRepoHints(entry);
        //if there are module paths, load the files
        if (!isEmpty(modulePaths)) {
            return loadModules(modulePaths);
        }
        return promise.resolve();
    });

    //merge all of the module objects
    proc = proc.then(function (modules) {
        //there could be a module object in the manifest entry, append to the end
        if (!!entry.module) {
            modules.push(entry.module);
        }
        return type_module_moduleMerger(modules);
    });

    return proc.then(function (module) {
        //update the entry module object
        entry.module = module;
        //augment the paths and set the files property
        entry.files = augmentPaths(base, entry);
        //start the file loading process
        return type_module_filePicker(base, entry);
    });

  };
}