/*
    @ip Module for getting user's Ip information from ip-api (json)
    @depends on async.js and an external ip variable
    @an std json object of ip info: {
		status: "success"
		as: "AS577 Bell Canada"
		city: "Ottawa"
		country: "Canada"
		countryCode: "CA"
		isp: "Bell Canada"
		lat: "45.3938"
		lon: "-75.6639"
		org: "Bell Canada"
		query: "174.91.34.126"
		region: "ON"
		regionName: "Ontario"
		status: "success"
		timezone: "America/Montreal"
		zip: "K1H"
    }
    @author:Simy Mo
*/

define('ipinfo', ['jquery'], function($) {

    /* initiation */

    // dom binding function for setting page
    var updSettings = function(data){
        $('#weather-city-setting').val(data.city || '');
        $('#weather-country-setting').val(data.countryCode || '');
    };

    //retrun a public function
    return {
        getIp: function(callback) {
            $.ajax({
                dataType: "jsonp", //use jsonp for cross domain ajax
                // call the backend API
                url: 'http://54.86.107.215/ipapi',
                //backup link:
                //url: 'http://ip-api.com/json/?callback=?',
                success: function(data) {

                    //display the detected location in the setting page
                    updSettings(data);
                    // Run the callback function after success (async mode).
                    callback(data);
                }
            });
        }
    };

});
