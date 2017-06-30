let utilStats = {
    mainStats: function() {
        let startTime = Game.cpu.getUsed();
        if (Memory.stats === null) {
            Memory.stats = {tick: Game.time};
        }

        Memory.stats.cpu = Game.cpu;
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
                let structures = Game.rooms[name].find(FIND_STRUCTURES, {filter:
                    (s) => {return s.structureType === STRUCTURE_CONTAINER && s.store}});
                Memory.stats.room[name].energyStorage = 0;
                Memory.stats.room[name].storageAvailable = 0;
                for(let struct in structures) {
                    Memory.stats.room[name].storageAvailable += structures[struct].storeCapacity;
                    if(structures[struct].store){
                        Memory.stats.room[name].energyStorage += structures[struct].store[RESOURCE_ENERGY];
                    }
                }

            }

        }
        for(let name in Game.creeps) {
            if(!Memory.stats.room[Game.creeps[name].room.name].creeps) {
                Memory.stats.room[Game.creeps[name].room.name].creeps = 1;
                Memory.stats.room[Game.creeps[name].room.name].energyOnCreeps = Game.creeps[name].carry[RESOURCE_ENERGY];
            } else {
                Memory.stats.room[Game.creeps[name].room.name].creeps++;
                Memory.stats.room[Game.creeps[name].room.name].energyOnCreeps += Game.creeps[name].carry[RESOURCE_ENERGY];
            }
        }
        Memory.stats.cpu.statsLoading = Game.cpu.getUsed() - startTime;
        Memory.stats.cpu.used = Game.cpu.getUsed();
    },

    creepBehaviorStats: function(creep, currTime) {
        if(!Memory.stats.behavior[creep.memory.currentBehavior]) {
            Memory.stats.behavior[creep.memory.currentBehavior] = currTime;
        } else {
            Memory.stats.behavior[creep.memory.currentBehavior] += currTime;
        }
    },

    resetCreepStatsForTick: function() {
        Memory.stats.behavior = {};
    }
};

module.exports = utilStats;