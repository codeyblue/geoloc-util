/* istanbul ignore file */

import { exec } from 'child_process';

// Running the CLI using the node method in case the utility is not installed globally
export function cli(options) {
  let command = 'node ./bin/index.js';
  for (const [option, value] of Object.entries(options)) {
    command += ` --${option} "${value.join('" "')}"`;
  }

  return new Promise(resolve => { 
    exec(command,
      '.', 
      (error, stdout, stderr) => { resolve({
      code: error && error.code ? error.code : 0,
      error,
      stdout,
      stderr });
    });
  })
}

export default cli;