module.exports = {
    resolveCurrentTarget:function(creep) {
        return Game.getObjectById(this.getCurrentTarget(creep));
    },

    getNextTarget:function(type, filter, creep) {
        if (this.numPotentialTargets(creep) <= 0) {
            if(!this.initTargetList(type, filter, creep)) {
                this.clearTargets(creep);
                return false;
            }
        }

        this.setCurrentTarget(this.shiftPotentialTarget(creep), creep);

        return true;
    },

    initTargetList:function(type, filter, creep) {
        this.clearTargets(creep);

        let targets = creep.room.find(type, {filter: filter});

        // bail if no targets were found
        if(targets.length <= 0) {
            return false;
        }

        // store target IDs
        for(let index in targets) {
            this.pushPotentialTarget(targets[index].id, creep);
        }

        return true;
    },

    /* Methods below this line directly reference creep memory. */

    clearTargets:function(creep) {
        creep.memory.potentialTargets = [];
        creep.memory.currentTarget = false;
    },

    getCurrentTarget:function(creep) {
        return creep.memory.currentTarget;
    },

    setCurrentTarget:function(target, creep) {
        creep.memory.currentTarget = target;
    },

    shiftPotentialTarget:function(creep) {
        if (this.numPotentialTargets(creep) > 0) {
            return creep.memory.potentialTargets.shift();
        } else {
            return false;
        }
    },

    pushPotentialTarget:function(target, creep) {
        creep.memory.potentialTargets.push(target);
    },

    numPotentialTargets:function(creep) {
        return creep.memory.potentialTargets.length;
    }
};