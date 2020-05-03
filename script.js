$(document).ready(function() {
    var longitude;
    var latitude;

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
        longitude = position.coords.longitude;
        latitude = position.coords.latitude;
        console.log(longitude);
        console.log(latitude);
        renderWeather()
    }
    function renderWeather() {

        var APIKeyWeather = "cb1577afa812f61cbe09d858ec81e6a7"
        var APIKeyGoogle = "AIzaSyAOY009CGgDZyGzU8xEcUZ337wPd_M054g"
        
        
        var googleURL = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&key=" + APIKeyGoogle;
        var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude +  "&units=imperial&appid=" + APIKeyWeather;
        

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            console.log(response);
            
            var tempEl = $("#temp");
            var humidityEl = $("#humidity");
            var windSpeedEl = $("#windSpeed");
            var uviEl = $("#uvIndex");

            tempEl.text("");
            humidityEl.text("");
            windSpeedEl.text("");
            uviEl.text("");

            var weatherData = "http://openweathermap.org/img/wn/" + response.current.weather[0].icon + ".png";
            var tempData = response.current.temp;
            var humidityData = response.current.humidity;
            var windData = response.current.wind_speed;
            var uviData = response.current.uvi;

            var weatherIcon = $("<img>").attr("src", weatherData);
            $("#weatherDisplay").prepend(weatherIcon);
            tempEl.append("Temperature: " + tempData + " F");
            humidityEl.append("Humidity: " + humidityData + "%");
            windSpeedEl.append("Wind Speed: " + windData + "Mph");
            uviEl.append("UV Index: " + uviData);
            if (uviData < 8) {
                uviEl.addClass("low");
            } else {
                uviEl.addClass("high");
            }
            $("#forecastBody").html("");
            for (i = 1; i < 6; i++) {
                var forecastDate = moment().add(i, 'days').format('L');  
                var forecastCol = $("<div class='col'>");
                var forecastCard = $("<div class='card forecast'>");
                var forecastHeader = $("<div class='card-header'>");
                var forecastDateP = $("<p>").text(forecastDate);

                $("#forecastBody").append(forecastCol);
                forecastCol.append(forecastCard);
                forecastCard.append(forecastHeader);
                forecastHeader.append(forecastDateP);

                var forecastWeatherData = "http://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon + ".png";
                var forecastTempData = response.daily[i].temp.day;
                var forecastHumidityData = response.daily[i].humidity;
                var forecastData = $("<div class='card-body'>");

                var forecastWeatherIcon = $("<img>").attr("src", forecastWeatherData);
                var forecastTempEl = $("<p>").text("Temp: " + forecastTempData + " F");
                var forecastHumidityEl = $("<p>").text("Humidity: " + forecastHumidityData + "%");
                forecastCard.append(forecastData);
                forecastData.append(forecastWeatherIcon, forecastTempEl, forecastHumidityEl);
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
            cityDiv.html("");
            var cityDisplay = $("<p>").text(cityData);
            var dateDisplay = $("<p>").text(forecastDate);
            cityDiv.append(cityDisplay, dateDisplay);
        });
    }
    var clickedCity;
    function citybutton() {
        var APIKeyOpenCage = "0e893a43b61740029dae9b3b5397296d"
        var opencageURL = "https://api.opencagedata.com/geocode/v1/json?q=" + clickedCity + "&key=" + APIKeyOpenCage;
        
        $.ajax({
            url: opencageURL,
            method: "GET"
        }).then(function(response) {
            console.log(response);
            latitude = response.results[0].geometry.lat
            longitude = response.results[0].geometry.lng
            renderWeather();
        })
    }

    var cityHistory = [];

    function StorageCheck() {
        // Get stored cities from localStorage
        // Parsing the JSON string to an array
        var storedCities = JSON.parse(localStorage.getItem("searchHistory"));
      
        // If cities were retrieved from localStorage, update the cities array to it
        if (storedCities !== null) {
          cityHistory = storedCities;
        }
      
        // Render cities to the DOM
        renderButtons();
    }

    function renderButtons() {
        $("#BtnDiv").html("");
        for (var i = 0; i < cityHistory.length; i++) {
            var city = cityHistory[i];
            var newBtn = $("<button>");
            newBtn.addClass("btn btn-primary searchResult cityadded");
            newBtn.attr("data-name", city);
            newBtn.attr("id", "cityBtn");
            newBtn.text(city);
            $("#BtnDiv").prepend(newBtn);
        }        
    }
    $("#BtnDiv").on("click","button", function(event) {
        event.preventDefault();
        clickedCity = $(this).attr("data-name");
        console.log(clickedCity);
        citybutton();
    })

    $("#searchBtn").on("click", function(event) {
        event.preventDefault();
        var searchVal = $("#searchBar").val();
        if (searchVal === "") {
            return;
        }
        cityHistory.push(searchVal);
        localStorage.setItem("searchHistory", JSON.stringify(cityHistory));
        $("#searchBar").val("");
        renderButtons();
    })

    $("#clearBtn").on("click", function(event) {
        event.preventDefault();
        $("#searchBar").val("");
        localStorage.clear();
        $("#BtnDiv").html("");
        cityHistory = [];
    })
    StorageCheck();
    getLocation();
})