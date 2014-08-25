/*
 * GET home page.
 */

 exports.ipapi = function(req, res) {
    console.log('Request received.' + req.ip);
    var ip = req.ip, callback = req.query.callback;
	var url = 'http://ip-api.com/json/' + ip;
	if(typeof callback != 'undefined'){
		url += '?callback=' + callback;
	}
    var request = require('request');

    var options = {
        url: url
    };

    request(options, function(error, response, body) {
        console.log(options.url);
        if (!error && response.statusCode == 200) {
            console.log('Connected! Start to get data!');
            res.send(body);
        } else {
            console.log(error);
        }
    });
};

exports.rssapi = function(req, res) {
    console.log('Request received. - rssapi');
    var feed = req.query.feed, num = req.query.num, callback = req.query.callback;
	var url = 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=' + num + '&q=' + feed;
	if(typeof callback != 'undefined'){
		url += '&callback=' + callback;
	}
	console.log(url);
    var request = require('request');
    var options = {
        url: url
    };

    request(options, function(error, response, body) {
        console.log(options.url);
        if (!error && response.statusCode == 200) {
            console.log('Connected! Start to get data!');
            res.send(body);
        } else {
            console.log(error);
        }
    });
};