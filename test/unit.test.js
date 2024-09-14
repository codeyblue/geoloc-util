import cli from "./test-helper.js";

  describe('Unit Tests', () => {
    describe('Valid Inputs', () => {
      it('returns an object of the locations', async () => {
        const result = await cli(['Baltimore, MD', '33709', 'x']);
        const expected = `---Cities---Baltimore,MDName:BaltimoreLatitude:39.2908816Longitude:-76.610759Country:USState:Maryland---ZipCodes---33709Name:PinellasCountyLatitude:27.8201Longitude:-82.7308Country:US`;
        expect(result.stdout.replace(/[ \t\n\r]/gm, '')).toBe(expected);
      })
      it('it fetches data with a valid "city, state" format', () => {});
      it('it fetches data with a valid "zipcode" format', () => {});
      it('it fetches data with multiple valid "city, state" and "zipcode" formats', () => {});
    });

    describe('Invalid Inputs', () => {
      it('it throws an error if the "locations" argument is missing', () => {});
      it('it throws an error if the "locations" argument is empty', () => {});
      it('it throws an error if the "city, state" is not the proper format', () => {});
      it('it throws an error if the "zipcode" is not the proper format', () => {});
      it('it returns location data for valid inputs along with error data for invalid inputs', () => {});
    });
  });