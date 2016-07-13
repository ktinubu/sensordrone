
// configure jshint
/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
/*
The IoT Devkit v1 - This Node.js sample application distributed within Intel® XDK IoT Edition under the IoT with Node.js project creation that demonstrates the fundamental functionality of the sensors in the Intel IoT Devkit via mraa or upm by using three sensors(LCD, Temperature sensor, LED) within the SEEED* Grove kit .

Drive the Grove RGB LCD (a JHD1313m1). We can do this in either of two ways.The best way is to use the upm library, which contains support for this device.The alternative way is to drive the LCD directly from Javascript code using the i2c interface directly.In this sample UPM method is used.


UPM - UPM is a high level repository for sensors that use libmraa. Each sensor links to libmraa and are not meant to be interlinked although some groups of sensors are linked. Each sensor contains a header which allows to interface with it. Typically a sensor is represented as a class and instantiated.

Steps for installing/updating MRAA & UPM on Intel IoT Platforms with IoTDevKit Linux image
Using a ssh client: 
1. echo "src maa-upm http://iotdk.intel.com/repos/1.1/intelgalactic" > /etc/opkg/intel-iotdk.conf
2. opkg update
3. opkg upgrade

OR
In Intel XDK IoT Edition for Internet of Things Embedded Application

1. Connect to board via the IoT Device Drop down (Add Manual Connection or pick device in list)
2. Press the "Settings" button
3. Click the "Update libraries on board" option

Review README.md file for more information about enabling IoT Devkit v1 and completing the desired configurations.

Article: https://software.intel.com/en-us/creating-project-with-lightsensor-led-lcd
*/


// change this to false to use the hand rolled version
var useUpmVersion = true;

// we want mraa to be at least version 0.6.1
var mraa = require('mraa');
var version = mraa.getVersion();
var t;
if (version >= 'v0.6.1') {
    console.log('mraa version (' + version + ') ok');
}
else {
    console.log('meaa version(' + version + ') is old - this code may not work');
}

if (useUpmVersion) {
    clearTimeout(t)
    setInterval(useUpm, 5000)
    
}
else {
    useLcd();
}
/**
 * Use the upm library to drive the two line display
 *
 * Note that this does not use the "lcd.js" code at all
 */
function useUpm() {
    var lcd = require('jsupm_i2clcd');
    var display = new lcd.Jhd1313m1(0, 0x3E, 0x62);
   
    var groveSensor = require('jsupm_grove');
    
    var led = new groveSensor.GroveLed(2);

    var light = new groveSensor.GroveLight(0);
    console.log(""+light.value());
    
    var lux = light.value();// If the light sensor value reaches the threshold on/off LED
     
       if(lux >= 10){
        led.on();
       } else{
           led.off();
       }
    
    
   var strings = ["" ,"Full moon overhead at tropical latitudes", "Twilight in the city", "Family living room", "Office building light in hallway","Very dark, overcast day", "Not sure" ];// Array of strings
/**
 * For scrolling long strings i.e.(length > 16)
 * Values in the array are taken from *seed grove wiki page
 * Note that this does not use the "lcd.js" code at all
 */
   function loop(bool,count){
       console.log(count)
       if(count){
        t=setTimeout(function(){
            display.scroll (bool);
            count--;
            loop(bool,count)
        }, 300);
       }
    }
    
    function scroll(text){
        console.log(text);
         var x= text.length - 16
        loop(true,x)
    }
    display.setCursor(0, 0);
    /**
 * Comparing all the lux values to display appropriate message on LCD 
 */
    if(lux < 1){
        display.write("1---");
    } else if(lux == 1){
        display.write("Full moon overhead at tropical latitudes");
        scroll("Full moon overhead at tropical latitudes")
    } else if(lux > 1 && lux <= 3){
        display.write("Twilight in the city");
    } else if(lux > 3 && lux <= 6){
        display.write("4---");
    } else if(lux > 6 && lux <= 10){
        display.write("5---");
    } else if(lux > 10 && lux <= 15){
        display.write("6---");
    } else if(lux > 15 && lux <= 35){
        display.write("Family living room");
        scroll("Family living room")
    } else if(lux > 35 && lux <= 80){
        display.write("Office building light in hallway");
        scroll("Office building light in hallway");
    } else if(lux > 80 && lux <= 100){
        display.write("Very dark, overcast day");
        scroll("Very dark, overcast day");
    } else {
        display.write("Not sure");
        scroll("Not sure");
    }
    
}


