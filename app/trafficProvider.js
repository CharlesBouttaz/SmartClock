define(['async!https://maps.googleapis.com/maps/api/js?v=3.exp&signed_in=true'], function() {
    // google.maps is defined

    var directionsService = new google.maps.DirectionsService();
    var trafficInfo = {
        trafficIcon: new Image(),
        trafficDuration: null
    };
    //var trafficDuration;

    trafficInfo.trafficIcon = new Image();
    trafficInfo.trafficIcon.src = "images/traffic/Traffic_Icon.png";

    function calcRoute() {
        var start = "Tassin-la-Demi-Lune, France";
        var end = "Lyon, France";
        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                trafficInfo.trafficDuration = Math.round(response.routes[0].legs[0].duration.value / 60);
            }
        });
    }
    calcRoute();

    return {
        getTraffic: function () {
            return trafficInfo;
        }
    };

});