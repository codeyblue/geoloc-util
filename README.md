# Geolocation CLI Utility

This is a CLI utility using OpenWeather API to fetch and return geocoding using "<city>, <state>" or "<zipcode>".

## Setup

1. Clone the repository
```bash
git clone git@github.com:codeyblue/geoloc-util.git
```

2. Install the dependencies

To run the CLI utility using just the utility name and not the `node` keyword, install globally:
```bash
npm install -g geoloc-util
```

To run the CLI utility using the `node` keyword, install locally:
```bash
npm install geoloc-util
```

3. Add your API key to a `.env` file in the root directory. This is required to run the test, but not required to run the tool as long as you pass in a key.
``` title=".env"
OW_API_KEY = [APIKey]
```

## Running the Utility

### Installed Globally

```bash
geoloc-util --locations "Baltimore, MD" "33709"
```

```bash
geoloc-util --locations "Baltimore, MD" "33709" --key "<apikey>"
```

### Installed Locally

```bash
node ./bin/index.js --locations "Baltimore, MD" "33709"
```

```bash
node ./bin/index.js --locations "Baltimore, MD" "33709" --key "<apikey>"
```

## Running the tests

### Entire test suite

```bash
npm test
```

### Coverage report

```bash
npm run coverage
```