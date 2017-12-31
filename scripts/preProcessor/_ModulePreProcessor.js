/**
* This factory creates a worker function that pre-processes module entries. It
* adds the module entry to the array of files
* @factory
*/
function _ModulePreProcessor(promise, getLineEnding, annotation, funcInspector, preProcessor_javascript) {
    var LN_END_PATT = /(\r?\n)/g
    , NAME_PATT = /{name}/g
    , DEPENDS_PATT = /{depends}/g
    , FUNC_PATT = /{func}/g
    , ALIAS_PATT = /{alias}/g
    , cnsts = {
        "dependenciesAlias": "$dependencies"
        , "wrapper": [
            "(function() {"
            , "\t{func}"
            , "\t{name}.{alias} = {depends};"
            , "\treturn {name};"
            , "})();"
        ].join("\n")
    };

    /**
    * Adds a $dependencies property to the factory function
    * @function
    */
    function addDependsProperty(resolve, reject, entry, files) {
        try {
            //loop through the files
            files.forEach(function forEachFile(fileObj) {
                var naming = annotation.lookup("naming", fileObj.data)
                , funcInfo = getFuncInfo(fileObj.data)
                , params = !!funcInfo && funcInfo.params
                , name = !!funcInfo && funcInfo.name;

                if (!!params && (!naming || !naming.skip)) {
                    fileObj.data = cnsts.wrapper
                    .replace(NAME_PATT, name)
                    .replace(ALIAS_PATT, cnsts.dependenciesAlias)
                    .replace(DEPENDS_PATT, JSON.stringify(params))
                    .replace(FUNC_PATT, fileObj.data.replace(LN_END_PATT, "$1\t"))
                }
            });

            resolve();
        }
        catch(ex) {
            reject(ex);
        }
    }
    /**
    * Gets the parameters from the factory function, returns an null if the file
    * is not a factory function, and an empty array if there are no parameters
    * @function
    */
    function getFuncInfo(data) {
        try {
            return funcInspector(data);
        }
        catch(ex) {
            return null;
        }
    }
    /**
    * Add the container file
    * @function
    */
    function addContainer(resolve, reject, entry, files) {
        try {
            //stitch the files together and use the data to determine the line ending
            var lineEnding = getLineEnding(files.map(function (f) { return f.data; }).join(" "));

            //create the module file and add it to the files array
            var file = {
              "name": "module"
              , "ext": ".js"
              , "file": "module.js"
              , data: "/**[@naming({ \"skip\": true })]*/" + lineEnding +
                      "/* The IOC Container */" + lineEnding +
                      "var " + entry.return + " = TruJS.ioc.Container(" + JSON.stringify(entry.module) + ");"
            };
            files.push(file);

            resolve();
        }
        catch(ex) {
            reject(ex);
        }
    }

    /**
    * @worker
    * @param {object} entry A manifest entry object
    * @param {array} files An array of file objects
    */
    return function ModulePreProcessor(entry, files) {

        //add the dependencies property to the factory
        var proc = new promise(function (resolve, reject) {
            addDependsProperty(resolve, reject, entry, files);
        });

        //apply the defaults and create the container file
        proc = proc.then(function () {
            return new promise(function (resolve, reject) {
                addContainer(resolve, reject, entry, files);
            });
        });

        //run the javascript pre-processor
        return proc.then(function () {
            return preProcessor_javascript(entry, files);
        });
    };
}