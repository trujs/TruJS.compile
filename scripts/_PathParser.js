/**
* This factory provides a worker function that resolves special tags, makes
*   the path fully qualified, and parses it into a path object.
*
*   Sepcial Tags:
*     {script} => The directory of the current running script
*     {root} => The directory node was invoked from, i.e. the root
*     {repos} => The "repos" directory off of the root
*     {projects} => The "projects" directory off of the root
*
*   Qualifying:
*     ./ => the base
*
* @factory
* @function
*/
function _PathParser(nodePath, nodeProcess, nodeDirName) {

  var tags = {
    "script": nodeDirName
    , "root": nodeProcess.cwd()
    , "repos": nodePath.join(nodeProcess.cwd(), "repos")
    , "projects": nodePath.join(nodeProcess.cwd(), "projects")
  }
  , cnsts = {
    "base": "./"
    , "back": "../"
  }
  , TAG_PATT = /{([^}]+)}/g
  ;

  /**
  * @worker
  * @function
  */
  return function PathParser(base, curPath) {

    //if curPath is undefined then the curPath is base
    if (curPath === undefined) {
      curPath = base;
      base = null;
    }

    //set the base default
    base = base || tags.root;

    //replace the tags
    curPath = curPath.replace(TAG_PATT, function(tag, name) {
      return tags[name];
    });

    //make this an absolute path
    if (!nodePath.isAbsolute(curPath)) {
      curPath = nodePath.join(base, curPath);
    }

    //ensure the path has been normalized
    curPath = nodePath.normalize(curPath);

    //make the path fully qualified
    curPath = nodePath.resolve(curPath);

    //parse the path
    curPath =  nodePath.parse(curPath);

    curPath.path = nodePath.join(curPath.dir, curPath.base);

    return curPath;
  };
}
