/**
*
* factory
*/
function _UpdateModule(promise) {
    var cnsts = {
        "defaultCtrl": ".simpleDefaultController"
    }
    ;

    /**
    * Adds the views entries to the module
    * @function
    */
    function updateModule(resolve, reject, entry, views) {
        var module = entry.module
        , keys = Object.keys(views);

        //remove the ide ref property
        keys.splice(keys.indexOf("$idRef"), 1);

        if (!module.hasOwnProperty("templates")) {
            module.templates = [{}];
        }
        if (!module.hasOwnProperty("styles")) {
            module.styles = [{}];
        }
        if (!module.hasOwnProperty("controllers")) {
            module.controllers = [{}];
        }

        try {
            //add a module entry for each view
            keys.forEach(function forEachView(key) {
                var view = views[key]
                , segs = key.split(".")
                , path
                , template = "\b"
                , style = "\b"
                , indx
                ;
                //don't use the project root namespace
                if (segs[0] === entry.name) {
                    segs.splice(0, 1);
                }
                //leave out the views segment
                if ((indx = segs.indexOf("views")) !== -1) {
                    segs.splice(indx, 1);
                }

                path = segs.concat("view").join(".").toLowerCase();

                if (!isNill(view.template)) {
                    createModuleEntry(entry, module.templates[0], segs)["view"] =
                    [key + ".viewHtml", [], false];
                    template = [".templates." + path];
                }
                if (!!view.style) {
                    createModuleEntry(entry, module.styles[0], segs)["view"] =
                    [key + ".viewCss", [], false];
                    style = [".styles." + path];
                }

                if (!view.controller) {
                    createModuleEntry(entry, module.controllers[0], segs)["view"] =
                    [cnsts.defaultCtrl, [template, style]];
                }
                else {
                    createModuleEntry(entry, module.controllers[0], segs)["view"] =
                    [key + ".view", [template, style]];
                }
            });

            resolve();
        }
        catch (ex) {
            reject(ex);
        }
    }
    /**
    * Creates the module entry for the path
    * @function
    */
    function createModuleEntry(entry, scope, segs) {
        //ensure the path exists
        segs.forEach(function forEachSeg(seg) {
            seg = seg.toLowerCase();
            if (!scope.hasOwnProperty(seg)) {
                scope[seg] = [{}];
            }
            scope = scope[seg][0];
        });

        return scope;
    }

    /**
    * @worker
    */
    return function UpdateModule(entry, views) {

        return new promise(function (resolve, reject) {
            updateModule(resolve, reject, entry, views);
        });

    };
}