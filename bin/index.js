#!/usr/bin/env node

import { program } from 'commander';
import dotenv from 'dotenv';
dotenv.config();

import Parser from '../src/utils/parser.js';
import Locations from '../src/lib/Locations.js';

program
  .version('1.0.0')
  .description('Fetch geolocation data for a list of locations')
  .requiredOption('-l, --locations <locations...>', 'List of space-separated locations to look up', Parser.parseLocation, [])
  .option('-k, --key <apikey>', 'API key for OpenWeather, if not set in the .env or environment')
  .usage('--locations <locations...>');

program.addHelpText('after', `

  Example call:
    $ geoloc-util --locations "Baltimore, MD" "12345"`);

program.parse();

const API_KEY = program.opts().key ? program.opts().key : process.env.API_KEY;

if (!API_KEY) {
  throw new Error('Missing API_KEY. Set it as an environment variable, in the .env file, or pass it in using -k.');
}

const locations = await Locations.getLocations(program.opts().locations, API_KEY);
Parser.outputLocationData(locations);