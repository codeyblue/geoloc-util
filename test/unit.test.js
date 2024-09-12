describe('Unit Tests', () => {
  describe('Valid Inputs', () => {
    it('it fetches data with a valid "city, state" format');
    it('it fetches data with a valid "zipcode" format');
    it('it fetches data with multiple valid "city, state" and "zipcode" formats');
  });

  describe('Invalid Inputs', () => {
    it('it throws an error if the "locations" argument is missing');
    it('it throws an error if the "locations" argument is empty');
    it('it throws an error if the "city, state" is not the proper format');
    it('it throws an error if the "zipcode" is not the proper format');
    it('it returns location data for valid inputs along with error data for invalid inputs');
  });
});