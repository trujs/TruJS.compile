/**
* This factory produces a worker function that formats the test file, depending
* on the entry format
* @factory
*/
function _TestFormatter(promise, defaults, stringInsert) {
    var LN_END_PATT = /(\r?\n)/g;

    /**
    * @worker
    */
    return function TestFormatter(entry, files) {

        return new promise(function (resolve, reject) {
            try {
                if (files.length === 2) {
                    var fileUnderTest = files.pop().data
                    , rtrn = "return " + (entry.return || defaults.entry.module.return)
                    , value = "function () {\n" + fileUnderTest + "\n\t" + rtrn + ";\n}"
                    , futEntry = [
                        "{"
                        , "\"label\": \"module\""
                        , ", \"type\": \"singleton\""
                        , ", \"value\": " + JSON.stringify(value.replace(LN_END_PATT, "$1\t"))
                        , "}"
                    ].join("\n");

                    files[0].data = stringInsert(
                        files[0].data
                        , "," + futEntry
                        , files[0].data.length - 1
                    );
                }

                resolve(files);
            }
            catch(ex) {
                reject(ex);
            }
        });

    };
}