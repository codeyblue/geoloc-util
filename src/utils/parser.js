const Parser = {
  parseLocation (location) {
    const zipRegex = /^\d{5}$/;
    const cityStateRegex = /([A-z]+), ([A-z]{2})$/;
    const type = zipRegex.test(location) ? 'zipcode' : cityStateRegex.test(location) ? 'city' : 'invalid';
    return {type, location};
  },

  outputLocationData(locations) {
    const invalidErrors = locations.errors.filter(error => error.type === 'invalid').map(error => error.location).join('\n\t');
    const apiErrors = locations.errors.filter(error => error.type !== 'invalid').map(
      error => `${error.location} - ${error.data.error}`).join('\n\t');

    const cities = locations.cities.map(city => `${city.location}
      Name: ${city.data.name}
      Latitude: ${city.data.lat}
      Longitude: ${city.data.lon}
      Country: ${city.data.country}
      State: ${city.data.state}`).join('\n\n');

    const zipcodes = locations.zipcodes.map(zipcode => `${zipcode.location}
      Name: ${zipcode.data.name}
      Latitude: ${zipcode.data.lat}
      Longitude: ${zipcode.data.lon}
      Country: ${zipcode.data.country}`).join('\n\n');

    if(invalidErrors) {
      console.error(`error: Invalid input formats\n\t${invalidErrors}\n`);
    }
    
    if (apiErrors) {
      console.error(`error: API Errors\n\t${apiErrors}\n`);
    }

    console.log(cities.length <= 0 && zipcodes.length <= 0 ? 'No output' :
      (cities.length > 0 ? `--- Cities ---\n ${cities}\n\n` : '') +
      (zipcodes.length > 0 ? `--- ZipCodes ---\n ${zipcodes}\n\n` : ''));
  }
}

export default Parser;