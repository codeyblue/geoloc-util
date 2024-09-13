#!/usr/bin/env node

import { program } from 'commander';

import parseLocation from '../src/utils/parseLocations.js';

program
  .version('1.0.0')
  .description('Fetch geolocation data for a list of locations')
  .requiredOption("-l, --locations <locations...>", "List of space-separated locations to look up", parseLocation, [])
  .usage("--locations <locations...>");

program.addHelpText('after', `

  Example call:
    $ geoloc-util --locations "Baltimore, MD" "12345"`);

program.parse();

console.log('Options: ', program.opts());