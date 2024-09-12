#!/usr/bin/env node

import { program } from 'commander';

program
  .version('1.0.0')
  .description('Fetch geolocation data for a list of locations')
  .requiredOption("-l, --locations <locations...>", "List of space-separated locations to look up. Format is either \"<city>, <state>\" or \"zipcode.\"")
  .usage("--locations <locations...>")
  .action((options) => {
    console.log(options.locations);
  });

program.addHelpText('after', `

  Example call:
    $ geoloc-util --locations "Baltimore, MD" "12345"`);

program.parse(process.argv);