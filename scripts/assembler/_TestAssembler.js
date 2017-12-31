/**
* This factory produces a worker function that preps the manifest entry for
* processing by the JavaScript Assembler
* @factory
*/
function _TestAssembler(promise, getLineEnding, errors, defaults, nodePath, fileObj) {

  /**
  * Creates one large file with the test objects stitched together
  * @function
  */
  function stitchTest(resolve, reject, entry, files) {
    var lineEnding = getLineEnding(files[0].data)
    , isErr
    , path = entry.testFile || defaults.test.testFile
    , data = []
    ;
    //add a json object entry for each file
    files.forEach(function forEachFile(test) {
      if (!isErr) {
        //check for title or label
        if (!test.title && !test.label) {
          isErr=true;
          reject(new Error(errors.missingTestTitle));
          return;
        }

        //ensure there is a type
        test.type = test.type || defaults.test.testType;

        //add the test object
        data.push(
          "{" + lineEnding +
           (!!test.title && "\t\"title\": \"" + test.title + "\", "  + lineEnding || "") +
           (!!test.label && "\t\"label\": \"" + test.label + "\", "  + lineEnding || "") +
           "\t\"type\": \"" + test.type + "\", "  + lineEnding +
           "\t\"value\": " + test.data + lineEnding +
           "}"
        );
      }
    });

    //if there wasn't an error then join the data and resolve this one file
    if (!isErr) {
      //modify the file.data array to a string
      data = "[" + data.join(", ") + "]";

      resolve([fileObj(path, data)]);
    }
  }

  /**
  * @worker
  */
  return function TestAssembler(entry, files) {

    if (isEmpty(files)) {
        return promise.resolve([]);
    }

    return new promise(function (resolve, reject) {
        stitchTest(resolve, reject, entry, files);
    });

  };
}
