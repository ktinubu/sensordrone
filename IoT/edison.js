

const thingShadow = require('./thing');
//Define your device name
var Device_Name = 'Device Name';

//define AWS certificate path paramenters
var args = {


	privateKey:'/home/root/aws_certs/privateKey.pem',
	clientCert:'/home/root/aws_certs/cert.pem',
	caCert:'/home/root/aws_certs/aws-iot-rootCA.crt',
	clientId:'icebreaker_edison',
	region:'us-east-1', //at time of writing only region that supports AWS IoT
	reconnectPeriod:'10' //asumming reconnect period in seconds
} 

//create global state variables 
var gpsPosition={ lat:0 long:0}
var reported_state={ gpsPosition: 0, temp: 0, };

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
}





// Load Grove module taken from the intel website "https://software.intel.com/en-us/iot/hardware/sensors/grove-temperature-sensor"
var groveSensor = require('jsupm_grove');

// Create the temperature sensor object using AIO pin 0
var temp = new groveSensor.GroveTemp(0);
console.log(temp.name());

// Read the temperature ten times, printing both the Celsius and
// equivalent Fahrenheit temperature, waiting one second between readings
/*var i = 0;
var waiting = setInterval(function() {
        var celsius = temp.value();
        var fahrenheit = celsius * 9.0/5.0 + 32.0;
        console.log(celsius + " degrees Celsius, or " +
            Math.round(fahrenheit) + " degrees Fahrenheit");
        i++;
        if (i == 10) clearInterval(waiting);
        }, 1000);*/

// function to get temperature 
function readTemp(){
	return temp.value;
}




var GPSSensor = require('jsupm_ublox6');
// Instantiate a Ublox6 GPS device on uart 0.
var myGPSSensor = new GPSSensor.Ublox6(0);

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
			process.stdout.write(GPSData)
		}

		if (rv < 0) // some sort of read error occured
		{
			console.log("Port read error.");
			process.exit(0);
		}
	}
}

setInterval(getGPSInfo, 100);

// Print message when exiting
process.on('SIGINT', function()
{
	console.log("Exiting...");
	process.exit(0);
});