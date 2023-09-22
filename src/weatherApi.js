function getIcon(weather_code, hour) {
  var icon_name = "";

  var night_flag = false;
  if (hour >= 20 || hour <= 6)
    night_flag = true;

  switch(weather_code) { 
    case 0: case 1:
      icon_name = (!night_flag) ? "wi-day-sunny.svg" : "wi-night-clear.svg";
      break;
    case 2:
      icon_name = "wi-day-cloudy.svg";
      break;
    case 3:
      icon_name = (!night_flag) ? "wi-cloudy.svg" : "wi-night-alt-cloudy.svg";
      break;
    case 51: case 53: case 55:
      icon_name = "wi-sprinkle.svg";
      break;
    case 61: case 63: case 65:
      icon_name ="wi-rain.svg";
      break;
    case 80: case 81: case 82:
      icon_name = "wi-showers.svg";
      break;
    default:
      icon_name = "wi-day-sunny.svg";
      break;  
  }

  return icon_name;
}

function fillWeeklyDiv(parentDiv, temperature_max, temperature_min, day, date, weather_code, precip) {
  document.getElementById(parentDiv).innerHTML += '<div class="grid grid-cols-1 gap-5 place-items-stretch">'
    + '<img style="text-align: center;" src="./res/WeatherIcons/svg/' + getIcon(weather_code, 12) + '" class="object-cover h-32 w-32">'
    + '<div style="text-align: center;" class="text-slate-50 text-2xl h-5 w-28">' + temperature_max + '</div>'
    + '<div style="text-align: center;" class="text-slate-300 text-md h-5 w-28">' + temperature_min + '</div>'
    + '<div style="text-align: center;" class="text-slate-100 text-xl h-5 w-28">' + day + '</div>'
    + '<div style="text-align: center;" class="text-slate-300 text-lg h-10 w-28">' + date + '</div>'
    + '<div style="text-align: center;" class="text-slate-100 text-md h-5 w-28">Precipitation:</div>'
    + '<div style="text-align: center;" class="text-slate-300 text-md h-5 w-28">' + precip + '%</div>'
    + '</div>';
}

function fillDailyIcon(parentDiv, weather_code, hour) {
  document.getElementById(parentDiv).innerHTML += '<div class="grid grid-cols-1 gap-5 place-items-stretch">'
    + '<img style="text-align: center;" src="./res/WeatherIcons/svg/' + getIcon(weather_code, hour) + '" class="h-48 w-48">'
    + '</div>';
}

function fillDailyData(parentDiv, current_temp, feels_like, current_humidity) {
  document.getElementById(parentDiv).innerHTML += '<div class="grid grid-cols-1 gap-5">'
    + '<div class="text-slate-100 text-xl object-contain">Current Temperature: ' + current_temp + ' | Feels like: ' + feels_like + '</div>'
    + '<div class="text-slate-100 text-xl object-contain">Humidity: ' + current_humidity + '</div>'
    + '</div>';
}

function dailyForecast(parentDiv, hourly) {
  const CURRENT_HOUR = new Date().getHours();
  var weather_code = hourly.weathercode[CURRENT_HOUR];
  var current_temp = hourly.temperature_2m[CURRENT_HOUR].toFixed(0).toString() + "&deg;F";
  var current_humidity = hourly.relativehumidity_2m[CURRENT_HOUR].toFixed(0).toString() + "%";
  var feels_like = hourly.apparent_temperature[CURRENT_HOUR].toFixed(0).toString() + "&deg;F";

  fillDailyIcon(parentDiv, weather_code, CURRENT_HOUR);
  fillDailyData(parentDiv, current_temp, feels_like, current_humidity);
}

function weeklyForecast(parentDiv, daily) {
  const NUM_ENTRIES = 7;
  const CURRENT_DAY = new Date().getDay();
  const WEEKDAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  var max_temp = [], min_temp = [], date = [];
  
  for (var i = 0; i < daily.temperature_2m_max.length; i++) {
    max_temp[i] = (daily.temperature_2m_max[i]).toFixed(0).toString() + "&deg;F";
    min_temp[i] = (daily.temperature_2m_min[i]).toFixed(0).toString() + "&deg;F";
    date[i] = daily.time[i].substring(5); 
  }
           
  for (var i = 0; i < NUM_ENTRIES; i++) {
    fillWeeklyDiv(parentDiv, max_temp[i], min_temp[i], WEEKDAYS[(CURRENT_DAY + i) % 7], date[i], daily.weathercode[i], daily.precipitation_probability_max[i]);
  }
}

$(document).ready(function () {
  navigator.geolocation.getCurrentPosition((location) => {
    const API_REQUEST = "&hourly=temperature_2m,relativehumidity_2m,weathercode,apparent_temperature,precipitation,windspeed_10m,winddirection_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,rain_sum,snowfall_sum,precipitation_probability_max,windspeed_10m_max&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=";
    const URL = "https://api.open-meteo.com/v1/forecast?latitude=" + location.coords.latitude + "&longitude=" + location.coords.longitude + API_REQUEST + "America%2FNew_York";
    $.ajax({ 
      url: URL,
      type: "GET",
      success: function(result) {
          console.log(result);
          const current_date = new Date();
          dailyForecast("daily_forecast_box", result.hourly); 
          weeklyForecast("weekly_forecast_box", result.daily);
      },
      error: function(error) {
        console.log(`Error ${error}`)
      }
    })
  })
})
