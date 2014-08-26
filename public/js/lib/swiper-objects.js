/*
    @swiper-objects Module to create Swipe instances
    @depends on Swipe
    @returns an object of Swipe instances
    @author:Simy
    */

define('swiperObjects', ['swiper', 'transit'], function(swiper) {

    var pageIndex = 1;

    //Instance for page slider
    var swiperParent = new Swiper('.swiper-parent', {
        speed: 200,
        pagination: '.pagination',
        paginationClickable: false,
        onSlideChangeEnd: function() {
            btnCtrl(swiperParent.activeIndex);
        }
    });

    var btnCtrl = function(index) {
        switch (index) {
            case 1:
                $('#gohome img').attr('src','images/arrow-right.png');
                $('#fnbtn img').css({opacity: 0}).attr('src','images/plus.png').transition({opacity: 100},400);
                $('#btn-title').css({opacity: 0}).html('Add Task').transition({opacity: 100},400);
                break;
            case 2:
                $('#gohome img').attr('src','images/arrow-right.png');
                $('#fnbtn img').css({opacity: 0}).attr('src','images/refresh.png').transition({opacity: 100},400);
                $('#btn-title').css({opacity: 0}).html('Refresh').transition({opacity: 100},400);
                break;
            case 3:
                $('#gohome img').css({opacity: 0}).attr('src','images/home.png').transition({opacity: 100},400);
                $('#fnbtn img').css({opacity: 0}).attr('src','images/logo-s.png').transition({opacity: 100},400);
                $('#btn-title').css({opacity: 0}).html('Responsive').transition({opacity: 100},400);
                break;
            case 0:
                $('#gohome img').css({opacity: 0}).attr('src','images/arrow-right.png').transition({opacity: 100},400);
                $('#fnbtn img').css({opacity: 0}).attr('src','images/logo-s.png').transition({opacity: 100},400);
                $('#btn-title').css({opacity: 0}).html('Responsive').transition({opacity: 100},400);
				break;
			default:
        }
    };

    //Instances for back-to-top buttons
    var swiperNested = [];
    for (var i = 1; i <= 3; i++) {
        var swiperName = '.swiper-nested' + i;
        var ContainerName = '.swiper-scrollbar' + i;

        swiperNested.push(new Swiper(swiperName, {
            scrollContainer: true,
            mousewheelControl: true,
            calculateHeight: true,
            updateOnImagesReady: true,
            mode: 'vertical',
            //Enable Scrollbar
            scrollbar: {
                container: ContainerName,
                hide: true,
                draggable: false
            }
        }));
    }


    // //Bind back-to-top functions
    // $('.scrolltop1').click(function() {
    //     swiperNested[1].swipeTo(0);
    // });
    // $('.scrolltop2').click(function() {
    //     swiperNested[2].swipeTo(0);
    // });
    // $('.scrolltop3').click(function() {
    //     swiperNested[3].swipeTo(0);
    // });
    // $('.scrolltop4').click(function() {
    //     swiperNested[4].swipeTo(0);
    // });

    //Bind page tuning functions
    $('#gohome').click(function() {
        var next = (swiperParent.activeIndex + 1)%4;
        swiperParent.swipeTo(next);
    });
    $('#todo-block').click(function() {
        swiperParent.swipeTo(1);
    });
    $('#rss-block').click(function() {
        swiperParent.swipeTo(2);
    });
    $('#settings-block').click(function() {
        swiperParent.swipeTo(3);
    });
    // $('#block4').click(function() {
    //     swiperParent.swipeTo(3);
    // });
    return {
        swiperParent: swiperParent,
        swiperNested: swiperNested,
        resize: {
            0: function() {
                swiperNested[0].resizeFix(true);
            },
            1: function() {
                swiperNested[1].resizeFix(true);
            },
        }
    };

});
