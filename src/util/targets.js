let cache = require('cache.transient');

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

    shiftPotentialTarget:function(creep) {
        if (this.numPotentialTargets(creep) > 0) {
            return this.getPotentialTargets(creep).shift();
        } else {
            return false;
        }
    },

    pushPotentialTarget:function(target, creep) {
        this.getPotentialTargets(creep).push(target);
    },

    numPotentialTargets:function(creep) {
        return this.getPotentialTargets(creep).length;
    },


    /* Methods below this line directly reference creep memory. */

    clearTargets:function(creep) {
        cache.storeValue(this.key(creep), null, 0);
        creep.memory.currentTarget = false;
    },

    getCurrentTarget:function(creep) {
        return creep.memory.currentTarget;
    },

    setCurrentTarget:function(target, creep) {
        creep.memory.currentTarget = target;
    },

    getPotentialTargets:function(creep) {
        if(!cache.fetchValue(this.key(creep), true)) {
            cache.storeValue(this.key(creep), [], 50);
        }
        return cache.fetchValue(this.key(creep));
    },

    key:function(creep) {
        return creep.name + "_potentialTargets";
    }
};