// Create home page with city search input
// Store that input to local storage and to page in search history
//Present option for current or future conditions for that city
//Present- city name, date, icon representation of weather conditions temp, humidity, wind speed, uv index
//When UV index is clicked, show a color to indicate favorable, moderate or severe conditions
//Future- 5 day forecast with date, icon, temp and humidity
//When a search history city is clicked, that city is presented again
//When the page is refreshed, last searched for city is shown
var savedLocations = [];
var currentLoc;

function initialize() {
    //grab previous locations from local storage
    savedLocations = JSON.parse(localStorage.getItem("cityInput"));
    var lastSearch;
    //display buttons for previous searches
    if (savedLocations) {
        //get the last city searched so we can display it
        currentLoc = savedLocations[savedLocations.length - 1];
        showPrevious();
        getCurrent(currentLoc);
    }
    else {
        //try to geolocate, otherwise set city to raleigh
        if (!navigator.geolocation) {
            //can't geolocate and no previous searches, so just give them one
            getCurrent("Bee Lick");
        }
        else {
            navigator.geolocation.getCurrentPosition(error);
        }
    }
}
function error(){
    //can't geolocate and no previous searches, so just give them one
    currentLoc = "Bee Lick"
    getCurrent(currentLoc);
}

$(document).ready(function () {
    //One call API

    // This function handles events where one button is clicked
    $("#submitCity").on("click", function (event) {
        event.preventDefault();

        // This line grabs the input from the textbox
        var city = $("#cityInput").val().trim();
        callCityAPI(city);
    });


    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=";
    var APIkey = "&units=imperial&appid=5b000dfb0c4cf0200c9fce5439f8f59a";

    var uvAPIkey = "&appid=5b000dfb0c4cf0200c9fce5439f8f59a";
    var currentDate = moment().format("L");

    //calls API
    function callCityAPI(city) {
        $.ajax({
            method: "GET",
            url: queryURL + city + APIkey,
            dataType: "json",
            success: (function (data) {
                console.log(data);

                var iconCode = data.weather[0].icon;
                var uvURL =
                    "https://api.openweathermap.org/data/2.5/uvi?lat=" +
                    data.coord.lat +
                    "&lon=" +
                    data.coord.lon;
                var iconURL =
                    "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";

                $("#city").html(
                    data.name +
                    "   (" +
                    currentDate +
                    ") " +
                    ("<img src='" + iconURL + "'>")
                );
                $("#temp").text("Temperature: " + data.main.temp + "°F");
                $("#humidity").text("Humidity: " + data.main.humidity + "%");
                $("#windSpeed").text("Wind Speed: " + data.wind.speed + "MPH");





                $.ajax({
                    method: "GET",
                    url: uvURL + uvAPIkey,
                    dataType: "json"
                }).then(function (data) {
                    // console.log(data);
                    var uvInt = data.value;
                    var bgcolor;
                    if (uvInt <= 3) {
                        bgcolor = "green";
                    }
                    else if (uvInt >= 3 || uvInt <= 5.99) {
                        bgcolor = "yellow";
                    }
                    else if (uvInt >= 6 || uvInt <= 7.99) {
                        bgcolor = "orange";
                    } else if (uvInt > 8) {
                        bgcolor = "red";
                    }
                    //Having issues getting color to change
                    $("#uvIndex").text("UV Index: ");
                    $("#uvIndex").append($("<span>").attr("id", "uvIndex").attr("style", ("background-color:" + bgcolor)).text(uvInt));
                });


                var fiveDayAPI = "https://api.openweathermap.org/data/2.5/forecast?q=";
                var fiveDayKey = "&cnt=5&units=imperial&appid=c58694ce4b6677ee10931f7d70076866";

                $.ajax({
                    method: "GET",
                    url: fiveDayAPI + city + fiveDayKey,
                    dataType: "json"
                }).then(function (data) {
                    console.log(data)
                    $(".fiveDay").html(data.)
                })


            }),
        });
    };

});
