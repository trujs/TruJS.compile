/**
* This factory produces a worker function that takes the manifest entry and file
* object and determines what the fully qualified name should be, returning an
* object with the namespace and name.
* @factory
*/
function _Namer(annotation, stringTrim, defaults, nodePath) {
  var SPLIT_PATT = /[\\/.]/g
  , cnsts = {
    "namespaceEndings": ["projects", "repos"]
    , "jsExt": [".js", ".json"]
  };

  /**
  * Processes a single file using the naming annotation and the naming property
  * in the manifest entry. Determines the name from the file path and naming
  * object and extracts the namespace. Returns the naming object
  * @function
  */
  function nameFile(defaultRoot, fileObj, scriptsDir) {
    //get the file data and trim leading and trailing line breaks
    var data = stringTrim(fileObj.data, "\\r?\\n")
    , naming = annotation.lookup("naming", data) || {} //get the naming annotation, default empty obj
    // get the namespace root starting with the naming annotation, then entry
    , root = !!naming && !!naming.root && naming.root || defaultRoot || "";

    //see if we are going to provide the factory's name and namespace
    if (!naming.skip) {

      //default to naming name, if missing use file name minus the extention
      naming.name = naming.name || determineName(fileObj);

      //extract the namespace from the base directory
      naming.namespace = naming.namespace || extractNamespace(fileObj, root, scriptsDir);

      //if the name starts with - then remove it, that's a special convention
      //for namespacing
      if (naming.name.indexOf("-") === 0) {
        naming.name = naming.name.substring(1); //remove the dash
        naming.namespace = naming.namespace
          .substring(0, naming.namespace.lastIndexOf(".")); //remove last key
      }

      naming.name = (!!naming.namespace && (naming.namespace + ".") || "") + naming.name;
    }
    //if there isn't a namespace then return a blank object
    // (otherwise it would be the annotation object)
    else if (!naming.namespace) {
      naming = {};
    }

    return naming;
  }
  /**
  * Gets the namespace from the file path base
  * @function
  */
  function extractNamespace(fileObj, root, scriptsDir) {
    var found
    , dir = !!fileObj.fragment && nodePath.join(fileObj.dir, fileObj.fragment) || fileObj.dir
    , namespace = dir.split(SPLIT_PATT)
      .reverse()
      .map(function(part) {
        //check to see if we've already found the end, or if this is the drive :
        if (!found && part.indexOf(":") === -1) {
          //if there is a root value check for that
          if (!!root && root.indexOf(part) !== -1) {
            found = true;
          }
          //if there isn't a root value then check the default endings
          else if (cnsts.namespaceEndings.indexOf(part) !== -1) {
            found = true;
            return ""; //return an empty string because we dont want this ending
          }
          //return the part
          return part;
        }
        //already done, just return an empty string
        return "";
      })
      .reverse()
      .join(".")
    ;

    //since "scripts" is a special directory naming convention lets remove it
    namespace = namespace.replace(new RegExp("[.](?:" + (scriptsDir + "|" + defaults.scriptsDir) + ")([.]|$)"), "$1");

    //remove additional dots from the join
    namespace = stringTrim(namespace, "[.]");

    return namespace;
  }
  /**
  * Uses the file name and extension to determine the name
  * @function
  */
  function determineName(fileObj) {
    //if this is not .js or .json
    if (cnsts.jsExt.indexOf(fileObj.ext) === -1) {
      if (!!defaults.fileTypes[fileObj.ext]) {
        return fileObj.name + defaults.fileTypes[fileObj.ext];
      }
    }
    return fileObj.name;
  }

  /**
  * @worker
  */
  return function Namer(root, fileObj, scriptsDir) {
    return nameFile(root, fileObj, scriptsDir);
  }
}
