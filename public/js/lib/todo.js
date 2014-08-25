/*
    @swiperObjects Module for create Swipe instances
    @depends on Swipe
    @returns an object of Swipe instances
    @author:Simy
    */

define('todo', ['jquery', 'masonry'], function($) {

    //todo object
    var todo = {
            todoId: 0,
            todoCont: 'To Do',
            importance: 0, //0: Normal, 1:Important
            todoStatus: 0 //0: In Progress, 1: Done
        },
        iptcType = {
            0: 'blue',
            1: 'red'
        },
        statusType = {
            0: 'In Progress',
            1: 'Finished'
        };

    // internal method: convert todo obj to an HTML format
    var todoHtml = function(obj) {
        return '<div class="task-item ' + iptcType[obj.importance] + ((obj.todoStatus == 1) ? ' finished' : '') + '" id="task-' + obj.todoId + '"><div class="task-btnholder"><div class="delete-task task-btn h' + iptcType[obj.importance] + '" ></div><div class="finish-task task-btn h' + iptcType[obj.importance] + '"></div></div><div class = "task-content">' + obj.todoCont + '</div><span class="status-type">Task ' + obj.todoId + ' : ' + statusType[obj.todoStatus] + '</span></div>';
    };

    var bindEvents = function() {
        $('.delete-task').unbind("click").click(function() {
            if (confirm('Do you want to delete this task? ')) {
                removeTask($(this).parent().parent().attr('id'));
            }
        });
        $('.finish-task').unbind("click").click(function() {
            finishTask($(this).parent().parent().attr('id'));
        });
    };

    $("#myiptswitch").change(function() {
        if ($("#myiptswitch").prop('checked')) {
            $("#add-task").addClass('red').removeClass('blue');
        } else {
            $("#add-task").addClass('blue').removeClass('red');
        }
    });

    //initiate todo list, create default task list,
    //for the first time users:
    if (typeof localStorage.todoInit == 'undefined') {

        //reset and create localStorage
        localStorage.todoInit = 1;
        localStorage.tid = 2;
        localStorage.removeItem('todoList');

        //generate 3x default items, push to the defaultList
        var defaultList = [];
        for (var i = 0; i < 3; i++) {
            var defaultTodo = {
                todoId: i,
                todoCont: 'To Do ' + i,
                importance: i % 2,
                todoStatus: Math.floor((2 - i) / 2 + 0.5)
            };
            defaultList.push(defaultTodo);
        }
        //put objects to localStorage
        localStorage.todoList = JSON.stringify(defaultList);
    }

    //display todo list, initiate masonry plugin
    (function() {
        var todoList = JSON.parse(localStorage.todoList),
            html = '';
        $(todoList).each(function(id, task) {
            html += todoHtml(task);
        });

        $('#task-menu').html(html);
        //initiate masonry plugin
        $('#task-menu').masonry({
            itemSelector: '.task-item'
        });

        bindEvents();
    })();

    /* Public methods */

    var addTask = function(obj, callback) {
        //check object
        var task = { // task to be added
            todoId: ++localStorage.tid,
            todoCont: obj.todoCont.replace(/\n/g, '<br/>') || 'empty',
            importance: obj.importance || 0, //0: Normal, 1:Important
            todoStatus: obj.todoStatus || 0 //0: In Progress, 1: Done, 2, Exparired.
        };

        //update localStorage
        var todoList = JSON.parse(localStorage.todoList);
        todoList.push(task);
        localStorage.todoList = JSON.stringify(todoList);
        //update HTML
        var $newTask = $(todoHtml(task));
        $('#task-menu').append($newTask).masonry('appended', $newTask, true);
        bindEvents();
        if (typeof callback !== 'undefined') {
            callback();
        }
    };

    var removeTask = function(divId) {
        //remove obj from localStorage
        var tid = parseInt(divId.replace('task-', ''), 10);
        console.log('tid:' + tid);

        var arraId, todoList = JSON.parse(localStorage.todoList);
        for (var i = 0; i < todoList.length; i++) {
            console.log('todoId:' + todoList[i].todoId);
            if (todoList[i].todoId === tid) {
                arraId = i;
                break;
            }
        }
        console.log('arraId:' + arraId);
        todoList.splice(arraId, 1);
        // console.log('todoList b4 delete:' + localStorage.todoList);
        localStorage.todoList = JSON.stringify(todoList);
        // console.log('todoList after delete:' + localStorage.todoList);
        //remove obj from DOM
        $('#task-menu').masonry('remove', $('#' + divId));
        $('#task-menu').masonry('reload');
    };

    var finishTask = function(divId) {
        var tid = parseInt(divId.replace('task-', ''), 10);
        var todoList = JSON.parse(localStorage.todoList);
        for (var i = 0; i < todoList.length; i++) {
            if (todoList[i].todoId == tid) {
                todoList[i].todoStatus = (todoList[i].todoStatus + 1) % 2;
                //update DOM
                $('div#' + divId + ' .status-type').html('Task ' + todoList[i].todoId + ' : ' + statusType[todoList[i].todoStatus]);
                if (todoList[i].todoStatus == 1) {
                    $('div#' + divId).addClass('finished');
                } else {
                    $('div#' + divId).removeClass('finished');
                }
                break;
            }
        }
        //update localStorage
        localStorage.todoList = JSON.stringify(todoList);
    };

    return {
        addTask: addTask
    };


});
