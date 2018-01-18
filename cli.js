/**[@naming({ "skip": true })]*/
/**
*
* @module TruJS.compile.cli
*/
//load the required modules
var cmdArgs = require('trujs-cmdargs')(process.argv)
, compile = require('./index.js')
, compileReporter = compile(".compileReporter")
//resolve the compiler worker from the compile container
, run = compile('.run')
, saver = compile('.saver')
;

compileReporter.setLevels("all");
compileReporter.addHandler(function (msg, type) {
    if (type.indexOf("group") === -1) {
        if (type === "error") {
            console.error(msg);
        }
        else if (type === "warning") {
            console.warn(msg);
        }
        else {
            console.log(msg);
        }
    }
    else if (type === "group") {
        console.group();
    }
    else if (type === "groupEnd") {
        console.groupEnd();
    }
});

compileReporter.report("seperator", "*****************************************************");
compileReporter.info("Starting the compiler");
compileReporter.group("compiler");

//run the compiler
run(cmdArgs)
  .then(function () {
    compileReporter.groupEnd("compiler");
    compileReporter.info("Finished Processing");
  })
  .catch(function(err) {
    compileReporter.groupEnd("compiler");
    compileReporter.report("seperator", "");
    compileReporter.error(err);
  });