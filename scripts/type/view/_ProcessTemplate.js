/**
* Extracts controller names from the html and loads the files
* @factory
*/
function _ProcessTemplate(promise, regExForEachMatch, collector_collection) {
    var TAG_PATT = /<([A-z0-9-_]+)( [^>]+)?>/gm
    , ID_PATT = /id ?= ?("|')([^\1]+?)(?:\1)/
    , LCL_PATT = /^c[-.]/
    , LCL_END_PATT = /\/c[-]/g
    , cnsts = {
        "viewFiles": [
            "*.view.html"
            , "view.html"
            , "*.view.css"
            , "view.css"
            , "*.view.js"
            , "view.js"
            , "*.state.json"
            , "state.json"
        ]
    };

    /**
    * Finds html tags that have a hint
    * @function
    */
    function extractControllers(resolve, reject, entry, view) {
        try {
            var cntrlrs = [];

            view.template.data = view.template.data
            .replace(TAG_PATT, function (val) {
                //convert the tag name to a object path
                var tag = arguments[1]
                    .replace(LCL_PATT, "")
                , tagName = arguments[1]
                    .replace(/-/g, ".")
                    .replace(LCL_PATT, entry.name + ".")
                , id = getId(tagName, arguments[2])
                , attribs = modifyAttribs(tag, arguments[2])
                , namespace;

                //look for a hint that matches
                Object.keys(entry.hints).every(function everyHint(hint) {
                    //check the hint
                    if (tagName.indexOf(hint) !== -1) {
                        namespace = hint;
                        return false;
                    }
                    return true;
                });

                //if we found a namespace then add the controller
                if (!!namespace) {
                    //see if the controller already is in the list
                    if (cntrlrs.indexOf(tagName) === -1) {
                        cntrlrs.push({
                            "name": tagName
                            , "id": id
                            , "namespace": namespace
                            , "basePath": entry.hints[namespace]
                        });
                    }

                    return "<" + tag + " " + attribs + ">";
                }

                return arguments[0];
            });

            view.template.data = view.template.data.replace(LCL_END_PATT, "/");

            resolve(cntrlrs);
        }
        catch(ex) {
            reject(ex);
        }
    }
    /**
    * Extracts the id property from the attributes string
    * @function
    */
    function getId(tagName, attributeStr) {
        var id = tagName;

        //see if there  is an id attribute
        if(!!attributeStr) {
            regExForEachMatch(ID_PATT, attributeStr, function(match) {
                id =  match[2];
            });
        }

        if (!!id) {
            id = id.split("-")
            .map(function (val, indx) {
                if (indx > 0) {
                    val = val.substring(0, 1).toUpperCase() +
                        val.substring(1);
                }
                return val;
            })
            .join("");
        }

        return id;
    }
    /**
    * Adds/updates the id attribute
    * @function
    */
    function modifyAttribs(id, tagName, attribsStr) {
        var id;

        attribsStr = attribsStr || "";

        attribsStr = attribsStr
        .replace(ID_PATT, function forEachAttr() {
            id = arguments[2];
            return "";
        });

        if (!id) {
            id = tagName;
        }

        return "id=\"" + id + "\"" + attribsStr;
    }
    /**
    * Create a temporary module and run the collector
    * @function
    */
    function loadFiles(entry, controllers) {
        var procs = [];

        controllers.forEach(function forEachCtrl(ctrl) {
            if (ctrl.namespace !== entry.name) {
                var tempEntry = {
                    "files": createFilePaths(ctrl)
                    , "scripts": entry.scripts
                };
                procs.push(collector_collection("", tempEntry));
            }
        });

        return promise.all(procs)
            .then(function (results) {
                //add the files to each controller
                updateControllers(controllers, results);
                return promise.resolve(controllers);
            });
    }
    /**
    * Creates the view paths for each controller
    * @function
    */
    function createFilePaths(controller) {
        var files = []
        , name = controller.name.replace(controller.namespace + ".", "")
        , path = "+" + controller.basePath + "/*" + name.replace(/[.]/g, "/");

        cnsts.viewFiles.forEach(function forEachView(view) {
            files.push(path + "/" + view);
        });

        return files;
    }
    /**
    * Adds the files from the results array to the associated controller
    * @function
    */
    function updateControllers(controllers, results) {
        controllers.forEach(function forEachCtrl(ctrl, indx) {
            ctrl.files = results[indx];
        });
    }

    /**
    * @worker
    */
    return function ProcessTemplate(entry, view) {
        var controllers;

        //get the controllers from the html
        var proc = new promise(function (resolve, reject) {
            extractControllers(resolve, reject, entry, view);
        });

        //get the controller files for the found controllers
        return proc.then(function (results) {
            controllers = results;
            return loadFiles(entry, controllers);
        });

    };
}