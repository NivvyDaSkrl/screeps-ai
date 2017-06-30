const Scheduler = require('./schedule.Scheduler');
const Task = require('./schedule.Task');
const assert = require('assert');

const TASK = new Task(
    () => {return true;},    //method
    'argument',             //argument
    0,                      //priority
    1,                      //delay
    2                       //period
);

let scheduler = null;

beforeEach(function () {
    scheduler = new Scheduler();
});

describe ("Scheduler", function () {
    describe ("#addTask()", function () {
        it ('should add a task to the schedule', function() {
            scheduler.addTask(TASK);
            assert(scheduler.schedule[0].method() === TASK.method());
            assert(scheduler.schedule[0].priority === TASK.priority);
            assert(scheduler.schedule[0].argument === TASK.argument);
            assert(scheduler.schedule[0].period   === TASK.period);
            // Task.delay is used internally by the scheduler; its value can't be assumed once we hand it over.
        })
    });

    describe ("#runTask()", function () {
        it ('should run the highest priority task', function() {
            scheduler.addTask(new Task(
                (argument) => {return argument * 10}, 5, 100, 0, 1));
            scheduler.addTask(new Task ((argument) => {return argument * 100}, 6, 10, 0, 1));
            assert(scheduler.runTask() === 600);
            assert(scheduler.runTask() ===  50);
        });
        it ('should bail and run no tasks if the tasks are delayed', function() {
            scheduler.addTask(new Task (() => {return true}, null, 0, 1, 0));
            assert(scheduler.runTask() === null);
        });
        it ('should find the highest priority ready task and run it', function() {
            scheduler.addTask(new Task (() => {return  true;}, null, 0, 5, 0)); // priority 0, delay 5
            scheduler.addTask(new Task (() => {return false;}, null, 5, 0, 0)); // priority 5, delay 0
            assert(scheduler.runTask() === false);
        });
        it ('should reschedule periodic tasks', function() {
            scheduler.addTask(new Task (() => {return true}, null, 0, 0, 10));
            scheduler.runTask();
            assert(scheduler.schedule.length === 1);
            assert(scheduler.schedule[0].delay === 10);
        });
    });

    describe ("#tick()", function () {
        it('should run down task delay times', function () {
            scheduler.addTask(new Task(() => {return true;}, null, 0, 1, 0));
            scheduler.addTask(new Task(() => {return true;}, null, 0, 5, 0));
            scheduler.tick();
            assert(scheduler.schedule.length === 2);
            assert(scheduler.schedule[0].delay === 0);
            assert(scheduler.schedule[1].delay === 4);
        })

    })
});