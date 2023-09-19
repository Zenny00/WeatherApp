$(document).ready(function() {
  const URL = 'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m,relativehumidity_2m,precipitation_probability,precipitation,rain,showers,snowfall,visibility,windspeed_10m&timezone=America%2FNew_York'
  $.ajax({ 
    url: URL,
    type: "GET",
    success: function(result) {
      console.log(result)
    },
    error: function(error) {
      console.log(`Error ${error}`)
    }
  })
})
