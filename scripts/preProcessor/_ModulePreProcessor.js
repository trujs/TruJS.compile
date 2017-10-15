/**
* This factory creates a worker function that pre-processes module entries. It
* adds the module entry to the array of files
* @factory
*/
function _ModulePreProcessor(promise, defaults, getLineEnding, preProcessor_javascript) {

  /**
  * @worker
  * @param {object} entry A manifest entry object
  * @param {array} files An array of file objects
  */
  return function ModulePreProcessor(entry, files) {
    //the return value must be module
    apply(defaults.module, entry);

    //stitch the files together and use the data to determine the line ending
    var lineEnding = getLineEnding(files.map((f)=>{ return f.data; }).join(" "));

    //create the module file and add it to the files array
    var file = {
      "name": "module"
      , "ext": ".js"
      , "file": "module.js"
      , data: "/**[@naming({ \"skip\": true })]*/" + lineEnding +
              "/* The IOC Container */" + lineEnding +
              "var " + defaults.module.return + " = TruJS.ioc.Container(" + JSON.stringify(entry.module) + ");"
    };
    files.push(file);

    //run the javascript pre-processor
    return preProcessor_javascript(entry, files);
  };
}
