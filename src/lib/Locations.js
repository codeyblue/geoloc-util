import fetch from 'node-fetch';

const baseUrl = 'http://api.openweathermap.org/geo/1.0';
const limit = 1;

function filterType(locations, type) {
  return locations.filter(l => l.type === type);
}

const Locations = {
  async getLocations(locations, API_KEY) {
    let cities = filterType(locations, 'city');
    let zipcodes = filterType(locations, 'zipcode');
    const invalids = filterType(locations, 'invalid');

    const cityPromises = cities.map(async city => {
      city.data = await getLocationByCity(city.location, API_KEY);
      return city;
    })

    const zipPromises = zipcodes.map(async zipcode => {
      zipcode.data = await getLocationByZip(zipcode.location, API_KEY);
      return zipcode;
    });

    cities = await Promise.all(cityPromises);
    zipcodes = await Promise.all(zipPromises);

    const results = {
      cities: cities.filter(city => !city.data.error),
      zipcodes: zipcodes.filter(zipcode => !zipcode.data.error),
      errors: invalids.concat(cities.filter(city => city.data.error),zipcodes.filter(zipcode => zipcode.data.error))
    }
    
    return results;
  }
}

async function getLocationByCity(cityState, API_KEY) {
  const [city, state] = cityState.split(', ');
  return await fetch(`${baseUrl}/direct?q=${city},${state},US&limit=${limit}&appid=${API_KEY}`)
    .then(response => {
      return response.json();
    })
    .then(data => {
      if (data.length === 0) {
        return {error: `No location found for ${city}, ${state}`};
      }

      return (({name, lat, lon, country, state}) => ({name, lat, lon, country, state}))(data[0]);
    })
    .catch(error => {
      return {error: error.message};
    });
};

async function getLocationByZip(zipcode, API_KEY) {
  return await fetch(`${baseUrl}/zip?zip=${zipcode},US&appid=${API_KEY}`)
    .then(response => {
      return response.json();
    })
    .then(data => {
      if(data.message) {
        if (data.message === 'not found') {
          return {error: `No location found for ${zipcode}`}
        } else {
          return {error: data.message}
        }
      }

      return (({name, lat, lon, country}) => ({name, lat, lon, country}))(data);
    })
    .catch(error => {
      return {error: error.message};
    });
}

export default Locations;