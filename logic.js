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
        savedLocations = JSON.parse(localStorage.getItem("citySearch"));
        //display buttons for previous searches
        if (savedLocations) {
            //get the last city searched so we can display it
            currentLoc = savedLocations[savedLocations.length - 1];
            showPrevious();
            getCurrent(currentLoc);
            }   
        else {
                var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=Austin&appid=5b000dfb0c4cf0200c9fce5439f8f59a";
                $.ajax({
                    url:queryURL,
                    method: "GET",
                }).then(function(response){
                    currentLoc = response.name;
                    saveLoc(response.name);
                    getCurrent(currentLoc);
                });
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
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=";
        var APIkey = "&units=imperial&appid=5b000dfb0c4cf0200c9fce5439f8f59a";
        var uvAPIkey = "&appid=5b000dfb0c4cf0200c9fce5439f8f59a";
        var currentDate = moment().format("L");

        $.ajax({
            method: "GET",
            url: queryURL + city + APIkey,
            dataType: "json",
            success: (function (data) {
                console.log(data);
                $(".fiveDay").append("#daily");

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
                    var uvInt = parseInt(data.value);
                    var bgcolor = "";
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
                    $("#uvIndex").append($("<span>").attr("id", "uvIndex").attr("style", ("background-color: " + bgcolor)).text(uvInt));
                });


                var fiveDayAPI = "https://api.openweathermap.org/data/2.5/forecast?q=";
                var fiveDayKey = "&units=imperial&appid=c58694ce4b6677ee10931f7d70076866";

                $.ajax({
                    method: "GET",
                    url: fiveDayAPI + city + fiveDayKey,
                    dataType: "json"
                }).then(function (data) {
                    console.log(data);
                    var newrow = $("<div>").attr("class", "forecast");
                    $("#fiveDay").append(newrow);

                    for (var i = 0; i < data.list.length; i++) {
                        if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                            var newCol = $("<div>").attr("class", "one-fifth");
                            newrow.append(newCol);

                            var newCard = $("<div>").attr("class", "card text-black bg-info");
                            newCol.append(newCard);

                            var cardHead = $("<div>").attr("class", "card-header").text(moment(data.list[i].dt, "X").format("MMM Do"));
                            newCard.append(cardHead);

                            var cardImg = $("<img>").attr("class", "card-img-top").attr("src", "https://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + "@2x.png");
                            newCard.append(cardImg);

                            var bodyDiv = $("<div>").attr("class", "card-body");
                            newCard.append(bodyDiv);

                            bodyDiv.append($("<p>").attr("class", "card-text").html("Temp: " + data.list[i].main.temp + "°F"));
                            bodyDiv.append($("<p>").attr("class", "card-text").text("Humidity: " + data.list[i].main.humidity + "%"));
                        }

                    }
                })


            }),
        });
    };
    //clear previous cities five day forecasts
    function clear() {
        $("#fiveDay").empty();
    }

    function saveLoc(city) {
        if (savedLocations === null) {
            savedLocations = [city];
        }
        else if (savedLocations.indexOf(city) === -1) {
            savedLocations.push(city)
        }
        localStorage.setItem("citySearch", JSON.stringify(savedLocations));
        showPrevious();
    }

    // This function handles events when submit button is clicked
    $("#submitCity").on("click", function (event) {
    event.preventDefault();

    // This line grabs the input from the textbox
    var city = $("#cityInput").val().trim();
    if (city !== "") {
        clear();
        currentCity = city;
        saveLoc(city);
        $("#cityInput").val("");
        getCurrent(city);
    }

});

$(document).on("click", "#city-btn", function () {
    clear();
    currentLoc = $(this).text();
    showPrevious();
    getCurrent(currentLoc);
});
initialize();

