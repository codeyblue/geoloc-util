import fetch from 'node-fetch';

const baseUrl = 'http://api.openweathermap.org/geo/1.0';
const limit = 1;

function filterType(locations, type) {
  return locations.filter(location => location.type === type).map(location => location.location);
}

async function getLocations(locations, API_KEY) {
  const cities = filterType(locations, 'city');
  const zipcodes = filterType(locations, 'zipcode');

  const cityPromises = cities.map(async location => {
    return await getLocationByCity(location, API_KEY);
  })


  const results = await Promise.all(cityPromises);
  return results;
}

async function getLocationByCity(location, API_KEY) {
  const [city, state] = location.split(', ');
  return await fetch(`${baseUrl}/direct?q=${city},${state},US&limit=${limit}&appid=${API_KEY}`)
    .then(response => {
      return response.json();
    })
    .then(data => {
      const {name, lat, lon, country, state} = data[0];
      return {name, lat, lon, country, state};
    })
    .catch(error => {
      console.log(error)
    });
}

export default getLocations;