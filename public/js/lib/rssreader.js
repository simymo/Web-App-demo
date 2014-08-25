/*
    @rssReader Module provides functions for rss reader, getting JSON from back-end API, and
    @update DOM
    @depends: jquery, transit
    @author:Simy Mo
*/

define('rssReader', ['jquery', 'transit'], function($) {

    /*Module's internal elements:*/

    /* ifame part */

    //options object
    var options = {};

    //funtion to display remote page when a news was clicked
    //use ifrme
    var showIframe = function(src) {
        //initiate iframe
        $('#iframe').empty();

        //show the embeded iframe browser
        $('#iframe').css({
            display: 'block'
        }).transition({
            //css3 animation 300ms
            right: 0
        }, 300);

        setTimeout( //set a timeout: load the iframe after the animation is finished, to make the animation smooth
            function() {
                $('<iframe>', {
                    src: src,
                    id: 'myFrame',
                    width: '100%',
                    height: '100%',
                    frameborder: 0,
                    scrolling: 'yes'
                }).appendTo('#iframe');
            }, 1000
        );
    };

    /* ifame part end*/

    /* DOM controls*/

    //function to update rss page after getting json
    var updtDom = function(feed, page) {

        //create an html string to store the feed
        var pageId = 'rsspage-' + page,
            html = '<div id = "' + pageId + '" style="display:none;opacity:0">';

        //8 feeds per page
        for (var index = 8 * page, i = index; i < (index + 8); i++) {
            if (i >= feed.length) {
                $('.rss-load-more').css({
                    display: 'none'
                });
                break;
            }
            var date = new Date(feed[i].publishedDate);
            html += '<div class="news-block"><div class="news-item white"><div class="news-content"><h3><a class="rss-source" target="_blank" href="' + feed[i].link + '">' + feed[i].title + '</h3></a><span>' + date.toLocaleString() + '</span>' + feed[i].content + '</div></div></div>';
        }
        //html finished
        html += '</div>';

        //add elements to the Dom
        $('#google-news').append(html);

        //fade in using css3
        $('#' + pageId).css({
            display: 'block'
        }).transition({
            opacity: 100
        }, 300);

        //binding feed title with click(mouseup) event,
        //when user clicks the feed title, show iframe with remote page
        $('.rss-source').mouseup(function() {
            var link = $(this).attr('href');
            showIframe(link);

            //btns in the navi-bar
            $('#fnbtn img').attr('src', 'images/back.png');
            $('#gohome').css({
                display: 'none'
            });

            //click to destory the iframe and go back to rss page
            $('#fnbtn').unbind('mouseup').mouseup(function() {
                $('#iframe').empty().transition({
                    right: '-100%'
                }, 300);
                $('#fnbtn img').css({
                    opacity: 0
                }).attr('src', 'images/refresh.png').transition({
                    opacity: 100
                }, 400);
                $('#btn-title').css({
                    display: 'none'
                });
                $('#fnbtn').unbind('mouseup').mouseup(function() {
                    refreshRss(localStorage.setting_rssLink);
                });
                $('#gohome').css({
                    display: 'block'
                });
            });
            return false;

        }).click(function() {
            //disable the click event (prevent default link opens)
            return false;
        });
        //callback:(defined in options obj)
        if (typeof options.callback !== 'undefined') {
            options.callback();
        }
    };

    //function to check the accessability of a rss feed link
    var checkLink = function(link) {

        //var feedLink = 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=20&q=' + link + '&callback=?';

        //use the backend API provided by node.js
        var feedLink = 'http://54.86.107.215/rssapi?num=20&feed=' + link + '&callback=?';

        $.getJSON(feedLink, function(data) {
            //display result directly in DOM
            if (data.responseStatus == 200) {
                localStorage.setting_rssLink = link;
                $('#rss-result').removeClass('result_failed').addClass('result_success').html('Your subscription has been updated successfully.');
                refreshRss(link);
            } else {
                $('#rss-result').removeClass('result_success').addClass('result_failed').html('Invalid link.');
            }
        });
    };

    //Dom Binding
    $('#fnbtn').unbind('mouseup').mouseup(function() {
        refreshRss(localStorage.setting_rssLink);
    });
    //settings
    $('#rss-link-setting').val(localStorage.setting_rssLink || '');

    $('#rss-submit').mouseup(function() {
        var link = $('#rss-link-setting').val();
        checkLink(link);
    });

    /* DOM controls part end*/

    /* public functions */

    var getRss = function(opts) {
        //store the opts input obj to a module's vairable
        options = opts;
        localStorage.setting_rssLink = options.link; //store the subcription link in local

        //use the backend API provided by node.js
        var feedLink = 'http://54.86.107.215/rssapi?num=20&feed=' + options.link,
            currentPage = 0;
        //var feedLink = 'http://' + document.domain + '/rssapi?num=20&feed=' + link;

        $.ajax({
            dataType: "jsonp", //use jsonp for cross domain ajax
            // call the backend API
            url: feedLink,
            success: function(data) {
                //initiation for the 1st time user
                //using HTML5 localStoage
                if (typeof localStorage.rssLink == 'undefined' || localStorage.rssLink != options.link) {
                    //reset and create localStorage
                    localStorage.rssLink = options.link || '';
                    localStorage.removeItem('rssStorage');
                    localStorage.rssStorage = JSON.stringify(data.responseData.feed.entries);
                } else {
                    // for the not 1st time users, only update the new feeds
                    var newElements = [];
                    $(data.responseData.feed.entries).each(function(index, entry) {
                        if (entry.link == JSON.parse(localStorage.rssStorage)[0].link) {
                            //if the feed is exist in the localStorage already, do nothing
                            return false;
                        }
                        //else push it in a array to store in the localStorage
                        newElements.push(entry);
                    });
                    //combine the new feeds and the old feeds
                    var feeds = newElements.concat(JSON.parse(localStorage.rssStorage));
                    //reduce size, maxiuam 40 feeds in localStorage
                    if (feeds.length > 40) {
                        feeds = feeds.slice(0, 39);
                    }
                    localStorage.rssStorage = JSON.stringify(feeds);
                }

                rssFeed = JSON.parse(localStorage.rssStorage);

                //call update DOM function to display
                updtDom(rssFeed, currentPage);

                //display the feed title
                $('#feed-title h3').html(data.responseData.feed.title);

                //bind the "load more" button
                $('#load-more').unbind('mouseup').mouseup(function() {
                    updtDom(JSON.parse(localStorage.rssStorage), ++currentPage);
                }).click(function() {
                    return false;
                });
            },
            error: function(error) {
                console.log(error);
            }
        });
    };


    var refreshRss = function(link) {

        //use the backend API provided by node.js
        var feedLink = 'http://54.86.107.215/rssapi?num=20&feed=' + link, currentPage = 0;
        //var feedLink = 'http://' + document.domain + '/rssapi?num=20&feed=' + link;

        $.ajax({
            dataType: "jsonp", //use jsonp for cross domain ajax
            // call the backend API
            url: feedLink,
            success: function(data) {
                //push only the new feeds into the localStorage
                var newElements = [];
                $(data.responseData.feed.entries).each(function(index, entry) {
                    if (entry.link == JSON.parse(localStorage.rssStorage)[0].link) {
                        return false;
                    }
                    newElements.push(entry);
                });
                var feeds = newElements.concat(JSON.parse(localStorage.rssStorage));

                //control the size of localStorage
                if (feeds.length > 40) {
                    feeds = feeds.slice(0, 39);
                }
                localStorage.rssStorage = JSON.stringify(feeds);
                rssFeed = JSON.parse(localStorage.rssStorage);

                $('#google-news').empty();
                //call update DOM to refresh
                updtDom(rssFeed, currentPage);

                //bind the "load more" button
                $('#load-more').unbind('mouseup').mouseup(function() {
                    updtDom(JSON.parse(localStorage.rssStorage), ++currentPage);
                }).click(function() {
                    return false;
                });
            },
            error: function(error) {
                console.log(error);
            }
        });
    };

    //export the public functions
    return {
        getRss: getRss,
        refreshRss: refreshRss
    };
});
