/**
* This factory produces a worker function that stiches all the files together.
* @factory
*/
function _SassAssembler(promise, fileObj) {
  var cnsts = {
    "defaultPath": "style.scss"
  };

  /**
  * Loops through the files, appending the data to the output file object
  * @function
  */
  function assemble(resolve, reject, files) {
    var data = []
    , outputFileObj;
    try {
      //loop through the files, append data to the data array
      files.forEach(function (file) {
        data.push(file.data);
      });

      //join the data array and create the file object
      outputFileObj = fileObj(cnsts.defaultPath, data.join("\n"));

      resolve([outputFileObj]);
    }
    catch(ex) {
      reject(ex);
    }
  }

  /**
  * @factory
  */
  return function SassAssembler(entry, files) {

    return new promise(function (resolve, reject) {
      assemble(resolve, reject, files);
    });

  };
}
