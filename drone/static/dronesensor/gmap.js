var map;

var location_marker
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.39, lng: 150.64},
    zoom: 8
  });
      location_marker = new google.maps.Marker({
      map: map,
      duration: time_interval,
  });
}

var current_point = {
  latitude: 0,
  longitude: 0,
  temperature:0,
  zoom:1,
}
var time_interval = 2000


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
  location_marker.Postion = latLng_position

  var inner_loop_timeout = time_interval
  var inner_loop_frequency = 1000
  var startTime = new Date().getTime();
  
 
  //set timeout
  //set freq loop 
  map.panTo(latLng_position)

}
var interval = time_interval
setInterval(ajax_call,interval)