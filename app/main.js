define(function (require) {

    var weatherInfoProvider = require('./weatherInfoProvider');
    var trafficProvider = require('./trafficProvider');
    var canvasDrawer = require('./canvasDrawer');

    var canvas = document.getElementById("clock");


    var defaultClockBackground = new Image();
    defaultClockBackground.src = 'images/Cadran.png';

    var canvasCtx = {
        width: canvas.width,
        height: canvas.height,
        context: canvas.getContext("2d"),
        fontType: "Calibri",
        /** Rayon de l'horloge */
        clockRadius: canvas.width / 2,
        clockBackground : defaultClockBackground,
        getCenterX: function () {
            return this.width / 2;
        },
        getCenterY: function () {
            return this.height / 2;
        },
        getClockRadius: function () {
            return canvas.width / 2;
        },
        setFontSize: function (size) {
            this.context.font = size + "pt " + this.fontType;
        }
    };

    var dataCtx = {
        weatherInfo: weatherInfoProvider.getWeatherInfo()
    };

    setInterval(function () {
        updateClock(canvasCtx, dataCtx)
    }, 1000);

    function updateClock(canvasContext) {
        canvasDrawer.resetCanvas(canvasContext);
        canvasDrawer.drawOriginCircle(canvasContext);
        canvasDrawer.drawHourMarkers(canvasContext);
        canvasDrawer.drawAnalogTime(canvasContext);
        canvasDrawer.drawNumericTime(canvasContext);
        canvasDrawer.drawWeather(canvasContext, dataCtx.weatherInfo);
        //TODO CBO gestion Async
        if (trafficProvider != undefined) {
            canvasDrawer.drawTraffic(canvasContext, trafficProvider.getTraffic());
        }
    }

});