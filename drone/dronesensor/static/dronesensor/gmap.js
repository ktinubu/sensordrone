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

  var ll_position = new google.maps.LatLng(current_point.latitude, current_point.longitude)
  map.panTo(ll_position)
}
var interval = 6000
setInterval(ajax_call,interval)