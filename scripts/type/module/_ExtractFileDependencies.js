/**
* This factory produces a worker function that extracts the dependencies
* annotation, looks through the entry module object for any dependencies that
* don't exist or that are in conflict (throwing an error if they are), and
* returns a temp module entry
* @factory
*/
function _ExtractFileDependencies(promise, errors, annotation, compileReporter) {
    var LD_PATT = /_/g
    , cnsts = {
        "annotationName": "dependencies"
    };

    /**
    * Checks the files for depenedency annotations and builds a list of them
    * @function
    */
    function extractDependencies(resolve, reject, module, files) {
        try {
            var newModule = {};

            files.forEach(function forEachFile(file) {
                var depends = isString(file.data) && extractFileAnnotation(file);
                if (!!depends) {
                    addModuleEntries(module, newModule, file.path, depends);
                }
            });

            resolve(newModule);
        }
        catch(ex) {
            reject(ex);
        }
    }
    /**
    * Extracts the file's dependency annotation
    * @function
    */
    function extractFileAnnotation(file) {
        var depends = annotation.lookup(cnsts.annotationName, file.data);
        file.data = annotation.remove(cnsts.annotationName, file.data);
        if (!!depends) {
            delete depends.$line;
            delete depends.$index;
        }
        return depends;
    }
    /**
    * Checks to see if the depends exist in the current module, if not it adds
    * them to the new module, if so, checks to see if the definitions conflit
    * @function
    */
    function addModuleEntries(curModule, newModule, path, dependencies) {
        Object.keys(dependencies)
        .forEach(function forEachDepend(key) {
            var dependEntry = dependencies[key]
            , moduleEntry;
            //add the entry to the new module
            if (!(moduleEntry = getEntry(key, newModule))) {
                if (!(moduleEntry = getEntry(key, curModule))) {
                    addEntry(key, dependEntry, newModule);
                }
            }
            //if we have a module entry here, it already exists, see if it
            //conflicts
            if (!!moduleEntry) {
                if (JSON.stringify(moduleEntry) !== JSON.stringify(dependEntry)) {
                    throw new Error(
                        errors.dependConflict
                        .replace("{key}", key)
                        .replace("{path}", path)
                    );
                }
            }
        });
    }
    /**
    * Looks for the path in the module, returning the entry if found, creating
    * the path and entry if create is true, and returning undefined if not found
    * @function
    */
    function getEntry(path, module) {
        var segs = path.split(LD_PATT)
        , lastIndx = segs.length -1
        , scope = module
        , entry;

        segs.every(function everySeg(seg, indx) {
            if (scope.hasOwnProperty(seg)) {
                if (indx === lastIndx) {
                    entry = scope[seg];
                }
                else {
                    scope = scope[seg][0];
                }
            }
            else {
                return false;
            }
            return true;
        });

        return entry;
    }
    /**
    * Adds an entry to the module, adding the path if missing, throwing an error
    * if there is an existing entry that conflicts
    * @function
    */
    function addEntry(key, entry, module) {
        var segs = key.split(LD_PATT)
        , lastIndx = segs.length -1
        , scope = module;

        segs.forEach(function forEachSeg(seg, indx) {
            if (scope.hasOwnProperty(seg)) {
                if (indx === lastIndx) {
                    entry = scope[seg];
                }
                else {
                    scope = scope[seg][0];
                }
            }
            else {
                if (indx === lastIndx) {
                    scope[seg] = entry;
                }
                else {
                    scope[seg] = [{}];
                    scope = scope[seg][0];
                }
            }
        });
    }

    /**
    * @worker
    */
    return function ExtractFileDependencies(module, files) {

        //get the dependency annotation and parameters for each file
        return new promise(function (resolve, reject) {
            extractDependencies(resolve, reject, module, files);
        });

    };
}