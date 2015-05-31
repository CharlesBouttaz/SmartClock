define(function (require) {

    var weatherInfoProvider = require('./weatherInfoProvider');
    var trafficProvider = require('./trafficProvider');
    var canvasDrawer = require('./canvasDrawer');

    var canvas = document.getElementById("clock");


    var defaultClockBackground = new Image();
    defaultClockBackground.src = 'images/backgrounds/Background_Black.png';

    var canvasContext = {
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
        },
        getProportionalY: function(heightRatio){
            return this.getCenterY() + this.getClockRadius() / heightRatio;
        }
    };

    var dataCtx = {
        weatherInfo: weatherInfoProvider.getWeatherInfo()
    };

    setInterval(function () {
        updateClock(canvasContext, dataCtx)
    }, 1000);

    function updateClock(canvasContext) {
        canvasDrawer.drawBackground(canvasContext);
        canvasDrawer.drawOriginCircle(canvasContext);
        canvasDrawer.drawAnalogTime(canvasContext);
        canvasDrawer.drawNumericTime(canvasContext);
        canvasDrawer.drawWeather(canvasContext, dataCtx.weatherInfo);
        canvasDrawer.drawAgenda(canvasContext);
        //TODO CBO gestion Async
        if (trafficProvider != undefined) {
            canvasDrawer.drawTraffic(canvasContext, trafficProvider.getTraffic());
        }
    }

});