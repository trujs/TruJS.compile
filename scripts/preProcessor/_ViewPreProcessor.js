/**
*
* @factory
*/
function _ViewPreProcessor(promise, type_view_createState, type_view_createView) {

    /**
    * @worker
    */
    return function ViewPreProcessor(entry, files) {

        //extract the state files
        var procs = type_view_createState(entry, files);

        //extract the views
        return procs.then(function (files) {
            return type_view_createView(entry, files);
        });

    };
}