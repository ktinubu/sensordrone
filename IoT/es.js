//NOTE: This code is unfinished and the dependencies are incomplete. It should be used for reference only at this point  

//node.js deps

//npm deps

//app deps
const thingShadow = require('./thing');
//const isUndefined = require('../common/lib/is-undefined');
//const cmdLineProcess   = require('./lib/cmdline');

//UPM dependencies 
// Load Grove module
var groveSensor = require('jsupm_grove');
var GPSSensor = require('jsupm_ublox6');



// Instantiate a Ublox6 GPS device on uart 0.
var myGPSSensor = new GPSSensor.Ublox6(0);

// Create the temperature sensor object using AIO pin 1
var temp = new groveSensor.GroveTemp(1);





// gps configuration 
if (!myGPSSensor.setupTty(GPSSensor.int_B9600))
{
  console.log("Failed to setup tty port parameters");
  process.exit(0);
}

// Collect and output NMEA data.

// This device also supports numerous configuration options, which
// you can set with writeData().  Please refer to the Ublox-6 data
// sheet for further information on the formats of the data sent and
// received, and the various operating modes available.

var bufferLength = 256;
var nmeaBuffer  = new GPSSensor.charArray(bufferLength);

//do error handling
function getGPSInfo()
{
  // we don't want the read to block in this example, so always
  // check to see if data is available first.
  if (myGPSSensor.dataAvailable())
  {
    var rv = myGPSSensor.readData(nmeaBuffer, bufferLength);

    var GPSData, dataCharCode, isNewLine, lastNewLine;
    var numlines= 0;
    if (rv > 0)
    {
      GPSData = "";
      // read only the number of characters
      // specified by myGPSSensor.readData
      for (var x = 0; x < rv; x++)
        GPSData += nmeaBuffer.getitem(x);
      // <<--------------------------->>
      var data_string=GPSData;
      if (data_string.substring(0,6) == '$GPGGA') {
              gpgga_string = data_string.split('\n')[0];
              gpgga_string = gpgga_string.replace('\n', '');
              gps_data = gpgga_string.split(',');
              console.log('data received: ' + gps_data);
             /* var time_string = gps_data[1];
              var gps_time = new Date();
              var gps_time_hours = parseInt(gps_data[1].substring(0,2));
              var gps_time_minutes = parseInt(gps_data[1].substring(2,4));
              var gps_time_seconds = parseInt(gps_data[1].substring(4,6));
              gps_time.setHours(gps_time_hours);
              gps_time.setMinutes(gps_time_minutes);
              gps_time.setSeconds(gps_time_seconds);
              */
              gps_lat = gps_data[2];
              gps_lat_ns = gps_data[3];
              gps_lon = gps_data[4];
              gps_lon_ew = gps_data[5];
              /*console.log('gps_time', gps_time);
              console.log(gps_lat, gps_lat_ns);
              console.log(gps_lon, gps_lon_ew);*/
                var temp;
                //temp=decimalToDMS(gps_lat);
                read_gpslat=temp+ gps_lat_ns;
                //console.log('\n');
                //console.log(temp+ gps_lat_ns);
                //temp=decimalToDMS(gps_lon);
                read_gpslon=temp+gps_lon_ew;
                //console.log(temp+gps_lon_ew);
                return gps_data
          }





      //<<-------------------------->>
      
    }

    if (rv < 0) // some sort of read error occured
    {
      console.log("Port read error.");
      process.exit(0);
    }
  }
}

// Print message when exiting
process.on('SIGINT', function()
{
  console.log("Exiting...");
  process.exit(0);
});




//Define your device name
var Device_Name = 'Device Name';


//define AWS certificate path paramenters
var args = {


	privateKey:'/home/root/aws_certs/privateKey.pem',
	clientCert:'/home/root/aws_certs/cert.pem',
	caCert:'/home/root/aws_certs/aws-iot-rootCA.crt',
	clientId:'SPEdision',
	region:'us-west-2', //at time of writing only region that supports AWS IoT
	reconnectPeriod:'10' //asumming reconnect period in seconds
} 


//create global state variable

var reported_state={ gps: 0, temp: 0};

//create global sensor value variables:

var read_gps = 0;
var read_temp = 0;

//launch sample app function 
update_state(args);

function update_state(args) {

  //create a things Shadows object
  
  const thingShadows = thingShadow({
    keyPath: args.privateKey,
    certPath: args.clientCert,
    caPath: args.caCert,
    clientId: args.clientId,
    region: args.region,
    reconnectPeriod: args.reconnectPeriod,
  });

  //When Thing Shadows connects to AWS server:


  thingShadows
    .on('connect', function() {
      console.log('registering device: '+ Device_Name)
  
      //register device
      thingShadows.register(Device_Name);
  
      
      //read sensor values and send to AWS IoT every 5 seconds 
      setInterval(function(){
  
      read_sensor(send_state); 
  
    }, 5000);
  
    });
  
  
  //monitor for events in the stream and print to console:
  
  thingShadows 
    .on('close', function() {
      console.log('close');
    });
  thingShadows 
    .on('reconnect', function() {
      console.log('reconnect');
    });
  thingShadows 
    .on('offline', function() {
      console.log('offline');
    });
  thingShadows
    .on('error', function(error) {
      console.log('error', error);
    });
  thingShadows
    .on('message', function(topic, payload) {
      console.log('message', topic, payload.toString());
    });
  
  //define function for reading sensor
  function read_sensor(cb){

  	read_gps = getGPSInfo();
  	read_temp = temp.value();

  	cb();
  };

  //define function for updating thing state:

  function send_state(){

  	//define the payload with sensor values
  	reported_state ={ gps: read_gps, temp: read_temp};

  	//create state update payload JSON:
  	device_state={state: { reported: reported_state }};

  	//send update payload to aws:
  	thingShadows.update(Device_Name, device_state );

  };
};