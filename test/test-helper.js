const path = require('path');
const exec = require('child_process').exec;

// Running the CLI using the node method in case the utility is not installed globally
function cli(locations) {
  return new Promise(resolve => { 
    exec(`node ./bin/index.js --locations "${locations.join('" "')}"`,
    '.', 
    (error, stdout, stderr) => { resolve({
    code: error && error.code ? error.code : 0,
    error,
    stdout,
    stderr })
  })
})}

module.exports = { cli };