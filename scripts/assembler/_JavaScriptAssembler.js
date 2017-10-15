/**
* This factory creates a worker function that stiches javascript files together
*   using annotations and convention to create namespaces and setting the
*   contents to a variable name
*
*   Convention:
*     The contents of each file are set equal to a variable name that is created
*     using the file path and the file name from the `fileObj`.
*     If there is a `root` value on the manifest entry, the naming will start
*     at that point in the path, i.e. if the root is TruJS and the path is
*     "/projects/TruJS/name.js" then the the name will be `TruJS.name` and _not_
*     `projects.TruJS.name`. The "scripts" directory name is special and will be
*     removed from the namespace.
*
*   Annotations:
*     The @naming annotation can be used to override the default convention,
*     either in part, or completely. There are four possible values in the
*     annotation object, "name", "namespace", "root", "skip".
*
*     "name" => the name of the content
*     "namespace" => The full namespace of the content
*     "root" => The starting point of the namespace, will be ignored if the
*               `namespace` value is present
*     "skip" => If true, the naming will be skipped and the content will be
*               as-is
*
* @module
*/
function _JavaScriptAssembler(promise, annotation, nodePath, stringTrim, getLineEnding, regExGetMatches, stringInsert, namer, fileObj) {
  var COMM_PATT = /^\s?((?:\/[*]{1,2}[\s\S]*?[*]\/\r?\n)|(?:[\/]{2}[^\n]*\n))+/g
  ;

  /**
  * Assembles the files into one, processing annotations and adding variable
  *   names
  * @function
  */
  function assembleFiles(resolve, reject, entry, files) {
    var data = [] //array for the processed file data
    , namespaces = [] //array for required namespaces
    , lineEnding
    , pathObj = nodePath.parse(entry.name + ".js") //the new file object with fake name
    ;

    //loop through the file objects, process each, and add the result to the
    //data array
    files.forEach(function (fileObj) {
      data.push(processFileData(entry, fileObj, namespaces));
    });

    lineEnding = getLineEnding(data);

    //add the namespace entries
    data = addNamespaces(namespaces, data, lineEnding).concat(data);

    //join the data array
    data = [data.join(lineEnding + lineEnding)];

    //resolve with the file object
    resolve([fileObj(pathObj.base, data)]);
  }
  /**
  * Runs the namer and determines if the name should be added to the file data
  * @function
  */
  function processFileData(entry, fileObj, namespaces) {
    var naming = namer(entry.root, fileObj)
    , fileData = fileObj.data
    , matcher;

    //remove all annotations for data processing
    fileData = annotation.clear(fileData);

    //remove any leading or trailing CR LF
    fileData = stringTrim(fileData, "\\r?\\n")

    if (!!naming.name && entry.naming !== false && entry.naming !== "namespace" ) {
      //ensure the variable assignment doesn't already exist
      matcher = new RegExp("(\\s|^|=)" + naming.name.replace(/[.]/g, "[.]") + "\\s?=","m");
      if (!matcher.test(fileData)) {
        //update the file to include the variable assignment
        fileData = insertName(naming.name, fileData);
      }
    }
    if (!!naming.namespace && (entry.naming !== false || entry.naming === "namespace")) {
      //add the namespace
      namespaces.push(naming.namespace);
    }

    return fileData;
  }
  /**
  * Inserts the `name` into the file `data` after any comments and returns the
  * updated value
  * @function
  */
  function insertName(name, data) {
    //find the first instance of code
    //we're expecting either some comments at the start or code
    var matches = regExGetMatches(COMM_PATT, data)
    , index = 0
    ;

    //if we have matches then get the index of the last starting comment
    if (matches.length > 0) {
        //the last match will get us the index
        index = matches[matches.length - 1].index + matches[matches.length - 1][0].length;
    }

    //update the data
    data = stringInsert(data, name + " = ", index);

    //see if we should add a semi-colon
    if (data.lastIndexOf(";") !== data.length - 1) {
      data = data + ";";
    }

    return data;
  }
  /**
  * Loops through the namespaces array, deconstruct to root, adding each level
  * and create an output array with all of the distinct namespace entries
  * @function
  */
  function addNamespaces(namespaces, data, lineEnding) {
    var ns = [], output = [];
    data = data.join(" ");
    //loop through each namespace, split each, add each parent and self to `ns`
    namespaces.forEach(function forEachNamespace(namespace) {
      var parts = namespace.split(".")
      , name;

      for (var i = 0, l = parts.length; i < l; i++) {
        if (!name) {
          name = parts[i];
        }
        else {
          name = name + "." + parts[i];
        }
        if (ns.indexOf(name) === -1) {
          ns.push(name);
        }
      }

    });

    //sort the ns array so each namespace is added in succession to it's parent
    ns.sort();

    //create the output with each namespace
    ns.forEach(function forEachNs(namespace) {
      var entry
      , matcher = new RegExp("(\\s|^|=)" + namespace.replace(/[.]/g, "[.]") + "\\s?=","m");

      //only add the entry if it doesn't already exists
      if (!matcher.test(data)) {

        //if this is the root namespace use var
        if (namespace.indexOf(".") === -1) {
          entry = "var " + namespace + " = { };";
        }
        else {
          entry = namespace + " = " + namespace + " || { };";
        }

        output.push("/** @namespace " + namespace + " */" + lineEnding + entry);
      }
    });

    return output;
  }

  /**
  * @worker
  */
  return function JavaScriptAssembler(entry, files) {

    return new promise(function(resolve, reject) {
      assembleFiles(resolve, reject, entry, files);
    });

  };
}
