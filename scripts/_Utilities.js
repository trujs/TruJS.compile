/**
* Catch all for cross concern utilities
* @object
*/
function _Utilities(nodePath, defaults) {

  return Object.create(null, {
    /**
    * Inspects string data to see what line endings it uses
    * @function
    */
    "getLineEnding": {
      "enumerable": true
      , "value": function getLineEnding(data) {
        if (data.indexOf("\r\n") !== -1) {
          return "\r\n";
        }
        return "\n";
      }
    }
    /**
    * Adds the scripts directory to the base path, using the entry.scripts value
    * if exists, otherwise uses the defaults.scriptsDir
    * @function
    */
    , "getScriptsDir": {
      "enumerable": true
      , "value": function getScriptsDir(base, entry) {
        //setup the path to the scripts, using the default or the manifest entry
        var scriptsDir = (!isNill(entry.scripts)) ? entry.scripts : defaults.scriptsDir
        , scriptsPath = nodePath.join(base, scriptsDir);

        return scriptsPath;
      }
    }
    /**
    * Parses the entry option in the cmdArgs object and return either "all" or an
    * array representing the manifest entry indexes that will be compiled
    * @function
    */
    , "getEntryArg": {
      "enumerable": true
      , "value": function getEntryArg(cmdArgs) {
        if (!!cmdArgs.entry && cmdArgs.entry !== "all") {
          return cmdArgs.entry.split(",");
        }
        return "all";
      }
    }
  });

}
