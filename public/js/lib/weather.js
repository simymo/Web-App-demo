/*
    @weather Module for getting weather infomation from openweathermap API (json), and
    @update the DOM file
    @depends: jquery, transit
    @author:Simy
*/

define('weather', ['jquery', 'transit'], function($) {

    //initiation, using HTML5 localStorage
    if (typeof localStorage.autoloc == 'undefined' || localStorage.autoloc == 1) {
        //auto detect location by default
        localStorage.autoloc = 1;
    } else {
        localStorage.autoloc = 0;
        $("#auto-loc-setting").prop('checked', false);
        $("#loc-settings input").prop('disabled', false);
        $("#weather-city-setting").val(localStorage.settings_city);
        $("#weather-country-setting").val(localStorage.settings_country);
    }


    //DOM bindings
    $("#auto-loc-switcher").click(function() {

        $("#auto-loc-setting").prop('checked', !($("#auto-loc-setting").prop('checked')));
        //Auto detect location switcher
        if ($("#auto-loc-setting").prop('checked')) {
            localStorage.autoloc = 1;
            $("#loc-settings input").prop('disabled', true);
            localStorage.removeItem('localStorage.settings_city');
            localStorage.removeItem('localStorage.settings_country');
        } else {
            localStorage.autoloc = 0;
            $("#loc-settings input").prop('disabled', false);
        }
        return false;
    });

    $("#location-submit").mouseup(function() {
        //Submit specified location in setting page.
        if ($("#weather-city-setting").val() === '' || $("#weather-city-setting").val() === '') {
            $('#loc-result').addClass('result_failed').removeClass('result_success').html('Please input the city and country names');
        } else {
            localStorage.settings_city = $("#weather-city-setting").val();
            localStorage.settings_country = $("#weather-country-setting").val();
            $('#loc-result').addClass('result_success').removeClass('result_failed').html('Your location has been updated successfully.');
            getWeather({
                city: localStorage.settings_city,
                country: localStorage.settings_country
            });
        }

    });

    //public function: update weather for the input location
    var getWeather = function(location) {
        //get json from openweathermap.org RESTful API.
        var link = 'http://api.openweathermap.org/data/2.5/weather?q=' + location.city + ',' + location.country + '&units=metric&callback=?';
        //Jquery getJson method (Jsonp for cross domains)
        $.getJSON(link, function(data) {
            if (data.cod == 200) {
                //create an object to store the result
                var weatherInfo = {
                    temp: Math.floor(data.main.temp + 0.5),
                    maxTemp: Math.floor(data.main.temp_max + 0.5),
                    minTemp: Math.floor(data.main.temp_min + 0.5),
                    desc: data.weather[0].description,
                    city: data.name,
                    icon: data.weather[0].icon
                };
                console.log(weatherInfo);

                setTimeout(function() {
                    //modify DOM after update, using CSS3 fadein animations.
                    var html = '<img src="http://openweathermap.org/img/w/' + weatherInfo.icon + '.png" alt="" title="" /><div class="wtr-desc">' + weatherInfo.desc + '</div><div class="wtr-temp">' + weatherInfo.temp + '<span>°C</span></div><div class="wtr-maxmin">' + weatherInfo.minTemp + '°C / ' + weatherInfo.maxTemp + '°C</div>';
                    $('#weather-holder .weather-icon').attr("src", "images/empty.png");
                    $('#weather-holder span').html(weatherInfo.city);
                    // $('#real-weather').html(html).fadeIn(500);
                    $('#real-weather').html(html).transition({
                        opacity: 100
                    }, 300);
                }, 1000);
            }else{
                //if failed in getting weather infomation
                $('#loc-result').addClass('result_failed').html('Your location is not accessable, please try again.');
            }
        });
    };

    //export the getWeather function.
    return getWeather;
});
