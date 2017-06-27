module.exports = {
    run: function (creep) {

        //determine if we can deposit energy
        if (creep.carry.energy == 0) {
            creep.memory.currentTarget = false;
            return false;
        }

        if (!creep.memory.currentTarget) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length > 0) {
                creep.memory.currentTarget = targets[0].id;
            } else {
                return false;
            }
        }

        var resultCode = creep.build(Game.getObjectById(creep.memory.currentTarget));
        if (resultCode == ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.getObjectById(creep.memory.currentTarget), {
                visualizePathStyle: {stroke: '#ff00ff'},
                reusePath: 7
            });
        } else if (resultCode != OK) {
            return false;
        }

        return true;
    }
};