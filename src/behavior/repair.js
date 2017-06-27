const utilTargets = require('util.targets');

module.exports = {
    filterType: FIND_STRUCTURES,
    filter: (structure) => {
        return (structure.hits < 50000
                && (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART))
            || (structure.structureType != STRUCTURE_WALL
                && structure.structureType != STRUCTURE_RAMPART
                && structure.hits < structure.hitsMax * 0.9);
    },
    moveOptions: {
        visualizePathStyle: {stroke: '#00ff00'},
        reusePath: 7,
        maxRooms: 1
    },

    run:function(creep) {
        //determine if we can deposit energy
        if (creep.carry.energy <= 0) {
            return false;
        }

        // get a new target, if needed
        let resolvedTarget = utilTargets.resolveCurrentTarget(creep);
        if(!utilTargets.getCurrentTarget(creep) || resolvedTarget.hits >= resolvedTarget.hitsMax) {
            if(!utilTargets.getNextTarget(this.filterType, this.filter, creep)) {
                return false;
            }
            resolvedTarget = utilTargets.resolveCurrentTarget(creep);
        }
        
        //repair item
        let resultCode = creep.repair(resolvedTarget);
        if(resultCode === ERR_NOT_IN_RANGE) {
            creep.moveTo(resolvedTarget, this.moveOptions);
        } else if (resultCode !== OK) {
            utilTargets.setCurrentTarget(false, creep);
        }
        
        return true;
    }
};