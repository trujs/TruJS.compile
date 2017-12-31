/**
*
* @factory
*/
function _CheckoutRepositories(promise, type_collection_repository) {
    var SEP_PATT = /[/\\]/;
    
    /**
    * Loops through the entry's repos property and checks out the branch's that
    * are required for the
    * @function
    */
    function checkoutRepositories(resolve, reject, base, entry) {
        var procs = []
        , repos = entry.repos || []
        , basePath = getWorkspacePath(base)
        ;

        //create all of the repo processes
        repos.forEach(function forEachRepo(repoObj) {
            var type = repoObj.type || "git"
            , dir = repoObj.isProject && "projects" || "repos"
            , path = basePath + "/" + dir
            , repo = type_collection_repository[type]
            ;
            procs.push(repo(path, repoObj));
        });

        //run all of the repo processes
        promise.all(procs)
        .then(function () {
            resolve();
        })
        .catch(function (ex) {
            reject(ex);
        });
    }
    /**
    * Extracts the workspace path from the base
    * @function
    */
    function getWorkspacePath(base) {
        var segs = base.split(SEP_PATT)
        , indx = segs.indexOf("repos");

        if (indx === -1) {
            indx = segs.indexOf("projects");
        }

        return segs.slice(0, indx).join("/");
    }

    /**
    * @worker
    */
    return function CheckoutRepositories(base, entry) {

        if (isArray(entry.repos)) {
            return  new Promise(function (resolve, reject) {
                checkoutRepositories(resolve, reject, base, entry);
            });
        }
        else {
            return promise.resolve();
        }

    };
}