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

    var backgroundIndex = 0;
    function changeBackground(canvasContext) {
        if (backgroundIndex > 2) {
            backgroundIndex = 0;
        }
        var backgroundImages = [
            "Background_Vintage.png",
            "Background_Zen.png",
            "Background_Black.png"
            ];
        canvasContext.clockBackground.src = 'images/backgrounds/' + backgroundImages[backgroundIndex++];
    }

    //TODO: use requestAnimationFrame(callback) instead of setInterval

    var countClock = 0;
    var countScreen = 0;
    var clockIntervalID;
    var screenIntervalID;
    var screenSaverSpeed = 45;
    var nbSecBeforeScreenSaver = 15;

    var goClock = function () {
        window.clearInterval(screenIntervalID);
        countClock++;
        updateClock(canvasContext, dataCtx);
        if (countClock > nbSecBeforeScreenSaver) {
            countClock = 0;
            window.clearInterval(clockIntervalID);
            canvasContext.context.clearRect(0, 0, canvasContext.width, canvasContext.height);
            screenIntervalID = setInterval(goScreenSaver, screenSaverSpeed);
        }
    };

    var goScreenSaver = function () {
        window.clearInterval(clockIntervalID);
        countScreen++;
        draw_frame(canvasContext, dataCtx);

        if (countScreen > 5*screenSaverSpeed) {
            changeBackground(canvasContext);

            countScreen = 0;
            window.clearInterval(screenIntervalID);
            canvasContext.context.clearRect(0, 0, canvasContext.width, canvasContext.height);
            clockIntervalID = setInterval(goClock, 1000);
        }
    };

    clockIntervalID = setInterval(goClock, 1000);

    function updateClock(canvasContext) {
        canvasDrawer.drawBackground(canvasContext);
        canvasDrawer.drawOriginCircle(canvasContext);
        canvasDrawer.drawNumericTime(canvasContext);
        canvasDrawer.drawWeather(canvasContext, dataCtx.weatherInfo);
        canvasDrawer.drawAgenda(canvasContext);
        //TODO CBO gestion Async
        if (trafficProvider != undefined) {
            canvasDrawer.drawTraffic(canvasContext, dataCtx.trafficInfo);
        }
        canvasDrawer.drawAnalogTime(canvasContext);
    }


    //TODO move to separate module




    var start_width = 20;           // starting width of each branch
    var frame_time = 30;            // milliseconds per frame
    var straighten_factor = 0.95;   // value from 0 to 1, factor applied to direction_offset every frame
    var curviness = 0.2;            // amount of random direction change each frame

    var color_speed = 0.03;     // speed at which colors change when cycling is enabled
    var branch_shrink = 0.95;   // factor by which branches shrink every frame
    var min_width = 1;          // minimum width for branch, after which they are discontinued
    var branch_opacity = 0.4;   // opacity of lines drawn
    var width = canvasContext.width;            // width and height of canvas
    var height = canvasContext.height;
    var branch_count = 3;       // branch count per tree
    var branch_bud_size = 0.5;  // ratio of original branch size at which branch will split
    var branch_bud_angle = 1;   // angle offset for split branch;

    var paper;                  // reference to graphics context
    var branches = Object();    // linked list of active branches
    var color_styles = [];      // pre-computed list of colors as styles. format: (r,g,b,a)
    var direction_offset = 0;   // current direction offset in radians.  this is applied to all branches.
    var frame = 0;              // frame counter

    // preferences object, contains an attribute for each user setting
    var prefs = {
        wrap: true,             // causes branches reaching edge of viewable area to appear on opposite side
        randomize: false,        // randomize position of new branches
        fade: false,             // fade existing graphics on each frame
        cycle: true,            // gradually change colors each frame
        new_branch_frames: 20    // number of frames elapsed between each auto-generated tree
    };

    // create tree at the specified position with number of branches
    function create_tree(branches, start_width, position, branch_count) {
        var angle_offset = Math.PI * 2 / branch_count;
        for (var i = 0; i < branch_count; ++i) {
            branch_add(branches, new Branch(position, angle_offset * i, start_width));
        }
    }

    // add branch to collection
    function branch_add(branches, branch) {
        branch.next = branches.next;
        branches.next = branch;
    }

    // get the coordinates for the position of a new tree
    // if not random, use the center of the canvas
    function get_new_tree_center(width, height, randomize) {
        return {
            x: (randomize ? Math.random() : 0.5) * width,
            y: (randomize ? Math.random() : 0.5) * height
        };
    }

    // Branch constructor
    // position has x and y properties
    // direction is in radians
    function Branch(position, direction, width) {
        this.x = position.x;
        this.y = position.y;
        this.width = width;
        this.original_width = width;
        this.direction = direction;
    }

    // update position, direction and width of a particular branch
    function branch_update(branches, branch, paper) {
        paper.beginPath();
        paper.lineWidth = branch.width;
        paper.moveTo(branch.x, branch.y);

        branch.width *= branch_shrink;
        branch.direction += direction_offset;
        branch.x += Math.cos(branch.direction) * branch.width;
        branch.y += Math.sin(branch.direction) * branch.width;

        paper.lineTo(branch.x, branch.y);
        paper.stroke();

        if (prefs.wrap) wrap_branch(branch, width, height);

        if (branch.width < branch.original_width * branch_bud_size) {
            branch.original_width *= branch_bud_size;
            branch_add(branches, new Branch(branch, branch.direction + 1, branch.original_width));
        }
    }

    function draw_frame() {
        if (prefs.fade) {
            paper.fillRect(0, 0, width, height);
        }

        if (prefs.cycle) {
            paper.strokeStyle = color_styles[frame % color_styles.length];
        }

        if (++frame % prefs.new_branch_frames == 0) {
            create_tree(branches, start_width, get_new_tree_center(width, height, prefs.randomize), branch_count);
        }

        direction_offset += Math.random() * curviness - curviness / 2;
        direction_offset *= straighten_factor;

        var branch = branches;
        var prev_branch = branches;
        while (branch = branch.next) {
            branch_update(branches, branch, paper);

            if (branch.width < min_width) {
                // remove branch from list
                prev_branch.next = branch.next;
            }
            prev_branch = branch;
        }

    }

    // constrain branch position to visible area by "wrapping" from edge to edge
    function wrap_branch(branch, width, height) {
        branch.x = positive_mod(branch.x, width);
        branch.y = positive_mod(branch.y, height);
    }

    // for a < 0, b > 0, javascript returns a negative number for a % b
    // this is a variant of the % operator that adds b to the result in this case
    function positive_mod(a, b) {
        // ECMA 262 11.5.3: Applying the % Operator
        // remainder operator does not convert operands to integers,
        // although negative results are possible

        return ((a % b) + b) % b;
    }

    // pre-compute color styles that will be used for color cycling
    function populate_colors(color_speed, color_styles, branch_opacity) {
        // used in calculation of RGB values
        var two_thirds_pi = Math.PI * 2 / 3;
        var four_thirds_pi = Math.PI * 4 / 3;
        var two_pi = Math.PI * 2;

        // hue does represent hue, but not in the conventional HSL scheme
        for(var hue = 0; hue < two_pi; hue += color_speed) {
            var r = Math.floor(Math.sin(hue) * 128 + 128);
            var g = Math.floor(Math.sin(hue + two_thirds_pi) * 128 + 128);
            var b = Math.floor(Math.sin(hue + four_thirds_pi) * 128 + 128);
            color = "rgba(" + [r, g, b, branch_opacity].join() + ")";

            color_styles.push(color);
        }
    }

    // apply initial settings to canvas object
    function setup_canvas() {
        var canvas = document.getElementById("clock");
        canvas.width = width;
        canvas.height = height;

        paper = canvas.getContext("2d");
        paper.fillStyle = "rgb(0, 0, 0)";
        paper.fillRect(0, 0, width, height);
        paper.fillStyle = "rgba(0, 0, 0, 0.005)";

        paper.strokeStyle = "rgba(128, 128, 64, " + String(branch_opacity) + ")";
    }

    // called before any frames are drawn.  initializes stuff.
    function setup() {
        populate_colors(color_speed, color_styles, branch_opacity);
        setup_canvas();

    }

    setup();


});