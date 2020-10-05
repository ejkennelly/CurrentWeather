// Create home page with city search input
// Store that input to local storage and to page in search history
//Present option for current or future conditions for that city
    //Present- city name, date, icon representation of weather conditions temp, humidity, wind speed, uv index
    //When UV index is clicked, show a color to indicate favorable, moderate or severe conditions
    //Future- 5 day forecast with date, icon, temp and humidity
//When a search history city is clicked, that city is presented again
//When the page is refreshed, last searched for city is shown
$(document).ready(function(){
//One call API
var queryURL = "api.openweathermap.org/data/2.5/weather?q="          

var APIkey = "&appid=5b000dfb0c4cf0200c9fce5439f8f59a"

// This function handles events where one button is clicked
$("#submitCity").on("click", function(event) {
    event.preventDefault();

    // This line grabs the input from the textbox
    var city = $("#cityInput").val().trim();
    callCityAPI(city)
   
  });

  //calls API
  function callCityAPI(city) {
      $.ajax({
          method: "GET",
          url:  "http://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=5b000dfb0c4cf0200c9fce5439f8f59a",
          dataType: "json",
          success: function(data) {
              console.log(data);
          }
      })
  }
})