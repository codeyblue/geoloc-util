const Parser = {
  parseLocation (location) {
    if (typeof location !== 'string') {
      throw new Error('Passed in location is not of type string');
    }

    const zipRegex = /^\d{5}$/;
    const cityStateRegex = /([A-z]+), ([A-z]{2})$/;
    const type = zipRegex.test(location) ? 'zipcode' : cityStateRegex.test(location) ? 'city' : 'invalid';
    return {type, location};
  },

  outputLocationData(locations) {
    const invalidErrors = locations.errors ? locations.errors.filter(error => error.type === 'invalid').map(error => error.location).join('\n\t') : undefined;
    const apiErrors = locations.errors ? locations.errors.filter(error => error.type !== 'invalid').map(
      error => `${error.location} - ${error.data.error}`).join('\n\t') : undefined;

    const cities = locations.cities ? locations.cities.map(city => `${city.location}
      Name: ${city.data.name}
      Latitude: ${city.data.lat}
      Longitude: ${city.data.lon}
      Country: ${city.data.country}
      State: ${city.data.state}`).join('\n\n') : undefined;

    const zipcodes = locations.zipcodes ? locations.zipcodes.map(zipcode => `${zipcode.location}
      Name: ${zipcode.data.name}
      Latitude: ${zipcode.data.lat}
      Longitude: ${zipcode.data.lon}
      Country: ${zipcode.data.country}`).join('\n\n') : undefined;

    if(invalidErrors) {
      console.error(`error: Invalid input formats\n\t${invalidErrors}\n`);
    }
    
    if (apiErrors) {
      console.error(`error: API Errors\n\t${apiErrors}\n`);
    }

    console.log(!cities && !zipcodes ? 'No locations to output' :
      (cities ? `--- Cities ---\n${cities}\n\n` : '') +
      (zipcodes ? `--- ZipCodes ---\n${zipcodes}\n\n` : ''));
  }
}

export default Parser;