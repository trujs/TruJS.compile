/**
* This factory produces a worker function that inspects each manifest entry for
* either an `include` or `postInclude` property. If present it attempts to
* lookup the manifest name or ordinal in the manifest array. Finally it inserts
* the found files to the associated manifestFiles member.
* @factory
*/
function _Includes(promise, isInteger, errors) {
  var cnsts = {
    "include": "include"
    , "postInclude": "postInclude"
  };

  /**
  * Adds the files for the includes
  * @function
  */
  function addIncludes(resolve, reject, manifest, manifestFiles, post) {
    var includeProp = !post && cnsts.include || cnsts.postInclude
    , updatedManifestFiles = []; //the conatiner for the updated file arrays

    try {
      //loop through the manifests, determine if there are includes, get any
      //include files, update the
      manifest.forEach(function forEachEntry(entry, indx) {
        var files = manifestFiles[indx]
        , include = entry[includeProp]
        , indexes, includeFiles;
        //if there is an include property on the entry
        if (!isNill(include)) {
          indexes = getManifestIndexes(include, manifest);
          includeFiles = getIncludeFiles(indexes, manifestFiles);
          //if this is a post includes we'll want to append not insert
          if (!post) {
            files = includeFiles.concat(files);
          }
          else {
            files = files.concat(includeFiles);
          }
          //update the container rather than the original manifestFiles
          //otherwise included files can have side effects, i.e. added multiple times
          updatedManifestFiles[indx] = files;
        }
        else {
          updatedManifestFiles[indx] = files;
        }
      });

      resolve(updatedManifestFiles);
    }
    catch(ex) {
      reject(ex);
    }
  }
  /**
  * Creates an array of manifest entry indexes based on the include value. The
  * include values can be a mix of entry name and indexes.
  * Throws an exception if the include value is a name and that name is not
  * found in the manifest
  * @function
  */
  function getManifestIndexes(include, manifest) {
    if (!isArray(include)) {
      include = [include];
    }
    return include.map(function mapInclude(inc) {
      var incIndx;
      //if the inc is a number use that as the literal index
      if(isInteger(inc)) {
        return parseInt(inc);
      }
      else {
        //get the index of the manifest entry by name
        incIndx = getManifestIndexByName(manifest, inc);
        if (incIndx === -1) {
          throw new Error(errors.missingInclude.replace("{include}", inc));
        }
        return incIndx;
      }
    });
  }
  /**
  * Gets the manifest entry's index in the manifest by name
  * @function
  */
  function getManifestIndexByName(manifest, name) {
    var index = -1;

    manifest.every(function(entry, indx) {
      if (entry.name === name) {
        index = indx;
        return false;
      }
      return true;
    });

    return index;
  }
  /**
  * Creates an array of files from the manifestFiles that match the manifest
  * indexes
  * @function
  */
  function getIncludeFiles(indexes, manifestFiles) {
    var files = [];
    indexes.forEach(function forEachIndx(indx) {
      files = files.concat(manifestFiles[indx]);
    });
    return files;
  }

  /**
  * @worker
  * @param {array} manifest Array of manifest entries
  * @param {array} manifestFiles Array of file arrays
  * @param {boolean} post Inidicates the includes property is postIncludes
  */
  return function Includes(manifest, manifestFiles, post) {

    return new promise(function (resolve, reject) {
      addIncludes(resolve, reject, manifest, manifestFiles, post);
    });

  };
}
