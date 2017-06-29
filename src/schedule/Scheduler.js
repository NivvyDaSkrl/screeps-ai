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
}

/**
 * Adds a task to the schedule.
 * @param task      the task which will be executed
 */
Scheduler.prototype.addTask = function(task) {
    this.schedule.push(task);
}

module.exports = Scheduler;