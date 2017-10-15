/**
*
* @factory
*/
function _TestPostProcessor(promise, type_test_testIndex, stringApply, nodePath, fileObj) {

    /**
    * Merges the test index file with the entry and adds it as a file
    * @function
    */
    function createIndexFile(resolve, reject, entry, files) {
        try {
            if (entry.format === "browser")  {
                var data = stringApply(type_test_testIndex, entry)
                , path = "index.html"
                , file = fileObj(path, data)
                ;

                files.push(file);
            }

            resolve(files);
        }
        catch(ex) {
            reject(ex);
        }
    }

    /**
    * @worker
    */
    return function TestPostProcessor(entry, files) {

        return new promise(function (resolve, reject) {
            createIndexFile(resolve, reject, entry, files);
        });

    };
}