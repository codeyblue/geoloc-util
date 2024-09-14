import { program } from 'commander';

function createProgram() {
  program
    .version('1.0.0')
    .description('Fetch geolocation data for a list of locations')
    .requiredOption('-l, --locations <locations...>', 'List of space-separated locations to look up')
    .option('-k, --key <apikey>', 'API key for OpenWeather, if not set in the .env or environment')
    .usage('--locations <locations...>');

  program.addHelpText('after', `

    Example call:
      $ geoloc-util --locations "Baltimore, MD" "12345"`);
  
  return program;
}

export default createProgram;