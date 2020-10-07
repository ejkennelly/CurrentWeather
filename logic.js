// Create home page with city search input
// Store that input to local storage and to page in search history
//Present option for current or future conditions for that city
//Present- city name, date, icon representation of weather conditions temp, humidity, wind speed, uv index
//When UV index is clicked, show a color to indicate favorable, moderate or severe conditions
//Future- 5 day forecast with date, icon, temp and humidity
//When a search history city is clicked, that city is presented again
//When the page is refreshed, last searched for city is shown
// $(document).ready(function () {
    var savedLocations = [];
    var currentLoc;


    function initialize() {

        //grab previous locations from local storage
        savedLocations = JSON.parse(localStorage.getItem("citySearch"));
        //display buttons for previous searches
        if (savedLocations) {
            //get the last city searched so we can display it
            currentLoc = savedLocations[savedLocations.length - 1];
            showPrevious();
            getCurrent(currentLoc);
        }
        else {
            // Default Austin if no saved cities
            var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=Austin&appid=5b000dfb0c4cf0200c9fce5439f8f59a";
            $.ajax({
                url: queryURL,
                method: "GET",
            success: (function (response) {
                currentLoc = response.name;
                console.log(response.name);
                getCurrent(currentLoc);
            }),
        })
        }

    }


    function showPrevious() {
        if (savedLocations) {
            $(".prevSearches").empty();
            var btns = $("<div>").attr("class", "list-group");
            for (var j = 0; j < savedLocations.length; j++) {
                var cityBtn = $("<a>").attr("href", "#").attr("id", "city-btn").text(savedLocations[j]);
                if (savedLocations[j] == currentLoc) {
                    cityBtn.attr("class", "list-group-item list-group-item-action active");
                }
                else {
                    cityBtn.attr("class", "list-group-item list-group-item-action");
                }
                btns.prepend(cityBtn);
            }
            $(".prevSearches").append(btns)
        }
    }

    //calls API 


    function getCurrent(city) {
        var uvAPIkey = "&appid=5b000dfb0c4cf0200c9fce5439f8f59a";
        var currentDate = moment().format("L");
        

        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=5b000dfb0c4cf0200c9fce5439f8f59a",
            method: "GET",
            dataType: "json",
        }).then(function (data) {
            console.log(data);
            var iconCode = data.weather[0].icon;
            var iconURL = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";

            $("#city").html(data.name +  " (" + currentDate + ") " + "<img src=" + iconURL + ">");
            $("#temp").text("Temperature: " + data.main.temp + "°F");
            $("#humidity").text("Humidity: " + data.main.humidity + "%");
            $("#windSpeed").text("Wind Speed: " + data.wind.speed + "MPH");
            getUV();
            getForecast();

            function getUV() {
                var uvURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + data.coord.lat + "&lon=" + data.coord.lon;
                $.ajax({
                    method: "GET",
                    url: uvURL + uvAPIkey,
                    dataType: "json",
                    success: function(data) {
                    var uv = $("<p>").text("UV Index: ");
                    var btn = $("<span>").addClass("btn btn-sm").text(data.value);
                    // change color depending on uv value
                    if (data.value < 3) {
                      btn.addClass("btn-success");
                    }
                    else if (data.value < 7) {
                      btn.addClass("btn-warning");
                    }
                    else {
                      btn.addClass("btn-danger");
                    }
                    $("#uvIndex").append(uv.append(btn));
                  }
                });
            }
            
                getForecast(data.id)
            })
        };


    function getForecast(city) {
        var fiveDayAPI = "https://api.openweathermap.org/data/2.5/forecast?id=";
        var fiveDayKey = "&APPID=5b000dfb0c4cf0200c9fce5439f8f59a&units=imperial";


        $.ajax({
            url: fiveDayAPI + city + fiveDayKey,
            method: "GET",
        }).then(function (forecastData) {
            console.log(forecastData);
            var newrow = $("<div>").attr("class", "forecast");
            $("#fiveDay").append(newrow);

            for (var i = 0; i < forecastData.list.length; i++) {
                if (forecastData.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                    var newCol = $("<div>").attr("class", "one-fifth");
                    newrow.append(newCol);

                    var newCard = $("<div>").attr("class", "card text-black bg-info");
                    newCol.append(newCard);

                    var cardHead = $("<div>").attr("class", "card-header").text(moment(forecastData.list[i].dt, "X").format("MMM Do"));
                    newCard.append(cardHead);

                    var cardImg = $("<img>").attr("class", "card-img-top").attr("src", "https://openweathermap.org/img/wn/" + forecastData.list[i].weather[0].icon + "@2x.png");
                    newCard.append(cardImg);

                    var bodyDiv = $("<div>").attr("class", "card-body");
                    newCard.append(bodyDiv);

                    bodyDiv.append($("<p>").attr("class", "card-text").html("Temp: " + forecastData.list[i].main.temp + "°F"));
                    bodyDiv.append($("<p>").attr("class", "card-text").text("Humidity: " + forecastData.list[i].main.humidity + "%"));
                }

            }
        });
    }
    //clear previous cities five day forecasts
    function clear() {
        $("#fiveDay").empty();
        $("#uvIndex").empty();
    }

    function saveLoc(loc) {
        if (savedLocations === null) {
            savedLocations = [loc];
        }
        else if (savedLocations.indexOf(loc) === -1) {
            savedLocations.push(loc);
        }
        localStorage.setItem("citySearch", JSON.stringify(savedLocations));
        showPrevious();
    }
    // This function handles events when submit button is clicked
    $("#submitCity").on("click", function (event) {
        event.preventDefault();
        // This line grabs the input from the textbox
        var loc = $("#cityInput").val().trim();
        //if city isn't empty
        if (loc !== "") {
            clear();
            currentLoc = loc;
            saveLoc(loc);
            $("#cityInput").val("");
            getCurrent(loc);
        }
    });

    $(document).on("click", "#city-btn", function () {
        clear();
        currentLoc = $(this).text();
        showPrevious();
        getCurrent(currentLoc);
    });

    initialize();
// })


