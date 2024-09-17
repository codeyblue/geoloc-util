#!/usr/bin/env node

import dotenv from 'dotenv';
dotenv.config();

import createProgram from '../src/utils/cli.js';
import Locations from '../src/lib/Locations.js';
import Parser from '../src/utils/Parser.js';

const program = createProgram();

program.parse(process.argv);

if (program.opts().locations.length <= 0 || (program.opts().locations.length == 1 && program.opts().locations[0] === '')) {
  throw Error('Locations cannot be empty.');
}

const API_KEY = program.opts().key ? program.opts().key : process.env.API_KEY;
if (!API_KEY) {
  throw Error('Missing API_KEY. Set it as an environment variable, in the .env file, or pass it in using -k.');
}

const parsedLocations = program.opts().locations.map(location => Parser.parseLocation(location));
const locations = await Locations.getLocations(parsedLocations, API_KEY);
Parser.outputLocationData(locations);