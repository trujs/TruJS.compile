/**
*
* @factory
*/
function _ViewPreProcessor(promise, namer, fileObj) {
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
    function createState(resolve, reject, entry, files) {

        try {
            var state = extractState(entry, files)
            , data = JSON.stringify(state)
            , naming = { "namespace": entry.name, "name": entry.stateName || cnsts.stateName }
            ;

            data = "/**[@naming(" + JSON.stringify(naming) + ")]*/\n" + data;

            files.push(fileObj(entry.stateName || cnsts.stateName, data));

            entry.module[entry.stateEntry || cnsts.stateEntry] =
                [ entry.name + "." + entry.stateName || cnsts.stateName, [], false];

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
                    .replace(TRIM_DOT_PATT, "$1")
                , name = naming.name
                    .replace(naming.namespace + ".", "")
                    .replace(cnsts.state, "")
                    .toLowerCase()
                , segs = namespace.split(".")
                , parent = state
                ;

                //ensure the parent exists
                if (!!namespace) {
                    //loop through the namespace segments
                    for (var i = 0, l = segs.length, e = l - 1; i < l; i++) {
                        segs[i] = segs[i].toLowerCase();
                        //skip anything that starts with views
                        if (i > 0 || segs[i] !== (entry.views || cnsts.views)) {
                            //if there wasn't a file name, and i is the last position
                            if (!name && i === e) {
                                name = segs[i];
                                break;
                            }
                            if (!parent.hasOwnProperty(segs[i])) {
                                parent[segs[i]] = {};
                            }
                            parent = parent[segs[i]];
                        }
                    }
                }

                if (!name) {
                    name = cnsts.state;
                }

                if (name === cnsts.state) {
                    apply(obj, state);
                }
                else {
                    parent[name] = obj;
                }

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