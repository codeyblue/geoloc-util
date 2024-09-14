import cli from "./test-helper.js";
import createProgram from '../src/utils/cli.js';

describe('Unit Tests', () => {
  describe('Valid Inputs', () => {
    describe('CLI tool', () => {
      it('it has the proper options', () => {
        const expectedOpts = { locations: ['Baltimore, MD', '39532'], key: 'fakeApiKey' };
        const expectedOptions = ['-V, --version', '-l, --locations <locations...>', '-k, --key <apikey>'];
        const expectedArgs = ['node', './bin/index.js', '--locations', 'Baltimore, MD', '39532', '--key', 'fakeApiKey'];
        
        const program = createProgram();
        program.parse(expectedArgs);

        expect(program.options.map(option => option.flags)).toEqual(expectedOptions);
        expect(program.rawArgs).toEqual(expectedArgs)
        expect(program.opts()).toEqual(expectedOpts);
      });
      it.skip(`it doesn't require an api key option`, () => {});
      it.skip('it sets the API_KEY variable when passed in', () => {});
      it.skip('it sets the API_KEY variable when set in the environment', () => {});
      it.skip('it calls getLocations once', () => {});
      it.skip('it calls outputlocation data once', () => {});
    });
  });

  describe('Invalid Inputs', () => {
    describe('CLI tool', () => {
      it('it throws an error if the "locations" argument is missing', async () => {
        const result = await cli({key: ['fakeApiKey']});
        
        expect(result.code).toBe(1);
        expect(result.stderr).toEqual(`error: required option '-l, --locations <locations...>' not specified\n`);
      });

      it('it throws an error when locations is empty', async () => {
        const result = await cli({locations: [], key: ['fakeApiKey']});
        
        expect(result.code).toBe(1);
        expect(result.stderr).toContain(`Error: Locations cannot be empty.`);
      });

      it('throws an error when no API key is provided to the program or environment', () => {});
    })
  });
});