$(document).ready(function() {

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
            var tempDataRounded = tempData.toFixed(2);
            var humidityData = response.current.humidity;
            var windData = response.current.wind_speed;
            var uviData = response.current.uvi;

            tempEl.append("Temperature: " + tempDataRounded + " F");
            humidityEl.append("Humidity: " + humidityData);
            windSpeedEl.append("Wind Speed: " + windData);
            uviEl.append("UV Index: " + uviData);

            for (i = 1; i < 6; i++) {
                var forecastDate = moment().add(i, 'days').format('L');  
                var forecastCol = $("<div class='col'>");
                var forecastHeader = $("<div class='card-header'>");
                var forecastDateP = $("<p>").text(forecastDate);

                $("#forecastBody").append(forecastCol);
                forecastCol.append(forecastHeader);
                forecastHeader.append(forecastDateP);

                var forecastTempData = (response.daily[i].temp.day - 273.15) * 1.80 + 32;
                var forecastTempDataRounded = forecastTempData.toFixed(2);
                var forecastHumidityData = response.daily[i].humidity;
                var forecastData = $("<div class='card-body'>");

                var forecastTempEl = $("<p>").text("Temp: " + forecastTempDataRounded + " F");
                var forecastHumidityEl = $("<p>").text("Humidity: " + forecastHumidityData + "%");
                forecastCol.append(forecastData);
                forecastData.append(forecastTempEl, forecastHumidityEl);
            }
        });

        $.ajax({
            url: googleURL,
            method: "GET"
        }).then(function(response) {
            console.log(response);
            var forecastDate = moment().format('L');
            var cityDiv = $("#cityName");
            var cityData = response.results[6].formatted_address;
            var cityDisplay = $("<p>").text(cityData);
            var dateDisplay = $("<p>").text(forecastDate);
            cityDiv.append(cityDisplay, dateDisplay);
        });
    }

    var cityHistory = [];

    function StorageCheck() {
        // Get stored cities from localStorage
        // Parsing the JSON string to an object
        var storedCities = JSON.parse(localStorage.getItem("searchHistory"));
      
        // If cities were retrieved from localStorage, update the cities array to it
        if (storedCities !== null) {
          cityHistory = storedCities;
        }
      
        // Render todos to the DOM
        renderButtons();
    }

    function renderButtons() {
        $("#BtnDiv").innerHTML = "";
        for (var i = 0; i < cityHistory.length; i++) {
            var city = cityHistory[i];
            var newBtn = $("<button>");
            newBtn.addClass("btn btn-primary searchResult");
            newBtn.attr("data-name", city);
            newBtn.text(city);
            $("#BtnDiv").prepend(newBtn);

        }
        
    }

    $("#searchBtn").on("click", function(event) {
        event.preventDefault();
        var searchVal = $("#searchBar").val();
        if (searchVal === "") {
            return;
        }
        cityHistory.push(searchVal);
        searchVal = "";
        localStorage.setItem("searchHistory", JSON.stringify(cityHistory));
        renderButtons();
    })
    StorageCheck();
    getLocation();
})