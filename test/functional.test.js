import cli from "./test-helper.js";
import data from './test.data.json';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

describe('Functional Tests', () => {
  describe('Valid Inputs', () => {
    data.validPlaces.cities.forEach(city => {
      it(`it fetches data with a valid "city, state" format: ${city.input}`, async () => {
        const result = await cli({locations: [city.input]});
        
        expect(formatOutput(result.stdout)).toEqual(`---Cities---${city.expected}`);
      });
    });

    it('it fetches data with a valid "zipcode" format', async () => {
      const zipcode = data.validPlaces.zipcodes[0];
      const result = await cli({locations: [zipcode.input]});
      
      expect(formatOutput(result.stdout)).toEqual(`---ZipCodes---${zipcode.expected}`);
    });

    it('it fetches data with multiple valid "city, state" and "zipcode" formats', async () => {
      const zipcodes = data.validPlaces.zipcodes.map(zipcode => zipcode.input);
      const cities = data.validPlaces.cities.map(city => city.input);
      const expectedZipcodes = '---ZipCodes---' + data.validPlaces.zipcodes.map(zipcode => zipcode.expected).join('');
      const expectedCities = '---Cities---' + data.validPlaces.cities.map(city => city.expected).join('');

      const result = await cli({locations: zipcodes.concat(cities)});

      expect(formatOutput(result.stdout)).toEqual(expectedCities.concat(expectedZipcodes));
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

        expect(formatOutput(result.stdout)).toEqual(`---ZipCodes---${data.validPlaces.zipcodes[0].expected}`);
      });

      it('it throws an error if the API returns an error', async () => {
        const result = await cli({locations: [data.validPlaces.zipcodes[0].input], key: ['fakeApiKey']});

        expect(result.code).toBe(0);
        expect(formatOutput(result.stderr)).toEqual(`error:APIErrors54880-InvalidAPIkey.Pleaseseehttps://openweathermap.org/faq#error401formoreinfo.`);
        expect(formatOutput(result.stdout)).toEqual('Nolocationstooutput');
      });
    });

    data.invalidFormats.forEach(invalid => {
      it(`it throws an error if the input is not the proper format: ${invalid.input}`, async () => {
        const result = await cli({locations: [invalid.input]});
        
        expect(result.code).toBe(0);
        expect(formatOutput(result.stderr)).toEqual(invalid.error);
        expect(formatOutput(result.stdout)).toEqual('Nolocationstooutput');
      });
    });

    data.invalidPlaces.forEach(invalid => {
      it.only(`it throws an error if no location can be found: ${invalid.input}`, async () => {
        const result = await cli({locations: [invalid.input]});
        
        expect(result.code).toBe(0);
        expect(formatOutput(result.stderr)).toEqual(invalid.error);
        expect(formatOutput(result.stdout)).toEqual('Nolocationstooutput');
      });
    });

    it('it returns location data for valid inputs along with error data for invalid inputs', async () => {
      const d = {
        validZip: data.validPlaces.zipcodes[0],
        validCity: data.validPlaces.cities[0],
        invalidFormat: data.invalidFormats[0],
        invalidPlace: data.invalidPlaces[0]
      };

      const input = [
        d.validZip.input,
        d.validCity.input,
        d.invalidFormat.input,
        d.invalidPlace.input
      ];

      const result = await cli({locations: input});

      expect(result.code).toBe(0);
      expect(formatOutput(result.stderr)).toEqual(`${d.invalidFormat.error}${d.invalidPlace.error}`);
      expect(formatOutput(result.stdout)).toEqual(`---Cities---${d.validCity.expected}---ZipCodes---${d.validZip.expected}`);
    });
  });
});

function formatOutput(output) {
  return output.replace(/[ \t\n\r]/gm, '');
}

function getEnvPath() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const pathToEnv = path.resolve(__dirname, '../.env');
  return pathToEnv;
}