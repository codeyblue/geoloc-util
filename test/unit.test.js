  const {cli} = require('./test-helper.test.js');

  describe('Unit Tests', () => {
    describe('Valid Inputs', () => {
      it('returns an object of the locations', async () => {
        const result = await cli(['Baltimore, MD', '33709', 'x']);
        const expected = `Options:{locations:[{type:'city',location:'Baltimore,MD'},{type:'zipcode',location:'33709'},{type:'invalid',location:'x'}]}`;
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