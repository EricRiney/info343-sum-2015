"use strict";

/*
    tasks.js
    Script for the index.html page
    This code will use Parse.com's JavaScript library to create new tasks, save them, query them
    mark them as done, and purge done tasks
 */

//use jQuery to register a function that is called when the document is ready for manipulation

$(function() {
    var currentUser = Parse.User.current();
    if (!currentUser){
        window.location = 'signup.html';
    }
    $('.nav-link-sign-out').click(function(evt){
        evt.preventDefault();
        Parse.User.logOut();
        window.location = 'signin.html';

    });
    $('.user-name').text(currentUser.get('firstName') + ' ' + currentUser.get('lastName'));

    var Task = Parse.Object.extend('Task');

    var tasksQuery = new Parse.Query(Task);
    tasksQuery.equalTo('user', currentUser);
    tasksQuery.ascending('done, createdAt');

    var TaskLast = Parse.Collection.extend({
       model:Task,
        query: tasksQuery,
        getCompleted: function(){
            return this.filter(function(task){
                return task.get('done');
            });
        }
    });
    var tasks = new TaskLast();

    tasks.on('all', function(){
        var taskList = $('.task-list');
        taskList.empty();

        this.forEach(function(task) {
           var taskItem = $(document.createElement('li'));
            taskItem.text(task.get('title'));
            if (task.get('done')) {
                taskItem.addClass('task-done');
            }
            taskItem.click(function() {
                task.set('done',!task.get('done'));
                task.save();
            });
            taskList.append(taskItem);
        });
        if (this.getCompleted().length > 0){
            $('.btn-purge').fadeIn(300);
        } else {
            $('.btn-purge').fadeOut(300);
        }
    });
    tasks.fetch();

    $('.form-new-task').submit(function(evt){
       evt.preventDefault();
        var newTaskForm = $(this);
        var newTitleInput = newTaskForm.find('.new-task-title');
        var newTask = new Task();
        newTask.set('user', currentUser);
        newTask.set('title', newTitleInput.val());
        newTask.set('done', false);

        var addButton = newTaskForm.find(':submit');
        addButton.prop('disabled',true).addClass('working');
        addButton.prop('disabled',false).removeClass('working');



        newTask.save().then(function(){
            tasks.add(newTask);
            addButton.prop('disabled',false).removeClass('working');
        }, function(err) {
            showError(err)
        });
    });
    $('.btn-purge').click(function () {
        Parse.Object.destroyAll(tasks.getCompleted());
    });

});