/**
*
* @factory
* @function
*/
function _FilesSaver(nodeFs, nodePath, promise, errors) {
  var cnsts = {
    "exists": -4075
    , "validExts": [
      ".js"
      , ".json"
      , ".xml"
      , ".txt"
    ]
  }
  , DIR_SPLIT_PATT = /[/\\]/
  ;

  /**
  * Loops through all the files and saves each
  * @function
  */
  function saveFiles(resolve, reject, filePath, files) {
    var len = files.length
    , index = 0
    , hasErr;

    saveFile(filePath, files[index], writeCallback);

    function writeCallback(err) {
        index++;
        if(!!err) {
          hasErr = true;
          reject(err);
        }
        else if (!hasErr) {
          if (index < files.length) {
              saveFile(filePath, files[index], writeCallback);
          }
          else {
              resolve();
          }
        }
    }

  }
  /**
  * Scrapes the file annotation, determines the path, and saves the file
  * @function
  */
  function saveFile(filePath, fileObj, cb) {
    //create the fully qualified path
    filePath = createFilePath(filePath, fileObj);

    //check for error
    if (isError(filePath)) {
      cb(filePath);
    }
    else {
      //create the directory structure if needed
      ensureDirectory(filePath, function(err) {
        if (!!err) {
          cb(err);
        }
        else {
          //save the file
          nodeFs.writeFile(filePath, fileObj.data, cb);
        }
      });
    }
  }
  /**
  * Uses the file fragment to modify the path and adds a file name if one is
  * missing
  * @function
  */
  function createFilePath(filePath, fileObj) {
    var fragment = fileObj.fragment
    , dest = fileObj.dest;

    //if there is a fragment, add it to the end of the path
    if (!!fragment) {
      filePath = nodePath.join(filePath, fragment);
    }

    //if there is a destination add that
    if (!!dest) {
      filePath = nodePath.join(filePath, dest);
    }

    //if there isn't a file name then add it
    if (cnsts.validExts.indexOf(nodePath.extname(filePath)) === -1) {
      if (!!fileObj.file) {
        filePath = nodePath.join(filePath, fileObj.file);
      }
      else {
        return new Error(errors.missingFileProperty);
      }
    }

    return nodePath.resolve(filePath);
  }
  /**
  * Ensures the directory structure exists
   @function
  */
  function ensureDirectory(filePath, cb) {
      var path = nodePath.parse(filePath).dir
      , segs =  path.split(DIR_SPLIT_PATT)
      , sep = DIR_SPLIT_PATT.exec(path)[0]
      , index = 1
      ;

      makeDirectory(segs.slice(0, index).join(sep), makeDirCb);

      function makeDirCb(err) {
          index++;
          if (!!err) {
              cb(err);
          }
          else if (index <= segs.length) {
              makeDirectory(segs.slice(0, index).join(sep), makeDirCb);
          }
          else {
              cb();
          }
      }

  }
  /**
  *
  * @function
  */
  function makeDirectory(path, cb) {
      nodeFs.mkdir(path, function(err) {
        //if there was an error, it could be that the directory exists, ignore those
        if (!!err) {
          if (err.errno !== cnsts.exists) {
            cb(err);
            return;
          }
        }
        //all good, fire the callback
        cb();
      });
  }

  /**
  *
  * @worker
  * @function
  */
  return function FileSaver(filePath, files) {

    return new promise(function (resolve, reject) {
      saveFiles(resolve, reject, filePath, files);
    });

  };
}
