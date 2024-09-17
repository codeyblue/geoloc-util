import {expect, jest} from '@jest/globals';

import Parser from "../../src/utils/Parser.js";
import data from '../helpers/test.data.json';
import outputPrefixes from '../../src/utils/output-prefixes.json';


beforeEach(() => {
  console.error = jest.fn();
  console.log = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Parser.js unit tests', () => {
  const city = data.validPlaces.cities[0];
  const invalidCity = data.invalidPlaces.cities[0];
  const zipcode = data.validPlaces.zipcodes[0];
  const invalidZipcode = data.invalidPlaces.zipcodes[0];
  const invalidFormat = data.invalidFormats[0];

  describe('parseLocation()', () => {
    it('it properly parses a zipcode', () => {
      const result = Parser.parseLocation(zipcode.input);

      expect(result).toEqual({type: 'zipcode', location: zipcode.input})
    });

    it('it properly parses a city', () => {
      const result = Parser.parseLocation(city.input);

      expect(result).toEqual({type: 'city', location: city.input})
    });

    it('it properly parses an invalid input', () => {
      const result = Parser.parseLocation(invalidFormat);

      expect(result).toEqual({type: 'invalid', location: invalidFormat});
    });

    it('it only takes a string for input', () => {
      expect(() => Parser.parseLocation([])).toThrow(new Error('Passed in location is not of type string'));
    });
  });

  describe('outputLocationData', () => {
    it('it properly outputs error data for a single invalid error', () => {
      const location = invalidFormat;
      const input = { errors: [{ type: 'invalid', location }]};
      Parser.outputLocationData(input);

      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(`${outputPrefixes.invalidErrors}\n\t${location}\n`);
    });

    it('it properly outputs error data for multiple invalid errors', () => {
      const locations = data.invalidFormats;
      const input = { errors: [
        { type: 'invalid', location: locations[0] },
        { type: 'invalid', location: locations[1] }]
      };
      Parser.outputLocationData(input);

      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(`${outputPrefixes.invalidErrors}\n\t${locations[0]}\n\t${locations[1]}\n`);
    });

    it('it properly outputs error data for a single city api error', () => {
      const error = 'This is an API error message';
      const location = invalidCity.input;
      const input = { errors: [{ type: 'api', location, data: { error }}]};
      Parser.outputLocationData(input);

      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(`${outputPrefixes.apiErrors}\n\t${location} - ${error}\n`);
    });

    it('it properly outputs error data for multiple city api errors', () => {
      const locations = data.invalidPlaces.cities;
      const error = 'This is an API error message';
      const input = { errors: locations.map(location => ({type: 'api', location, data: {error}}))};
      Parser.outputLocationData(input);

      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(`${outputPrefixes.apiErrors}\n\t${locations.map(location => `${location} - ${error}`).join('\n\t')}\n`);
    });

    it('it properly outputs error data for a single zipcode api error', () => {
      const error = 'This is an API error message';
      const location = invalidZipcode.input;
      const input = { errors: [{ type: 'api', location, data: { error }}]};
      Parser.outputLocationData(input);

      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(`${outputPrefixes.apiErrors}\n\t${location} - ${error}\n`);
    });

    it('it properly outputs error data for multiple zipcode api errors', () => {
      const locations = data.invalidPlaces.zipcodes;
      const error = 'This is an API error message';
      const input = { errors: locations.map(location => ({type: 'api', location, data: {error}}))};
      Parser.outputLocationData(input);

      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(`${outputPrefixes.apiErrors}\n\t${locations.map(location => `${location} - ${error}`).join('\n\t')}\n`);
    });

    it('it properly outputs error data for a city and a zipcode api errors', () => {
      const locations = [invalidCity, invalidZipcode];
      const error = 'This is an API error message';
      const input = { errors: locations.map(location => ({type: 'api', location, data: {error}}))};
      Parser.outputLocationData(input);

      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(`${outputPrefixes.apiErrors}\n\t${locations.map(location => `${location} - ${error}`).join('\n\t')}\n`);
    });

    it('it properly outputs location data for a single city', () => {
      const location = city;
      const input = { cities: [{ type: 'city', location: location.input, data: location.outputObject}]};

      Parser.outputLocationData(input);
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith(`${outputPrefixes.cities}\n${location.expected}`);
    });

    it('it properly outputs location data for multiple cities', () => {
      const locations = [ city, data.validPlaces.cities[1] ];
      const input = { cities: [
        { type: 'city', location: locations[0].input, data: locations[0].outputObject},
        { type: 'city', location: locations[1].input, data: locations[1].outputObject }],
      };

      Parser.outputLocationData(input);
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith(`${outputPrefixes.cities}\n${locations[0].expected}${locations[1].expected}`);
    });

    it('it properly outputs location data for a single zipcode', () => {
      const location = zipcode;
      const input = { zipcodes: [{ type: 'zipcode', location: location.input, data: location.outputObject}]};

      Parser.outputLocationData(input);
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenLastCalledWith(`${outputPrefixes.zipcodes}\n${location.expected}`);
    });
    
    it('it properly outputs location data for multiple zipcodes', () => {
      const locations = [ zipcode, data.validPlaces.zipcodes[1] ];
      const input = { zipcodes: [
        { type: 'zipcode', location: locations[0].input, data: locations[0].outputObject},
        { type: 'zipcode', location: locations[1].input, data: locations[1].outputObject}],
      };

      Parser.outputLocationData(input);
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenLastCalledWith(`${outputPrefixes.zipcodes}\n${locations[0].expected}${locations[1].expected}`);
    });

    it('it properly outputs location data for multiple types', () => {
      const errorMessage = 'This is an API Error';
      const input = {
        zipcodes: [{ type: 'zipcode', location: zipcode.input, data: zipcode.outputObject }],
        cities: [{ type: 'city', location: city.input, data: city.outputObject}],
        errors: [
          { type: 'invalid', location: invalidFormat },
          { type: 'api', location: invalidCity, data: { error: errorMessage} },
          { type: 'api', location: invalidZipcode, data: { error: errorMessage} }]
      };
      const outputStrings = {
        zipcode: `${outputPrefixes.zipcodes}\n${zipcode.expected}`,
        city: `${outputPrefixes.cities}\n${city.expected}`,
        invalidError: `${outputPrefixes.invalidErrors}\n\t${invalidFormat}\n`,
        apiError: `${outputPrefixes.apiErrors}\n\t${invalidCity} - ${errorMessage}\n\t${invalidZipcode} - ${errorMessage}\n`
      };

      Parser.outputLocationData(input);
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenLastCalledWith(`${outputStrings.city}${outputStrings.zipcode}`);
      expect(console.error).toHaveBeenCalledTimes(2);
      expect(console.error).toHaveBeenNthCalledWith(1, outputStrings.invalidError);
      expect(console.error).toHaveBeenNthCalledWith(2, outputStrings.apiError);
    });

    it('it properly outputs an error when no locations are passed in', () => {
      const input = { zipcodes: [], cities: [], errors: []};

      Parser.outputLocationData(input);
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenLastCalledWith(outputPrefixes.noLocations);
    });
  });
});