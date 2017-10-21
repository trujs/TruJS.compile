/**
*
* @factory
*/
function _ViewPreProcessor(promise, namer, fileObj) {
    var STATE_PATT = /[.]state[.]json$/
    , cnsts = {
        "stateEntry": "$state"
        , "stateName": "$State"
    };

    /**
    * Pops all the *.state.json files, combines the data into one state object
    * and adds that to the files array and module
    * @function
    */
    function createState(resolve, reject, entry, files) {

        try {
            var state = extractState(entry, files)
            , data = JSON.stringify(state)
            , naming = { "namespace": entry.name, "name": cnsts.stateName }
            ;

            data = "/**[@naming(" + JSON.stringify(naming) + ")]*/\n" + data;

            files.push(fileObj(cnsts.stateName, data));

            entry.module[cnsts.stateEntry] =
                [ entry.name + "." + cnsts.stateName, [], false];

            resolve(files);
        }
        catch(ex) {
            reject(ex);
        }
    }
    /**
    * Looks through the files array for *.state.json files
    * @function
    */
    function extractState(entry, files) {
        var state = {}, indxs = [];

        files.forEach(function forEachFile(fileObj, indx) {
            if(STATE_PATT.test(fileObj.file)) {
                var obj = JSON.parse(fileObj.data)
                , naming = namer(entry.root, fileObj)
                , namespace = naming.namespace
                    .replace(entry.name, "")
                , name = naming.name
                    .replace(naming.namespace + ".", "")
                    .replace(".state", "")
                , segs = namespace.split(".")
                , parent = state
                ;

                //ensure the parent exists
                for (var i = 0, l = segs.length; i < l; i++) {
                    if (!!segs[i]) {
                        if (!parent.hasOwnProperty(segs[i])) {
                            parent[segs[i]] = {};
                        }
                        parent = parent[segs[i]];
                    }
                }

                parent[name] = obj;

                indxs.push(indx);
            }
        });

        //remove the files
        indxs.reverse();
        indxs.forEach(function forEachIndx(indx) {
            files.splice(indx, 1);
        });

        return state;
    }

    /**
    * @worker
    */
    return function ViewPreProcessor(entry, files) {

        //extract the state files
        return new promise(function (resolve, reject) {
            createState(resolve, reject, entry, files);
        });

    };
}