/**
 * Non-preemptive, priority-based scheduler.
 * Tasks are executed in order of priority, with initial delay and periodic rescheduling as options.
 * Order is undefined for ready tasks with the same priority level.
 * @constructor
 */
function Scheduler() {
    /**
     * Tracks the number of ticks since instantiation; used to track task delays.
     * Not directly linked to the main game clock.
     * @type {number}
     */
    this.clock = 0;

    /**
     * The array of tasks;
     * @type {Array}
     */
    this.schedule = [];

    /**
     * Set true when tasks have been added; indicates that the schedule needs to be re-sorted.
     * @type {boolean}
     */
    this.isDirty = false;
}

/**
 * Adds a task to the schedule.
 * @param task      the task which will be executed
 */
Scheduler.prototype.addTask = function(task) {
    this.schedule.push(task);
    this.isDirty = true;
};

/**
 * Runs the first available task.
 * @returns {null}  the result of the run task, if applicable
 */
Scheduler.prototype.runTask = function() {
    // bail if there are no ready tasks
    if (this.schedule.length <= 0) {
        return null;
    }

    // sort tasks if necessary
    if(this.isDirty) {
        this.schedule.sort(this.comparePriority);
        this.isDirty = false;
    }

    // bail if it's not time to run the first task yet
    if (this.schedule[0].delay > 0) {
        return null;
    }

    // reschedule task, if necessary
    let currTask = this.schedule.shift();
    if (currTask.period > 0) {
        currTask.delay = currTask.period;
        this.addTask(currTask);
    }

    // run task
    return currTask.method(currTask.argument);

};

/**
 * Ticks the clock forward and decrements all delays
 */
Scheduler.prototype.tick = function() {
    this.clock++;
    for(let index in this.schedule) {
        if(this.schedule[index].delay > 0) {
            this.schedule[index].delay--;
        }
    }
};

/**
 * Comparator for determining task order. Tasks are sorted first by delay, then by priority.
 * @param taskA         the first task to compare
 * @param taskB         the second task to compare
 * @returns {number}    -1 if taskA comes before taskB, 1 if taskB comes before taskA, 0 if they are equal
 */
Scheduler.prototype.comparePriority = function(taskA, taskB) {
    if (taskA.delay < taskB.delay) {
        return -1;
    } else if (taskA.delay > taskB.delay) {
        return 1;
    } else if (taskA.priority < taskB.priority) {
        return -1;
    } else if (taskA.priority > taskB.priority) {
        return 1;
    } else {
        return 0;
    }
}

module.exports = Scheduler;