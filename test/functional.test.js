import {cli} from "./helpers/test-helper.js";
import data from './helpers/test.data.json';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const outputPrefixes = {
  cities: '--- Cities ---',
  zipcodes: '--- ZipCodes ---',
  apiErrors: 'error: API Errors',
  invalidErrors: 'error: Invalid input formats'
}

describe('Functional Tests', () => {
  describe('Valid Inputs', () => {
    data.validPlaces.cities.forEach(city => {
      it(`it fetches data with a valid "city, state" format: ${city.input}`, async () => {
        const result = await cli({locations: [city.input]});
        
        expect(result.stdout).toEqual(`${outputPrefixes.cities}\n${city.expected}\n`);
      });
    });

    it('it fetches data with a valid "zipcode" format', async () => {
      const zipcode = data.validPlaces.zipcodes[0];
      const result = await cli({locations: [zipcode.input]});
      
      expect(result.stdout).toEqual(`${outputPrefixes.zipcodes}\n${zipcode.expected}\n`);
    });

    it('it fetches data with multiple valid "city, state" and "zipcode" formats', async () => {
      const zipcodes = data.validPlaces.zipcodes.map(zipcode => zipcode.input);
      const cities = data.validPlaces.cities.map(city => city.input);
      const expectedZipcodes = `${outputPrefixes.zipcodes}\n${data.validPlaces.zipcodes.map(zipcode => zipcode.expected).join('')}`;
      const expectedCities = `${outputPrefixes.cities}\n${data.validPlaces.cities.map(city => city.expected).join('')}`;

      const result = await cli({locations: zipcodes.concat(cities)});

      expect(result.stdout).toEqual(`${expectedCities}${expectedZipcodes}\n`);
    });
  });

  describe('Invalid Inputs', () => {
    describe('No API_KEY', () => {
      let API_KEY;
      let makeEnvFile = false;
      beforeAll(() => {
        const pathToEnv = getEnvPath();

        if (fs.existsSync(pathToEnv)) {
          makeEnvFile = true;
          const data = fs.readFileSync(pathToEnv).toString();
          const lookupString = 'API_KEY = ';
          API_KEY = data.substring(data.indexOf(lookupString)+lookupString.length);
          fs.unlink(pathToEnv, (err) => {
            if (err) {
              console.error(`Error removing file: ${err}`);
              return;
            }
          });
        }
      });

      afterAll(() => {
        if (makeEnvFile && API_KEY) {
          const pathToEnv = getEnvPath();
          const content = `API_KEY = ${API_KEY}`;
          fs.writeFile(pathToEnv, content, err => {
            if (err) {
              console.error(err);
            }
          });
        }
      });

      it('throws an error when no API key is provided to the program or environment', async () => {
        const result = await cli({locations: [data.validPlaces.zipcodes[0]]});

        expect(result.code).toBe(1);
        expect(result.stderr).toContain(`Missing API_KEY. Set it as an environment variable, in the .env file, or pass it in using -k.`);
        expect(result.stdout).toEqual('');
      });

      it('it fetches data when passed a valid API key', async () => {
        expect(API_KEY).not.toBe(undefined);
        const result = await cli({locations: [data.validPlaces.zipcodes[0].input], key: [API_KEY]});

        expect(result.stdout).toEqual(`${outputPrefixes.zipcodes}\n${data.validPlaces.zipcodes[0].expected}\n`);
      });

      it('it throws an error if the API returns an error', async () => {
        const location = data.validPlaces.zipcodes[0].input;
        const result = await cli({locations: [location], key: ['fakeApiKey']});

        expect(result.code).toBe(0);
        expect(result.stderr).toEqual(`${outputPrefixes.apiErrors}\n\t${location} - Invalid API key. Please see https://openweathermap.org/faq#error401 for more info.\n\n`);
        expect(result.stdout).toEqual('No locations to output\n');
      });
    });

    data.invalidFormats.forEach(invalid => {
      it(`it throws an error if the input is not the proper format: ${invalid.input}`, async () => {
        const result = await cli({locations: [invalid.input]});
        
        expect(result.code).toBe(0);
        expect(result.stderr).toEqual(`${outputPrefixes.invalidErrors}\n\t${invalid.input}\n\n`);
        expect(result.stdout).toEqual('No locations to output\n');
      });
    });

    data.invalidPlaces.cities.forEach(invalid => {
      it(`it throws an error if no location can be found for a city: ${invalid.input}`, async () => {
        const result = await cli({locations: [invalid.input]});
        
        expect(result.code).toBe(0);
        expect(result.stderr).toEqual(`${outputPrefixes.apiErrors}\n\t${invalid.input} - ${invalid.error}\n\n`);
        expect(result.stdout).toEqual('No locations to output\n');
      });
    });

    data.invalidPlaces.zipcodes.forEach(invalid => {
      it(`it throws an error if no location can be found for a zipcode: ${invalid.input}`, async () => {
        const result = await cli({locations: [invalid.input]});
        
        expect(result.code).toBe(0);
        expect(result.stderr).toEqual(`${outputPrefixes.apiErrors}\n\t${invalid.input} - ${invalid.error}\n\n`);
        expect(result.stdout).toEqual('No locations to output\n');
      });
    });

    it('it returns location data for valid inputs along with error data for invalid inputs', async () => {
      const d = {
        validZip: data.validPlaces.zipcodes[0],
        validCity: data.validPlaces.cities[0],
        invalidFormat: data.invalidFormats[0],
        invalidCity: data.invalidPlaces.cities[0],
        invalidZip: data.invalidPlaces.zipcodes[0],
      };

      const input = [
        d.validZip.input,
        d.validCity.input,
        d.invalidFormat.input,
        d.invalidCity.input,
        d.invalidZip.input
      ];

      const result = await cli({locations: input});

      expect(result.code).toBe(0);
      expect(result.stderr).toEqual(`${outputPrefixes.invalidErrors}\n\t${d.invalidFormat.input}\n\n${outputPrefixes.apiErrors}\n\t${d.invalidCity.input} - ${d.invalidCity.error}\n\t${d.invalidZip.input} - ${d.invalidZip.error}\n\n`);
      expect(result.stdout).toEqual(`${outputPrefixes.cities}\n${d.validCity.expected}${outputPrefixes.zipcodes}\n${d.validZip.expected}\n`);
    });
  });
});

function getEnvPath() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const pathToEnv = path.resolve(__dirname, '../.env');
  return pathToEnv;
}

// calls parselocations once w/ args -> index.js
// calls getlocations once w/ args
// calls outputlocations once w/args