/**[@naming({ "skip": true })]*/
/**
*
* @module TruJS.compile.cli
*/
//load the required modules
var cmdArgs = require('trujs-cmdargs')(process.argv)
, compile = require('./index.js')
//resolve the compiler worker from the compile container
, run = compile('.run')
, saver = compile('.saver')
, compileReporter = compile(".compileReporter")
;

compileReporter.addHandler(function (msg, type) {
    console.log(msg);
});
compileReporter.setLevels("all");

console.log("*****************************************************");
console.log("Starting the compiler");

//run the compiler
run(cmdArgs)
  .then(function(manifest) {
    return saver(manifest);
  })
  .then(function () {
    console.log("Finished Processing");
  })
  .catch(function(err) {
    console.log(err);
  });
