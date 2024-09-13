function parseLocation(location, previous) {
  const zipRegex = /\d{5}$/;
  const cityStateRegex = /([A-z]+), ([A-z]{2})$/;
  const type = zipRegex.test(location) ? 'zipcode' : cityStateRegex.test(location) ? 'city' : 'invalid';
  return previous.concat({type, location});
}

export default parseLocation;