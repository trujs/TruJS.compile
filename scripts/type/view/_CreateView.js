/**
* Looks for all of the view.* files, adds any Javascript files to the
* controllers module entry, adds any html files to the templates module entry,
* and adds any css files to the styles module entry.
* @factory
*/
function _CreateView(promise, namer, regExForEachMatch, type_view_processTemplate, defaults) {
    var VIEW_PATT = /([.]|^)view[.](html|css|js)$/
    , me
    , cnsts = {
        "viewsDir": "views"
    }
    ;

    /**
    * Finds all of the view.* files
    * @function
    */
    function extractViews(resolve, reject, entry, files) {
        try {
            var views = {
                ".html": []
                , ".css": []
                , ".js": []
            };

            //loop through the files
            files.forEach(function forEachFile(fileObj) {
                if (VIEW_PATT.test(fileObj.file)) {
                    views[fileObj.ext].push(fileObj);
                }
            });

            resolve(views);
        }
        catch(ex) {
            reject(ex);
        }
    }
    /**
    * Adds all of the controllers to the module
    * @function
    */
    function processControllers(resolve, reject, entry, controllers) {
        try {
            var controllerEntries = [];

            //loop through the controllers
            controllers.forEach(function forEachCtrlr(ctrlr) {
                controllerEntries.push(resolveName(entry, ctrlr));
            });

            updateModule(entry.module, controllerEntries, "controllers");

            resolve();
        }
        catch(ex) {
            reject(ex);
        }
    }
    /**
    * Adds all the template files to the module
    * @function
    */
    function processTemplates(resolve, reject, entry, templates) {
        try {
            var templateEntries = [];

            //loop through the styles
            templates.forEach(function forEachTemp(template) {
                templateEntries.push(resolveName(entry, template));
            });

            updateModule(entry.module, templateEntries, "templates");

            resolve();
        }
        catch(ex) {
            reject(ex);
        }
    }
    /**
    * Adds all of the styles to the module
    * @function
    */
    function processStyles(resolve, reject, entry, styles) {
        try {
            var styleEntries = [];

            //loop through the styles
            styles.forEach(function forEachStyle(style) {
                styleEntries.push(resolveName(entry, style));
            });

            updateModule(entry.module, styleEntries, "styles");

            resolve();
        }
        catch(ex) {
            reject(ex);
        }
    }
    /**
    * Adds the templates to the templates module entry. Looks for tags that
    * could be other controllers.
    * @function
    */
    function extractControllers(entry, templates) {
        var procs = [];

        //loop through each template, load additional controllers
        templates.forEach(function forEachTemp(template) {
            procs.push(type_view_processTemplate(entry, template.data));
        });

        //process all the templates and then combine the file arrays
        return promise.all(procs);
    }
    /**
    * Create the views for the extracted controllers
    * @function
    */
    function createView(entry, results) {
        var files = results[0];
        for (var i = 1, l = results.length; i < l; i++) {
            files = files.concat(results[i]);
        }
        if (!!files && !isEmpty(files)) {
            return me(entry, files);
        }
        return promise.resolve([]);
    }
    /**
    * Creates the name
    * @function
    */
    function resolveName(entry, fileObj) {
        var naming = namer(entry.root, fileObj)
        , name = naming.name.replace(naming.namespace + ".", "")
        , ns = naming.namespace.replace(cnsts.viewsDir + ".", "")
        , segs = ns.split(".");

        if (name.indexOf("view") === 0) {
            name = segs.pop() + name.replace("view", "");
            ns = segs.join(".");
        }
        else {
            name = name.replace("view", "");
        }

        return ns + "." + name;
    }
    /**
    * Adds the entries to the module
    * @function
    */
    function updateModule(module, entries, type) {

        entries.forEach(function forEachEntry(entry) {
            var path = entry.toLowerCase()
            , segs = path.split(".")
            , scope = module
            , name = segs.pop();

            segs.splice(0, 0, type);

            segs.forEach(function forEachSeg(seg) {
                if (!scope.hasOwnProperty(seg)) {
                    scope[seg] = [{}];
                }
                scope = scope[seg][0];
            });

            if (type !== "controllers") {
                name = name.replace("css", "").replace("html", "");
                scope[name] = [entry, [], false];
            }
            else {
                scope[name] = [entry, [[".templates." + path], [".styles." + path]]];
            }
        });
    }

    /**
    * @worker
    */
    return me = function CreateView(entry, files) {
        var views;

        //get all of the view files
        var proc = new promise(function (resolve, reject) {
            extractViews(resolve, reject, entry, files);
        });

        //process the html templates
        proc = proc.then(function (results) {
            views = results;
            return new promise(function (resolve, reject) {
                processTemplates(resolve, reject, entry, views[".html"]);
            });
        });

        //process the css
        proc = proc.then(function () {
            return new promise(function (resolve, reject) {
                processStyles(resolve, reject, entry, views[".css"]);
            });
        });

        //process the js
        proc = proc.then(function () {
            return new promise(function (resolve, reject) {
                processControllers(resolve, reject, entry, views[".js"]);
            });
        });

        //find any controllers within the templates
        proc = proc.then(function () {
            return extractControllers(entry, views[".html"]);
        });

        //create a view for the extracted files
        proc = proc.then(function (results) {
            return createView(entry, results);
        });

        //add the extracted files to the files array
        return proc.then(function (results) {
            return promise.resolve(files.concat(results));
        });

    };
}