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
        "simple_weather_icon_03.png", //"tornado",
        "simple_weather_icon_03.png", //"tropical storm",
        "simple_weather_icon_03.png", //"hurricane",
        "simple_weather_icon_03.png", //"severe thunderstorms",
        "simple_weather_icon_03.png", //"thunderstorms",
        "simple_weather_icon_03.png", //"mixed rain and snow",
        "simple_weather_icon_03.png", //"mixed rain and sleet",
        "simple_weather_icon_03.png", //"mixed snow and sleet",
        "simple_weather_icon_03.png", //"freezing drizzle",
        "simple_weather_icon_03.png", //"drizzle",
        "simple_weather_icon_03.png", //"freezing rain",
        "simple_weather_icon_03.png", //"showers",
        "simple_weather_icon_03.png", //"showers",
        "simple_weather_icon_03.png", //"snow flurries",
        "simple_weather_icon_03.png", //"light snow showers",
        "simple_weather_icon_03.png", //"blowing snow",
        "simple_weather_icon_03.png", //"snow",
        "simple_weather_icon_03.png", //"hail",
        "simple_weather_icon_03.png", //"sleet",
        "simple_weather_icon_03.png", //"dust",
        "simple_weather_icon_03.png", //"foggy",
        "simple_weather_icon_03.png", //"haze",
        "simple_weather_icon_03.png", //"smoky",
        "simple_weather_icon_03.png", //"blustery",
        "simple_weather_icon_03.png", //"windy",
        "simple_weather_icon_03.png", //"cold",
        "simple_weather_icon_04.png", //"cloudy",
        "simple_weather_icon_04.png", //"mostly cloudy (night)",
        "simple_weather_icon_04.png", //"mostly cloudy (day)",
        "simple_weather_icon_07.png", //"partly cloudy (night)",
        "simple_weather_icon_03.png", //"partly cloudy (day)",
        "simple_weather_icon_02.png", //"clear (night)",
        "simple_weather_icon_01.png", //"sunny",
        "simple_weather_icon_01.png", //"fair (night)",
        "simple_weather_icon_01.png", //"fair (day)",
        "simple_weather_icon_21.png", //"mixed rain and hail",
        "simple_weather_icon_01.png", //"hot",
        "simple_weather_icon_17.png", //"isolated thunderstorms",
        "simple_weather_icon_01.png", //"scattered thunderstorms",
        "simple_weather_icon_01.png", //"scattered thunderstorms",
        "simple_weather_icon_01.png", //"scattered showers",
        "simple_weather_icon_01.png", //"heavy snow",
        "simple_weather_icon_01.png", //"scattered snow showers",
        "simple_weather_icon_01.png", //"heavy snow",
        "simple_weather_icon_06.png", //"partly cloudy",
        "simple_weather_icon_01.png", //"thundershowers",
        "simple_weather_icon_01.png", //"snow showers",
        "simple_weather_icon_01.png", //"isolated thundershowers",
        "simple_weather_icon_01.png"]; //"not available"

    return {
        getWeatherInfo: function () {
            return weatherInfoResult;
        }
    };
});