function getIcon(weather_code) {
  var icon_name = "";
  switch(weather_code) {
    case 0:
    case 1:
      icon_name = "wi-day-sunny.svg";
      break;
    case 2:
      icon_name = "wi-cloudy.svg";
      break;
    case 3:
      icon_name = "wi-day-cloudy.svg";
      break;
    default:
      icon_name = "wi-day-sunny.svg";
      break;  
  }

  return icon_name;
}

function createDiv(parentDiv, temperature_max, temperature_min, day, date, weather_code) {
  document.getElementById(parentDiv).innerHTML += '<div class="grid grid-cols-1 gap-5 place-items-stretch">'
    + '<img src="./res/WeatherIcons/svg/' + getIcon(weather_code) + '">'
    + '<div style="text-align: center;" class="text-slate-50 text-2xl">' + temperature_max + '</div>'
    + '<div style="text-align: center;" class="text-slate-600 text-m">' + temperature_min + '</div>'
    + '<div style="text-align: center;" class="text-slate-100 text-xl">' + day + '</div>'
    + '<div style="text-align: center;" class="text-slate-600 text-l">' + date + '</div>'
    + '</div>';
}

$(document).ready(function () {
  navigator.geolocation.getCurrentPosition((location) => {
    const URL = "https://api.open-meteo.com/v1/forecast?latitude=" + location.coords.latitude + "&longitude=" + location.coords.longitude + "&hourly=temperature_2m,relativehumidity_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,rain_sum,snowfall_sum,precipitation_probability_max,windspeed_10m_max&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=America%2FNew_York";
    $.ajax({ 
      url: URL,
      type: "GET",
      success: function(result) {
        console.log(result);
        for (var i = 0; i < result.daily.temperature_2m_max.length; i++) {
         result.daily.temperature_2m_max[i] = (result.daily.temperature_2m_max[i]).toFixed(0).toString() + "&deg;F";
         result.daily.temperature_2m_min[i] = (result.daily.temperature_2m_min[i]).toFixed(0).toString() + "&deg;F";
         result.daily.time[i] = result.daily.time[i].substring(5); 
        }
         
        const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        const current_day = new Date().getDay();
        const weekdays = [];
        for (var i = 0; i < weekday.length; i++) {
          createDiv("forecast_box", result.daily.temperature_2m_max[i], result.daily.temperature_2m_min[i], weekday[(current_day + i) % 7], result.daily.time[i], result.daily.weathercode[i]);
        }
      },
      error: function(error) {
        console.log(`Error ${error}`)
      }
    })
  })
})
