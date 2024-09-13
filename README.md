# Geolocation CLI Utility

This is a CLI utility using OpenWeather API to fetch and return geocoding using "<city>, <state>" or "<zipcode>".

## Setup

1. Clone the repository
2. Install the dependencies

To run the CLI utility using just the utility name and not the `node` keyword, install globally:
```bash
npm install -g geoloc-util
```

To run the CLI utility using the `node` keyword, install locally:
```bash
npm install geoloc-util
```

3. Add your API key

## Running the Utility

### Installed Globally

```bash
geoloc-util --locations "Baltimore, MD" "33709"
```

### Installed Locally
```bash
node ./bin/index.js --locations "Baltimore, MD" "33709"
```

## Running the tests