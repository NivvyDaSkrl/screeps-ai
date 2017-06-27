const utilTargets = require('util.targets');

module.exports = {
    filterType: FIND_SOURCES,
    filter: (source) => {
        return source
    },
    moveOptions: {
        visualizePathStyle: {stroke: '#ffaa00'},
        reusePath: 3,
        maxOps: 1000,
        ignoreRoads: true
    },

    run: function (creep) {
        var carried = _.sum(creep.carry);

        // determine if we can harvest
        if (carried >= creep.carryCapacity) {
            return false;
        }

        // find a target source, if needed
        let resolvedTarget = utilTargets.resolveCurrentTarget(creep);
        if (!utilTargets.getCurrentTarget(creep) || resolvedTarget.energy < creep.carryCapacity - carried) {
            if (!utilTargets.getNextTarget(this.filterType, this.filter, creep)) {
                return false;
            }
            resolvedTarget = utilTargets.resolveCurrentTarget(creep);
        }

        // move or harvest
        if (creep.harvest(resolvedTarget) === ERR_NOT_IN_RANGE) {
            var resultCode = creep.moveTo(resolvedTarget, this.moveOptions);
            if (resultCode !== OK) {
                utilTargets.setCurrentTarget(false, creep);
            }
        }

        return true;
    }
};