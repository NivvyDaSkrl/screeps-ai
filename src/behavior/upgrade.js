module.exports = {
    run:function(creep) {
        //determine if we can deposit energy
        if (creep.carry.energy == 0) {
            creep.memory.currentTarget = false;
            return false;
        }
        
        //upgrade
        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, {
                visualizePathStyle: {stroke: '#00aaaa'},
                reusePath: 7
            });
        }
        
        return true;
    }
};