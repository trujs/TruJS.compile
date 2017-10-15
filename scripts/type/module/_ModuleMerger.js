/**
* This factory produces a worker function that merges module object, ensuring
* child module entries are merged and not just overwritten
* @function
*/
function _ModuleMerger(type_module_iocEntry) {

  /**
  * Loop through the modules array, merging each module with the local `module`
  * object
  * @function
  */
  function mergeModules(modules) {
    var module = {};

    //loop through each module in the array
    modules.forEach(function forEachModule(modObj, indx) {
      mergeModule(module, modObj);
    });

    return module;
  }
  /**
  *
  * @function
  */
  function mergeModule(base, module) {
    //loop through the modules properties, see if there is a match on the base
    Object.keys(module).forEach(function forEachModuleKey(key) {
      //if the key exists in the base then we need to do some checking
      if (key in base) {
        //if this is an object entry type then we'll need to dive into it
        if (type_module_iocEntry.getEntryType(base[key]) === "object") {
          //if the module property is not an object entry then throw an error
          if (type_module_iocEntry.getEntryType(module[key]) !== "object") {
            throw new Error(errors.moduleEntryMismatch.replace("{key}", key));
          }
          //recursively run the merge
          mergeModule(base[key][0], module[key][0]);
          return;
        }
      }
      //default action is to add the property to the base
      base[key] = module[key];
    });

  }

  /**
  * @worker
  */
  return function ModuleMerger(modules) {

    if (modules.length === 0) {
      return {};
    }
    else if (modules.length === 1) {
      return modules[0];
    }
    else {
      return mergeModules(modules);
    }

  };
}
