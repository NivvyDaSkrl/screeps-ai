/**
 * A schedule-able task
 * @param method    the function call to be made when this task is scheduled
 * @param argument  the argument to pass into the method (similar to a void pointer!)
 * @param priority  the priority of the task (lower number = higher priority)
 * @param delay     the one-time delay before the task is able to be executed; 0 or less is immediate (same tick)
 * @param period    the recurring delay between task executions
 *                  *) non-numbers and numbers less than 1 indicates the task will NOT repeat
 * @constructor
 */
function Task(method, argument, priority, delay, period) {
    this.method = method;
    this.argument = argument;
    this.priority = priority;
    this.delay = delay;
    if(!period || typeof period !== 'number' || period < 1) {
        this.period = 0;
    } else {
        this.period = period;
    }
}

module.exports = Task;