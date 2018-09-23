/**
* This factory produces a worker function that, when passed a repo object,
* ensures the repo is cloned, and that it is on the branch specified
* @factory
*/
function _GitRepo(promise, nodeFs, type_collection_gitDriver) {

    /**
    * Checks to see if the repo directory exists
    * @function
    */
    function checkForDirectory(resolve, reject, path) {
        nodeFs.stat(path, function(err, stat) {
          if (!!err) {
              resolve(false);
          }
          else {
              resolve(stat.isDirectory());
          }
        });
    }

    /**
    * @worker
    */
    return function GitRepo(basePath, repoObj) {
        //see if the directory exists
        var proc = new promise(function (resolve, reject) {
            checkForDirectory(resolve, reject, basePath + "/" + repoObj.name);
        });
        //if the directory does not exist then clone
        proc = proc.then(function (isDirectory) {
            return new promise(function (resolve, reject) {
                if(!isDirectory) {
                    var git = type_collection_gitDriver(basePath);
                    git.clone(repoObj.url, basePath + "/" + repoObj.name, [], function (err) {
                        if (!!err) {
                            reject(err);
                        }
                        else {
                            resolve();
                        }
                    });
                }
                else {
                    resolve();
                }
            });
        });
        //do a pull to get any branches and updates
        proc = proc.then(function () {
            var git = type_collection_gitDriver(basePath + "/" + repoObj.name);
            return new promise(function (resolve, reject) {
                git.fetch("--all", function (err) {
                    if (!!err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            });
        });
        //checkout the branch
        return proc.then(function () {
            return new promise(function (resolve, reject) {
                var git = type_collection_gitDriver(basePath + "/" + repoObj.name);
                git.checkout(repoObj.branch, function (err) {
                    if (!!err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            });
        });
    };
}