import createProgram from "../../src/utils/cli";

let program;;

beforeEach(() => {
  program = createProgram();
});

describe('cli.js unit tests', () => {
  describe('createProgram()', () => {
    const locations = ['Baltimore, MD', '39532'];
    it('it has the proper options', () => {
      const expectedOptions = ['-V, --version', '-l, --locations <locations...>', '-k, --key <apikey>'];

      expect(program.options.map(option => option.flags)).toEqual(expectedOptions);
    });

    it('it sets the opts properly', () => {
      const opts = { locations, key: 'fakeApiKey' };
      const args = ['node', './bin/index.js', '--locations', opts.locations[0], opts.locations[1], '--key', opts.key];
      
      program.parse(args);

      expect(program.rawArgs).toEqual(args)
      expect(program.opts()).toEqual(opts);
    });

    it(`it doesn't require an api key option`, () => {
      const opts = { locations };
      const args = ['node', './bin/index.js', '--locations', opts.locations[0], opts.locations[1]];
      
      program.parse(args);

      expect(program.rawArgs).toEqual(args)
      expect(program.opts()).toEqual(opts);
    });
  });
});