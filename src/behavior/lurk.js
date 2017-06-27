module.exports = {
    run:function(creep) {
        creep.memory.timeToNextCheck = creep.memory.timeToNextCheck - 1;
        if(creep.memory.timeToNextCheck <= 0) {
            if(creep.pos.getRangeTo(creep.room.controller.pos) > 6) {
                creep.moveTo(creep.room.controller);
            } else {
                creep.memory.timeToNextCheck = 13;
            }
        }
        
        
    }
};