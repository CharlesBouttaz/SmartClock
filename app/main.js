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
        weatherInfo: weatherInfoProvider.getWeatherInfo(),
        trafficInfo : trafficProvider.getTraffic()
    };

    var allEssentials = [
        canvasDrawer.drawWeather,
        canvasDrawer.drawAgenda,
        canvasDrawer.drawTraffic,
        canvasDrawer.drawBourse,
        canvasDrawer.drawBus,
        canvasDrawer.drawRSS
    ];

    var essentialsShift = 0;

    setInterval(function () {
        changeBackgroundAndEssentials(canvasContext)
    }, 30000);

    var backgroundIndex = 0;
    function changeBackgroundAndEssentials(canvasContext) {
        if (backgroundIndex > 2) {
            backgroundIndex = 0;
        }
        var backgroundImages = [
            "Background_Black.png",
            "Background_Vintage.png",
            "Background_Zen.png"
        ];
        canvasContext.clockBackground.src = 'images/backgrounds/' + backgroundImages[backgroundIndex++];

        if (essentialsShift == 0) {
            essentialsShift = 3;
        } else {
            essentialsShift = 0;
        }

    }

    setInterval(function () {
        updateClock(canvasContext, dataCtx, allEssentials, essentialsShift)
    }, 1000);

    function updateClock(canvasContext, dataCtx, allEssentials, essentialsShift) {
        canvasDrawer.drawBackground(canvasContext);
        canvasDrawer.drawOriginCircle(canvasContext);
        canvasDrawer.drawNumericTime(canvasContext);
        canvasDrawer.drawAnalogTime(canvasContext);

        allEssentials[0+essentialsShift](canvasContext, dataCtx);
        allEssentials[1+essentialsShift](canvasContext, dataCtx);
        allEssentials[2+essentialsShift](canvasContext, dataCtx);

    }

});