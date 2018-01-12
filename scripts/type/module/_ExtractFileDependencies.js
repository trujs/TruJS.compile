/**
* This factory produces a worker function that extracts the dependencies
* annotation, looks through the entry module object for any dependencies that
* don't exist or that are in conflict (throwing an error if they are), and
* returns a temp module entry
* @factory
*/
function _ExtractFileDependencies(promise, errors, annotation) {
    var LD_PATT = /_/g
    , cnsts = {
        "annotationName": "dependencies"
    };

    /**
    * Checks the files for depenedency annotations and builds a list of them
    * @function
    */
    function extractAnnotations(resolve, reject, files) {
        try {
            var fileDependObjs = [];

            files.forEach(function forEachFile(file) {
                var depends = extractFileAnnotation(file);
                if (!!depends) {
                    fileDependObjs.push({
                        "path": file.path
                        , "dependencies": depends
                    });
                }
            });

            resolve(fileDependObjs);
        }
        catch(ex) {
            reject(ex);
        }
    }
    /**
    *
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
    * Filters out any dependencies that already exist or are duplicates
    * @function
    */
    function createModule(resolve, reject, entry, fileDependObj) {
        try {
            var module = {};

            fileDependObj.forEach(function forEachDepend(fileDependObj) {
                var path = fileDependObj.path
                , dependencies = fileDependObj.dependencies;

                //check each dependency on the filDependObj.dependencies
                Object.keys(dependencies)
                .forEach(function forEachFdo(key) {
                    var dependEntry = fileDependObj.dependencies[key]
                    , existEntry = getEntry(key, entry.module)
                        || getEntry(key, module);
                    if (!existEntry) {
                        addEntry(key, dependEntry, module);
                    }
                    else if (JSON.stringify(existEntry) !== JSON.stringify(dependEntry)) {
                        throw new Error(
                            errors.dependConflict
                            .replace("{key}", "key")
                            .replace("{path}", "path")
                        );
                    }
                });
            });

            resolve(module);
        }
        catch(ex) {
            reject(ex);
        }
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
    return function ExtractFileDependencies(base, entry, files) {

        //get the dependency annotation and parameters for each file
        var proc = new promise(function (resolve, reject) {
            extractAnnotations(resolve, reject, files);
        });

        //remove any of the dependencies that exist already
        return proc.then(function (dependencies) {
            return new promise(function (resolve, reject) {
                createModule(resolve, reject, entry, dependencies);
            });
        });

    };
}