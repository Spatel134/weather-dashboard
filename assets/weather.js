function updatePage(city) {}

function getWeather(city) {
  var weatherURL =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=78704ab92df5e3b0514666d3a597d433&units=imperial";

  var date;
  var temperature;
  var windSpeed;
  var UVindex;
  var lat;
  var lon;
  var icon;
  var humidity;

  $.ajax({
    url: weatherURL,
    method: "GET",
  }).then(function (response) {
    date = response.dt;
    icon = response.weather[0].icon;
    lat = response.coord.lat;
    lon = response.coord.lon;
    temperature = response.main.temp;
    windSpeed = response.wind.speed;
    humidity = response.main.humidity;

    $.ajax({
      url: getUV(lat, lon),
      method: "GET",
    }).then(function (response) {
      console.log(response);
      UVindex = response.value;
      date = moment.unix(date).format("L");
      icon = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      $(".city-date").text(city + " (" + date + ")");
      $(".temperature").text("Temparature: " + temperature + " ℉");
      $(".humidity").text("Humidity: " + humidity + "%");
      $(".wind-speed").text("Wind Speed: " + windSpeed + " MPH");
      $(".uvIndex").text(UVindex);
      $(".icon").attr("src", icon);
    });
  });
}

function getUV(lat, lon) {
  var uvURL =
    "http://api.openweathermap.org/data/2.5/uvi?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=78704ab92df5e3b0514666d3a597d433";

  return uvURL;
}

updatePage();
