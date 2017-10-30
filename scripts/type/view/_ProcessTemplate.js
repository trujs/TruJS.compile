/**
* Extracts controller names from the html and loads the files
* @factory
*/
function _ProcessTemplate(promise, regExForEachMatch, collector_collection) {
    var TAG_PATT = /<([A-z0-9-_]+)(?: [^>]+)?>/g
    , viewFiles = [
        "*.view.html"
        , "view.html"
        , "*.view.css"
        , "view.css"
        , "*.view.js"
        , "view.js"
    ];

    /**
    * Finds html tags that have a hint
    * @function
    */
    function extractControllers(resolve, reject, entry, html) {
        try {
            var cntrlrs = [];

            regExForEachMatch(TAG_PATT, html, function (match) {
                //convert the tag name to a object path
                var tagName = match[1].replace(/-/g, ".");;
                //look for a hint that matches
                Object.keys(entry.hints).every(function everyHint(hint) {
                    //check the hint
                    if (tagName.indexOf(hint) !== -1) {
                        //see if the controller already is in the list
                        if (cntrlrs.indexOf(tagName) === -1) {
                            //see if the controller is already in the module
                            if (!hasController(entry, tagName)) {
                                cntrlrs.push({
                                    "name": tagName
                                    , "namespace": hint
                                    , "basePath": entry.hints[hint]
                                });
                            }
                        }
                        return false;
                    }
                    return true;
                });
            });

            resolve(cntrlrs);
        }
        catch(ex) {
            reject(ex);
        }
    }
    /**
    * Checks the module to see if we've already got this controller
    * @function
    */
    function hasController(entry, controller) {
        if (!entry.module.views) {
            return;
        }
        var segs = controller.toLowerCase().split(".")
        , scope = entry.module.views[0];

        segs.every(function everySeg(seg) {
            if (scope.hasOwnProperty(seg)) {
                scope = scope[seg][0];
            }
            else {
                scope = null;
            }
            if (!!scope) {
                return true;
            }
        });

        return !!scope;
    }
    /**
    * Create a temporary module and run the collector
    * @function
    */
    function loadFiles(entry, controllers) {
        var tempEntry = {
            "files": createFilePaths(controllers)
        };

        return collector_collection("", tempEntry);
    }
    /**
    * Creates the view paths for each controller
    * @function
    */
    function createFilePaths(controllers) {
        var files = [];

        controllers.forEach(function forEachCtrl(ctrl) {
            var name = ctrl.name.replace(ctrl.namespace + ".", "")
            , path = ctrl.basePath + "/" + name.replace(/[.]/g, "/");

            viewFiles.forEach(function forEachView(view) {
                files.push(path + "/" + view);
            });
        });

        return files;
    }

    /**
    * @worker
    */
    return function ProcessTemplate(entry, html) {
        var controllers;

        //get the controllers from the html
        var proc = new promise(function (resolve, reject) {
            extractControllers(resolve, reject, entry, html);
        });

        //get the controller files for the found controllers
        return proc.then(function (results) {
            controllers = results;
            return loadFiles(entry, controllers);
        });

    };
}