import fetch from 'node-fetch';

const baseUrl = 'http://api.openweathermap.org/geo/1.0';
const limit = 1;

function filterType(locations, type) {
  return locations.filter(location => location.type === type).map(location => location.location);
}

async function getLocations(locations, API_KEY) {
  const cities = filterType(locations, 'city');
  const zipcodes = filterType(locations, 'zipcode');

  const cityPromises = cities.map(async city => {
    return await getLocationByCity(city, API_KEY);
  })

  const zipPromises = zipcodes.map(async zipcode => {
    return await getLocationByZip(zipcode, API_KEY);
  });


  const results = await Promise.all(cityPromises.concat(zipPromises));
  return results;
}

async function getLocationByCity(cityState, API_KEY) {
  const [city, state] = cityState.split(', ');
  return await fetch(`${baseUrl}/direct?q=${city},${state},US&limit=${limit}&appid=${API_KEY}`)
    .then(response => {
      return response.json();
    })
    .then(data => {
      if (data.length === 0) {
        return {error: `No location found for ${city}, ${state}`, city, state};
      }

      return (({name, lat, lon, country, state}) => ({name, lat, lon, country, state}))(data[0]);
    })
    .catch(error => {
      return {error: error.message, city, state};
    });
}

async function getLocationByZip(zipcode, API_KEY) {
  return await fetch(`${baseUrl}/zip?zip=${zipcode},US&appid=${API_KEY}`)
    .then(response => {
      return response.json();
    })
    .then(data => {
      if (data.length === 0) {
        return {error: `No location found for ${zipcode}`, zipcode};
      }

      return (({name, lat, lon, country}) => ({name, lat, lon, country}))(data);
    })
    .catch(error => {
      return {error: error.message, zipcode};
    });
  }

export default getLocations;