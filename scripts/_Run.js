/**
* This factory produces a worker function that takes a command line arguments
* object and determines the base and manifest path, loads the manifest, and
* runs the compiler
* @factory
*/
function _Run(promise, nodeFs, nodePath, compiler, defaults, nodeDirName, nodeProcess, getEntryArg) {
  var cnsts = {
    "manifest": "manifest.json"
    , "manifestDir": "{script}/manifest.json"
  };

  /**
  * Uses the command line arguments to determine the base and manifest paths and
  * then loads the
  * @function
  */
  function processArgs(resolve, reject, cmdArgs) {
    var manPath = getManifestPath(cmdArgs)
    , basePath = getBasePath(cmdArgs, manPath)
    , entry = getEntryArg(cmdArgs)
    , settings = {
      "basePath": basePath
      , "manPath": manPath
      , "entry": entry
    }
    ;
    //set the repo tag
    if (cmdArgs.repos === "false") {
        entry.norepos = true;
    }
    resolve(settings);
  }
  /**
  * Resolves the manifest path
  * @function
  */
  function getManifestPath(cmdArgs) {
    //get the manifest path
    var manPath = cmdArgs.manifest || defaults.manifest.manifestDir;

    if (nodePath.extname(manPath) !== ".json") {
      manPath = nodePath.join(manPath, defaults.manifest.manifestFile);
    }
    manPath = resolvePathSpecials(manPath);
    manPath = nodePath.resolve(manPath);
    if(!nodePath.isAbsolute(manPath)) {
      manPath = nodePath.join(basePath, manPath);
    }
    return manPath;
  }
  /**
  * Resolves the path that the scripts will originate from. If no cmd arg was
  * specified then use the manifest path
  * @function
  */
  function getBasePath(cmdArgs, manPath) {
    var basePath = cmdArgs.base || nodePath.dirname(manPath);
    basePath = resolvePathSpecials(basePath);
    return basePath;
  }
  /**
  * Replaces the {script} and {cwd} values with __dirname and process.cwd()
  * respectively
  * @function
  * @param {string} path The path to inspect and replace
  */
  function resolvePathSpecials(path) {
    return path
      .replace(/\{script\}/, nodeDirName)
      .replace(/\{cwd\}/, nodeProcess.cwd())
      .replace(/\{projects\}/, nodePath.join(nodeProcess.cwd(), "projects"))
      .replace(/\{repos\}/, nodePath.join(nodeProcess.cwd(), "repos"))
      ;
  }
  /**
  * Loads the manifest file
  * @function
  */
  function loadManifestFile(resolve, reject, settings) {
    nodeFs.readFile(settings.manPath, { "encoding": "utf8" }, readFileCb);

    function readFileCb(err, data) {
      if (!!err) {
        reject(err);
      }
      else {
        parseData(data);
      }
    }

    function parseData(data) {
      try {
        var manifest = JSON.parse(data);
        settings.manifest = processManifest(manifest);
        resolve(settings);
      }
      catch(ex) {
        reject(ex);
      }
    }
  }
  /**
  * Extracts the manifest entries and merges all other properties to each entry
  * @function
  */
  function processManifest(manifest) {

      if (!isArray(manifest)) {
          var entries = manifest.entries;
          delete manifest.entries;

          entries.forEach(function forEachEntry(entry) {
              update(entry, manifest);
          });

          return entries;
      }

      return manifest;
  }
  /**
  * Uses the entry setting to filter the manifest array
  * @function
  */
  function filterManifest(resolve, reject, settings) {
    if (settings.entry !== "all") {
      settings.manifest = settings.manifest.filter(function filterManifest(entry, indx) {
        if (settings.entry.indexOf(indx + '') !== -1) {
          return true;
        }
      });
    }

    resolve(settings);
  }

  /**
  * @worker
  */
  return function Run(cmdArgs) {

    //parse the command args
    var proc = new promise(function (resolve, reject) {
      processArgs(resolve, reject, cmdArgs);
    });

    //load the manifest file
    proc = proc.then(function (settings) {
      return new promise(function (resolve, reject) {
        loadManifestFile(resolve, reject, settings);
      });
    });

    //filter manifest
    proc = proc.then(function (settings) {
      return new promise(function (resolve, reject) {
        filterManifest(resolve, reject, settings);
      });
    });

    //execute the compiler
    return proc.then(function (settings) {
      return compiler(settings.basePath, settings.manifest);
    });

  };
}