import dotenv from 'dotenv';
dotenv.config();

import {expect, jest} from '@jest/globals';

import Locations from '../src/lib/Locations.js';
import data from './helpers/test.data.json';
import outputPrefixes from '../src/utils/output-prefixes.json';


beforeEach(() => {
  jest.clearAllMocks();
});


describe('Integration Tests', () => {
  const API_KEY = process.env.OW_API_KEY;
  const city = data.validPlaces.cities[0];
  const invalidCity = data.invalidPlaces.cities[0];
  const zipcode = data.validPlaces.zipcodes[0];
  const invalidZipcode = data.invalidPlaces.zipcodes[0];
  const invalidFormat = data.invalidFormats[0];

  describe('getLocationByCity()', () => {
    it('it fetches a valid city', async () => {
      const result = await Locations.getLocationByCity(city.input, API_KEY);

      expect(result).toEqual(city.outputObject);
    });

    it('it returns an error for an invalid city state format', async () => {
      const result = await Locations.getLocationByCity(invalidFormat, API_KEY);

      expect(result).toEqual({ error: 'Format incorrect, city and state are both required' });
    });

    it('it returns an error for an unknown city', async () => {
      const result = await Locations.getLocationByCity(invalidCity, API_KEY);

      expect(result).toEqual({ error: `${outputPrefixes.unknownLocation} ${invalidCity}`});
    });

    it('it returns an error when there is an API error', async () => {
      const result = await Locations.getLocationByCity(city.input, 'fakeApiKey');

      expect(result).toEqual({ error: outputPrefixes.invalidKey});
    });
  });

  describe('getLocationByZip()', () => {
    it('it fetches a valid zipcode with getLocationByZip()', async () => {
      const result = await Locations.getLocationByZip(zipcode.input, API_KEY);

      expect(result).toEqual(zipcode.outputObject);
    });

    it('it returns an error for an unknown zipcode', async () => {
      const result = await Locations.getLocationByZip(invalidZipcode, API_KEY);

      expect(result).toEqual({ error: `${outputPrefixes.unknownLocation} ${invalidZipcode}`});
    });

    it('it returns an error when there is an API error', async () => {
      const result = await Locations.getLocationByZip(zipcode.input, 'fakeApiKey');

      expect(result).toEqual({ error: outputPrefixes.invalidKey});
    });
  });

  describe('getLocations()', () => {
    it('it returns an object with a valid city', async () => {
      jest.spyOn(Locations, 'getLocationByCity');

      const result = await Locations.getLocations([{type: 'city', location: city.input}], API_KEY);

      expect(Locations.getLocationByCity).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        cities: [{type: 'city', location: city.input, data: city.outputObject}],
        zipcodes: [],
        errors: []
      });
    });

    it('it returns an object with a valid zipcode', async () => {
      jest.spyOn(Locations, 'getLocationByZip');

      const result = await Locations.getLocations([{type: 'zipcode', location: zipcode.input}], API_KEY);

      expect(Locations.getLocationByZip).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        zipcodes: [{type: 'zipcode', location: zipcode.input, data: zipcode.outputObject}],
        cities: [],
        errors: []
      });
    });

    it('it returns an object with an invalid format error', async () => {
      jest.spyOn(Locations, 'getLocationByCity');
      jest.spyOn(Locations, 'getLocationByZip');

      const result = await Locations.getLocations([{type: 'invalid', location: invalidFormat}], API_KEY);

      expect(Locations.getLocationByCity).toHaveBeenCalledTimes(0);
      expect(Locations.getLocationByZip).toHaveBeenCalledTimes(0);
      expect(result).toEqual({
        errors: [{type: 'invalid', location: invalidFormat}],
        cities: [],
        zipcodes: []
      });
    });

    it('it returns an object with an unknown city error', async () => {
      jest.spyOn(Locations, 'getLocationByCity');

      const result = await Locations.getLocations([{type: 'city', location: invalidCity}], API_KEY);

      expect(Locations.getLocationByCity).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        errors: [{type: 'city', location: invalidCity, data: {error: `${outputPrefixes.unknownLocation} ${invalidCity}`}}],
        cities: [],
        zipcodes: []
      });
    });

    it('it returns an object with an unknown zipcode error', async () => {
      jest.spyOn(Locations, 'getLocationByZip');

      const result = await Locations.getLocations([{type: 'zipcode', location: invalidZipcode}], API_KEY);

      expect(Locations.getLocationByZip).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        errors: [{type: 'zipcode', location: invalidZipcode, data: {error: `${outputPrefixes.unknownLocation} ${invalidZipcode}`}}],
        cities: [],
        zipcodes: []
      });
    });

    it('it returns an object with a city api error', async () => {
      jest.spyOn(Locations, 'getLocationByCity');

      const result = await Locations.getLocations([{type: 'city', location: city.input}], 'fakeApiKey');

      expect(Locations.getLocationByCity).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        errors: [{type: 'city', location: city.input, data: {error: outputPrefixes.invalidKey}}],
        cities: [],
        zipcodes: []
      });
    });

    it('it returns an object with a zipcode api error', async () => {
      jest.spyOn(Locations, 'getLocationByZip');

      const result = await Locations.getLocations([{type: 'zipcode', location: zipcode.input}], 'fakeApiKey');

      expect(Locations.getLocationByZip).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        errors: [{type: 'zipcode', location: zipcode.input, data: {error: outputPrefixes.invalidKey}}],
        cities: [],
        zipcodes: []
      });
    });

    it('returns an object with valid cities, valid zipcodes, invalid formats, unknown cities, and unknown zipcodes', async () => {
      const input = [
        { type: 'city', location: city.input },
        { type: 'zipcode', location: zipcode.input },
        { type: 'invalid', location: invalidFormat},
        { type: 'city', location: invalidCity },
        { type: 'zipcode', location: invalidZipcode }
      ]

      jest.spyOn(Locations, 'getLocationByCity');
      jest.spyOn(Locations, 'getLocationByZip');

      const result = await Locations.getLocations(input, API_KEY);

      expect(Locations.getLocationByCity).toHaveBeenCalledTimes(2);
      expect(Locations.getLocationByZip).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        cities: [{type: 'city', location: city.input, data: city.outputObject}],
        zipcodes: [{type: 'zipcode', location: zipcode.input, data: zipcode.outputObject}],
        errors: [
          {type: 'invalid', location: invalidFormat},
          {type: 'city', location: invalidCity, data: {error: `${outputPrefixes.unknownLocation} ${invalidCity}`}},
          {type: 'zipcode', location: invalidZipcode, data: {error: `${outputPrefixes.unknownLocation} ${invalidZipcode}`}}
        ],
      });
    });
  });
});