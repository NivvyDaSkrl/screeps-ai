let creepOrchestrator = require('creep.orchestrate');
let roleWorker = require('role.worker');
let roleUpgrader = require('role.upgrader');
let roleBuilder = require('role.builder');
let roleSoldier = require('role.soldier');

let transientCache = require('cache.transient');

let spawningInfo = [
    {role: roleWorker,   target: 8},
    {role: roleUpgrader, target: 3},
    {role: roleBuilder,  target: 6},
    {role: roleSoldier,  target: 1}
];

let timeUsed = Game.cpu.getUsed();

let incrementalTime = function() {
    let currTime = Game.cpu.getUsed();
    let rval = currTime - timeUsed;
    timeUsed = currTime;
    return rval;
}


//metric-gathering; placed in main temporarily. I need to make a proper module for this
let storeStats = function() {
    if (Memory.stats == null) {
        Memory.stats = {tick: Game.time};
    }

    Memory.stats.cpu = Game.cpu;
    Memory.stats.cpu.used = Game.cpu.getUsed();
    Memory.stats.gcl = Game.gcl;
    Memory.stats.memory = {
        used: RawMemory.get().length
    };
    Memory.stats.market = {
        credits: Game.market.credits,
        num_orders: Game.market.orders ? Object.keys(Game.market.orders).length : 0
    };
    Memory.stats.room = {};
    for(let name in Game.rooms) {
        if(Game.rooms[name]) {
            Memory.stats.room[name] = {};
            if(Game.rooms[name].controller) {
                Memory.stats.room[name].controllerProgress = Game.rooms[name].controller.progress;
                Memory.stats.room[name].controllerProgressTotal = Game.rooms[name].controller.progressTotal;
            }
            Memory.stats.room[name].energyAvailable = Game.rooms[name].energyAvailable;
            Memory.stats.room[name].energyCapacityAvailable = Game.rooms[name].energyCapacityAvailable;
        }

    }
}

Memory.ticksToLastRefresh = 0;
console.log('T:', Game.cpu.getUsed(), '| Setup completed.');
module.exports.loop = function () {
    timeUsed = Game.cpu.getUsed();
    console.log('T:', timeUsed, '| Loop start');
    // clear out old memory
    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    console.log('T:', incrementalTime(), '| Memory cleared.');

    // max cost of spawned creeps
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
    console.log('T:', incrementalTime(), '| Max creep size calculated.');

    // spawn additional creeps up to target numbers
    for(let index in spawningInfo) {
        let category = spawningInfo[index].role;
        let categoryCreeps = _.filter(Game.creeps, (creep) => creep.memory.role == category.role);
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
    console.log('T:', incrementalTime(), '| Creep spawning finished.');

    Memory.stats.behavior = {};

    // run creep logic
    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        creepOrchestrator.run(creep);
        let currTime = incrementalTime();
        if(!Memory.stats.behavior[creep.memory.currentBehavior]) {
            Memory.stats.behavior[creep.memory.currentBehavior] = currTime;
        } else {
            Memory.stats.behavior[creep.memory.currentBehavior] += currTime;
        }
        if (currTime > 1) {
            console.log('-----', currTime, name, creep.memory.currentBehavior, creep.memory.timeOnCurrentBehavior);
        }
    }

    let numPruned = transientCache.prune();
    console.log('T:', incrementalTime(), '|', numPruned, 'records pruned from cache.');

    storeStats();
    console.log("Time to tick:", Game.cpu.getUsed(), '| Ticks since last refresh:', Memory.ticksToLastRefresh++);
}