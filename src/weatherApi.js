$(document).ready(function () {
  navigator.geolocation.getCurrentPosition((location) => {
    const URL = "https://api.open-meteo.com/v1/forecast?latitude=" + location.coords.latitude + "&longitude=" + location.coords.longitude + "&hourly=temperature_2m,relativehumidity_2m,precipitation_probability,precipitation,rain,showers,snowfall,visibility,windspeed_10m&timezone=America%2FNew_York"
    $.ajax({ 
      url: URL,
      type: "GET",
      success: function(result) {
        console.log(result);
        var div = document.getElementById("weather_info");
        for (var i = 0; i < result.hourly.temperature_2m.length; i++) {
         result.hourly.temperature_2m[i] = (((9/5) * result.hourly.temperature_2m[i]) + 32).toFixed(0);
        }
        
        div.innerHTML = result.hourly.temperature_2m;
      },
      error: function(error) {
        console.log(`Error ${error}`)
      }
    })
  })
})
