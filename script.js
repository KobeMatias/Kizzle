$(document).ready(function() {
    var searchBar = $("#searchBar");

    function updateTime() {
        var date = moment().format('MMMM Do YYYY, h:mm:ss a');
        $("#clock").text(date);
    }
    setInterval(updateTime, 1000);

    function getLocation() {
        navigator.geolocation.getCurrentPosition(showPosition);
        showPosition();
    }

    function showPosition(position) {
        var longitude = position.coords.longitude;
        var latitude = position.coords.latitude;
        console.log(longitude);
        console.log(latitude);

        var APIKeyWeather = "cb1577afa812f61cbe09d858ec81e6a7"
        var APIKeyGoogle = "AIzaSyAOY009CGgDZyGzU8xEcUZ337wPd_M054g"
        
        var googleURL = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&key=" + APIKeyGoogle;
        var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&appid=" + APIKeyWeather;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            console.log(response);
            var tempEl = $("#temp");
            var humidityEl = $("#humidity");
            var windSpeedEl = $("#windSpeed");
            var uviEl = $("#uvIndex");

            var tempData = (response.current.temp - 273.15) * 1.80 + 32;
            var humidityData = response.current.humidity;
            var windData = response.current.wind_speed;
            var uviData = response.current.uvi;

            tempEl.append("Temperature: " + tempData + " F");
            humidityEl.append("Humidity: " + humidityData);
            windSpeedEl.append("Wind Speed: " + windData);
            uviEl.append("UV Index: " + uviData);
        });

        $.ajax({
            url: googleURL,
            method: "GET"
        }).then(function(response) {
            console.log(response);
            var cityDiv = $("#cityName");
            var cityData = response.results[6].formatted_address;
            var cityDisplay = $("<p>").text(cityData);
            cityDiv.append(cityDisplay);
        });
    }
    getLocation();

})