const utilTargets = require('util.targets');

module.exports = {
    filterType: FIND_STRUCTURES,
    filters: [
        (structure) => {
            return (structure.structureType === STRUCTURE_EXTENSION ||
                structure.structureType === STRUCTURE_SPAWN ||
                structure.structureType === STRUCTURE_TOWER)
                && structure.energy < structure.energyCapacity;
        },
        (structure) => {
            return structure.structureType === STRUCTURE_CONTAINER
                && _.sum(structure.store) < structure.storeCapacity;
        }
    ],
    moveOptions: {
        visualizePathStyle: {stroke: '#ffffff'},
        reusePath: 7
    },

    run: function (creep) {
        //determine if we can deposit energy
        if (creep.carry.energy === 0) {
            creep.memory.currentTarget = false;
            return false;
        }

        //reset target if our current target is at energy cap
        if (creep.memory.currentTarget && creep.memory.currentTarget.energy >= creep.memory.currentTarget.energyCapacity) {
            creep.memory.currentTarget = false;
        }

        //choose a target if we don't have one
        let resolvedTarget = utilTargets.resolveCurrentTarget(creep);
        if (!utilTargets.getCurrentTarget(creep) || resolvedTarget.energy >= resolvedTarget.energyCapacity) {
            let targetsFound = false;
            for (let index in this.filters) {
                if (utilTargets.getNextTarget(this.filterType, this.filters[index], creep)) {
                    targetsFound = true;
                    break;
                }
            }
            if (!targetsFound) {
                return false;
            }
            resolvedTarget = utilTargets.resolveCurrentTarget(creep);
        }

        //deposit energy
        let resultCode = creep.transfer(resolvedTarget, RESOURCE_ENERGY);
        if (resultCode === ERR_NOT_IN_RANGE) {
            creep.moveTo(resolvedTarget, this.moveOptions);
        } else if (resultCode === ERR_FULL) {
            utilTargets.setCurrentTarget(false, creep);
        }

        return true;
    }
};