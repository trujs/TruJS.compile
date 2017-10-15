/**
* This factory produces a worker function that formats the test file, depending
* on the entry format
* @factory
*/
function _TestFormatter(promise) {

    /**
    * @worker
    */
    return function TestFormatter(entry, files) {

        return new promise(function (resolve, reject) {
            try {
                if (entry.format === "browser") {
                    files[0].ext = ".js";
                    files[0].data = "TruJSTest('.testPackage').init(" + files[0].data + ");";
                }
                else if (entry.format === "node") {
                    files[0].ext = ".json";
                }
                files[0].file = files[0].name + files[0].ext;

                resolve(files);
            }
            catch(ex) {
                reject(ex);
            }
        });

    };
}