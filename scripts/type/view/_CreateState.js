/**
* Looks for all of the .state.json files, extracts the namespace and name,
* deserializes the data, adds it to the state object, removes the files, createState
* a state file and module entry.
* @factory
*/
function _CreateState(promise, namer, fileObj) {
    var STATE_PATT = /([.]|^)state[.]json$/
    , TRIM_DOT_PATT = /^[.]+(.*)$/
    , cnsts = {
        "stateEntry": "$state"
        , "stateName": "$State"
        , "views": "views"
        , "state": "state"
    };

    /**
    * Pops all the *.state.json files, combines the data into one state object
    * and adds that to the files array and module
    * @function
    */
    function createState(resolve, reject, entry, views) {
        try {
            var main = entry.name + ".views"
            , state = JSON.parse(!!views[main] && views[main].state || "{}")
            , keys = Object.keys(views)
            , idRef = views["$idRef"];

            //remove the id ref
            keys.splice(keys.indexOf("$idRef"), 1);

            //process each key
            keys.forEach(function forEachView(key) {
                var view = views[key], scope, def;
                //skip the root entry
                if (key !== main) {
                    //if there is an id ref match then get the type default
                    if (!!idRef[key]) {
                        def = views[idRef[key].type].default;
                    }
                    if (key.indexOf(entry.name) === 0) {
                        key = key.replace(entry.name + ".", "");
                    }
                    key = key.replace(/^views[.]?/, "");

                    //convert the name to camel case
                    //key = key.split(".")
                    //    .map(function mapKey(val) {
                    //        return val;
                    //    })
                    //    .join(".");
                    // removed this because we should honor the case the user
                    // used in the file path

                    if (!!def) {
                        scope = resolvePath(key, state, true);
                        scope.parent[scope.index] =
                            merge(scope.value, JSON.parse(def));
                    }
                    if (!isNill(view.state)) {
                        scope = resolvePath(key, state, true);
                        scope.parent[scope.index] =
                            merge(JSON.parse(view.state), scope.value);
                    }
                }
            });

            resolve(state);
        }
        catch(ex) {
            reject(ex);
        }
    }
    /**
    * Creates the state file and adds it to the files array
    * @function
    */
    function addState(resolve, reject, entry, files, state) {
        try {
            var path = entry.name + "/$$state$$.json"
            , file = fileObj(path, JSON.stringify(state));

            files.push(file);

            entry.module["state"] = [".simpleWatcher", [[":Magnetic.$$state$$"], null]];

            resolve();
        }
        catch(ex) {
            reject(ex);
        }
    }

    /**
    * @worker
    */
    return function CreateState(entry, files, views) {

        var proc = new promise(function (resolve, reject) {
            return createState(resolve, reject, entry, views);
        });

        return proc.then(function (state) {
            return new promise(function (resolve, reject) {
                addState(resolve, reject, entry, files, state);
            });
        });

    };
}