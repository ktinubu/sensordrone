var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.39, lng: 150.64},
    zoom: 8
  });
}

var current_point = {
  latitude: 0,
  longitude: 0,
  temperature:0,
  zoom:1,
}
var time_interval = 2000
var location_marker = new slidingMarker({
  map: map,
  duration: time_interval,
});

var ajax_call = function(){
  $(function (){

    $.ajax({
      type: 'GET',
      url: '/dronesensor/ajaxupdate',
      dataType: "json",
      success: function(data) { 
      
      current_point = ((data[0]).fields);

      console.log('success', data);
      }
    })
  });


  
  var latLng_position = new google.maps.LatLng(current_point.latitude, current_point.longitude)
  location_marker.setpostion(latLng_position)

  var inner_loop_timeout = time_interval
  var inner_loop_frequency = 1000
  var startTime = new Date().getTime();
  
  var map_animate = function(){
    map.panTo(location_marker.getAnimationPosition())
  }
  setInterval(map_animate,inner_loop_frequency)
  //set timeout
  //set freq loop 
  map.panTo(latLng_position)

}
var interval = time_interval
setInterval(ajax_call,interval)