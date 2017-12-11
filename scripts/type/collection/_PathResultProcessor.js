/**
*
* @factory
*/
function _PathResultProcessor(nodePath, regExGetMatches, stringTrim) {

  /**
  * Generates a regex statment from the wildcard
  * @function
  */
  function getMatcher(pathObj) {

    //if there is a fragment or wildcard
    if (!!pathObj.wildcard || !!pathObj.fragment) {

      //add the path
      var filter = "(" + updateReserved(!!pathObj.path && stringTrim(pathObj.path, "[/\\\\]", "end") || "*") + ")";
      //add the fragment
      if (!!pathObj.fragment) {
        filter = filter + "[/\\\\](" + updateReserved(pathObj.fragment) + (!!pathObj.options && !!pathObj.options.recurse && "(?:[/\\\\](?:.*))?" || "") + ")";
      }
      else if (!!pathObj.options && !!pathObj.options.recurse) {
        filter = filter + "(?:[/\\\\](.*))?"; //allow all child paths
      }
      else if(pathObj.minus && !pathObj.path) {
        filter = filter + "(?:[/\\\\](.*))?"; //allow all child paths
      }
      else {
        filter = filter + "()"; //empty grouping to preserve group order
    }
      //add the wildcard or file name
      filter = filter + "[/\\\\](" + updateReserved(pathObj.wildcard || pathObj.base || "*") + ")";

      //add the begining and ending restrictions
      var matcher = "^" + filter + "$";

      return new RegExp(matcher);
    }
  }
  /**
  * Modifies the text, escaping some reserved regex character
  * @function
  */
  function updateReserved(value) {
    //replace reserved regex characters
    value = value.replace(/[.]/g, "[.]");
    value = value.replace(/([/\\])/g, "[/\\\\]");

    //convert wildcard to regex
    value = value.replace(/[*]/g, "[^/\\\\]*");

    return value;
  }
  /**
  * Remove the files that match the minus entry
  * @function
  */
  function minusFiles(files, pathObj, matcher) {
    //if there isn't a matcher then this is a static file
    if (!matcher) {
      var indx = getFileIndex(files, pathObj.path);
      if (indx !== -1) {
        files.splice(indx, 1);
      }
      return files;
    }
    else {

      //loop through all of the current files
      return files.filter(function (file) {
        return !matcher.test(file.path);
      });
    }
  }
  /**
  * Filters the files in the path object using the wildcard regex
  * @function
  */
  function filterFiles(files, pathObj, matcher) {

    //lets sort the files first, we want files that start with - to take
    //precedence, then files that start with _ and then unicode sequenced
    pathObj.files.sort(sortFiles);

    pathObj.files.forEach(function forEachFile(file) {
      var fileObj = nodePath.parse(file)
      , nameObj
      , dir = fileObj.dir
      , root = fileObj.root
      , fragment
      , name = fileObj.base
      , matches;
      //if there is a matcher then evaluate it and update the values
      if (!!matcher) {

        matches = regExGetMatches(matcher, file);

        if (matches.length === 0) {
          return;
        }

        dir = matches[0][1];
        fragment = matches[0][2];
        name = matches[0][3];

        //since the name part of the match could have a path in it, lets get it
        var temp = nodePath.parse(name);
        if (!!temp.dir) {
          dir = nodePath.join(dir, temp.dir);
          name = temp.base;
        }

      }
      //add the file to the array if it's nat already a member
      if (missingFile(files, file)) {
        nameObj = nodePath.parse(name);
        files.push({ "path": file, "root": root, "dir": dir, "file": fileObj.base, "name": nameObj.name, "ext": nameObj.ext, "fragment": fragment });
      }
    });

  }
  /**
  * Checks the files object array for an instance of `path`
  * @function
  */
  function missingFile(files, path) {
    return !!path && getFileIndex(files, path) === -1;
  }
  /**
  * Removes the `files` entry having `path` as the path
  * @function
  */
  function removeFile(files, path) {
    return files.filter(function filesFilter(val) {
      return val.path !== path;
    });
  }
  /**
  * Gets the index of the `files` entry for `path`
  * @function
  */
  function getFileIndex(files, path) {
    return files.findIndex(function filesFilter(val) {
      return val.path === path;
    });
  }
  /**
  * Sorts an array of files, giving - precedence and then _ and then unicode seq
  * @function
  */
  function sortFiles(a, b) {
    //get the file names
    a = nodePath.parse(a).name;
    b = nodePath.parse(b).name;

    if (a[0] === "-" && b[0] !== "-") {
      return -1;
    }
    if (b[0] === "-" && a[0] !== "-") {
      return 1;
    }
    if (a[0] === "_" && b[0] !== "_") {
      return -1;
    }
    if (b[0] === "_" && a[0] !== "_") {
      return 1;
    }
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  }

  /**
  * @worker
  */
  return function PathResultProcessor(files, result) {
    var procFiles = files.slice(); //create a shallow copy of the array

    //check for an object, that will be either a directory or a minus
    if (isObject(result)) {
      //get the matcher from the wildcard
      var matcher = getMatcher(result);

      if (result.minus) {
        procFiles = minusFiles(procFiles, result, matcher);
      }
      else if (result.missing) {
        procFiles.push({ "path": result.path, "missing": true });
      }
      else if (!!result.files){
        filterFiles(procFiles, result, matcher);
      }
      else if (missingFile(files, result.path)) {
        procFiles.push({ "path": result.path, "fragment": result.fragment, "root": result.root, "dir": result.dir, "file": result.base, "name": result.name, "ext": result.ext });
      }
    }
    //if not an object then we are expecting a path string
    else if (missingFile(files, result)) {
      var fileObj = nodePath.parse(result);
      procFiles.push({ "path": result, "root": fileObj.root, "dir": fileObj.dir, "file": fileObj.base, "name": fileObj.name, "ext": fileObj.ext });
    }

    return procFiles;
  };
}
