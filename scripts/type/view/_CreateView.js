/**
* Looks for all of the view.* files, adds any Javascript files to the
* controllers module entry, adds any html files to the templates module entry,
* and adds any css files to the styles module entry.
* @factory
*/
function _CreateView(promise, namer, regExForEachMatch, type_view_processTemplate, defaults) {
    var VIEW_PATT = /([.]|^)(view[.](html|css|js)|state[.]json)$/
    , SEP_PATT = /[\/\\]/g
    , REP_PATT = /[.]((default[.])?state|view)$/
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
                "$idRef": {}
            };

            //loop through the files
            files.forEach(function forEachFile(fileObj, indx) {
                if (VIEW_PATT.test(fileObj.file)) {
                    //get the asset name and namespace
                    var naming = namer(entry.root, fileObj, entry.scripts)
                    , name = naming.name
                        .replace(naming.namespace + ".", "")
                        .replace(/(Html|Css)$/, "")
                    , path = (naming.namespace)
                    , view = views[path]
                    ;

                    //add the named property
                    if (!views.hasOwnProperty(path)) {
                        view = views[path] = {};
                    }

                    //disposition the file
                    if (fileObj.ext === ".html") {
                        view.template = fileObj;
                    }
                    else if (fileObj.ext === ".css") {
                        view.style = true;
                    }
                    else if (fileObj.ext === ".js") {
                        view.controller = true;
                    }
                    else if (fileObj.ext === ".json") {
                        fileObj.isState = true;
                        if (name === "default.state") {
                            view.default = fileObj.data;
                        }
                        else {
                            view.state = fileObj.data;
                        }
                    }
                }
            });

            resolve(views);
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
    function extractControllers(entry, files, views) {
        var procs = [];

        //loop through the templates
        Object.keys(views).forEach(function forEachTmpl(key) {
            if (!!views[key].template) {
                procs.push(processTemplate(entry, files, views, key));
            }
        });

        return promise.all(procs)
        .then(function () {
            return promise.resolve(views);
        });
    }
    /**
    * Gets any new files from the template, creates the views and updates the
    *  views
    * @function
    */
    function processTemplate(entry, files, views, key) {
        return type_view_processTemplate(entry, views[key])
        .then(function (tmpls) {
            if (!isEmpty(tmpls)) {
                return createTemplateViews(entry, files, views, tmpls, key);
            }
            return promise.resolve(views);
        });
    }
    /**
    * Create the views object for each template and append them to the parent
    *  views
    * @function
    */
    function createTemplateViews(entry, files, views, tmpls, key) {
        var procs = [];

        tmpls.forEach(function forEachTpl(tpl) {
            //add the id to the reference
            views["$idRef"][key + "." + tpl.id] = {
                "id": tpl.id
                , "type": tpl.name
                , "parent": key
            };
            //if we have any files then append them
            if(!!tpl.files) {
                //remove any files that already exist
                var tmplFiles = filterFiles(files, tpl);
                //add the remaining files to the files array
                appendFiles(files, tmplFiles);
                //run the create view for these files
                procs.push(me(entry, tmplFiles));
            }
        });

        return promise.all(procs)
        .then(function (tmplViews) {
            tmplViews.forEach(function forEachView(tmplView) {
                update(views, tmplView);
            });
            return promise.resolve(views);
        });
    }
    /**
    * filters out any files that already exist
    * @function
    */
    function filterFiles(files, tmpl) {
        var newFiles = [];

        tmpl.files.forEach(function forEachFile(fileObj) {
            if (!files.find(function (fo) { return fo.path === fileObj.path; })) {
                newFiles.push(fileObj);
            }
        });

        return newFiles;
    }
    /**
    * Add the filtered files to the files array
    * @function
    */
    function appendFiles(files, tmplFiles) {
        tmplFiles.forEach(function forEachFile(fileObj) {
            files.push(fileObj);
        });
    }

    /**
    * @worker
    */
    return me = function CreateView(entry, files) {

        //get all of the view files
        var proc = new promise(function (resolve, reject) {
            extractViews(resolve, reject, entry, files);
        });

        //find any controllers within the templates
        return proc.then(function (views) {
            return extractControllers(entry, files, views);
        });

    };
}