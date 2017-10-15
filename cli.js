/**[@naming({ "skip": true })]*/
/**
*
* @module TruJS.compile.cli
*/
//load the required modules
var cmdArgs = require('TruJS.cmdArgs')(process.argv)
, compile = require('./index.js')
//resolve the compiler worker from the compile container
, run = compile('.run')
, saver = compile('.saver')
;

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
