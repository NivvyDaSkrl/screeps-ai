const Scheduler = require('schedule.Scheduler');
const Task = require('schedule.Task');

let creepOrchestrator = require('creep.orchestrate');
let roleWorker = require('role.worker');
let roleUpgrader = require('role.upgrader');
let roleBuilder = require('role.builder');
let roleSoldier = require('role.soldier');

let transientCache = require('cache.transient');

let utilStats = require('util.stats');

let spawningInfo = [
    {role: roleWorker,   target: 7},
    {role: roleUpgrader, target: 5},
    {role: roleBuilder,  target: 3},
    {role: roleSoldier,  target: 1}
];

let timeUsed = Game.cpu.getUsed();

let incrementalTime = function() {
    let currTime = Game.cpu.getUsed();
    let rval = currTime - timeUsed;
    timeUsed = currTime;
    return rval;
};

/* Here, we schedule some routine tasks. */

const LOW_PRIORITY    = 90;
const NORMAL_PRIORITY = 50;
const HIGH_PRIORITY   = 20;

const EVERY_TICK   = 1;
const FREQUENTLY   = 3;
const OCCASIONALLY = 7;

let scheduler = global.scheduler = new Scheduler();

// Clear dead creeps' memory periodically.
scheduler.addTask( new Task(
    function() {
        // clear creep memory
        for(let name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }
        console.log('   TASK: Dead creep memory task completed.');
        return true;
    }, null, LOW_PRIORITY, 3, OCCASIONALLY
));

// Clear cache frequently
scheduler.addTask( new Task(() =>
    {console.log("   TASK:", transientCache.prune(), 'records purged from cache.'); return true;},
    null, LOW_PRIORITY, 2, FREQUENTLY
));

// Find max creep cost occasionally
scheduler.addTask( new Task(
    function() {
        let maxCost = Game.spawns['Home'].energyCapacity;
        let extensions = Game.spawns['Home'].room.find(
            FIND_STRUCTURES,
            {
                filter: (structure) => {return structure.structureType === STRUCTURE_EXTENSION}
            }
        );
        for(let index in extensions) {
            maxCost += extensions[index].energyCapacity;
        }
        transientCache.storeValue('maxCost', maxCost);
        console.log('   TASK: max creep size calculated:', transientCache.fetchValue('maxCost'));
        return true;
    }, null, LOW_PRIORITY, 0, OCCASIONALLY
));

Memory.ticksToLastRefresh = 0;
module.exports.loop = function () {
    timeUsed = Game.cpu.getUsed();

    // max cost of spawned creeps
    let maxCost = transientCache.fetchValue('maxCost');
    if(!maxCost) {
        maxCost = 0;
    }

    // spawn additional creeps up to target numbers
    for(let index in spawningInfo) {
        let category = spawningInfo[index].role;
        let categoryCreeps = _.filter(Game.creeps, (creep) => creep.memory.role === category.role);
        if(categoryCreeps.length < spawningInfo[index].target) {
            let bodyTemplate = false;
            for(let index in category.bodyTemplates) {
                if(category.bodyTemplates[index].cost <= maxCost) {
                    bodyTemplate = category.bodyTemplates[index].template;
                    break;
                }
            }
            let newName = 0;
            if(bodyTemplate) {
                newName = Game.spawns['Home'].createCreep(
                    bodyTemplate,
                    undefined, {
                        role: category.role,
                        behaviors: category.behaviors
                    }
                );
            }
            if (newName > 0) {
                console.log("Building a new", category.role);
            }
            break;
        }
    }

    utilStats.resetCreepStatsForTick();

    incrementalTime();
    // run creep logic
    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        creepOrchestrator.run(creep);

        utilStats.creepBehaviorStats(creep, incrementalTime());
    }

    // run scheduled tasks
    let tasksStartTime = new Date().getTime();
    let numTasksRun = 0;
    scheduler.tick();
    while(scheduler.runTask()) { numTasksRun++ };
    console.log('Number of tasks run this tick:', numTasksRun);
    Memory.stats.cpu.scheduledTasks = new Date().getTime() - tasksStartTime;

    utilStats.mainStats();
    console.log("Time to tick:", Game.cpu.getUsed(), '| Ticks since last refresh:', Memory.ticksToLastRefresh++);
}