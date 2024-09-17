import {expect, jest} from '@jest/globals';

import Locations from '../../src/lib/Locations';
import data from '../helpers/test.data.json';
import outputPrefixes from '../../src/utils/output-prefixes.json';

describe('Locations.js unit tests', () => {
  const API_KEY = 'test-api-key';
  const city = data.validPlaces.cities[0];
  const invalidCity = data.invalidPlaces.cities[0];
  const zipcode = data.validPlaces.zipcodes[0];
  const invalidZipcode = data.invalidPlaces.zipcodes[0];
  const invalidFormat = data.invalidFormats[0];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getLocations()', () => {
    it('it returns an object of empty arrays for an invalid input object', async () => {
      const locations = [
        { location: 'object with no type' }
      ]

      jest.spyOn(Locations, 'getLocationByCity');
      jest.spyOn(Locations, 'getLocationByZip');

      const result = await Locations.getLocations(locations, API_KEY);

      expect(Locations.getLocationByCity).toHaveBeenCalledTimes(0);
      expect(Locations.getLocationByZip).toHaveBeenCalledTimes(0);
      expect(result).toEqual({
        cities: [],
        zipcodes: [],
        errors: []
      });

    });

    it('it returns an object of a single city location', async () => {
      const locations = [
        { type: 'city', location: city.input }
      ];

      jest.spyOn(Locations, 'getLocationByCity').mockResolvedValue(city.outputObject);
      jest.spyOn(Locations, 'getLocationByZip');

      const result = await Locations.getLocations(locations, API_KEY);

      expect(Locations.getLocationByCity).toHaveBeenCalledWith(city.input, API_KEY);
      expect(Locations.getLocationByCity).toHaveBeenCalledTimes(1);
      expect(Locations.getLocationByZip).toHaveBeenCalledTimes(0);
      expect(result).toEqual({
        cities: [{...locations[0], data: city.outputObject}],
        zipcodes: [],
        errors: []
      });
    });

    it('it returns an object of city locations', async () => {
      const city2 = data.validPlaces.cities[1];
      const locations = [
        { type: 'city', location: city.input },
        { type: 'city', location: city2.input }
      ];

      jest.spyOn(Locations, 'getLocationByCity').mockResolvedValueOnce(city.outputObject);
      jest.spyOn(Locations, 'getLocationByCity').mockResolvedValueOnce(city2.outputObject);
      jest.spyOn(Locations, 'getLocationByZip');

      const result = await Locations.getLocations(locations, API_KEY);

      expect(Locations.getLocationByCity).toHaveBeenNthCalledWith(1, city.input, API_KEY);
      expect(Locations.getLocationByCity).toHaveBeenNthCalledWith(2, city2.input, API_KEY);
      expect(Locations.getLocationByCity).toHaveBeenCalledTimes(2);
      expect(Locations.getLocationByZip).toHaveBeenCalledTimes(0);
      expect(result).toEqual({
        cities: [
          {...locations[0], data: city.outputObject},
          {...locations[1], data: city2.outputObject}
        ],
        zipcodes: [],
        errors: []
      });
    });

    it('it returns an object of a single zipcode location', async () => {
      const locations = [
        { type: 'zipcode', location: zipcode.input }
      ];

      jest.spyOn(Locations, 'getLocationByZip').mockResolvedValueOnce(zipcode.outputObject);
      jest.spyOn(Locations, 'getLocationByCity');

      const result = await Locations.getLocations(locations, API_KEY);

      expect(Locations.getLocationByZip).toHaveBeenCalledWith(zipcode.input, API_KEY);
      expect(Locations.getLocationByZip).toHaveBeenCalledTimes(1);
      expect(Locations.getLocationByCity).toHaveBeenCalledTimes(0);
      expect(result).toEqual({
        zipcodes: [{...locations[0], data: zipcode.outputObject}],
        cities: [],
        errors: []
      });
    });

    it('it returns an object of zipcode locations', async () => {
      const zipcode2 = data.validPlaces.zipcodes[1];
      const locations = [
        { type: 'zipcode', location: zipcode.input },
        { type: 'zipcode', location: zipcode2.input }
      ];

      jest.spyOn(Locations, 'getLocationByZip').mockResolvedValueOnce(zipcode.outputObject);
      jest.spyOn(Locations, 'getLocationByZip').mockResolvedValueOnce(zipcode2.outputObject);
      jest.spyOn(Locations, 'getLocationByCity');

      const result = await Locations.getLocations(locations, API_KEY);

      expect(Locations.getLocationByZip).toHaveBeenNthCalledWith(1, zipcode.input, API_KEY);
      expect(Locations.getLocationByZip).toHaveBeenNthCalledWith(2, zipcode2.input, API_KEY);
      expect(Locations.getLocationByZip).toHaveBeenCalledTimes(2);
      expect(Locations.getLocationByCity).toHaveBeenCalledTimes(0);
      expect(result).toEqual({
        zipcodes: [
          {...locations[0], data: zipcode.outputObject},
          {...locations[1], data: zipcode2.outputObject}
        ],
        cities: [],
        errors: []
      });
    });

    it('it returns an object of a single unknown city location', async () => {
      const locations = [
        { type: 'city', location: invalidCity.input }
      ];
      const error = `${outputPrefixes.unknownLocation} ${invalidCity}`;

      jest.spyOn(Locations, 'getLocationByCity').mockResolvedValue({error});
      jest.spyOn(Locations, 'getLocationByZip');

      const result = await Locations.getLocations(locations, API_KEY);

      expect(Locations.getLocationByCity).toHaveBeenCalledWith(invalidCity.input, API_KEY);
      expect(Locations.getLocationByCity).toHaveBeenCalledTimes(1);
      expect(Locations.getLocationByZip).toHaveBeenCalledTimes(0);
      expect(result).toEqual({
        errors: [
          {...locations[0], data: {error}}
        ],
        cities: [],
        zipcodes: []
      });
    });

    it('it returns an object of unknown city locations and api errors', async () => {
      const invalidCity2 = data.invalidPlaces.cities[1];
      const locations = [
        { type: 'city', location: invalidCity.input },
        { type: 'city', location: invalidCity2.input }
      ];
      const error1 = `${outputPrefixes.unknownLocation} ${invalidCity}`;
      const error2 = 'API error';

      jest.spyOn(Locations, 'getLocationByCity').mockResolvedValueOnce({error: error1});
      jest.spyOn(Locations, 'getLocationByCity').mockResolvedValueOnce({error: error2});
      jest.spyOn(Locations, 'getLocationByZip');

      const result = await Locations.getLocations(locations, API_KEY);

      expect(Locations.getLocationByCity).toHaveBeenNthCalledWith(1, invalidCity.input, API_KEY);
      expect(Locations.getLocationByCity).toHaveBeenNthCalledWith(2, invalidCity2.input, API_KEY);
      expect(Locations.getLocationByCity).toHaveBeenCalledTimes(2);
      expect(Locations.getLocationByZip).toHaveBeenCalledTimes(0);
      expect(result).toEqual({
        errors: [
          {...locations[0], data: {error: error1}},
          {...locations[1], data: {error: error2}}
        ],
        cities: [],
        zipcodes: []
      });
    });

    it('it returns an object of a single unknown zipcode location', async () => {
      const locations = [
        { type: 'zipcode', location: invalidZipcode.input }
      ];
      const error = `${outputPrefixes.unknownLocation} ${invalidZipcode}`;

      jest.spyOn(Locations, 'getLocationByZip').mockResolvedValue({error});
      jest.spyOn(Locations, 'getLocationByCity');

      const result = await Locations.getLocations(locations, API_KEY);

      expect(Locations.getLocationByZip).toHaveBeenCalledWith(invalidZipcode.input, API_KEY);
      expect(Locations.getLocationByZip).toHaveBeenCalledTimes(1);
      expect(Locations.getLocationByCity).toHaveBeenCalledTimes(0);
      expect(result).toEqual({
        errors: [
          {...locations[0], data: {error}}
        ],
        cities: [],
        zipcodes: []
      });
    });

    it('it returns an object of invalid zipcode locations and api errors', async () => {
      const invalidZipcode2 = data.invalidPlaces.zipcodes[1];
      const locations = [
        { type: 'zipcode', location: invalidZipcode.input },
        { type: 'zipcode', location: invalidZipcode2.input }
      ];
      const error1 = `${outputPrefixes.unknownLocation} ${invalidZipcode}`;
      const error2 = 'API error';

      jest.spyOn(Locations, 'getLocationByZip').mockResolvedValueOnce({error: error1});
      jest.spyOn(Locations, 'getLocationByZip').mockResolvedValueOnce({error: error2});
      jest.spyOn(Locations, 'getLocationByCity');

      const result = await Locations.getLocations(locations, API_KEY);

      expect(Locations.getLocationByZip).toHaveBeenNthCalledWith(1, invalidZipcode.input, API_KEY);
      expect(Locations.getLocationByZip).toHaveBeenNthCalledWith(2, invalidZipcode2.input, API_KEY);
      expect(Locations.getLocationByZip).toHaveBeenCalledTimes(2);
      expect(Locations.getLocationByCity).toHaveBeenCalledTimes(0);
      expect(result).toEqual({
        errors: [
          {...locations[0], data: {error: error1}},
          {...locations[1], data: {error: error2}}
        ],
        cities: [],
        zipcodes: []
      });
    });

    it('it returns an object of a single invalid format', async () => {
      const locations = [
        { type: 'invalid', location: invalidFormat }
      ];

      jest.spyOn(Locations, 'getLocationByZip');
      jest.spyOn(Locations, 'getLocationByCity');

      const result = await Locations.getLocations(locations, API_KEY);

      expect(Locations.getLocationByZip).toHaveBeenCalledTimes(0);
      expect(Locations.getLocationByCity).toHaveBeenCalledTimes(0);
      expect(result).toEqual({
        errors: locations,
        cities: [],
        zipcodes: []
      });
    });

    it('it returns an object of invalid formats', async () => {
      const invalidFormat2 = data.invalidFormats[1];
      const locations = [
        { type: 'invalid', location: invalidFormat },
        { type: 'invalid', location: invalidFormat2 }
      ];

      jest.spyOn(Locations, 'getLocationByZip');
      jest.spyOn(Locations, 'getLocationByCity');

      const result = await Locations.getLocations(locations, API_KEY);

      expect(Locations.getLocationByZip).toHaveBeenCalledTimes(0);
      expect(Locations.getLocationByCity).toHaveBeenCalledTimes(0);
      expect(result).toEqual({
        errors: locations,
        cities: [],
        zipcodes: []
      });
    });

    it('it returns an object of valid cities and zipcodes, invalid cities and zipcodes, and invalid formats', async () => {
      const locations = [
        { type: 'city', location: city.input },
        { type: 'zipcode', location: zipcode.input },
        { type: 'city', location: invalidCity.input },
        { type: 'zipcode', location: invalidZipcode },
        { type: 'invalid', location: invalidFormat}
      ];

      const error1 = `${outputPrefixes.unknownLocation} ${invalidCity.input}`;
      const error2 = `${outputPrefixes.unknownLocation} ${invalidZipcode.input}`;

      jest.spyOn(Locations, 'getLocationByCity').mockResolvedValueOnce(city.outputObject);
      jest.spyOn(Locations, 'getLocationByCity').mockResolvedValueOnce({error: error1});
      jest.spyOn(Locations, 'getLocationByZip').mockResolvedValueOnce(zipcode.outputObject);
      jest.spyOn(Locations, 'getLocationByZip').mockResolvedValueOnce({error: error2});

      const result = await Locations.getLocations(locations, API_KEY);

      expect(Locations.getLocationByCity).toHaveBeenCalledWith(city.input, API_KEY);
      expect(Locations.getLocationByZip).toHaveBeenCalledWith(zipcode.input, API_KEY);
      expect(Locations.getLocationByZip).toHaveBeenCalledTimes(2);
      expect(Locations.getLocationByCity).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        cities: [{...locations[0], data: city.outputObject}],
        zipcodes: [{...locations[1], data: zipcode.outputObject}],
        errors: [
          {...locations[4]},
          {...locations[2], data: {error: error1}},
          {...locations[3], data: {error: error2}}
        ]
      });
    });
  });
});