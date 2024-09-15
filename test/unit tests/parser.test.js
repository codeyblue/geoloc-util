import Parser from "../../src/utils/Parser.js";
import data from '../test.data.json';
import {expect, jest, test} from '@jest/globals';

console.error = jest.fn();
console.log = jest.fn();

beforeEach(() => {
  console.error.mockClear();
  console.log.mockClear();
});

describe('Parser.js unit tests', () => {
  describe('parseLocation()', () => {
    it('it properly parses a zipcode', () => {
      const input = data.validPlaces.zipcodes[0].input;
      const result = Parser.parseLocation(input);

      expect(result).toEqual({type: 'zipcode', location: input})
    });

    it('it properly parses a city', () => {
      const input = data.validPlaces.cities[0].input;
      const result = Parser.parseLocation(input);

      expect(result).toEqual({type: 'city', location: input})
    });

    it('it properly parses an invalid input', () => {
      const input = data.invalidFormats[0].input;
      const result = Parser.parseLocation(input);

      expect(result).toEqual({type: 'invalid', location: input});
    });

    it('only takes a string for input', () => {
      expect(() => Parser.parseLocation([])).toThrow(new Error('Passed in location is not of type string'));
    });
  });

  describe('outputLocationData', () => {
    it('it properly outputs error data for a single invalid error', () => {
      const input = { errors: [{ type: 'invalid', location: data.invalidFormats[0].input }]};
      Parser.outputLocationData(input);

      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(`error: Invalid input formats\n\t${data.invalidFormats[0].input}\n`);
    });

    it('it properly outputs error data for multiple invalid errors', () => {
      const locations = [ data.invalidFormats[0].input, data.invalidFormats[0].input];
      const input = { errors: [
        { type: 'invalid', location: locations[0] },
        { type: 'invalid', location: locations[1] }]
      };
      Parser.outputLocationData(input);

      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(`error: Invalid input formats\n\t${locations[0]}\n\t${locations[1]}\n`);
    });

    it('it properly outputs error data for a single api error', () => {
      const error = 'This is an API error message';
      const location = data.invalidPlaces[0].input;
      const input = { errors: [{ type: 'api', location, data: { error }}]};
      Parser.outputLocationData(input);

      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(`error: API Errors\n\t${location} - ${error}\n`);
    });

    it('it properly outputs error data for multiple api errors', () => {
      const locations = [data.invalidPlaces[0], data.invalidPlaces[1]];
      const error = 'This is an API error message';
      const input = { errors: [
        { type: 'api', location: locations[0], data: { error }},
        { type: 'api', location: locations[1], data: { error }}]
      };
      Parser.outputLocationData(input);

      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(`error: API Errors\n\t${locations[0]} - ${error}\n\t${locations[1]} - ${error}\n`);
    });

    it('it properly outputs location data for a single city', () => {
      const location = data.validPlaces.cities[0];
      const input = { cities: [{ type: 'city', location: location.input, data: location.outputObject}]};

      Parser.outputLocationData(input);
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith(`--- Cities ---\n${location.expected}`);
    });

    it('it properly outputs location data for multiple cities', () => {
      const locations = [ data.validPlaces.cities[0], data.validPlaces.cities[1] ];
      const input = { cities: [
        { type: 'city', location: locations[0].input, data: locations[0].outputObject},
        { type: 'city', location: locations[1].input, data: locations[1].outputObject }],
      };

      Parser.outputLocationData(input);
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith(`--- Cities ---\n${locations[0].expected}${locations[1].expected}`);
    });

    it('it properly outputs location data for a single zipcode', () => {
      const location = data.validPlaces.zipcodes[0];
      const input = { zipcodes: [{ type: 'zipcode', location: location.input, data: location.outputObject}]};

      Parser.outputLocationData(input);
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenLastCalledWith(`--- ZipCodes ---\n${location.expected}`);
    });
    
    it('it properly outputs location data for multiple zipcodes', () => {
      const locations = [ data.validPlaces.zipcodes[0], data.validPlaces.zipcodes[1] ];
      const input = { zipcodes: [
        { type: 'zipcode', location: locations[0].input, data: locations[0].outputObject},
        { type: 'zipcode', location: locations[1].input, data: locations[1].outputObject}],
      };

      Parser.outputLocationData(input);
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenLastCalledWith(`--- ZipCodes ---\n${locations[0].expected}${locations[1].expected}`);
    });

    it('it properly outputs location data for multiple types', () => {
      const invalidInput = data.invalidFormats[0];
      const invalidPlace = data.invalidPlaces[0];
      const zipcode = data.validPlaces.zipcodes[0];
      const city = data.validPlaces.cities[0];
      const input = {
        zipcodes: [{ type: 'zipcode', location: zipcode.input, data: zipcode.outputObject }],
        cities: [{ type: 'city', location: city.input, data: city.outputObject}],
        errors: [
          { type: 'invalid', location: invalidInput.input },
          { type: 'api', location: invalidPlace.input, data: { error: 'This is an API Error'} }]
      };
      const outputStrings = {
        zipcode: `--- ZipCodes ---\n${zipcode.expected}`,
        city: `--- Cities ---\n${city.expected}`,
        invalidError: `error: Invalid input formats\n\t${invalidInput.input}\n`,
        apiError: `error: API Errors\n\t${invalidPlace.input} - This is an API Error\n`
      };

      Parser.outputLocationData(input);
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenLastCalledWith(`${outputStrings.city}${outputStrings.zipcode}`);
      expect(console.error).toHaveBeenCalledTimes(2);
      expect(console.error).toHaveBeenNthCalledWith(1, outputStrings.invalidError);
      expect(console.error).toHaveBeenNthCalledWith(2, outputStrings.apiError);
    });

    it('it properly outputs "No locations to output" when no locations are passed in', () => {
      const input = { zipcodes: [], cities: [], errors: []};

      Parser.outputLocationData(input);
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenLastCalledWith('No locations to output');
    });
  });
});