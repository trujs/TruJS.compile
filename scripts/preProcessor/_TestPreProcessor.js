/**
* This factory produces a worker function that processes TruJS test files,
* extracting all test and setup entries using the @test annotation.
*
* @factory
*/
function _TestPreProcessor(promise, annotation, defaults, stringTrim, nodePath, fileObj) {

  /**
  * Loops through each file, extracts the tests, and creates files for each
  * adding the test the the TruJS test package
  * @function
  */
  function processFiles(resolve, reject, entry, files) {
    var data = [];

    files.sort(function (a, b) {
        if (a.path < b.path) {
            return -1;
        }
        else if (a.path > b.path) {
            return 1;
        }
        return 0;
    });

    //loop through the files
    files.forEach(function forEachFile(file) {
        var tests = extractTests(file, entry.format);
        if (!isEmpty(tests)) {
            data = data.concat(tests);
        }
    });

    resolve(data);
  }
  /**
  * Uses the test annotations to extract multiple test entries in a single file
  * @function
  */
  function extractTests(file, format) {
    //extract the tests from the file
    var tests = annotation.extract("test", file.data)
    , testFiles = []
    ;
    //get the test annotation for each test and clear all annotations from text
    tests.forEach(function mapTestAns(testData, indx) {
      var testAn = annotation.lookup("test", testData);
      //if there is a format option on the annotation check it
      if (!!testAn.format && testAn.format !== format) {
          return;
      }
      //remove all annotations
      testData = annotation.clear(testData);
      //make sure we have data
      if (!!testData) {
        //trim any leading/trailing CR/LF
        testData = stringTrim(testData, "\\r?\\n?");

        //add the test text to the annotation object
        testAn.data = JSON.stringify(testData);
        //create a new file name and add the basic file properties
        testAn.name = file.name + (indx + 1);
        testAn.ext = ".json";
        testAn.file = file.name + (indx + 1) + ".json";

        testFiles.push(testAn);
      }
    });


    return testFiles;
  }

  /**
  * @worker
  */
  return function TestPreProcessor(entry, files) {

    return new promise(function (resolve, reject) {
      processFiles(resolve, reject, entry, files);
    });

  };
}
