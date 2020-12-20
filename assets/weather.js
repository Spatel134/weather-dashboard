function updatePage() {
  var city = $(".input").val();
  if (city != "") {
    getWeather(city);
    $(".home").show();
  }
}

function getWeather(city) {
  var weatherURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
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
    error: function (err) {
      console.log(err.responseText);
      $(".home").hide();
    },
    success: function (response) {
      var cities = [];

      if (localStorage.getItem("cities") != null) {
        cities = JSON.parse(localStorage.getItem("cities"));
        console.log(cities);
      }

      if (city != "" && !cities.includes(city)) {
        cities.push(city);
        localStorage.setItem("cities", JSON.stringify(cities));
      }

      $(".list-group").empty();
      for (var i = 0; i < cities.length; i++) {
        $(".list-group").prepend(
          '<li class="list-group-item" onclick="getWeather(\'' +
            cities[i] +
            "')\">" +
            cities[i] +
            "</li>"
        );
      }

      console.log(response);
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
        UVindex = response.value;
        date = moment.unix(date).format("L");
        icon = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

        $(".city-date").text(city + " (" + date + ")");
        $(".temperature").text("Temperature: " + temperature + " ℉");
        $(".humidity").text("Humidity: " + humidity + "%");
        $(".wind-speed").text("Wind Speed: " + windSpeed + " MPH");
        $(".uvIndex").text(UVindex);
        $(".icon").attr("src", icon);

        $.ajax({
          url: getForecast(lat, lon),
          method: "GET",
        }).then(function (response) {
          console.log(response.daily);

          for (var i = 1; i < 6; i++) {
            loadForecastData(response.daily[i], i);
          }
          $(".home").show();
        });
      });
    },
  });
}

function getUV(lat, lon) {
  var uvURL =
    "https://api.openweathermap.org/data/2.5/uvi?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=78704ab92df5e3b0514666d3a597d433";

  return uvURL;
}

function getForecast(lat, lon) {
  var url =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&exclude=current,minutely,hourly,alerts&appid=78704ab92df5e3b0514666d3a597d433&units=imperial";
  return url;
}

function loadForecastData(data, day) {
  $(".day-" + day).text(moment.unix(data.dt).format("L"));
  $(".icon-" + day).attr(
    "src",
    "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png"
  );
  $(".temp-" + day).text("Temp: " + data.temp.day + "℉");
  $(".humidity-" + day).text("Humidity: " + data.humidity + "%");
}

updatePage();
