define(function () {
    var weatherInfoResult = {
        weatherIcon: new Image(),
        tempMin: null,
        tempMax: null,
        weatherMessage: null
    };

    var weatherUrl = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20%28select%20woeid%20from%20geo.places%281%29%20where%20text%3D%22lyon%22%29&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
    var weatherHttpRequest = new XMLHttpRequest();
    weatherHttpRequest.onreadystatechange = parseWeatherResponse;
    weatherHttpRequest.open('GET', weatherUrl);
    weatherHttpRequest.send();

    function parseWeatherResponse() {
        if (weatherHttpRequest.readyState === 4) {
            if (weatherHttpRequest.status === 200) {
                var weatherResponse = JSON.parse(weatherHttpRequest.responseText);
                var todayForecast = weatherResponse.query.results.channel.item.forecast[0];
                weatherInfoResult.tempMin = Math.round((todayForecast.low - 32) * 5 / 9);
                weatherInfoResult.tempMax = Math.round((todayForecast.high - 32) * 5 / 9);
                weatherInfoResult.weatherMessage = weatherLabels[todayForecast.code];
                weatherInfoResult.weatherIcon.src = 'images/weather/' + weatherLabels[todayForecast.code];

            } else {
                //TODO handle cnx errors
//                    alert('There was a problem with the request.');
            }
        }
    }

    var weatherLabels = [
        "Storm rain.png", //"tornado",
        "Storm rain.png", //"tropical storm",
        "Storm rain.png", //"hurricane",
        "Storm rain.png", //"severe thunderstorms",
        "Storm rain.png", //"thunderstorms",
        "Rain.png", //"mixed rain and snow",
        "Rain.png", //"mixed rain and sleet",
        "Rain.png", //"mixed snow and sleet",
        "Rain.png", //"freezing drizzle",
        "Rain.png", //"drizzle",
        "Rain.png", //"freezing rain",
        "Rain.png", //"showers",
        "Rain.png", //"showers",
        "Rain.png", //"snow flurries",
        "Rain.png", //"light snow showers",
        "Rain.png", //"blowing snow",
        "Rain.png", //"snow",
        "Rain.png", //"hail",
        "Rain.png", //"sleet",
        "cloudy.png", //"dust",
        "cloudy.png", //"foggy",
        "cloudy.png", //"haze",
        "cloudy.png", //"smoky",
        "Storm rain.png", //"blustery",
        "cloudy.png", //"windy",
        "cloudy.png", //"cold",
        "cloudy.png", //"cloudy",
        "cloudy.png", //"mostly cloudy (night)",
        "cloudy.png", //"mostly cloudy (day)",
        "Cloudy Sun.png", //"partly cloudy (night)",
        "Cloudy Sun.png", //"partly cloudy (day)",
        "Sunny.png", //"clear (night)",
        "Sunny.png", //"sunny",
        "Eclaircie.png", //"fair (night)",
        "Eclaircie.png", //"fair (day)",
        "Eclaircie.png", //"mixed rain and hail",
        "Sunny.png", //"hot",
        "Storm rain.png", //"isolated thunderstorms",
        "Storm rain.png", //"scattered thunderstorms",
        "Storm rain.png", //"scattered thunderstorms",
        "Rain.png", //"scattered showers",
        "Rain.png", //"heavy snow",
        "Sunny cloud.png", //"scattered snow showers",
        "Rain.png", //"heavy snow",
        "Cloudy Sun.png", //"partly cloudy",
        "Storm rain.png", //"thundershowers",
        "Rain.png", //"snow showers",
        "Storm rain.png", //"isolated thundershowers",
        "Cloudy Sun.png"]; //"not available"

    return {
        getWeatherInfo: function () {
            return weatherInfoResult;
        }
    };
});