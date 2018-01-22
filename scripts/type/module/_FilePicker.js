/**
*
* @factory
*/
function _FilePicker(promise, getScriptsDir, collector_collection, type_module_moduleFileProcessor, type_module_modulePathProcessor, type_module_extractFileDependencies) {
    var worker;

    /**
    * @worker
    */
    return worker = function FilePicker(base, entry) {

        //use the module to get the list of file paths
        var files, proc = type_module_moduleFileProcessor(entry);

        //determine the file type and verify the paths iteratively
        proc = proc.then(function (pathsObj) {
          return type_module_modulePathProcessor(getScriptsDir(base, entry), pathsObj);
        });

        //use the collection collector to load the files
        proc = proc.then(function (paths) {
          entry.files = entry.files.concat(paths);
          //console.log(entry.files);
          //pass the buck to the standard collection collector
          return collector_collection(base, entry);
        });

        //inspect the files for dependencies
        proc = proc.then(function (results) {
            files = results;
            return type_module_extractFileDependencies(entry.module, files);
        });

        //run the picker for the found dependencies
        proc = proc.then(function (tempModule) {
            if (!isEmpty(tempModule)) {
                var tempEntry = copy(entry);
                tempEntry.module = apply(tempModule, entry.module);
                return worker(base, tempEntry);
            }
            else {
                return promise.resolve([]);
            }
        });

        //combine the files and results
        return proc.then(function (moreFiles) {
            return promise.resolve(files.concat(moreFiles));
        });

    };
}