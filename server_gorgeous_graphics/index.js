const express = require('express');
const fetch = require('node-fetch');
const app = express();
const cors = require('cors');
app.use(cors());

async function getJSON(url, apiAction, queryParameters, protocolOptions) {
  console.log(url);
  const response = await fetch(url, protocolOptions);
  if (response) {
      return response.json();
  }
  else {
      throw new Error(`API Access Error ${response.status} for URL: ${urlWithParameters}`);
  }
}

app.get(  
  '/get_data',
  async (req, res, next) => {
    try {
      const weatherData = await getJSON(`https://api.weather.gov/points/${req.query.lat},${req.query.lon}`, '', '', {
          "method": "GET",
          "headers": {
            "User-Agent": 'alex.desbans@duke.edu'
        }
      });
      res.status(200);
      console.log(weatherData);
      var forecastURL = weatherData.properties.forecast;
      const forecastData = await getJSON(forecastURL);
      console.log(forecastData)
      const hourlyURL = weatherData.properties.forecastHourly;
      const hourlyData = await getJSON(hourlyURL);
      res.json({
          forecastData,
          hourlyData
      });
    }
    catch (error) {
      console.log(error);
      const err = new Error('Error: Check server --- one or more APIs are currently unavailable.');
      err.status = 503;
      next(err);
    }
  },
);

const PORT = 3000;
app.listen(PORT, () => console.log('App listening on port ' + PORT));