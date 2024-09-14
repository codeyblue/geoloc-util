#!/usr/bin/env node

import createProgram from '../src/utils/cli.js';
import dotenv from 'dotenv';
dotenv.config();

import Parser from '../src/utils/Parser.js';
import Locations from '../src/lib/Locations.js';

const program = createProgram();

program.parse(process.argv);

const API_KEY = program.opts().key ? program.opts().key : process.env.API_KEY;

if (!API_KEY) {
  throw Error('Missing API_KEY. Set it as an environment variable, in the .env file, or pass it in using -k.');
}

const parsedLocations = program.opts().locations.map(location => Parser.parseLocation(location));
const locations = await Locations.getLocations(parsedLocations, API_KEY);
Parser.outputLocationData(locations);