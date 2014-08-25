/*
    @ this is the main js file called by require.js
    @ Web application constructed using MVVM model
    @ There're 3 main modules in this demo:
    @@ 1. TO-DO List
    @@ 2. RSS Reader
    @@ 3. Weather by location
    @ Other supporting functions:
    @@ Auto location detection
    @@ Finger slide control
    @ author: Simy Mo
*/

/* Require.js initiation*/
require.config({
    //set library pathes
    baseUrl: "js/lib",
    paths: {
        //public libraries: (try to call js from cdn first, call local verison if failed)
        jquery: ["http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.11.1.min", "jquery-1.11.1.min"],
        angular: ["http://cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.20/angular.min", "angular.min"],
        transit: ['http://cdnjs.cloudflare.com/ajax/libs/jquery.transit/0.9.9/jquery.transit.min', 'jquery.transit.min'],
        masonry: ['http://cdnjs.cloudflare.com/ajax/libs/masonry/2.1.08/jquery.masonry.min', 'jquery.masonry.min'],
        swiper: 'idangerous.swiper.min',
        //web app modules:
        swiperObjects: 'swiper-objects',
        ipinfo: 'ipinfo', //for auto detect location
        todo: 'todo', // To-do List function
        weather: 'weather', // Weather function
        rssReader: 'rssreader' // RSS reader function
    },
    shim: {
        'swiper': {
            deps: ['jquery']
        },
        'masonry': {
            deps: ['jquery']
        },
        'transit': {
            deps: ['jquery'],
            exports: 'transit'
        }
    }
});

/* Call modules, asynchronous approaches. */
require(['jquery', 'swiper', 'swiperObjects'], function($, swiper, swiperObjects) {

    // disable text selection in global
    document.onselectstart = function() {
        return false;
    };

    /*initiate TO-Do module:*/
    require(['todo'], function(todo) {

        // Add task form
        $('#add-task-btn').click(function() {
            var content = $("#newtask").val();
            var importance = $("#myiptswitch").prop('checked') ? 1 : 0;
            var task = {
                todoCont: content,
                importance: importance,
                todoStatus: 0
            };
            $("#newtask").val('');
            //call addTask function provided by todo module:
            todo.addTask(task, swiperObjects.resize[0]);
        });
    });


    /*Location detection, and update weather*/
    require(['ipinfo', 'weather'], function(ipInfo, weather) {

        //get location using IP API if auto location detection is enabled in setting page
        if (localStorage.autoloc == 1 || typeof localStorage.settings_city == 'undefined') {
            //create callback function, ipinfo modual will call this function as a callback after getting user's location
            var weatherCallback = function(ip) {
                var location = {
                    city: ip.city,
                    country: ip.countryCode
                };
                weather(location);
            };
            //Get weather information after getting the IP address (Asynchronous mode)
            ipInfo.getIp(weatherCallback);
        } else {
            //or use the values configured in setting page
            var locSetting = {
                city: localStorage.settings_city,
                country: localStorage.settings_country
            };
            weather(locSetting);
        }
    });

    /*RSS Reader Module*/
    require(['rssReader'], function(rss) {

        //go to setting page when user wants to change the feed source
        $('#change-feed').click(function() {
            swiperObjects.swiperParent.swipeTo(3);
        });

        // /*News update */
        var newsFeed = {
            //create options obj
            link: localStorage.setting_rssLink || 'http://www.engadget.com/rss.xml',
            //Resize the swiper after DOM updated:
            callback: swiperObjects.resize[1]
        };

        //Get news from api (Synchronous mode)
        //call getRss function
        rss.getRss(newsFeed);

    });

});
