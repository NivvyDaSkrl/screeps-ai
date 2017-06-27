const utilTargets = require('util.targets');

module.exports = {
    filterType: FIND_STRUCTURES,
    filter: (structure) => {return structure.structureType === STRUCTURE_CONTAINER
                            && structure.store[RESOURCE_ENERGY] >= 50},
    moveOptions: {
        visualizePathStyle: {stroke: '#aaff00'},
        reusePath: 7,
        maxRooms: 1
    },

    run:function(creep) {
        var carried = _.sum(creep.carry);

        // determine if we can withdraw
        if (carried >= creep.carryCapacity) {
            return false;
        }

        // get a new target, if needed
        let resolvedTarget = utilTargets.resolveCurrentTarget(creep);
        if(!utilTargets.getCurrentTarget(creep) || resolvedTarget.energy <= creep.carryCapacity) {
            if(!utilTargets.getNextTarget(this.filterType, this.filter, creep)) {
                return false;
            }
            resolvedTarget = utilTargets.resolveCurrentTarget(creep);
        }

        //repair item
        let resultCode = creep.withdraw(resolvedTarget, RESOURCE_ENERGY);
        if(resultCode === ERR_NOT_IN_RANGE) {
            creep.moveTo(resolvedTarget, this.moveOptions);
        } else if (resultCode !== OK) {
            utilTargets.setCurrentTarget(false, creep);
        }

        return true;
    }
};