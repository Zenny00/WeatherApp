function getIcon(weather_code, hour) {
  var icon_name = "";
  switch(weather_code) {
    case 0: case 1:
      if (hour > 20 || hour < 6) {
        icon_name = "wi-night-clear.svg";
      } else {
        icon_name = "wi-day-sunny.svg";
      }
      break;
    case 2:
      icon_name = "wi-day-cloudy.svg";
      break;
    case 3:
      icon_name = "wi-cloudy.svg";
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
    + '<div style="text-align: center;" class="text-slate-50 text-2xl object-contain h-5 w-32">' + temperature_max + '</div>'
    + '<div style="text-align: center;" class="text-slate-300 text-m object-contain h-5 w-32">' + temperature_min + '</div>'
    + '<div style="text-align: center;" class="text-slate-100 text-xl object-contain h-5 w-32">' + day + '</div>'
    + '<div style="text-align: center;" class="text-slate-300 text-l object-contain h-10 w-32">' + date + '</div>'
    + '<div style="text-align: center;" class="text-slate-100 text-m object-contain h-5 w-32">Precipitation:</div>'
    + '<div style="text-align: center;" class="text-slate-300 text-s object-contain h-5 w-32">' + precip + '%</div>'
    + '</div>';
}

function fillDailyDiv(parentDiv, weather_code, hour) {
  document.getElementById(parentDiv).innerHTML += '<div class="grid grid-cols-1 gap-5 place-items-stretch">'
    + '<img style="text-align: center;" src="./res/WeatherIcons/svg/' + getIcon(weather_code, hour) + '" class="object-cover h-48 w-48">'
    + '</div>';
}

function dailyForecast(parentDiv, hourly) {
  const CURRENT_HOUR = new Date().getHours();
  var weather_code = hourly.weathercode[CURRENT_HOUR];
  
  fillDailyDiv(parentDiv, weather_code, CURRENT_HOUR);
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
    const API_REQUEST = "&hourly=temperature_2m,relativehumidity_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,rain_sum,snowfall_sum,precipitation_probability_max,windspeed_10m_max&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=";
    const URL = "https://api.open-meteo.com/v1/forecast?latitude=" + location.coords.latitude + "&longitude=" + location.coords.longitude + API_REQUEST + "America%2FNew_York";
    $.ajax({ 
      url: URL,
      type: "GET",
      success: function(result) {
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
