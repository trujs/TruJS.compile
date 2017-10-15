/**
* This factory produces a worker function that generates a FileObj object.
* @factory
*/
function _FileObj(nodePath) {

  /**
  * @worker
  */
  return function FileObj(path, data) {
    //convert the path to a path object if it's a string
    if (typeof path === "string") {
      path = nodePath.parse(path);
    }

    if (!path.ext) {
      path.ext = !!path.base && nodePath.parse(path.base).ext
              || !!path.path && nodePath.parse(path.path).ext
              || path.ext;
    }

    if (!path.name) {
      path.name = !!path.base && nodePath.parse(path.base).name
              || !!path.file && nodePath.parse(path.file).name
              || !!path.path && nodePath.parse(path.path).name;
    }

    if (!path.dir) {
      path.dir = !!path.path && nodePath.parse(path.path).dir
                || path.dir;
    }

    //convert the path object to a file object
    path.file = path.file || path.base || (path.name + path.ext);
    path.path = path.path || nodePath.join(path.dir, path.file);
    delete path.base;
    path.data = data;

    return path;
  };
}
