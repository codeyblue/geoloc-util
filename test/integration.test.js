import dotenv from 'dotenv';
dotenv.config();

import {expect, jest} from '@jest/globals';

import Locations from '../src/lib/Locations.js';
import data from './helpers/test.data.json';


beforeEach(() => {
  jest.clearAllMocks();
});


describe('Integration Tests', () => {
  describe('getLocationByCity()', () => {
    it('it fetches a valid city', async () => {
      const city = data.validPlaces.cities[0];
      const result = await Locations.getLocationByCity(city.input, process.env.API_KEY);

      expect(result).toEqual(city.outputObject);
    });

    it('it returns an error for an invalid city state format', async () => {
      const result = await Locations.getLocationByCity('invalid format', process.env.API_KEY);

      expect(result).toEqual({ error: 'Format incorrect, city and state are both required' });
    });

    it('it returns an error for an invalid city', async () => {
      const city = data.invalidPlaces.cities[0];
      const result = await Locations.getLocationByCity(city.input, process.env.API_KEY);

      expect(result).toEqual({ error: city.error});
    });

    it('it returns an error when there is an API error', async () => {
      const city = data.validPlaces.cities[0];
      const result = await Locations.getLocationByCity(city.input, 'fakeApiKey');

      expect(result).toEqual({ error: 'Invalid API key. Please see https://openweathermap.org/faq#error401 for more info.'});
    });
  });

  describe('getLocationByZip()', () => {
    it('it fetches a valid zipcode with getLocationByZip()', async () => {
      const zipcode = data.validPlaces.zipcodes[0];
      const result = await Locations.getLocationByZip(zipcode.input, process.env.API_KEY);

      expect(result).toEqual(zipcode.outputObject);
    });

    it('it returns an error for an invalid zipcode', async () => {
      const zipcode = data.invalidPlaces.zipcodes[0];
      const result = await Locations.getLocationByZip(zipcode.input, process.env.API_KEY);

      expect(result).toEqual({ error: zipcode.error});
    });

    it('it returns an error when there is an API error', async () => {
      const zipcode = data.validPlaces.zipcodes[0];
      const result = await Locations.getLocationByZip(zipcode.input, 'fakeApiKey');

      expect(result).toEqual({ error: 'Invalid API key. Please see https://openweathermap.org/faq#error401 for more info.'});
    });
  });

  describe('getLocations()', () => {
    it('returns an object with a valid city', async () => {
      const city = data.validPlaces.cities[0];

      jest.spyOn(Locations, 'getLocationByCity');

      const result = await Locations.getLocations([{type: 'city', location: city.input}], process.env.API_KEY);

      expect(Locations.getLocationByCity).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        cities: [{type: 'city', location: city.input, data: city.outputObject}],
        zipcodes: [],
        errors: []
      });
    });

    it('returns an object with a valid zipcode', async () => {
      const zipcode = data.validPlaces.zipcodes[0];

      jest.spyOn(Locations, 'getLocationByZip');

      const result = await Locations.getLocations([{type: 'zipcode', location: zipcode.input}], process.env.API_KEY);

      expect(Locations.getLocationByZip).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        zipcodes: [{type: 'zipcode', location: zipcode.input, data: zipcode.outputObject}],
        cities: [],
        errors: []
      });
    });

    it('returns an object with an invalid format error', async () => {
      const invalid = data.invalidFormats[0];

      jest.spyOn(Locations, 'getLocationByCity');
      jest.spyOn(Locations, 'getLocationByZip');

      const result = await Locations.getLocations([{type: 'invalid', location: invalid.input}], process.env.API_KEY);

      expect(Locations.getLocationByCity).toHaveBeenCalledTimes(0);
      expect(Locations.getLocationByZip).toHaveBeenCalledTimes(0);
      expect(result).toEqual({
        errors: [{type: 'invalid', location: invalid.input}],
        cities: [],
        zipcodes: []
      });
    });

    it('returns an object with an unknown city error', async () => {
      const city = data.invalidPlaces.cities[0];

      jest.spyOn(Locations, 'getLocationByCity');

      const result = await Locations.getLocations([{type: 'city', location: city.input}], process.env.API_KEY);

      expect(Locations.getLocationByCity).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        errors: [{type: 'city', location: city.input, data: {error: city.error}}],
        cities: [],
        zipcodes: []
      });
    });

    it('returns an object with an unknown zipcode error', async () => {
      const zipcode = data.invalidPlaces.zipcodes[0];

      jest.spyOn(Locations, 'getLocationByZip');

      const result = await Locations.getLocations([{type: 'zipcode', location: zipcode.input}], process.env.API_KEY);

      expect(Locations.getLocationByZip).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        errors: [{type: 'zipcode', location: zipcode.input, data: {error: zipcode.error}}],
        cities: [],
        zipcodes: []
      });
    });

    it('returns an object with a city api error', async () => {
      const city = data.validPlaces.cities[0];

      jest.spyOn(Locations, 'getLocationByCity');

      const result = await Locations.getLocations([{type: 'city', location: city.input}], 'fakeApiKey');

      expect(Locations.getLocationByCity).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        errors: [{type: 'city', location: city.input, data: {error: 'Invalid API key. Please see https://openweathermap.org/faq#error401 for more info.'}}],
        cities: [],
        zipcodes: []
      });
    });

    it('returns an object with a zipcode api error', async () => {
      const zipcode = data.invalidPlaces.zipcodes[0];

      jest.spyOn(Locations, 'getLocationByZip');

      const result = await Locations.getLocations([{type: 'zipcode', location: zipcode.input}], 'fakeApiKey');

      expect(Locations.getLocationByZip).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        errors: [{type: 'zipcode', location: zipcode.input, data: {error: 'Invalid API key. Please see https://openweathermap.org/faq#error401 for more info.'}}],
        cities: [],
        zipcodes: []
      });
    });

    it('returns an object with valid cities, valid zipcodes, invalid formats, unknown cities, and unknown zipcodes', async () => {
      const city = data.validPlaces.cities[0];
      const zipcode = data.validPlaces.zipcodes[0];
      const invalidFormat = data.invalidFormats[0];
      const invalidZipcode = data.invalidPlaces.zipcodes[0];
      const invalidCity = data.invalidPlaces.cities[0];

      const input = [
        { type: 'city', location: city.input },
        { type: 'zipcode', location: zipcode.input },
        { type: 'invalid', location: invalidFormat.input},
        { type: 'city', location: invalidCity.input },
        { type: 'zipcode', location: invalidZipcode.input }
      ]

      jest.spyOn(Locations, 'getLocationByCity');
      jest.spyOn(Locations, 'getLocationByZip');

      const result = await Locations.getLocations(input, process.env.API_KEY);

      expect(Locations.getLocationByCity).toHaveBeenCalledTimes(2);
      expect(Locations.getLocationByZip).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        cities: [{type: 'city', location: city.input, data: city.outputObject}],
        zipcodes: [{type: 'zipcode', location: zipcode.input, data: zipcode.outputObject}],
        errors: [
          {type: 'invalid', location: invalidFormat.input},
          {type: 'city', location: invalidCity.input, data: {error: invalidCity.error}},
          {type: 'zipcode', location: invalidZipcode.input, data: {error: invalidZipcode.error}}
        ],
      });
    });
  });
});