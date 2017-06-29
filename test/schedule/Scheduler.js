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

describe("Scheduler", function () {
    describe("#addTask()", function () {
        it('should add a task to the schedule', function() {
            scheduler.addTask(TASK);
            assert(scheduler.schedule[0].method() === TASK.method());
            assert(scheduler.schedule[0].priority === 0);
            assert(scheduler.schedule[0].argument === 'argument');
            assert(scheduler.schedule[0].delay === 1);
            assert(scheduler.schedule[0].period === 2);
        })
    })
});