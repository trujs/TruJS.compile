/**
*
* @factory
*/
function _ViewPreProcessor(promise, type_view_updateModule, type_view_createView, type_view_createState, preProcessor_module) {

    /**
    * Removes the state files from the array
    * @function
    */
    function removeStateFiles(resolve, reject, files) {
        try {
            var delIndx = [];

            files.forEach(function forEachFile(fileObj, indx) {
                if (fileObj.isState) {
                    delIndx.push(indx);
                }
            });

            delIndx.reverse();
            delIndx.forEach(function forEachIndx(indx) {
                files.splice(indx, 1);
            });

            resolve();
        }
        catch(ex) {
            reject(ex);
        }

    }

    /**
    * @worker
    */
    return function ViewPreProcessor(entry, files) {
        var views;

        //extract the views
        var proc = type_view_createView(entry, files);

        //update the module
        proc = proc.then(function (results) {
            views = results;//console.log(views);
            return type_view_updateModule(entry, views);
        });

        //remove the state files
        proc = proc.then(function () {
            return new promise(function (resolve, reject) {
                removeStateFiles(resolve, reject, files);
            });
        });

        //create the state object
        proc = proc.then(function () {
            return type_view_createState(entry, files, views);
        });

        return proc.then(function () {
            return preProcessor_module(entry, files);
        });
    };
}