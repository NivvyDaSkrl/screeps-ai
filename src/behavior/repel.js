module.exports = {
    run: function(creep) {

        if (!creep.memory.currentTarget) {
            var targets = creep.room.find(FIND_HOSTILE_CREEPS);
            if (targets.length > 0) {
                creep.memory.currentTarget = targets[0].id;
            } else {
                return false;
            }
        }
        
        var resultCode = creep.attack(Game.getObjectById(creep.memory.currentTarget));
        if(resultCode == ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.getObjectById(creep.memory.currentTarget), {
                visualizePathStyle: {stroke: '#ff0000'},
                reusePath: 2
            });
        } else if (resultCode != OK) {
            return false;
        }
	    
	    return true;
    }
};